import {
    elizaLogger,
    composeContext,
    Content,
    HandlerCallback,
    ModelClass,
    type Memory,
    type State,
    generateObjectDeprecated,
    ActionExample,
    Action,
    IAgentRuntime,
} from "@elizaos/core";
import { WalletProvider, walletProvider } from "../../../providers/wallet.ts";
import { ONFTProvider } from "../../../providers/omniflix/onft.ts";
import { bech32 } from "bech32";
import { v4 as uuidv4 } from 'uuid';
import getNFTsExamples from "../../../action_examples/omniflix/onft/get_nfts.ts";

export interface getNFTsContent extends Content {
   denomId: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isGetNFTsContent(content: Content): validationResult {
    let msg = "";
    if (!content.denomId) {
        msg += "Please provide a denom id to get the NFTs.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "NFTs request is valid.",
    };
}

const getNFTsTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "denomId": "onftdenom"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested NFTs details:
- denomId mentioned in the current message required

Respond with a JSON markdown block containing only the extracted values.`;

export class getNFTsAction {
    async getNFTs(
        params: getNFTsContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<any> {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );

            const onftProvider = new ONFTProvider(wallet);
            const response = await onftProvider.getNFTs(
                params.denomId
            );
            if (!response) {
                throw new Error('NFTs does not exist');
            }
            return response;
        } catch (error) {
            throw new Error(`Get NFTs failed: ${error.message}`);
        }
    }
}

const buildGetNFTsDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getNFTsContent> => {

    // if (!state) {
    //     state = (await runtime.composeState(message)) as State;
    // } else {
    //     state = await runtime.updateRecentMessageState(state);
    // }
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getNFTsContext = composeContext({
        state: currentState,
        template: getNFTsTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getNFTsContext,
        modelClass: ModelClass.SMALL,
    });

    const getNFTsContent = content as getNFTsContent;

    return getNFTsContent;
};

export default {
    name: "GET_NFTS",
    similes: [
        "get nfts",
        "get nfts",
    ],
    description: "Get collection NFTs.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET_NFTS handler...");
        const getNFTsDetails = await buildGetNFTsDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetNFTsContent(getNFTsDetails);
        if (!validationResult.success) {
            if (callback) {
                callback({
                    text: validationResult.message,
                    content: { error: validationResult.message },
                });
            }
            return false;
        }
        try {
            const action = new getNFTsAction();
            const response = await action.getNFTs(
                getNFTsDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            const formattedResponse = JSON.stringify(response, (key, value) => 
                typeof value === "bigint" ? value.toString() : value, 2
            );
            if (callback) {
                callback({
                    text: `Successfully retrieved NFTs:\n\`${formattedResponse}\``,
                    parse_mode: "Markdown",
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve NFTs: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getNFTsTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getNFTsExamples as ActionExample[][],
} as Action;

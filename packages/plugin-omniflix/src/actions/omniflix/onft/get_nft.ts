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
import getNFTExamples from "../../../action_examples/omniflix/onft/get_nft.ts";

export interface getNFTContent extends Content {
   denomId: string;
   nftId: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isGetNFTContent(content: Content): validationResult {
    let msg = "";
    if (!content.denomId) {
        msg += "Please provide a denom id to get the NFT.";
    }
    if (!content.nftId) {
        msg += "Please provide a nft id to get the NFT.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "NFT request is valid.",
    };
}

const getNFTTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "denomId": "onftdenom",
   "nftId": "1"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested NFT details:
- denomId mentioned in the current message required
- nftId mentioned in the current message required

Respond with a JSON markdown block containing only the extracted values.`;

export class getNFTAction {
    async getNFT(
        params: getNFTContent,
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
            const response = await onftProvider.getSingleNFT(
                params.denomId,
                params.nftId
            );
            if (!response) {
                throw new Error('NFT does not exist');
            }
            return response;
        } catch (error) {
            throw new Error(`Get NFT failed: ${error.message}`);
        }
    }
}

const buildGetNFTsDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getNFTContent> => {

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

    const getNFTContext = composeContext({
        state: currentState,
        template: getNFTTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getNFTContext,
        modelClass: ModelClass.SMALL,
    });

    const getNFTContent = content as getNFTContent;

    return getNFTContent;
};

export default {
    name: "GET_SINGLE_NFT",
    similes: [
        "get single nft",
    ],
    description: "Get collection NFT.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET_NFT handler...");
        const getNFTDetails = await buildGetNFTsDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetNFTContent(getNFTDetails);
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
            const action = new getNFTAction();
            const response = await action.getNFT(
                getNFTDetails,
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
                    text: `Successfully retrieved NFT:\n\`${formattedResponse}\``,
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
                    text: `Failed to retrieve NFT: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getNFTTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getNFTExamples as ActionExample[][],
} as Action;

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
import { Coin } from "@cosmjs/stargate";
import { v4 as uuidv4 } from 'uuid';
import { WalletProvider, walletProvider } from "../../../providers/wallet.ts";
import { MarketPlaceProvider } from "../../../providers/omniflix/market_place.ts";
import listNFTExamples from "../../../action_examples/omniflix/market_place/list_nft.ts";
const genUniqueID = (prefix) => {
    return prefix + uuidv4().replace(/-/g, '');
};

export interface listNFTContent extends Content {
    nftId: string;
    denomId: string;
    denom: string;
    amount: number | string;
    splitShares: Array<Object>;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isListNFTContent(content: Content): validationResult {
    let msg = "";
    if (!content.nftId) {
        msg += "Please provide a nftId to list the NFT.";
    }
    if (!content.denomId) {
        msg += "Please provide a denomId for the of given NFT.";
    }
    if (!content.denom) {
        msg += "Please provide a denom for the of given NFT.";
    }
    if (!content.amount) {
        msg += "Please provide a amount for the of given NFT.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "List NFT request is valid.",
    };
}

const listNFTTemplate = `Respond with a JSON markdown block containing only the extracted values.Take all the values from the current messages, Dont consider the example values.

Example response:
\`\`\`json
{
   "nftId": "onft..",
   "denomId": "onftdenom..",
   "denom": "uflix",
   "amount": "1000000"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested list NFT from the current messages:
- nftId : dont take example value  (required) ask for the nftId not consider from example
- denomId : dont take example value  (required) ask for the denomId not consider from example
- denom : dont take example value , dont take example value (required)
- amount : dont take example value , dont take example value (required) 

Respond with a JSON markdown block containing only the extracted values from the current messages.`;

export class listNFTAction {
    async listNFT(
        params: listNFTContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<string> {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );

            const marketPlaceProvider = new MarketPlaceProvider(wallet);
            if (params.denom === "FLIX" || params.denom === "flix") {
                params.denom = "uflix";
                if (typeof params.amount === "number") {
                    params.amount = params.amount * 1000000;
                } else if (typeof params.amount === "string") {
                    params.amount = Number.parseInt(params.amount) * 1000000;
                }
            }
            console.log("params", params);
            const response = await marketPlaceProvider.listNFT(
                genUniqueID("list"),
                params.nftId,
                params.denomId,
                params.denom,
                params.amount,
                params.splitShares || []
            );

            return response.transactionHash;
        } catch (error) {
            throw new Error(`List failed: ${error.message}`);
        }
    }
}

const buildListNFTDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<listNFTContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const listNFTContext = composeContext({
        state: currentState,
        template: listNFTTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: listNFTContext,
        modelClass: ModelClass.SMALL,
    });

    const listNFTContent = content as listNFTContent;

    return listNFTContent;
};

export default {
    name: "LIST_NFT",
    similes: [
        "list NFT",
    ],
    description: "List a NFT.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting LIST_NFT handler...");
        const listNFTDetails = await buildListNFTDetails(
            runtime,
            message,
            state
        );
        console.log("listNFTDetails", listNFTDetails);
        const validationResult = isListNFTContent(listNFTDetails);
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
            const action = new listNFTAction();
            const txHash = await action.listNFT(
                listNFTDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                let id = listNFTDetails.nftId;
                callback({
                    text: `Successfully listed NFT ${id} & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to list NFT: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: listNFTExamples,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: listNFTExamples as ActionExample[][],
} as Action;

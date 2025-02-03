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
import { WalletProvider, walletProvider } from "../../../providers/wallet.ts";
import { MarketPlaceProvider } from "../../../providers/omniflix/market_place.ts";
import createAuctionExamples from "../../../action_examples/omniflix/market_place/create_auction.ts";

export interface createAuctionContent extends Content {
    nftId: string;
    denomId: string;
    denom: string;
    amount: number | string;
    duration: number;
    incrementPercentage: number;
    whitelistAccounts: Array<String>;
    splitShares: Array<Object>;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isCreateAuctionContent(content: Content): validationResult {
    let msg = "";
    if (!content.nftId) {
        msg += "Please provide a nftId to create a new auction.";
    }
    if (!content.denomId) {
        msg += "Please provide a denomId of given NFT.";
    }
    if (!content.denom) {
        msg += "Please provide a denom for the of given NFT.";
    }
    if (!content.amount) {
        msg += "Please provide a amount for the auction.";
    }
    if (!content.duration) {
        msg += "Please provide a duration for the auction.";
    }
    if (!content.incrementPercentage) {
        msg += "Please provide an incrementPercentage for the auction.";
    }
    console.log("content", content);
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "create auction request is valid.",
    };
}

const createAuctionTemplate = `Respond with a JSON markdown block containing only the extracted values.Take all the values from the current messages, Don't consider the example values.

Example response:
\`\`\`json
{
   "nftId": "onft..",
   "denomId": "onftdenom..",
   "denom": "uflix...",
   "amount": "1000000...",
   "duration": 10,
   "incrementPercentage": 10,
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested create auction NFT from the current messages:
- nftId mentioned in the current message, dont take example value (required) ask for the nftId
- denomId mentioned in the current message, dont take example value (required) ask for the denomId
- denom mentioned in the current message, dont take example value (required)
- amount mentioned in the current message, dont take example value (required)
- duration mentioned in the current message, dont take example value (required)
- incrementPercentage mentioned in the current message, dont take example value (required)

Respond with a JSON markdown block containing only the extracted values.`;

export class createAuctionAction {
    async createAuction(
        params: createAuctionContent,
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
            if (params.incrementPercentage === undefined) {
                params.incrementPercentage = params.incrementPercentage/ 100;
            }
            if (params.denom === "FLIX" || params.denom === "flix") {
                params.denom = "uflix";
                if (typeof params.amount === "number") {
                    params.amount = params.amount * 1000000;
                } else if (typeof params.amount === "string") {
                    params.amount = Number.parseInt(params.amount) * 1000000;
                }
            }
            const response = await marketPlaceProvider.createAuction(
                params.nftId,
                params.denomId,
                params.denom,
                params.amount,
                params.duration,
                params.incrementPercentage,
                params.whitelistAccounts || [],
                params.splitShares || []
            );

            return response.transactionHash;
        } catch (error) {
            throw new Error(`create auction failed: ${error.message}`);
        }
    }
}

const buildCreateAuctionDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<createAuctionContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const createAuctionContext = composeContext({
        state: currentState,
        template: createAuctionTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: createAuctionContext,
        modelClass: ModelClass.SMALL,
    });

    const createAuctionContent = content as createAuctionContent;

    return createAuctionContent;
};

export default {
    name: "CREATE_AUCTION",
    similes: [
        "create auction",
    ],
    description: "create an auction.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CREATE_AUCTION handler...");
        const createAuctionDetails = await buildCreateAuctionDetails(
            runtime,
            message,
            state
        );
        console.log("createAuctionDetails", createAuctionDetails);
        const validationResult = isCreateAuctionContent(createAuctionDetails);
        console.log("validationResult", validationResult);
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
            const action = new createAuctionAction();
            const txHash = await action.createAuction(
                createAuctionDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `Successfully created auction & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to create auction: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: createAuctionExamples,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: createAuctionExamples as ActionExample[][],
} as Action;

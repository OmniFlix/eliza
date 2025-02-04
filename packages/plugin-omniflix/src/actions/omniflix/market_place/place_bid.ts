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
import placeBidExamples from "../../../action_examples/omniflix/market_place/place_bid.ts";

export interface placeBidContent extends Content {
    auctionId: string;
    denom: string;
    amount: string | number;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isPlaceBidContent(content: Content): validationResult {
    let msg = "";
    if (!content.auctionId) {
        msg += "Please provide a auctionId to place the bid.";
    }
    if (!content.amount) {
        msg += "Please provide a amount to place the bid.";
    }
    if (!content.denom) {
        msg += "Please provide a denom to place the bid.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "Place Bid request is valid.",
    };
}

const placeBidTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "auctionId": "auction..",
   "amount": "100",
    "denom": "uflix"
   "bidder": "omniflix1abc123..."
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested place bid:
- auctionId : dont take example value  (required) ask for the auctionId 
- amount : dont take example value  (required) ask for the amount
- denom : dont take example value  (required) ask for the denom

Respond with a JSON markdown block containing only the extracted values.`;

export class placeBidAction {
    async placeBid(
        params: placeBidContent,
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
            const response = await marketPlaceProvider.placeBid(
                params.auctionId,
                params.denom,
                params.amount,
            );

            return response.transactionHash;
        } catch (error) {
            throw new Error(`Place Bid failed: ${error.message}`);
        }
    }
}

const buildPlaceBidDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<placeBidContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const placeBidContext = composeContext({
        state: currentState,
        template: placeBidTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: placeBidContext,
        modelClass: ModelClass.SMALL,
    });

    const placeBidContent = content as placeBidContent;

    return placeBidContent;
};

export default {
    name: "PLACE_BID",
    similes: [
        "place bid",
    ],
    description: "Place a bid.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting PLACE_BID handler...");
        const placeBidDetails = await buildPlaceBidDetails(
            runtime,
            message,
            state
        );
        console.log("placeBidDetails", placeBidDetails);
        const validationResult = isPlaceBidContent(placeBidDetails);
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
            const action = new placeBidAction();
            const txHash = await action.placeBid(
                placeBidDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                let id = placeBidDetails.listId;
                callback({
                    text: `Successfully placed bid ${id} & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to place bid: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: placeBidExamples,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: placeBidExamples as ActionExample[][],
} as Action;

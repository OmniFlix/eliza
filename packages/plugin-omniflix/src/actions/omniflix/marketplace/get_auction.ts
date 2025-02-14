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
import { MarketPlaceProvider } from "../../../providers/omniflix/marketplace.ts";
import getAuctionExamples from "../../../action_examples/omniflix/marketplace/get_auction.ts";

export interface getAuctionContent extends Content {
    auctionId: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isgetAuctionContent(content: Content): validationResult {
    let msg = "";
    if (!content.auctionId) {
        msg += "Please provide auctionId to fetch the auction.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "fetch auction request is valid.",
    };
}

const getAuctionTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "auctionId": 22
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested auction:
- auctionId : mentioned in the current message

Respond with a JSON markdown block containing only the extracted values.`;

export class getAuctionAction {
    async getAuction(
        params: getAuctionContent,
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

            const marketPlaceProvider = new MarketPlaceProvider(wallet);
            const response = await marketPlaceProvider.getAuction(
                params.auctionId
            );
            if (!response || response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }

            return response;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

const buildGetAuctionDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getAuctionContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getAuctionContext = composeContext({
        state: currentState,
        template: getAuctionTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getAuctionContext,
        modelClass: ModelClass.SMALL,
    });

    const getAuctionContent = content as getAuctionContent;

    return getAuctionContent;
};

export default {
    name: "GET_AUCTION",
    similes: [
        "fetch auction",
    ],
    description: "get auction.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET AUCTION handler...");
        const getAuctionDetails = await buildGetAuctionDetails(
            runtime,
            message,
            state
        );
        const validationResult = isgetAuctionContent(getAuctionDetails);
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
            const action = new getAuctionAction();
            const response = await action.getAuction(
                getAuctionDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retrieved auction details ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve auction details: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getAuctionTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getAuctionExamples as ActionExample[][],
} as Action;

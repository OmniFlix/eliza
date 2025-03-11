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
import getLatestBidByIdExamples from "../../../action_examples/omniflix/marketplace/get_latest_bid_by_id.ts";

export interface getLatestBidByIdContent extends Content {
    auctionId: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetLatestBidByIdContent(content: Content): validationResult {
    let msg = "";
    if (!content.auctionId) {
        msg += "Please provide auction to fetch the latest bid.";
    } 
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "fetch latest bid request is valid.",
    };
}

const getLatestBidByIdTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{ist.."
   "auctionId": 2
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested list:
- auctionId : mentioned in the current message 

Respond with a JSON markdown block containing only the extracted values.`;

export class getLatestBidByIdAction {
    async getLatestBidById(
        params: getLatestBidByIdContent,
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
            const response = await marketPlaceProvider.getLatestBidById(
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

const buildGetLatestBidByIdDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getLatestBidByIdContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getLatestBidByIdContext = composeContext({
        state: currentState,
        template: getLatestBidByIdTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getLatestBidByIdContext,
        modelClass: ModelClass.SMALL,
    });

    const getLatestBidByIdContent = content as getLatestBidByIdContent;

    return getLatestBidByIdContent;
};

export default {
    name: "GET_LATEST_BID_BY_ID",
    similes: [
        "fetch latest bid",
    ],
    description: "get latest bid.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET LATEST BID handler...");
        const getListingDetails = await buildGetLatestBidByIdDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetLatestBidByIdContent(getListingDetails);
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
            const action = new getLatestBidByIdAction();
            const response = await action.getLatestBidById(
                getListingDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retrieved latest bid details ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve latest bid details: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getLatestBidByIdTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getLatestBidByIdExamples as ActionExample[][],
} as Action;

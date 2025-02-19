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
import getListingExamples from "../../../action_examples/omniflix/marketplace/get_listing.ts";

export interface getListingContent extends Content {
    listId: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetListingContent(content: Content): validationResult {
    let msg = "";
    if (!content.listId) {
        msg += "Please provide listId to fetch the list.";
    } else if (content.listId && !(content.listId as string).startsWith("list")) {
        msg += "Please provide a valid listId to fetch list.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "fetch list request is valid.",
    };
}

const getListingTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "listId": "list.."
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested list:
- listId : mentioned in the current message or recent messages (if any)

Respond with a JSON markdown block containing only the extracted values.`;

export class getListingAction {
    async getListing(
        params: getListingContent,
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
            const response = await marketPlaceProvider.getListing(
                params.listId
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

const buildGetListingDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getListingContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getListingContext = composeContext({
        state: currentState,
        template: getListingTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getListingContext,
        modelClass: ModelClass.SMALL,
    });

    const getListingContent = content as getListingContent;

    return getListingContent;
};

export default {
    name: "GET_LISTING",
    similes: [
        "fetch list",
    ],
    description: "get list.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET LISTING handler...");
        const getListingDetails = await buildGetListingDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetListingContent(getListingDetails);
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
            const action = new getListingAction();
            const response = await action.getListing(
                getListingDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retrieved listing details ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve listing details: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getListingTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getListingExamples as ActionExample[][],
} as Action;

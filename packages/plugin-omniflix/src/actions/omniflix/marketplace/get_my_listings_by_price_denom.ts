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
import getMyListingsByPriceDenomExamples from "../../../action_examples/omniflix/marketplace/get_my_listings_by_price_denom.ts";

export interface getMyListingsByPriceDenomContent extends Content {
    denom: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetMyListingsByPriceDenomContent(content: Content): validationResult {
    let msg = "";
    if (!content.denom) {
        msg += "Please provide denom to get your listings.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "get listings of owner by denom request is valid.",
    };
}

const getMyListingsByPriceDenomTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "denom": "uflix"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested listing by price denom:
- denom : mentioned in the current message

Respond with a JSON markdown block containing only the extracted values.`;

export class getMyListingsByPriceDenomAction {
    async getMyListingsByPriceDenom(
        params: getMyListingsByPriceDenomContent,
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
            const response = await marketPlaceProvider.getMyListingByPriceDenom(
                params.denom
            );
            if (!response ) {
                throw new Error(`${response.rawLog}`);
            }
            console.log(response);
            return response;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

const buildGetMyListingsByPriceDenomDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getMyListingsByPriceDenomContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getMyListingsByPriceDenomContext = composeContext({
        state: currentState,
        template: getMyListingsByPriceDenomTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getMyListingsByPriceDenomContext,
        modelClass: ModelClass.SMALL,
    });

    const getMyListingsByPriceDenomContent = content as getMyListingsByPriceDenomContent;

    return getMyListingsByPriceDenomContent;
};

export default {
    name: "GET_MY_LISTINGS_BY_PRICE_DENOM",
    similes: [
        "Get my listings by price denom",
    ],
    description: "Get my listings by price denom",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting Get listing by price denom handler...");
        const getMyListingsByPriceDenomDetails = await buildGetMyListingsByPriceDenomDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetMyListingsByPriceDenomContent(getMyListingsByPriceDenomDetails);
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
            const action = new getMyListingsByPriceDenomAction();
            const response = await action.getMyListingsByPriceDenom(
                getMyListingsByPriceDenomDetails,
                runtime,
                message,
                state
            );
            console.log("Get listing by price denom response: ", response);
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retreived listings by price denom:  ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retreive listings by price denom: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getMyListingsByPriceDenomTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getMyListingsByPriceDenomExamples as ActionExample[][],
} as Action;

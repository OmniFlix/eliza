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
import getListingsByPriceDenomExamples from "../../../action_examples/omniflix/marketplace/get_listings_by_price_denom.ts";

export interface getListingsByPriceDenomContent extends Content {
    denom: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetListingsByPriceDenomContent(content: Content): validationResult {
    let msg = "";
    if (!content.denom) {
        msg += "Please provide denom to get the listings.";
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

const getListingsByPriceDenomTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "denom": "uflix"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested de-list NFT:
- denom : mentioned in the current message or recent messages (if any)

Respond with a JSON markdown block containing only the extracted values.`;

export class getListingsByPriceDenomAction {
    async getListingsByPriceDenom(
        params: getListingsByPriceDenomContent,
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
            const response = await marketPlaceProvider.getListingByPriceDenom(
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

const buildGetListingByPriceDenomDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getListingsByPriceDenomContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getListingByPriceDenomContext = composeContext({
        state: currentState,
        template: getListingsByPriceDenomTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getListingByPriceDenomContext,
        modelClass: ModelClass.SMALL,
    });

    const getListingsByPriceDenomContent = content as getListingsByPriceDenomContent;

    return getListingsByPriceDenomContent;
};

export default {
    name: "GET_LISTINGS_BY_PRICE_DENOM",
    similes: [
        "Get listings by price denom",
    ],
    description: "Get listings by price denom",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting Get listing by price denom handler...");
        const getListingByPriceDenomDetails = await buildGetListingByPriceDenomDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetListingsByPriceDenomContent(getListingByPriceDenomDetails);
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
            const action = new getListingsByPriceDenomAction();
            const response = await action.getListingsByPriceDenom(
                getListingByPriceDenomDetails,
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
    template: getListingsByPriceDenomTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getListingsByPriceDenomExamples as ActionExample[][],
} as Action;

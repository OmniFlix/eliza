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
import getMyAuctionsByPriceDenomExamples from "../../../action_examples/omniflix/marketplace/get_my_auctions_by_price_denom.ts";

export interface getMyAuctionsByPriceDenomContent extends Content {
    denom: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetMyAuctionsByPriceDenomContent(content: Content): validationResult {
    let msg = "";
    if (!content.denom) {
        msg += "Please provide denom to get your auctions.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "get auctions of owner by denom request is valid.",
    };
}

const getMyAuctionsByPriceDenomTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "denom": "uflix"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested auctions by price denom:
- denom : mentioned in the current message

Respond with a JSON markdown block containing only the extracted values.`;

export class getMyAuctionsByPriceDenomAction {
    async getMyAuctionsByPriceDenom(
        params: getMyAuctionsByPriceDenomContent,
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
            const response = await marketPlaceProvider.getMyAuctionsByPriceDenom(
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

const buildGetMyAuctionsByPriceDenomDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getMyAuctionsByPriceDenomContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getMyAuctionsByPriceDenomContext = composeContext({
        state: currentState,
        template: getMyAuctionsByPriceDenomTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getMyAuctionsByPriceDenomContext,
        modelClass: ModelClass.SMALL,
    });

    const getMyAuctionsByPriceDenomContent = content as getMyAuctionsByPriceDenomContent;

    return getMyAuctionsByPriceDenomContent;
};

export default {
    name: "GET_MY_AUCTIONS_BY_PRICE_DENOM",
    similes: [
        "Get my auctions by price denom",
    ],
    description: "Get my auctions by price denom",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting Get auction by price denom handler...");
        const getMyAuctionsByPriceDenomDetails = await buildGetMyAuctionsByPriceDenomDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetMyAuctionsByPriceDenomContent(getMyAuctionsByPriceDenomDetails);
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
            const action = new getMyAuctionsByPriceDenomAction();
            const response = await action.getMyAuctionsByPriceDenom(
                getMyAuctionsByPriceDenomDetails,
                runtime,
                message,
                state
            );
            console.log("Get auction by price denom response: ", response);
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retreived auctions by price denom:  ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retreive auctions by price denom: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getMyAuctionsByPriceDenomTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getMyAuctionsByPriceDenomExamples as ActionExample[][],
} as Action;

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
import getAuctionsByPriceDenomExamples from "../../../action_examples/omniflix/marketplace/get_auctions_by_price_denom.ts";

export interface getAuctionsByPriceDenomContent extends Content {
    denom: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetAuctionsByPriceDenomContent(content: Content): validationResult {
    let msg = "";
    if (!content.denom) {
        msg += "Please provide denom to get the auctions.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "get auctions by denom request is valid.",
    };
}

const getAuctionsByPriceDenomTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "denom": "uflix"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested listings by price denom:
- denom : mentioned in the current message

Respond with a JSON markdown block containing only the extracted values.`;

export class getAuctionsByPriceDenomAction {
    async getAuctionsByPriceDenom(
        params: getAuctionsByPriceDenomContent,
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
            const response = await marketPlaceProvider.getAuctionsByPriceDenom(
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

const buildGetAuctionsByPriceDenomDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getAuctionsByPriceDenomContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getAuctionsByPriceDenomContext = composeContext({
        state: currentState,
        template: getAuctionsByPriceDenomTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getAuctionsByPriceDenomContext,
        modelClass: ModelClass.SMALL,
    });

    const getAuctionsByPriceDenomContent = content as getAuctionsByPriceDenomContent;

    return getAuctionsByPriceDenomContent;
};

export default {
    name: "GET_AUCTIONS_BY_PRICE_DENOM",
    similes: [
        "Get auctions by price denom",
    ],
    description: "Get auctions by price denom",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting Get auctions by price denom handler...");
        const getAuctionsByPriceDenomDetails = await buildGetAuctionsByPriceDenomDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetAuctionsByPriceDenomContent(getAuctionsByPriceDenomDetails);
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
            const action = new getAuctionsByPriceDenomAction();
            const response = await action.getAuctionsByPriceDenom(
                getAuctionsByPriceDenomDetails,
                runtime,
                message,
                state
            );
            console.log("Get auctions by price denom response: ", response);
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
    template: getAuctionsByPriceDenomTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getAuctionsByPriceDenomExamples as ActionExample[][],
} as Action;

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
import getAuctionByNFTExamples from "../../../action_examples/omniflix/marketplace/get_auction_by_nft.ts";

export interface getAuctionByNFTContent extends Content {
    nftId: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetAuctionByNFTContent(content: Content): validationResult {
    let msg = "";
    if (!content.nftId) {
        msg += "Please provide nftId to fetch the auction.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "fetch auction of given NFT request is valid.",
    };
}

const getAuctionByNFTTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "nftId": "onft.."
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested NFT Id:
- nftId : mentioned in the current message.

Respond with a JSON markdown block containing only the extracted values.`;

export class getAuctionByNFTAction {
    async getAuctionByNFT(
        params: getAuctionByNFTContent,
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
            const response = await marketPlaceProvider.getAuctionByNftId(
                params.nftId
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

const buildGetAuctionByNFTDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getAuctionByNFTContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getAuctionByNFTContext = composeContext({
        state: currentState,
        template: getAuctionByNFTTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getAuctionByNFTContext,
        modelClass: ModelClass.SMALL,
    });

    const getAuctionByNFTContent = content as getAuctionByNFTContent;

    return getAuctionByNFTContent;
};

export default {
    name: "GET_AUCTION_BY_NFT",
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
        elizaLogger.log("Starting GET AUCTION BY NFT handler...");
        const getListingByNFTDetails = await buildGetAuctionByNFTDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetAuctionByNFTContent(getListingByNFTDetails);
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
            const action = new getAuctionByNFTAction();
            const response = await action.getAuctionByNFT(
                getListingByNFTDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retrieved auction by NFT ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve auction details by NFT: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getAuctionByNFTTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getAuctionByNFTExamples as ActionExample[][],
} as Action;

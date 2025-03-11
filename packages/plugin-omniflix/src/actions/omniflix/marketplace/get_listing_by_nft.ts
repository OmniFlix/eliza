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
import getListingByNFTExamples from "../../../action_examples/omniflix/marketplace/get_listing_by_nft.ts";

export interface getListingByNFTContent extends Content {
    nftId: string;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isGetListingByNFTContent(content: Content): validationResult {
    let msg = "";
    if (!content.nftId) {
        msg += "Please provide nftId to fetch the list.";
    }
    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }
    return {
        success: true,
        message: "fetch list of given NFT request is valid.",
    };
}

const getListingByNFTTemplate = `Respond with a JSON markdown block containing only the extracted values.

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

export class getListingByNFTAction {
    async getListingByNFT(
        params: getListingByNFTContent,
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
            const response = await marketPlaceProvider.getListingByNFTId(
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

const buildGetListingByNFTDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getListingByNFTContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getListingByNFTContext = composeContext({
        state: currentState,
        template: getListingByNFTTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getListingByNFTContext,
        modelClass: ModelClass.SMALL,
    });

    const getListingByNFTContent = content as getListingByNFTContent;

    return getListingByNFTContent;
};

export default {
    name: "GET_LISTING_BY_NFT",
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
        elizaLogger.log("Starting GET LISTING BY NFT handler...");
        const getListingByNFTDetails = await buildGetListingByNFTDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetListingByNFTContent(getListingByNFTDetails);
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
            const action = new getListingByNFTAction();
            const response = await action.getListingByNFT(
                getListingByNFTDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully retrieved listing by NFT ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve listing details by NFT: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getListingByNFTTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getListingByNFTExamples as ActionExample[][],
} as Action;

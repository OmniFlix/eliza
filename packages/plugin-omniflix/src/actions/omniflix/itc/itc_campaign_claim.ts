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
import { ITCProvider } from "../../../providers/omniflix/itc.ts";
import itcCampaignClaimExamples from "../../../action_examples/omniflix/itc/cancel_itc_campaign.ts";

export interface itcCampaignClaimContent extends Content {
    campaignId: bigint;
    nftId: string;
    interaction: number;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isITCCampaignClaimContent(content: Content): validationResult {
    const missingFields: string[] = [];

    if (!content.campaignId) {
        missingFields.push("campaignId");
    }
    if (!content.nftId) {
        missingFields.push("nftId");
    }
    if (!content.interaction) {
        missingFields.push("interaction");
    }
    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Please provide the following: ${missingFields.join(", ")}.`,
        };
    }

    return {
        success: true,
        message: "ITC campaign claim request is valid.",
    };
}

const itcCampaignClaimTemplate = `Respond with a JSON markdown block containing only the extracted values. Take all the values from the current messages. Please provide the following information:

- campaignId: (required) Please provide the campaignId.
- nftId: (required) Please provide the nftId.
- interaction: (required) Please provide the interaction level.

Example response:
\`\`\`json
{
   "campaignId": 123..,
   "nftId": "onft...",
   "interaction": 0
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested ITC Campaign Claim from the current messages:
- campaignId mentioned in the current message, don't take example value (required)
- nftId mentioned in the current message, don't take example value (required)
- interaction mentioned in the current message, don't take example value (required)

Respond with a JSON markdown block containing only the extracted values.`;

export class itcCampaignClaimAction {
    async itcCampaignClaim(
        params: itcCampaignClaimContent,
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

            const itcProvider = new ITCProvider(wallet);
            const response = await itcProvider.campaignClaim({
                campaignId: params.campaignId,
                nftId: params.nftId,
                interaction: params.interaction
            });
            if (!response || response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

const builditcCampaignClaimDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<itcCampaignClaimContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const itcCampaignClaimContext = composeContext({
        state: currentState,
        template: itcCampaignClaimTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: itcCampaignClaimContext,
        modelClass: ModelClass.SMALL,
    });

    const itcCampaignClaimContent = content as itcCampaignClaimContent;

    return itcCampaignClaimContent;
};

export default {
    name: "ITC_CAMPAIGN_CLAIM",
    similes: [
        "claim",
        "claim itc campaign",
        "itc campaign claim",
    ],
    description: "itc campaign claim.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting ITC_CAMPAIGN_CLAIM handler...");
        const itcCampaignClaimDetails = await builditcCampaignClaimDetails(
            runtime,
            message,
            state
        );
        console.log("itcCampaignClaimDetails", itcCampaignClaimDetails);
        const validationResult = isITCCampaignClaimContent(itcCampaignClaimDetails);
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
            const action = new itcCampaignClaimAction();
            const txHash = await action.itcCampaignClaim(
                itcCampaignClaimDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully claimed itc campaign ${itcCampaignClaimDetails.campaignId} & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to claim itc campaign: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: itcCampaignClaimTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: itcCampaignClaimExamples as ActionExample[][],
} as Action;

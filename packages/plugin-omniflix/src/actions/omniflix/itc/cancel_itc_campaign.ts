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
import cancelITCCampaignExamples from "../../../action_examples/omniflix/itc/cancel_itc_campaign.ts";

export interface cancelITCCampaignContent extends Content {
    campaignId: bigint;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isCancelITCCampaignContent(content: Content): validationResult {
    const missingFields: string[] = [];

    if (!content.campaignId) {
        missingFields.push("campaignId");
    }
    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Please provide the following: ${missingFields.join(", ")}.`,
        };
    }

    return {
        success: true,
        message: "Cancel ITC campaign request is valid.",
    };
}

const cancelITCCampaignTemplate = `Respond with a JSON markdown block containing only the extracted values. Take all the values from the current messages. Please provide the following information:

Example response:
\`\`\`json
{
   "campaignId": 123..,
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested cancel ITC Campaign from the current messages:
- campaignId mentioned in the current message, dont take example value (required)

Respond with a JSON markdown block containing only the extracted values.`;

export class cancelITCCampaignAction {
    async cancelITCCampaign(
        params: cancelITCCampaignContent,
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
            const response = await itcProvider.cancelCampaign({
                campaignId: params.campaignId,
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

const buildCancelITCCampaignDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<cancelITCCampaignContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const cancelITCCampaignContext = composeContext({
        state: currentState,
        template: cancelITCCampaignTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: cancelITCCampaignContext,
        modelClass: ModelClass.SMALL,
    });

    const cancelITCCampaignContent = content as cancelITCCampaignContent;

    return cancelITCCampaignContent;
};

export default {
    name: "CANCEL_ITC_CAMPAIGN",
    similes: [
        "cancel itc campaign",
        "cancel campaign",
        "cancel my campaign"
    ],
    description: "cancel an itc campaign.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CANCEL_ITC_CAMPAIGN handler...");
        const cancelITCCampaignDetails = await buildCancelITCCampaignDetails(
            runtime,
            message,
            state
        );
        console.log("cancelITCCampaignDetails", cancelITCCampaignDetails);
        const validationResult = isCancelITCCampaignContent(cancelITCCampaignDetails);
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
            const action = new cancelITCCampaignAction();
            const txHash = await action.cancelITCCampaign(
                cancelITCCampaignDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully canceled itc campaign ${cancelITCCampaignDetails.campaignId} & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to cancelling itc campaign: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: cancelITCCampaignTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: cancelITCCampaignExamples as ActionExample[][],
} as Action;

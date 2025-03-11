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
import depositITCCampaignExamples from "../../../action_examples/omniflix/itc/deposit_itc_campaign.ts";

export interface depositITCCampaignContent extends Content {
    campaignId: bigint;
    denom: string;
    amount: number | string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isDepositITCCampaignContent(content: Content): validationResult {
    const missingFields: string[] = [];

    if (!content.campaignId) {
        missingFields.push("campaignId");
    }
    if (!content.denom) {
        missingFields.push("denom");
    }
    if (!content.amount) {
        missingFields.push("amount");
    }
    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Please provide the following: ${missingFields.join(", ")}.`,
        };
    }

    return {
        success: true,
        message: "Deposit ITC campaign request is valid.",
    };
}

const depositITCCampaignTemplate = `Respond with a JSON markdown block containing only the extracted values. Take all the values from the current messages. Please provide the following information:

Example response:
\`\`\`json
{
   "campaignId": 123..,
   "denom": "uflix..",
   "amount": 100..
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested deposit ITC Campaign from the current messages:
- campaignId mentioned in the current message, dont take example value (required)
- denom mentioned in the current message, dont take example value (required)
- amount mentioned in the current message, dont take example value (required)

Respond with a JSON markdown block containing only the extracted values.`;

export class depositITCCampaignAction {
    async depositITCCampaign(
        params: depositITCCampaignContent,
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
            if (params.denom === "FLIX" || params.denom === "flix") {
                params.denom = "uflix";
                if (typeof params.amount === "number") {
                    params.amount = params.amount * 1000000;
                } else if (typeof params.amount === "string") {
                    params.amount = Number.parseInt(params.amount) * 1000000;
                }
            }

            const itcProvider = new ITCProvider(wallet);
            const response = await itcProvider.depositCampaign({
                campaignId: params.campaignId,
                denom: params.denom,
                amount: params.amount,
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

const buildDepositITCCampaignDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<depositITCCampaignContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const depositITCCampaignContext = composeContext({
        state: currentState,
        template: depositITCCampaignTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: depositITCCampaignContext,
        modelClass: ModelClass.SMALL,
    });

    const depositITCCampaignContent = content as depositITCCampaignContent;

    return depositITCCampaignContent;
};

export default {
    name: "DEPOSIT_ITC_CAMPAIGN",
    similes: [
        "deposit itc campaign",
        "deposit campaign",
        "deposit my campaign",
        "deposit some tokens",
        "deposit into itc campaign",
        "deposit into my itc campaign",
        "deposit"
    ],
    description: "deposit itc campaign.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting DEPOSIT_ITC_CAMPAIGN handler...");
        const depositITCCampaignDetails = await buildDepositITCCampaignDetails(
            runtime,
            message,
            state
        );
        console.log("depositITCCampaignDetails", depositITCCampaignDetails);
        const validationResult = isDepositITCCampaignContent(depositITCCampaignDetails);
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
            const action = new depositITCCampaignAction();
            const txHash = await action.depositITCCampaign(
                depositITCCampaignDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully deposited ${depositITCCampaignDetails.amount} ${depositITCCampaignDetails.denom} on itc campaign ${depositITCCampaignDetails.campaignId} & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to deposit itc campaign: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: depositITCCampaignTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: depositITCCampaignExamples as ActionExample[][],
} as Action;

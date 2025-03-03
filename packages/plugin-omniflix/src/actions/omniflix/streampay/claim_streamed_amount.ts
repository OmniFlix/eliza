import {
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
    elizaLogger
} from "@elizaos/core";
import { WalletProvider, walletProvider } from "../../../providers/wallet.ts";
import { StreamPayProvider, Period } from "../../../providers/omniflix/streampay.ts";
import claimStreamedAmountExamples from "../../../action_examples/omniflix/streampay/claim_streamed_amount";

export interface ClaimStreamedAmountContent extends Content {
    streamId: string;
    claimer: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isValidateClaimStreamedAmountContent(content: ClaimStreamedAmountContent): validationResult {
    if (!content.streamId) {
        return { success: false, message: "Valid stream id is required" };
    }
    return { success: true, message: "Claim streamed amount content is valid" };
}

const claimStreamedAmountTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "streamId": "sp3483"
}
\`\`\`
{{recentMessages}}

Given the recent messages, extract the following information about the requested claim streamed amount:
- stream id  mentioned in the current message or recent messages (if any)

Respond with a JSON markdown block containing only the extracted values.`;

const buildClaimStreamedAmountDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<ClaimStreamedAmountContent> => {
    const currentState = await runtime.updateRecentMessageState(
        state || await runtime.composeState(message)
    );

    const context = composeContext({
        state: currentState,
        template: claimStreamedAmountTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    });

    const claimStreamedAmountContent = content as ClaimStreamedAmountContent;

    return claimStreamedAmountContent;
};

export class ClaimStreamedAmountAction {
    async claimStreamedAmount(
        params: ClaimStreamedAmountContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<{ transactionHash: string, streamId: string }> {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );
            const streamPayProvider = new StreamPayProvider(wallet);

            console.log('params', params);
            
            const response = await streamPayProvider.claimStreamedAmount(params.streamId);

            if (response.code !== 0) {
                throw new Error(response.rawLog || "Claim streamed amount failed");
            }
            console.log('response', response);

            return {
                transactionHash: response.transactionHash,
                streamId: params.streamId
            }
        } catch (error) {
            throw new Error(`Claim streamed amount failed: ${error.message}`);
        }
    }
}

export default {
    name: "CLAIM_STREAMED_AMOUNT",
    similes: [
        "claim streamed amount",
        "claim streamed amount",
        "claim streamed amount",
        "claim streamed amount",
    ],
    description: "Claim a token streamed amount from a specified omniflix address.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CLAIM_STREAMED_AMOUNT handler...");

        const claimStreamedAmountContent = await buildClaimStreamedAmountDetails(
            runtime,
            message,
            state
        );

        const validationResult = isValidateClaimStreamedAmountContent(claimStreamedAmountContent);
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
            const action = new ClaimStreamedAmountAction();
            console.log('action', action)
            const tx = await action.claimStreamedAmount(
                claimStreamedAmountContent,
                runtime,
                message,
                state
            );

            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully claimed streamed amount of ${tx.streamId}\nTxHash: ${tx.transactionHash}`,
                    content: {
                        success: true,
                        hash: tx.transactionHash,
                        stream_id: tx.streamId,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `❌ Error occurred during CLAIM_STREAMED_AMOUNT please try again later with valid details.`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: claimStreamedAmountTemplate,
    validate: async (_runtime: IAgentRuntime) => true,
    examples: claimStreamedAmountExamples as ActionExample[][],
} as Action;
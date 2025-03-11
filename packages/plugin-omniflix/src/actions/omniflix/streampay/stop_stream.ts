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
import stopStreamExamples from "../../../action_examples/omniflix/streampay/stop_stream";

export interface StopStreamContent extends Content {
    streamId: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isValidateStopStreamContent(content: StopStreamContent): validationResult {
    if (!content.streamId) {
        return { success: false, message: "Valid stream id is required" };
    }
    return { success: true, message: "Stop stream content is valid" };
}

const stopStreamTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "streamId": "sp3483",
}
\`\`\`
{{recentMessages}}

Given the recent messages, extract the following information about the requested stop stream:
- stream id  mentioned in the current message or recent messages (if any)

Respond with a JSON markdown block containing only the extracted values.`;

const buildStopStreamDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<StopStreamContent> => {
    const currentState = await runtime.updateRecentMessageState(
        state || await runtime.composeState(message)
    );

    const context = composeContext({
        state: currentState,
        template: stopStreamTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    });

    const stopStreamContent = content as StopStreamContent;

    return stopStreamContent;
};

export class StopStreamAction {
    async stopStream(
        params: StopStreamContent,
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
            
            const response = await streamPayProvider.stopStream(params.streamId);

            if (response.code !== 0) {
                throw new Error(response.rawLog || "Stream stop failed");
            }

            return {
                transactionHash: response.transactionHash,
                streamId: params.streamId
            }
        } catch (error) {
            throw new Error(`Stream stop failed: ${error.message}`);
        }
    }
}

export default {
    name: "STOP_STREAM",
    similes: [
        "stop stream",
        "stop streaming",
        "end stream",
        "end streaming",
    ],
    description: "Stop a token streaming payment to a specified omniflix address.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting STOP_STREAM handler...");

        const stopStreamContent = await buildStopStreamDetails(
            runtime,
            message,
            state
        );

        const validationResult = isValidateStopStreamContent(stopStreamContent);
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
            const action = new StopStreamAction();
            console.log('action', action)
            const tx = await action.stopStream(
                stopStreamContent,
                runtime,
                message,
                state
            );

            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully stopped stream ${tx.streamId}\nTxHash: ${tx.transactionHash}`,
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
                    text: `❌ Error occurred during STOP_STREAM please try again later with valid details.`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: stopStreamTemplate,
    validate: async (_runtime: IAgentRuntime) => true,
    examples: stopStreamExamples as ActionExample[][],
} as Action;
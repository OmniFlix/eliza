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
import { Coin } from "@cosmjs/stargate";
import streamSendExamples from "../../../action_examples/omniflix/streampay/stream_send";

interface Period {
    amount: Coin;
    duration: {
        seconds: number;
        nanos: number;
    };
}

export interface StreamSendContent extends Content {
    recipientAddress: string;
    denom: string;
    amount: string;
    duration: string;
    streamType?: string;
    periods?: Period[];
    cancellable?: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isValidateStreamSendContent(content: StreamSendContent): validationResult {
    console.log('Validating stream send content:', content);
    if (!content.recipientAddress) {
        return { success: false, message: "Recipient address is required" };
    }
    if (!content.recipientAddress.startsWith('omniflix')) {
        return { success: false, message: "Invalid recipient address format. Must start with 'omniflix'" };
    }
    if (!content.denom) {
        return { success: false, message: "Valid denomination is required" };
    }
    if (!content.amount) {
        return { success: false, message: "Valid amount is required" };
    }

    // try {
    //     BigInt(content.amount);
    // } catch {
    //     return { success: false, message: "Amount must be a valid number" };
    // }
    
    return { success: true, message: "Stream send content is valid" };
}

const streamSendTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "recipientAddress": "omniflix...",
    "denom": "uflix",
    "amount": "1000000",
    "duration": 10,
    "streamType": 0,
    "periods": [],
    "cancellable": true
}
\`\`\`
{{recentMessages}}

Given the recent messages, extract the following information about the requested stream send:
- recipient address (must be a valid omniflix address)
- amount : mentioned in the current message or recent messages (if any)
- denom : mentioned in the current message or recent messages (if any)
- duration: (required) Please provide the duration.
- stream type (optional, defaults to 0)
- whether the stream is cancellable (optional, defaults to true)
- periods (optional)

Respond with a JSON markdown block containing only the extracted values.`;

const buildStreamSendDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<StreamSendContent> => {
    const currentState = await runtime.updateRecentMessageState(
        state || await runtime.composeState(message)
    );

    const context = composeContext({
        state: currentState,
        template: streamSendTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context,
        modelClass: ModelClass.SMALL,
    });

    const streamSendContent = content as StreamSendContent;

    return streamSendContent;
};

export class StreamSendAction {
    async sendStream(
        params: StreamSendContent,
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
            const streamPayProvider = new StreamPayProvider(wallet);
            //const content = await buildStreamSendDetails(runtime, message, state);

            // console.log('params', params);
            // if (!params || !params.denom || !params.amount) {
            //     throw new Error("Invalid parameters: denom and amount are required.");
            // }
            console.log('params', params);
            if (params.denom === "FLIX" || params.denom === "flix") {
                params.denom = "uflix";
                if (params.amount && typeof params.amount === "number") {
                    params.amount = params.amount * 1000000;
                } else if (params.amount && typeof params.amount === "string") {
                    params.amount = Number.parseInt(params.amount) * 1000000;
                }
            }
            
            elizaLogger.info(`Sending stream with parameters: ${JSON.stringify(params)}`);
            
            const response = await streamPayProvider.streamSend(
                params.recipientAddress,
                {
                    denom: params.denom,
                    amount: params.amount.toString()
                },
                Math.floor(Number(params.duration)),
                Number(params.streamType) || 0,
                [],
                params.cancellable === 'true'
            );

            if (response.code !== 0) {
                throw new Error(response.rawLog || "Stream send failed");
            }

            return response.transactionHash;
        } catch (error) {
            throw new Error(`Stream send failed: ${error.message}`);
        }
    }
}

export default {
    name: "STREAM_SEND",
    similes: [
        "stream send",
        "send stream",
        "create stream",
        "start stream",
        "stream payment",
        "streaming payment",
        "stream tokens",
        "stream flix"
    ],
    description: "Create a token streaming payment to a specified omniflix address.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting STREAM_SEND handler...");

        const streamSendContent = await buildStreamSendDetails(
            runtime,
            message,
            state
        );

        const validationResult = isValidateStreamSendContent(streamSendContent);
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
            const action = new StreamSendAction();
            console.log('action', action)
            const txHash = await action.sendStream(
                streamSendContent,
                runtime,
                message,
                state
            );
            console.log('txHash', txHash)

            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully streamed ${streamSendContent.amount} ${streamSendContent.denom} to ${streamSendContent.recipientAddress}\nTxHash: ${txHash}`,
                    content: {
                        success: true,
                        hash: txHash,
                        amount: streamSendContent.amount,
                        recipient_address: streamSendContent.recipientAddress,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `❌ Error occurred during STREAM_SEND please try again later with valid details.`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: streamSendTemplate,
    validate: async (_runtime: IAgentRuntime) => true,
    examples: streamSendExamples as ActionExample[][],
} as Action;
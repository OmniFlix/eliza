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
    paymentFee?: string;
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
    "cancellable": true,
    "paymentFee": 0
}
\`\`\`
{{recentMessages}}

Given the recent messages, extract the following information about the requested stream send:
- recipient address (must be a valid omniflix address)
- denom: (optional) Please provide the denom.
- amount: (required) Please provide the amount.
- duration: (required) Please provide the duration.
- stream type (optional, defaults to 0)
- whether the stream is cancellable (optional, defaults to true)
- payment fee (optional, in uflix)
- periods (optional)

Respond with a JSON markdown block containing only the extracted values.`;

function validateStreamSendContent(content: StreamSendContent): { isValid: boolean; error?: string } {
    console.log('Validating stream send content:', content);
    if (!content.recipientAddress) {
        return { isValid: false, error: "Recipient address is required" };
    }
    if (!content.recipientAddress.startsWith('omniflix')) {
        return { isValid: false, error: "Invalid recipient address format. Must start with 'omniflix'" };
    }
    if (!content.denom) {
        return { isValid: false, error: "Valid denomination is required" };
    }
    if (!content.amount) {
        return { isValid: false, error: "Valid amount is required" };
    }
    if (!content.duration) {
        return { isValid: false, error: "Valid duration in seconds is required" };
    }
    
    // Validate amount format
    try {
        BigInt(content.amount);
    } catch {
        return { isValid: false, error: "Amount must be a valid number" };
    }
    
    return { isValid: true };
}

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

    const validation = validateStreamSendContent(content as StreamSendContent);
    if (!validation.isValid) {
        throw new Error(validation.error);
    }

    return content as StreamSendContent;
};

export class StreamSendAction {
    static async sendStream(
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );
            const streamPayProvider = new StreamPayProvider(wallet);
            
            const params = await buildStreamSendDetails(runtime, message, state);
            if (params.denom === "FLIX" || params.denom === "flix") {
                params.denom = "uflix";
                if (typeof params.amount === "number") {
                    params.amount = params.amount * 1000000;
                } else if (typeof params.amount === "string") {
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
                params.cancellable === 'true',
                params.paymentFee && params.paymentFee !== 'null' ? { denom: params.denom, amount: params.paymentFee.toString() } : undefined
            );

            if (response.code !== 0) {
                throw new Error(response.rawLog || "Stream send failed");
            }

            if (callback) {
                callback({
                    text: `Successfully created stream with ID: ${response.streamId}\nTransaction Hash: ${response.transactionHash}`,
                    content: { 
                        success: true, 
                        streamId: response.streamId,
                        transactionHash: response.transactionHash 
                    }
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error(`Stream send failed: ${error.message}`);
            if (callback) {
                callback({
                    text: `Failed to send stream: ${error.message}`,
                    content: { success: false, error: error.message }
                });
            }
            return false;
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
        
        const params = await buildStreamSendDetails(runtime, message, state);
        return StreamSendAction.sendStream(runtime, message, state, callback);
    },
    template: streamSendTemplate,
    validate: async (_runtime: IAgentRuntime) => true,
    examples: streamSendExamples as ActionExample[][],
} as Action;
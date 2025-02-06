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
import { StreamPayProvider, Duration, Period } from "../../../providers/omniflix/streampay.ts";
import { Coin } from "@cosmjs/stargate";
import streamSendExamples from "../../../action_examples/omniflix/streampay/stream_send";

export interface StreamSendContent extends Content {
    recipientAddress: string;
    amount: Coin;
    duration: Duration;
    streamType?: number;
    periods?: Period[];
    cancellable?: boolean;
    paymentFee?: Coin;
}

const streamSendTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "recipientAddress": "omniflix...",
    "amount": {
        "denom": "uflix",
        "amount": "1000000"
    },
    "duration": {
        "seconds": 3600
    },
    "streamType": 0,
    "periods": [],
    "cancellable": true,
    "paymentFee": null
}
\`\`\`
{{recentMessages}}

Given the recent messages, extract the following information about the requested stream send:
- recipient address (must be a valid omniflix address)
- amount and denomination (convert to uflix, 1 FLIX = 1000000 uflix)
- duration in seconds and nanos
- stream type (optional, defaults to 0)
- whether the stream is cancellable (optional, defaults to true)
- payment fee (optional, in uflix)
- periods (optional)

Respond with a JSON markdown block containing only the extracted values.`;

function validateStreamSendContent(content: StreamSendContent): { isValid: boolean; error?: string } {
    if (!content.recipientAddress) {
        return { isValid: false, error: "Recipient address is required" };
    }
    if (!content.recipientAddress.startsWith('omniflix')) {
        return { isValid: false, error: "Invalid recipient address format. Must start with 'omniflix'" };
    }
    if (!content.amount || !content.amount.amount || !content.amount.denom) {
        return { isValid: false, error: "Valid amount with denomination is required" };
    }
    if (!content.duration || typeof content.duration.seconds !== 'number') {
        return { isValid: false, error: "Valid duration in seconds is required" };
    }
    
    // Validate amount format
    try {
        BigInt(content.amount.amount);
    } catch {
        return { isValid: false, error: "Amount must be a valid number" };
    }
    
    // Validate denomination
    if (content.amount.denom !== 'uflix') {
        return { isValid: false, error: "Amount denomination must be 'uflix'" };
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
    static async execute(
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        callback?: HandlerCallback
    ): Promise<boolean> {
        try {
            const wallet = await walletProvider.getWallet();
            const streamPayProvider = new StreamPayProvider(wallet);
            
            const params = await buildStreamSendDetails(runtime, message, state);
            
            elizaLogger.info(`Sending stream with parameters: ${JSON.stringify(params)}`);
            
            const response = await streamPayProvider.streamSend(
                params.recipientAddress,
                params.amount,
                params.duration,
                params.streamType || 0,
                params.periods || [],
                params.cancellable ?? true,
                params.paymentFee
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
        return StreamSendAction.execute(runtime, message, state, callback);
    },
    template: streamSendTemplate,
    validate: async (_runtime: IAgentRuntime) => true,
    examples: streamSendExamples as ActionExample[][],
} as Action;
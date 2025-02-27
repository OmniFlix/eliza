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
import { WalletProvider, walletProvider } from "../../providers/wallet.ts";
import { TokenFactoryProvider } from "../../providers/tokenfactory.ts";
import forceTransferExamples from "../../action_examples/tokenfactory/force_transfer.ts";
import { bech32 } from "bech32";

interface ForceTransferContent extends Content {
    sender: string;
    amount: string;
    denom: string;
    transferFromAddress: string;
    transferToAddress: string;
}

interface ValidationResult {
    success: boolean;
    message: string;
}

function isForceTransferContent(content: Content): ValidationResult {
    const missingFields: string[] = [];
    if (!content || !content.denom) {
        missingFields.push("denom");
    } else if (typeof content.denom !== 'string' || content.denom.length < 3 || content.denom.length > 10) {
        missingFields.push("denom");
    }

    if (!content.transferFromAddress || content.transferFromAddress === "null" || typeof content.transferFromAddress !== 'string') {
        missingFields.push("transferFromAddress");
    } else {
        try {
            const { prefix: senderPrefix } = bech32.decode(content.transferFromAddress);
            if (senderPrefix !== 'omniflix') {
                missingFields.push("valid sender");
            }
        } catch (error) {
            missingFields.push("valid sender");
        }
    }

    if (!content.transferToAddress || content.transferToAddress === "null" || typeof content.transferToAddress !== 'string') {
        missingFields.push("transferToAddress");
    } else {
        try {
            const { prefix: receiverPrefix } = bech32.decode(content.transferToAddress);
            if (receiverPrefix !== 'omniflix') {
                missingFields.push("valid recipent");
            }
        } catch (error) {
            missingFields.push("valid recipent");
        }
    }

    if (!content.amount || content.amount === "null" || typeof content.amount !== 'string') {
        missingFields.push("amount");
    }

    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`
        };
    }

    return {
        success: true,
        message: "Force transfer request is valid.",
    };
}

const forceTransferTemplate = `To force transfer tokens, I need the following information:
1. Token Denomination (required)

   - A unique identifier for your token
   - Must be 3-10 characters long
   - If the denom is in lowercase, it will be converted to uppercase
   - Will be created as "factory/[your-address]/[denom]"

2. Amount (required)
   - The amount of tokens to transfer

3. Transfer From Address (required)
   - The address of the account sending the tokens

4. Transfer To Address (required)
   - The address of the account receiving the tokens

Example request:

Example response:
\`\`\`json
{
    "denom": "GATA",
    "amount": "100",
    "transferFromAddress": "omniflix1...",
    "transferToAddress": "omniflix1..."
}
\`\`\`

{{recentMessages}}

Based on the recent messages, extract:
1. The token denomination to be created (if lowercase, converted to uppercase)
2. The amount of tokens to transfer
3. The address of the account sending the tokens
4. The address of the account receiving the tokens

Return only the extracted values in a JSON markdown block. Use null for missing values.`;

export class ForceTransferAction {
    async forceTransfer(
        params: ForceTransferContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<{ hash: string; fullDenom: string }> {
        const validationResult = isForceTransferContent(params);
        if (!validationResult.success) {
            throw new Error(validationResult.message);
        }

        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );
            const address = await wallet.getAddress();

            elizaLogger.log("Force transferring tokens:", params);

            const tokenFactory = new TokenFactoryProvider(wallet);

            const response = await tokenFactory.forceTransfer(address, params.transferToAddress, params.amount, params.denom);

            if (response.code !== 0) {
                throw new Error(`Transaction failed with code ${response.code}: ${response.rawLog}`);
            }

            return {
                hash: response.transactionHash,
                fullDenom: `factory/${address}/${params.denom}`
            };
        } catch (error) {
            elizaLogger.error("Error during force transfer:", error);
            throw new Error(`Force transfer failed: ${error.message}`);
        }
    }
}

const buildForceTransferDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<ForceTransferContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const forceTransferContext = composeContext({
        state,
        template: forceTransferTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: forceTransferContext,
        modelClass: ModelClass.SMALL,
    });

    if (content.denom) {
        content.denom = content.denom.toUpperCase();
    }

    const forceTransferContent = content as ForceTransferContent;

    return forceTransferContent;
};

export default {
    name: "FORCE_TRANSFER",
    similes: [
        "force_transfer",
        "force transfer",
        "force transfer {amount} {denom} from {sender} to {receiver}",
        "force transfer {amount} {denom} from {sender} to {receiver} {memo}"
    ],
    description: "Force transfer tokens from one address to another.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting FORCE_TRANSFER handler...");
        const forceTransferDetails = await buildForceTransferDetails(
            runtime,
            message,
            state
        );
    
        const validationResult = isForceTransferContent(forceTransferDetails);
        if (!validationResult.success) {
            if (callback) {
                if (!forceTransferDetails.denom) {
                    callback({
                        text: "What would you like to name your token? The name must be 3-10 characters long and contain only uppercase letters and numbers (e.g., 'GATA', 'TEST').",
                        content: { needDenom: true }
                    });
                } else {
                    callback({
                        text: validationResult.message,
                        content: { error: validationResult.message }
                    });
                }
            }
            return false;
        }
    
        try {
            const action = new ForceTransferAction();
            const result = await action.forceTransfer(
                forceTransferDetails,
                runtime,
                message,
                state
            );
            
            if (callback) {
                callback({
                    text: `Token denomination '${result.fullDenom}' force transferred successfully!\n ✅ Transaction hash: ${result.hash}`,
                    content: {
                        success: true,
                        hash: result.hash,
                        denom: forceTransferDetails.denom,
                        fullDenom: result.fullDenom
                    }
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during force transfer:", error);
            if (callback) {
                const errorMsg = error?.message || "Unknown error occurred.";
                callback({
                    text: "Failed to force transfer tokens. " + errorMsg,
                    content: { error: errorMsg }
                });
            }
            return false;
        }
    },
    template: forceTransferTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: forceTransferExamples as ActionExample[][]
} as Action;
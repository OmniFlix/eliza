import {
    elizaLogger,
    composeContext,
    Content,
    HandlerCallback,
    ModelClass,
    type IAgentRuntime,
    type Memory,
    type State,
    generateObjectDeprecated,
    ActionExample,
    Action,
} from "@elizaos/core";
import { WalletProvider, walletProvider } from "../../providers/wallet";
import { TokenFactoryProvider } from "../../providers/tokenfactory";
import burnTokenExamples from "../../action_examples/tokenfactory/burn_tokens";

export interface BurnTokenContent extends Content {
    amount: string;
    denom: string;
}

interface ValidationResult {
    success: boolean;
    message: string;
}

function isBurnTokenContent(content: Content): ValidationResult {
    const missingFields: string[] = [];
    if (!content.denom || content.denom === "null" || typeof content.denom !== 'string') {
        missingFields.push("denom");
    } else if (!content.denom.startsWith('factory/')) {
        missingFields.push("valid denom");
    }

    if (!content.amount || content.amount === "null" || typeof content.amount !== 'string') {
        missingFields.push("amount");
    }

    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Please provide ${missingFields.join(", ")} for the given NFT.`,
        };
    }

    return {
        success: true,
        message: "Burn tokens request is valid.",
    };
}

const burnTokenTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "amount": "1000",
    "denom": "factory/omniflix1.../yGATA",
}
\`\`\`

{{recentMessages}}

Based on the conversation, extract the following details for burning tokens:
1. Amount of tokens to burn (required)
   - Look for a number followed by a token symbol or just a number
   - Use null if not found

2. Token denom to burn (required)
   - Must be the complete denom string starting with "factory/"
   - Must include the full creator address (not abbreviated)
   - Example: "factory/omniflix1.../yGATA" (do not take from example)
   - Use null if not found

If any required field is missing or unclear, use null for its value.
Respond with a JSON markdown block containing only the extracted values.`;

export class BurnTokenAction {
    async burnTokens(
        params: BurnTokenContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<string> {
        console.log(`Burning tokens: ${params.amount} ${params.denom}`);
        const validationResult = isBurnTokenContent(params);
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

            console.log("Burning tokens:", params.amount, params.denom);

            const tokenFactory = new TokenFactoryProvider(wallet);
            const response = await tokenFactory.burnTokens(address, params.amount, params.denom);

            if (response.code !== 0) {
                throw new Error(`Transaction failed with code ${response.code}: ${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error) {
            throw new Error(`Token burn failed: ${error.message}`);
        }
    }
}

const buildBurnTokenDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<BurnTokenContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const burnTokenContext = composeContext({
        state,
        template: burnTokenTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: burnTokenContext,
        modelClass: ModelClass.SMALL,
    });

    const burnContent = content as BurnTokenContent;
    elizaLogger.debug("Burn content:", burnContent);

    return burnContent;
};

export default {
    name: "BURN_TOKEN_FACTORY_TOKENS",
    similes: [
        "burntokenfactorytokens",
        "burn_token_factory_tokens",
        "burn tokens",
        "burn {amount} {denom}",
        "burn {amount} tokens of {denom}",
        "burn token factory tokens",
        "burn {amount} token factory tokens of {denom}"
    ],
    description: "Burn tokens from a token factory denomination.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting BURN_TOKEN_FACTORY_TOKENS handler...");

        const burnDetails = await buildBurnTokenDetails(
            runtime,
            message,
            state
        );

        const validationResult = isBurnTokenContent(burnDetails);
        if (!validationResult.success) {
            elizaLogger.error("Invalid content for BURN_TOKEN_FACTORY_TOKENS action:", validationResult.message);
            if (callback) {
                callback({
                    text: validationResult.message,
                    content: { 
                        error: validationResult.message,
                        details: burnDetails 
                    },
                });
            }
            return false;
        }

        try {
            const action = new BurnTokenAction();
            const txHash = await action.burnTokens(
                burnDetails,
                runtime,
                message,
                state
            );

            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `Successfully burned ${burnDetails.amount} ${burnDetails.denom} tokens\n ✅ Transaction Hash: ${txHash}`,
                    content: {
                        success: true,
                        hash: txHash,
                        amount: burnDetails.amount,
                        denom: burnDetails.denom
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during token burn:", error);
            if (callback) {
                callback({
                    text: `Error burning tokens: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: burnTokenTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: burnTokenExamples as ActionExample[][]
} as Action

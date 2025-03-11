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
import { WalletProvider, walletProvider } from "../../providers/wallet.ts";
import { TokenFactoryProvider } from "../../providers/tokenfactory.ts";
import { bech32 } from "bech32";
import mintTokensExamples from "../../action_examples/tokenfactory/mint_tokens.ts";

export interface MintTokensContent extends Content {
    amount: string;
    denom: string;
    recipient: string;
}

interface ValidationResult {
    success: boolean;
    message: string;
}

function isMintTokensContent(content: Content): ValidationResult {
    const missingFields: string[] = [];
    if (!content.denom || content.denom === "null" || typeof content.denom !== 'string') {
        missingFields.push("denom");
    } else if (!content.denom.startsWith('factory/')) {
        missingFields.push("valid denom");
    }

    if (!content.amount || content.amount === "null" || typeof content.amount !== 'string') {
        missingFields.push("amount");
    }

    if (content.recipient) {
        try {
            const { prefix } = bech32.decode(content.recipient as string);
            if (prefix !== 'omniflix') {
                missingFields.push("valid recipient");
            }
        } catch (error) {
            missingFields.push("valid recipient");
        }
    }

    if (missingFields.length > 0) {
        const message = `Please provide ${missingFields.join(", ")} for the given NFT.`;
        return {
            success: false,
            message: message,
        };
    }

    return {
        success: true,
        message: "Mint tokens request is valid.",
    };
}

const mintTokensTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "amount": "100000000000",
    "denom": "factory/omniflix1.../denom",
    "recipient": "omniflix1..."
}
\`\`\`

{{recentMessages}}

Based on the conversation, extract the following details for minting tokens:
1. Amount of tokens to mint (required)
   - Look for a number followed by a token symbol or just a number
   - Use null if not found

2. Token denom to mint (required)
   - Must be the complete denom string starting with "factory/"
   - Must include the full creator address (not abbreviated)
   - Use null if not found

3. Recipient address (required)
   - Must be a complete OmniFlix address (not abbreviated)
   - Must be 45 characters long starting with "omniflix1"
   - Example: "omniflix1z6xl..."
   - Use null if not found or if incomplete

If any required field is missing or unclear, use null for its value.
Respond with a JSON markdown block containing only the extracted values.`;

export class MintTokensAction {
    async mintTokens(
        params: MintTokensContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<string> {
        elizaLogger.log("Minting tokens:", {
            amount: params.amount,
            denom: params.denom,
            recipient: params.recipient
        });
        const validationResult = isMintTokensContent(params);
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
            const tokenFactory = new TokenFactoryProvider(wallet);
            const response = await tokenFactory.mintTokens(
                params.denom,
                params.amount,
                params.recipient
            );

            if (response.code !== 0) {
                throw new Error(`Transaction failed with code ${response.code}: ${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error) {
            elizaLogger.error("Token minting failed:", error);
            throw new Error(`Token minting failed: ${error.message}`);
        }
    }
}

const buildMintTokensDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<MintTokensContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const mintTokensContext = composeContext({
        state,
        template: mintTokensTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: mintTokensContext,
        modelClass: ModelClass.SMALL,
    });

    const mintContent = content as MintTokensContent;

    return mintContent;
};

export default {
    name: "MINT_TOKEN_FACTORY_TOKENS",
    similes: [
        "minttokenfactorytokens",
        "mint_token_factory_tokens",
        "mint tokens",
        "mint new tokens",
        "mint {amount} {denom} tokens",
        "mint {amount} tokens of {denom}",
        "mint and send {amount} {denom} to {recipient}"
    ],
    description: "Mint new tokens using the token factory module.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting MINT_TOKEN_FACTORY_TOKENS handler...");

        const mintDetails = await buildMintTokensDetails(
            runtime,
            message,
            state
        );

        const validationResult = isMintTokensContent(mintDetails);
        if (!validationResult.success) {
            elizaLogger.error("Invalid content for MINT_TOKEN_FACTORY_TOKENS action:", validationResult.message);
            if (callback) {
                callback({
                    text: validationResult.message,
                    content: { 
                        error: validationResult.message,
                        details: mintDetails 
                    },
                });
            }
            return false;
        }

        try {
            const action = new MintTokensAction();
            const txHash = await action.mintTokens(
                mintDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `Successfully minted ${mintDetails.amount} ${mintDetails.denom} tokens to ${mintDetails.recipient}\n ✅ Transaction Hash: ${txHash}`,
                    content: {
                        success: true,
                        hash: txHash,
                        ...mintDetails
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during token minting:", error);
            if (callback) {
                callback({
                    text: `Failed to mint tokens: ${error.message}`,
                    content: { 
                        error: error.message,
                        details: mintDetails
                    },
                });
            }
            return false;
        }
    },
    template: mintTokensTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: mintTokensExamples as ActionExample[][]
} as Action;
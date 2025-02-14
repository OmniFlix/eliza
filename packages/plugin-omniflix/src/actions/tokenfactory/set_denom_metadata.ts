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
import setDenomMetadataExamples from "../../action_examples/tokenfactory/set_denom_metadata.ts";

interface SetDenomMetadataContent extends Content {
    denom: string;
    metadata: any;
}

interface ValidationResult {
    success: boolean;
    message: string;
}

function isSetDenomMetadataContent(content: Content): ValidationResult {
    let msg = "";
    if (!content || !content.denom) {
        msg += "Token denomination is required.";
    } else if (typeof content.denom !== 'string' || content.denom.length < 3 || content.denom.length > 10) {
        msg += "Token denomination must be between 3 and 10 characters long.";
    }

    if (!content.metadata) {
        msg += "Token metadata is required.";
    } else if (typeof content.metadata !== 'object') {
        msg += "Token metadata must be an object.";
    }

    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }

    return {
        success: true,
        message: "Denom request is valid.",
    };
}

const setDenomMetadataTemplate = `To set metadata for a token denomination, I need the following information:
1. Token Denomination (required)

   - A unique identifier for your token
   - Must be 3-10 characters long
   - If the denom is in lowercase, it will be converted to uppercase
   - Will be created as "factory/[your-address]/[denom]"

2. Token Metadata (required)
   - An object representing the metadata for the token

Example request:

Example response:
\`\`\`json
{
    "denom": "GATA",
    "metadata": {
        "name": "Gata Token",
        "description": "Gata Token",
        "display": {
            "name": "Gata Token",
            "symbol": "GATA",
            "logo": "https://example.com/logo.png",
            "color": "#000000"
        }
    }
}
\`\`\`

{{recentMessages}}

Based on the recent messages, extract:
1. The token denomination to be created (if lowercase, converted to uppercase)
2. The token metadata to be set

Return only the extracted values in a JSON markdown block. Use null for missing values.`;

export class SetDenomMetadataAction {
    async setDenomMetadata(
        params: SetDenomMetadataContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<{ hash: string; fullDenom: string }> {
        const validationResult = isSetDenomMetadataContent(params);
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

            elizaLogger.log("Setting denom:", params.denom);

            const tokenFactory = new TokenFactoryProvider(wallet);

            const response = await tokenFactory.setDenomMetadata(params.denom, params.metadata);

            if (response.code !== 0) {
                throw new Error(`Transaction failed with code ${response.code}: ${response.rawLog}`);
            }

            return {
                hash: response.transactionHash,
                fullDenom: `factory/${address}/${params.denom}`
            };
        } catch (error) {
            elizaLogger.error("Error during denom creation:", error);
            throw new Error(`Denom creation failed: ${error.message}`);
        }
    }
}

const buildSetDenomMetadataDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<SetDenomMetadataContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const setDenomMetadataContext = composeContext({
        state,
        template: setDenomMetadataTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: setDenomMetadataContext,
        modelClass: ModelClass.SMALL,
    });

    if (content.denom) {
        content.denom = content.denom.toUpperCase();
    }

    const denomContent = content as SetDenomMetadataContent;

    return denomContent;
};

export default {
    name: "SET_TOKEN_FACTORY_DENOM_METADATA",
    similes: [
        "settokenfactorydenommetadata",
        "set_token_factory_denom_metadata",
        "set denom metadata",
        "set token factory denom metadata {denom}",
        "set token factory denom {denom} metadata",
        "set token factory denom {denom} metadata {metadata}"
    ],
    description: "Set metadata for a token factory denomination.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting SET_TOKEN_FACTORY_DENOM_METADATA handler...");
        const denomDetails = await buildSetDenomMetadataDetails(
            runtime,
            message,
            state
        );
    
        const validationResult = isSetDenomMetadataContent(denomDetails);
        if (!validationResult.success) {
            if (callback) {
                if (!denomDetails.denom) {
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
            const action = new SetDenomMetadataAction();
            const result = await action.setDenomMetadata(
                denomDetails,
                runtime,
                message,
                state
            );
            
            if (callback) {
                callback({
                    text: `Token denomination '${result.fullDenom}' metadata set successfully!\n ✅ Transaction hash: ${result.hash}`,
                    content: {
                        success: true,
                        hash: result.hash,
                        denom: denomDetails.denom,
                        fullDenom: result.fullDenom
                    }
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during denom metadata set:", error);
            if (callback) {
                const errorMsg = error?.message || "Unknown error occurred.";
                callback({
                    text: "Failed to set token denomination metadata. " + errorMsg,
                    content: { error: errorMsg }
                });
            }
            return false;
        }
    },
    template: setDenomMetadataTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: setDenomMetadataExamples as ActionExample[][]
} as Action;
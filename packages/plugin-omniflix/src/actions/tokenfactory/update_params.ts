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
import updateParamsExamples from "../../action_examples/tokenfactory/update_params.ts";

interface UpdateParamsContent extends Content {
    authority: string;
    params: any;
}

interface ValidationResult {
    success: boolean;
    message: string;
}

function isUpdateParamsContent(content: Content): ValidationResult {
    const missingFields: string[] = [];
    if (!content.authority || content.authority === "null" || typeof content.authority !== 'string') {
        missingFields.push("authority");
    }

    if (!content.params || content.params === "null" || typeof content.params !== 'object') {
        missingFields.push("params");
    }

    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Missing required fields: ${missingFields.join(", ")}`
        };
    }

    return {
        success: true,
        message: "Update params request is valid.",
    };
}

const updateParamsTemplate = `To update token params, I need the following information:
1. Authority (required)
   - The address of the account sending the tokens

2. Params (required)
   - The new params for the token

Example request:
\`\`\`json
{
    "authority": "omniflix1...",
    "params": {
        "name": "Gata Token",
        "symbol": "GATA",
        "maxSupply": "1000000000",
        "mintable": true,
        "burnable": true,
        "pausable": false,
        "admin": "omniflix1..."
    }
}
\`\`\`

Example response:
\`\`\`

{{recentMessages}}

Based on the recent messages, extract:
1. The authority of the account sending the tokens
2. The new params for the token

Return only the extracted values in a JSON markdown block. Use null for missing values.`;

export class UpdateParamsAction {
    async updateParams(
        params: UpdateParamsContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<{ hash: string; fullDenom: string }> {
        const validationResult = isUpdateParamsContent(params);
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

            elizaLogger.log("Updating token params:", params);

            const tokenFactory = new TokenFactoryProvider(wallet);

            const response = await tokenFactory.updateParams(params.authority, params.params);

            if (response.code !== 0) {
                throw new Error(`Transaction failed with code ${response.code}: ${response.rawLog}`);
            }

            return {
                hash: response.transactionHash,
                fullDenom: `factory/${address}/${params.denom}`
            };
        } catch (error) {
            elizaLogger.error("Error during updating params:", error);
            throw new Error(`Update params failed: ${error.message}`);
        }
    }
}

const buildUpdateParamsDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<UpdateParamsContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const updateParamsContext = composeContext({
        state,
        template: updateParamsTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: updateParamsContext,
        modelClass: ModelClass.SMALL,
    });

    if (content.denom) {
        content.denom = content.denom.toUpperCase();
    }

    const updateParamsContent = content as UpdateParamsContent;

    return updateParamsContent;
};

export default {
    name: "UPDATE_TOKEN_FACTORY_PARAMS",
    similes: [
        "update_token_factory_params",
        "update token factory params",
        "update token factory params {denom} {max_supply} {mintable} {burnable}",
        "update token factory params {denom} {max_supply} {mintable} {burnable} {memo}"
    ],
    description: "Update the parameters of a token factory.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting UPDATE_TOKEN_FACTORY_PARAMS handler...");
        const updateParamsDetails = await buildUpdateParamsDetails(
            runtime,
            message,
            state
        );
    
        const validationResult = isUpdateParamsContent(updateParamsDetails);
        if (!validationResult.success) {
            if (callback) {
                if (!updateParamsDetails.denom) {
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
            const action = new UpdateParamsAction();
            const result = await action.updateParams(
                updateParamsDetails,
                runtime,
                message,
                state
            );
            
            if (callback) {
                callback({
                    text: `Token denomination '${result.fullDenom}' updated params successfully!\n ✅ Transaction hash: ${result.hash}`,
                    content: {
                        success: true,
                        hash: result.hash,
                        denom: updateParamsDetails.denom,
                        fullDenom: result.fullDenom
                    }
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during update params:", error);
            if (callback) {
                const errorMsg = error?.message || "Unknown error occurred.";
                callback({
                    text: "Failed to update params. " + errorMsg,
                    content: { error: errorMsg }
                });
            }
            return false;
        }
    },
    template: updateParamsTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: updateParamsExamples as ActionExample[][]
} as Action;
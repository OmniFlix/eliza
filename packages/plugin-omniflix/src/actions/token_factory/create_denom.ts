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
import createDenomExamples from "../../action_examples/tokenfactory/create_denom.ts";

interface CreateDenomContent extends Content {
    denom: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isCreateDenomContent(content: Content): validationResult {
    let msg = "";
    if (!content || !content.denom) {
        msg += "Token denomination is required.";
    } else if (typeof content.denom !== 'string' || content.denom.length < 3 || content.denom.length > 10) {
        msg += "Token denomination must be between 3 and 10 characters long.";
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

const createDenomTemplate = `To create a new token denomination, I need the following information:
1. Token Denomination (required)

   - A unique identifier for your token
   - Must be 3-10 characters long
   - If the denom is in lowercase, it will be converted to uppercase
   - Will be created as "factory/[your-address]/[denom]"

Example request:

Example response:
\`\`\`json
{
    "denom": "GATA",
}
\`\`\`

{{recentMessages}}

Based on the recent messages, extract:
1. The token denomination to be created (if lowercase, converted to uppercase)

Return only the extracted values in a JSON markdown block. Use null for missing values.`;

export class CreateDenomAction {
    async createDenom(
        params: CreateDenomContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<{ hash: string; fullDenom: string }> {
        const validationResult = isCreateDenomContent(params);
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

            elizaLogger.log("Creating denom:", params.denom);

            const tokenFactory = new TokenFactoryProvider(wallet);

            const response = await tokenFactory.createDenom(params.denom);
            
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

const buildCreateDenomDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<CreateDenomContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const createDenomContext = composeContext({
        state,
        template: createDenomTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: createDenomContext,
        modelClass: ModelClass.SMALL,
    });

    if (content.denom) {
        content.denom = content.denom.toUpperCase();
    }

    const denomContent = content as CreateDenomContent;

    return denomContent;
};

export default {
    name: "CREATE_TOKEN_FACTORY_DENOM",
    similes: [
        "createtokenfactorydenom",
        "create_token_factory_denom",
        "create denom",
        "create new denom",
        "create token denom {denom}",
        "create new token denom {denom}",
        "create a new token factory denom called {denom}"
    ],
    description: "Create a new token factory denomination.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CREATE_TOKEN_FACTORY_DENOM handler...");
        const denomDetails = await buildCreateDenomDetails(
            runtime,
            message,
            state
        );
    
        const validationResult = isCreateDenomContent(denomDetails);
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
            const action = new CreateDenomAction();
            const result = await action.createDenom(
                denomDetails,
                runtime,
                message,
                state
            );
            
            if (callback) {
                callback({
                    text: `Token denomination '${result.fullDenom}' created successfully!\n ✅ Transaction hash: ${result.hash}`,
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
            elizaLogger.error("Error during denom creation:", error);
            if (callback) {
                const errorMsg = error?.message || "Unknown error occurred.";
                callback({
                    text: "Failed to create token denomination. " + errorMsg,
                    content: { error: errorMsg }
                });
            }
            return false;
        }
    },
    template: createDenomTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: createDenomExamples as ActionExample[][],
} as Action;
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
import changeAdminExamples from "../../action_examples/tokenfactory/change_admin.ts";
import { bech32 } from "bech32";

export interface ChangeAdminContent extends Content {
    sender: string;
    denom: string;
    newAdmin: string;
}

interface ValidationResult {
    success: boolean;
    message: string;
}

function isChangeAdminContent(content: Content): ValidationResult {
    let msg = "";
    if (!content.denom || content.denom === "null" || typeof content.denom !== 'string') {
        msg += "Please provide the token denomination (denom) for which you want to change the admin.";
    }

    if (!content.denom.startsWith('factory/')) {
        msg += "Token denomination must start with 'factory/.'";
    }

    if (!content.sender || content.sender === "null" || typeof content.sender !== 'string') {
        msg += "Please provide the current admin address (sender).";
    }

    try {
        const { prefix: senderPrefix } = bech32.decode(content.sender);
        if (senderPrefix !== 'omniflix') {
            msg += "Current admin address must be a valid Omniflix address starting with 'omniflix'.";
        }
    } catch (error) {
        msg += "The current admin address format is invalid. Please provide a valid Omniflix address.";
    }

    if (!content.newAdmin || content.newAdmin === "null" || typeof content.newAdmin !== 'string') {
        msg += "Please provide the new admin address.";
    }

    try {
        const { prefix: newAdminPrefix } = bech32.decode(content.newAdmin);
        if (newAdminPrefix !== 'omniflix') {
            msg += "New admin address must be a valid Omniflix address starting with 'omniflix'.";
        }
    } catch (error) {
        msg += "The new admin address format is invalid. Please provide a valid Omniflix address.";
    }

    if (msg !== "") {
        return {
            success: false,
            message: msg,
        };
    }

    return {
        success: true,
        message: "Change admin request is valid.",
    };
}

const changeAdminTemplate = `Respond with a JSON markdown block containing only the extracted values. Use null for any values that cannot be determined.

Example response:
\`\`\`json
{
    "sender": "omniflix1...",
    "denom": "factory/omniflix1.../test",
    "newAdmin": "omniflix1...",
}
\`\`\`

{{recentMessages}}

Based on the conversation, extract the following details for changing token admin:
1. Current admin address (sender) (required)
   - Must be a valid Omniflix address
   - Must start with 'omniflix'
   - Use null if not found

2. Token denom (required)
   - Must be the complete denom string starting with "factory/"
   - Must include the full creator address (not abbreviated)
   - Use null if not found

3. New admin address (required)
   - Must be a valid Omniflix address
   - Must start with 'omniflix'
   - Use null if not found

If any required field is missing or unclear, use null for its value.
Respond with a JSON markdown block containing only the extracted values.`;

export class ChangeAdminAction {
    async changeAdmin(
        params: ChangeAdminContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<string> {
        elizaLogger.log("Changing admin:", {
            denom: params.denom,
            newAdmin: params.newAdmin
        });
        const validationResult = isChangeAdminContent(params);
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
            if (!wallet) {
                throw new Error("Failed to initialize wallet. Please check your seed phrase and try again");
            }

            elizaLogger.log("Changing admin for:", params.denom);

            const tokenFactory = new TokenFactoryProvider(wallet);
            const response = await tokenFactory.changeAdmin(
                address,
                params.denom,
                params.newAdmin
            );

            if (response.code !== 0) {
                throw new Error(`Transaction failed with code ${response.code}: ${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error) {
            elizaLogger.error("Admin change failed:", error);
            throw error;
        }
    }
}

const buildChangeAdminDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<ChangeAdminContent> => {
    if (!state) {
        state = (await runtime.composeState(message)) as State;
    } else {
        state = await runtime.updateRecentMessageState(state);
    }

    const changeAdminContext = composeContext({
        state,
        template: changeAdminTemplate
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: changeAdminContext,
        modelClass: ModelClass.SMALL,
    });

    const adminContent = content as ChangeAdminContent;
    elizaLogger.debug("Admin content:", adminContent);

    return adminContent;
};

export default {
    name: "CHANGE_TOKEN_FACTORY_ADMIN",
    similes: [
        "changetokenfactoryadmin",
        "change_token_factory_admin",
        "change admin",
        "update admin",
        "change token admin {denom}",
        "update token admin {denom}",
        "change admin for token {denom} to {newAdmin}",
        "transfer admin rights of {denom} to {newAdmin}"
    ],
    description: "Change the admin of a token factory denomination.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown; },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CHANGE_TOKEN_FACTORY_ADMIN handler...");

        const adminDetails = await buildChangeAdminDetails(
            runtime,
            message,
            state
        );

        const validationResult = isChangeAdminContent(adminDetails);
        if (!validationResult.success) {
            elizaLogger.error("Invalid content for CHANGE_TOKEN_FACTORY_ADMIN action:", validationResult.message);
            if (callback) {
                callback({
                    text: validationResult.message,
                    content: { 
                        error: validationResult.message,
                        details: adminDetails 
                    },
                });
            }
            return false;
        }

        try {
            const action = new ChangeAdminAction();
            const txHash = await action.changeAdmin(
                adminDetails,
                runtime,
                message,
                state
            );

            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `Successfully changed admin for denom ${adminDetails.denom} to ${adminDetails.newAdmin}\n ✅ Transaction Hash: ${txHash}`,
                    content: {
                        success: true,
                        hash: txHash,
                        denom: adminDetails.denom,
                        newAdmin: adminDetails.newAdmin
                    },
                });
            }
            return true;
        } catch (error) {
            elizaLogger.error("Error during admin change:", error);
            const errorMessage = error.message || "An unexpected error occurred while changing admin";
            if (callback) {
                callback({
                    text: errorMessage,
                    content: { 
                        error: errorMessage,
                        details: adminDetails 
                    },
                });
            }
            return false;
        }
    },
    template: changeAdminTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: changeAdminExamples as ActionExample[][]
} as Action;

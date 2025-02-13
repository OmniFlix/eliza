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
import { WalletProvider, walletProvider } from "../../../providers/wallet.ts";
import { ONFTProvider } from "../../../providers/omniflix/onft.ts";
import getDenomExamples from "../../../action_examples/omniflix/onft/get_denom.ts";


export interface getDenomContent extends Content {
   id: string;
}

interface validationResult {
    success: boolean;
    message: string;
}

function isGetDenomContent(content: Content): validationResult {
    let msg = "";
    if (!content.id) {
        msg += "Please provide a denom id to get the denom details.";
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

const getDenomTemplate = `Respond with a JSON markdown block containing only the extracted values.

Example response:
\`\`\`json
{
   "id": "onftdenom"
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the following information about the requested denom details:
- id mentioned in the current message required

Respond with a JSON markdown block containing only the extracted values.`;

export class getDenomAction {
    async getDenom(
        params: getDenomContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<object> {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );

            const onftProvider = new ONFTProvider(wallet);
            const response = await onftProvider.getDenom(
                params.id,
            );
            if (!response) {
                throw new Error('denom does not exist');
            }

            return response;
        } catch (error) {
            throw new Error(`Get Denom failed: ${error.message}`);
        }
    }
}

const buildGetDenomDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<getDenomContent> => {

    // if (!state) {
    //     state = (await runtime.composeState(message)) as State;
    // } else {
    //     state = await runtime.updateRecentMessageState(state);
    // }
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const getDenomContext = composeContext({
        state: currentState,
        template: getDenomTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: getDenomContext,
        modelClass: ModelClass.SMALL,
    });

    const getDenomContent = content as getDenomContent;

    return getDenomContent;
};

export default {
    name: "GET_DENOM",
    similes: [
        "get denom",
        "get denom",
    ],
    description: "Get a  collection.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting GET_DENOM handler...");
        const getDenomDetails = await buildGetDenomDetails(
            runtime,
            message,
            state
        );
        const validationResult = isGetDenomContent(getDenomDetails);
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
            const action = new getDenomAction();
            const response = await action.getDenom(
                getDenomDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `Successfully retrieved collection: ${JSON.stringify(response, null, 2)}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to retrieve collection: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: getDenomTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: getDenomExamples as ActionExample[][],
} as Action;

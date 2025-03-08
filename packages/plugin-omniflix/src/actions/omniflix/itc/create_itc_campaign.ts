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
import { ITCProvider } from "../../../providers/omniflix/itc.ts";
import createITCCampaignExamples from "../../../action_examples/omniflix/itc/create_itc_campaign.ts";

export interface createITCCampaignContent extends Content {
    name: string;
    description: string;
    interaction: number;
    claimType?: number;
    nftDenomId: string;
    denom: string;
    amount: number | string;
    maxAllowedClaims: bigint;
    depositAmount?: string;
    collectionId?: string;
    nftName?: string;
    nftDescription?: string;
    nftMediaUri?: string;
    nftPreviewUri?: string;
    royaltyShare?: string;
    transferable?: boolean;
    extensible?: boolean;
    nsfw?: boolean;
    data?: string;
    uriHash?: string;
    startIndex?: bigint;
    nameDelimiter?: string;
    startFromTimeInMinutes: number | string;
    duration: bigint;
    distributionType?: number;
    distributionStreamDuration?: bigint;
    creationFee?: number | string;
}
export interface NFTDetails {
    denomId: string;
    name: string;
    description: string;
    mediaUri: string;
    previewUri: string;
    royaltyShare: string;
    transferable: boolean;
    extensible: boolean;
    nsfw: boolean;
    data: string;
    uriHash: string;
    startIndex: bigint;
    nameDelimiter: string;
}
export interface Distribution {
    type: number;
    streamDuration: bigint;
}
interface validationResult {
    success: boolean;
    message: string;
}

function isCreateITCCampaignContent(content: Content): validationResult {
    const missingFields: string[] = [];
    // console.log('Content: ', content)

    if (!content.name) {
        missingFields.push("name");
    }
    if (!content.description) {
        missingFields.push("description");
    }
    if (content.interaction === undefined) {
        missingFields.push("interaction");
    }
    if (!content.nftDenomId || content.nftDenomId === "onftdenom..") {
        missingFields.push("nftDenomId");
    }
    if (!content.claimType) {
        missingFields.push("claimType");
    }
    if ((content.claimType == 0 || content.claimType == 2) && (!content.denom || content.denom === '')) {
        missingFields.push("denom");
    }
    if ((content.claimType == 0 || content.claimType == 2) && (!content.amount || content.amount === '')) {
        missingFields.push("amount");
    }
    if (!content.maxAllowedClaims) {
        missingFields.push("maxAllowedClaims");
    }
    if (!content.startFromTimeInMinutes) {
        missingFields.push("startFromTimeInMinutes");
    }
    if (!content.duration) {
        missingFields.push("duration");
    }
    if ((content.claimType == 0 || content.claimType == 2) && (!content.depositAmount || content.depositAmount === '')) {
        missingFields.push("depositAmount");
    }
    if ((content.claimType == 1 || content.claimType == 2) && !content.collectionId) {
        missingFields.push("collectionId");
    }
    if ((content.claimType == 1 || content.claimType == 2) && !content.nftName) {
        missingFields.push("nftName");
    }
    if ((content.claimType == 1 || content.claimType == 2) && !content.nftDescription) {
        missingFields.push("nftDescription");
    }
    if ((content.claimType == 1 || content.claimType == 2) && !content.nftMediaUri) {
        missingFields.push("nftMediaUri & optional fields royaltyShare, transferable, extensible, nsfw, data, uriHash, startIndex, nameDelimiter");
    }
    if (content.distributionType == 1 && !content.distributionStreamDuration) {
        missingFields.push("distributionStreamDuration");
    }

    if (missingFields.length > 0) {
        return {
            success: false,
            message: `Please provide the following: ${missingFields.join(", ")}.`,
        };
    }

    return {
        success: true,
        message: "Create ITC campaign request is valid.",
    };
}

const createITCCampaignTemplate = `Respond with a JSON markdown block containing only the extracted values. Take all the values from the current messages. Please provide the following information:

- name: (required) Please provide the name of the campaign.
- description: (required) Please provide a description of the campaign.
- interaction: (required) Please provide the interaction of the campaign and do not take example value.
- claimType: (required) Please provide the claim type and do not take example value.
- nftDenomId: (required) Please provide the nftDenomId.
- denom: (optional) Please provide the denom.
- amount: (required) Please provide the amount.
- maxAllowedClaims: (required) Please provide the maxAllowedClaims.
- depositAmount: (optional) Please provide the depositAmount.
- startFromTimeInMinutes: (required) Please provide the startFromTimeInMinutes (in minutes from now).
- duration: (required) Please provide the duration.
- distributionType: (optional) Please provide the distributionType. If not provided, default should be 0.
- distributionStreamDuration: (optional) Please provide the distributionStreamDuration. If distributionType is 1, then this field is required.
- creationFee: (optional) Please provide the creationFee.
- collectionId: (optional) Please provide the collectionId. If claimType is 1 or 2, then this field is required.
- nftName: (optional) Please provide the nftName. If claimType is 1 or 2, then this field is required.
- nftDescription: (optional) Please provide the nftDescription. If claimType is 1 or 2, then this field is required.
- nftMediaUri: (optional) Please provide the nftMediaUri. If claimType is 1 or 2, then this field is required.
- nftPreviewUri: (optional) Please provide the nftPreviewUri. If claimType is 1 or 2, then this field is required.
- royaltyShare: (optional) Please provide the royaltyShare.
- transferable: (optional) Please provide the transferable.
- extensible: (optional) Please provide the extensible.
- nsfw: (optional) Please provide the nsfw.
- data: (optional) Please provide the data.
- uriHash: (optional) Please provide the uriHash.
- startIndex: (optional) Please provide the startIndex. default is 1
- nameDelimiter: (optional) Please provide the nameDelimiter. default is '.'
Example response:
\`\`\`json
{
   "name": "Your Campaign Name",
   "description": "Your Campaign Description",
   "interaction": 0,
   "claimType": 0,
   "nftDenomId": "Your NFT Denom ID",
   "denom": "Your Denom",
   "amount": "Your Amount",
   "maxAllowedClaims": 10,
   "depositAmount": "Your Deposit",
   "startTime": "Your Start Time",
   "duration": 10000,
   "distributionType": 0,
   "distributionStreamDuration": 0,
   "creationFee": "Your Creation Fee",
   "collectionId": "Your Collection ID",
   "nftName": "Your NFT Name",
   "nftDescription": "Your NFT Description",
   "nftMediaUri": "Your NFT Media URI",
   "nftPreviewUri": "Your NFT Preview URI",
   "royaltyShare": "Your NFT Royalty Share",
   "transferable": true,
   "extensible": true,
   "nsfw": false,
   "data": "Your NFT Data",
   "uriHash": "Your NFT URI Hash",
   "startIndex": 0,
   "nameDelimiter": "Your NFT Name Delimiter",
}
\`\`\`

{{recentMessages}}

Given the recent messages, extract the required information about the requested create ITC Campaign.`;

export class createITCCampaignAction {
    async createITCCampaign(
        params: createITCCampaignContent,
        runtime: IAgentRuntime,
        message: Memory,
        state: State
    ): Promise<string> {
        try {
            const wallet: WalletProvider = await walletProvider.get(
                runtime,
                message,
                state,
            );

            const itcProvider = new ITCProvider(wallet);
            if (params.denom === "FLIX" || params.denom === "flix") {
                params.denom = "uflix";
                if (typeof params.amount === "number") {
                    params.amount = params.amount * 1000000;
                } else if (typeof params.amount === "string") {
                    params.amount = Number.parseInt(params.amount) * 1000000;
                }
                if (typeof params.depositAmount === "number") {
                    params.depositAmount = (params.depositAmount * 1000000).toString();
                } else if (typeof params.depositAmount === "string") {
                    params.depositAmount = (Number.parseInt(params.depositAmount) * 1000000).toString();
                }
            }
            const response = await itcProvider.createCampaign({
                name: params.name,
                description: params.description,
                interaction: params.interaction,
                claimType: params.claimType,
                nftDenomId: params.nftDenomId,
                denom: params.denom,
                amount: params.amount,
                maxAllowedClaims: params.maxAllowedClaims,
                depositAmount: params.depositAmount,
                startTime: params.startFromTimeInMinutes,
                duration: params.duration,
                distributionType: params.distributionType,
                distributionStreamDuration: params.distributionStreamDuration,
                creationFee: params.creationFee,
                nftMintDetails: {
                    denomId: params.collectionId,
                    name: params.nftName,
                    description: params.nftDescription,
                    mediaUri: params.nftMediaUri,
                    previewUri: params.nftPreviewUri,
                    royaltyShare: params.royaltyShare,
                    transferable: params.transferable,
                    extensible: params.extensible,
                    nsfw: params.nsfw,
                    data: params.data,
                    uriHash: params.uriHash,
                    startIndex: params.startIndex,
                    nameDelimiter: params.nameDelimiter,
                },
            });
            if (!response || response.code !== 0) {
                throw new Error(`${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error) {
            throw new Error(`${error.message}`);
        }
    }
}

const buildCreateITCCampaignDetails = async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
): Promise<createITCCampaignContent> => {
    
    let currentState: State = state;
    if (!currentState) {
        currentState = (await runtime.composeState(message)) as State;
    }
    currentState = await runtime.updateRecentMessageState(currentState);

    const createITCCampaignContext = composeContext({
        state: currentState,
        template: createITCCampaignTemplate,
    });

    const content = await generateObjectDeprecated({
        runtime,
        context: createITCCampaignContext,
        modelClass: ModelClass.SMALL,
    });

    const createITCCampaignContent = content as createITCCampaignContent;

    return createITCCampaignContent;
};

export default {
    name: "CREATE_ITC_CAMPAIGN",
    similes: [
        "create itc campaign",
        "create campaign",
    ],
    description: "create an itc campaign.",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ) => {
        elizaLogger.log("Starting CREATE_ITC_CAMPAIGN handler...");
        const createITCCampaignDetails = await buildCreateITCCampaignDetails(
            runtime,
            message,
            state
        );
        const jsonString = JSON.stringify(createITCCampaignDetails);
        console.log('json', jsonString)
        console.log("createITCCampaignDetails", createITCCampaignDetails);
        const validationResult = isCreateITCCampaignContent(createITCCampaignDetails);
        console.log("validationResult", validationResult);
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
            const action = new createITCCampaignAction();
            const txHash = await action.createITCCampaign(
                createITCCampaignDetails,
                runtime,
                message,
                state
            );
            state = await runtime.updateRecentMessageState(state);

            if (callback) {
                callback({
                    text: `✅ Successfully created itc campaign & hash: ${txHash}`,
                    content: {
                        success: true,
                    },
                });
            }
            return true;
        } catch (error) {
            if (callback) {
                callback({
                    text: `Failed to create itc campaign: ${error.message}`,
                    content: { error: error.message },
                });
            }
            return false;
        }
    },
    template: createITCCampaignTemplate,
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    examples: createITCCampaignExamples as ActionExample[][],
} as Action;

import { elizaLogger } from "@elizaos/core";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { WalletProvider } from "../wallet";
import {
    MsgCreateCampaign,
    MsgCancelCampaign,
    MsgClaim,
    MsgDepositCampaign
} from "@omniflixnetwork/omniflixjs/OmniFlix/itc/v1/tx";

export interface MsgCreateCampaignParams {
    name: string;
    description: string;
    interaction: InteractionType;
    claimType: ClaimType;
    nftDenomId: string;
    denom: string;
    amount: number | string;
    maxAllowedClaims: bigint;
    depositAmount: string;
    nftMintDetails?: NFTDetails;
    startTime: number | string;
    duration: bigint;
    distributionType?: DistributionType;
    distributionStreamDuration?: bigint;
    creationFee?: number | string;
}

export declare enum InteractionType {
    INTERACTION_TYPE_BURN = 0,
    INTERACTION_TYPE_TRANSFER = 1,
    INTERACTION_TYPE_HOLD = 2,
    UNRECOGNIZED = -1
}

export declare enum ClaimType {
    CLAIM_TYPE_FT = 0,
    CLAIM_TYPE_NFT = 1,
    CLAIM_TYPE_FT_AND_NFT = 2,
    UNRECOGNIZED = -1
}

export interface Coin {
    denom: string;
    amount: string;
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

export interface Timestamp {
    seconds: bigint;
    nanos: number;
}

export interface Duration {
    seconds: bigint;
    nanos: number;
}

export interface Distribution {
    type: DistributionType;
    streamDuration: Duration;
}

export declare enum DistributionType {
    DISTRIBUTION_TYPE_INSTANT = 0,
    DISTRIBUTION_TYPE_STREAM = 1,
    UNRECOGNIZED = -1
}

export interface CancelCampaignParams {
    campaignId: bigint;
}

export interface MsgClaimParams {
    campaignId: bigint;
    nftId: string;
    interaction: InteractionType;
}

export interface MsgDepositCampaignParams {
    campaignId: bigint;
    denom: string;
    amount: number | string;
}

export class ITCProvider {
    private wallet: WalletProvider;

    constructor(wallet: WalletProvider) {
        this.wallet = wallet;
    }

    async createCampaign(params: MsgCreateCampaignParams): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.itc.v1.MsgCreateCampaign", MsgCreateCampaign);
            
            console.log("Creating denom with details:", params);
            const futureStartTime = new Date(Date.now() + Number(params.startTime) * 60 * 1000);
            const startTimeBigInt = BigInt(Math.floor(futureStartTime.getTime() / 1000));
            console.log('startTimeBigInt', startTimeBigInt)
            const campaign = {
                name: params.name,
                description: params.description,
                interaction: params.interaction,
                claimType: params.claimType,
                nftDenomId: params.nftDenomId,
                tokensPerClaim: params.amount ? {
                    denom: params.denom,
                    amount: `${params.amount}`,
                } : undefined,
                maxAllowedClaims: params.maxAllowedClaims,
                deposit: {
                    denom: params.denom,
                    amount: `${params.depositAmount}`,
                },
                nftMintDetails: params.nftMintDetails,
                startTime: {
                    seconds: startTimeBigInt,
                    nano: 0,
                },
                duration: {
                    seconds: params.duration,
                    nano: 0
                },
                distribution: {
                    type: params.distributionType,
                    streamDuration: {
                        seconds: params.distributionStreamDuration,
                        nano: 0
                    }
                },
                creator: address,
                creationFee: {
                    denom: 'uflix',
                    amount: `10000000`,
                },
            };
            console.log('campaign', campaign)

            const msg = {
                typeUrl: "/OmniFlix.itc.v1.MsgCreateCampaign",
                value: campaign
            }
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };

            try {
                const tx = await client.signAndBroadcast(
                    address,
                    [msg],
                    fee,
                    "Created campaign using Eliza"
                );
                console.log('Transaction details:', {
                    hash: tx.transactionHash,
                    gasUsed: tx.gasUsed,
                    gasWanted: tx.gasWanted
                });
                return tx;
            } catch (txError) {
                console.log(txError)
                console.error("Transaction failed:", {
                    error: txError.message,
                    code: txError.code,
                    gasUsed: txError.gasUsed,
                    gasWanted: txError.gasWanted
                });
                throw txError;
            }
        } catch (e) {
            elizaLogger.error(`Error in creating campaign: ${e}`);
            throw e;
        }
    }

    async cancelCampaign(params: CancelCampaignParams): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            
            // Register the message type correctly
            client.registry.register("/OmniFlix.itc.v1.MsgCancelCampaign", MsgCancelCampaign);
            
            console.log("Cancel campaign", params);
            const campaign = {
                campaignId: params.campaignId,
                creator: address
            };
            
            // Create the message with proper structure
            const msg = {
                typeUrl: "/OmniFlix.itc.v1.MsgCancelCampaign",
                value: campaign
            }

            console.log("Msg CancelCampaign:", msg);
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };

            try {
                const tx = await client.signAndBroadcast(
                    address,
                    [msg],
                    fee,
                    "Cancel Campaign using Eliza"
                );
                console.log('Transaction details:', {
                    hash: tx.transactionHash,
                    gasUsed: tx.gasUsed,
                    gasWanted: tx.gasWanted
                });
                return tx;
            } catch (txError) {
                console.error("Transaction failed:", {
                    error: txError.message,
                    code: txError.code,
                    gasUsed: txError.gasUsed,
                    gasWanted: txError.gasWanted
                });
                throw txError;
            }
        } catch (txError) {
            console.error("Transaction failed:", {
                error: txError.message,
                code: txError.code,
                gasUsed: txError.gasUsed,
                gasWanted: txError.gasWanted
            });
            throw txError;
        }
    }

    async campaignClaim(params: MsgClaimParams): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            
            // Register the message type correctly
            client.registry.register("/OmniFlix.itc.v1.MsgClaim", MsgClaim);
            
            console.log("Claiming with details:", params);
            const campaign = {
                campaignId: params.campaignId,
                nftId: params.nftId,
                interaction: params.interaction,
                claimer: address
            };
            
            // Create the message with proper structure
            const msg = {
                typeUrl: "/OmniFlix.itc.v1.MsgClaim",
                value: campaign,
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };
            
            try {
                const tx = await client.signAndBroadcast(
                    address,
                    [msg],
                    fee,
                    "Claim ITC Campaign using Eliza"
                );
                console.log('Transaction details:', {
                    hash: tx.transactionHash,
                    gasUsed: tx.gasUsed,
                    gasWanted: tx.gasWanted
                });
                return tx;
            } catch (txError) {
                console.error("Transaction failed:", {
                    error: txError.message,
                    code: txError.code,
                    gasUsed: txError.gasUsed,
                    gasWanted: txError.gasWanted
                });
                throw txError;
            }
        } catch (txError) {
            console.error("Transaction failed:", {
                error: txError.message,
                code: txError.code,
                gasUsed: txError.gasUsed,
                gasWanted: txError.gasWanted
            });
            throw txError;
        }
    }

    async depositCampaign(params: MsgDepositCampaignParams): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            
            // Register the message type correctly
            client.registry.register("/OmniFlix.itc.v1.MsgDepositCampaign", MsgDepositCampaign);
            
            console.log("Depositing to campaign with details:", params);
            const campaign = {
                campaignId: params.campaignId,
                amount: {
                    denom: params.denom,
                    amount: `${params.amount}`,
                },
                depositor: address
            };
            
            // Create the message with proper structure
            const msg = {
                typeUrl: "/OmniFlix.itc.v1.MsgDepositCampaign",
                value: campaign,
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };

            try {
                const tx = await client.signAndBroadcast(
                    address,
                    [msg],
                    fee,
                    "Deposit to Campaign using Eliza"
                );
                console.log('Transaction details:', {
                    hash: tx.transactionHash,
                    gasUsed: tx.gasUsed,
                    gasWanted: tx.gasWanted
                });
                return tx;
            } catch (txError) {
                console.error("Transaction failed:", {
                    error: txError.message,
                    code: txError.code,
                    gasUsed: txError.gasUsed,
                    gasWanted: txError.gasWanted
                });
                throw txError;
            }
        } catch (txError) {
            console.error("Transaction failed:", {
                error: txError.message,
                code: txError.code,
                gasUsed: txError.gasUsed,
                gasWanted: txError.gasWanted
            });
            throw txError;
        }
    }
}

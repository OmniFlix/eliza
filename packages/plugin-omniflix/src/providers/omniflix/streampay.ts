import { elizaLogger } from "@elizaos/core";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { WalletProvider } from "../wallet";
import { Coin } from "@cosmjs/stargate";
import { 
    MsgStreamSend,
    MsgStopStream,
    MsgClaimStreamedAmount,
} from '@omniflixnetwork/omniflixjs/OmniFlix/streampay/v1/tx';

export interface Period {
    amount: Coin;
    duration: {
        seconds: number;
        nanos: number;
    };
}

export interface StreamSendResponse {
    streamId: string;
    code: number;
    rawLog?: string;
    transactionHash?: string;
}

export class StreamPayProvider {
    private wallet: WalletProvider;

    constructor(wallet: WalletProvider) {
        this.wallet = wallet;
    }

    async streamSend(
        recipientAddress: string,
        amount: Coin,
        duration: number,
        streamType: number = 0,
        periods?: Period[] = [],
        cancellable: boolean = false,
    ): Promise<StreamSendResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.streampay.v1.MsgStreamSend", MsgStreamSend);

            const startTime = Math.floor(Date.now() / 1000);
            const paymentDenom = amount.denom;
            const stream = {
                sender: address,
                recipient: recipientAddress,
                amount: {
                    denom: amount.denom,
                    amount: amount.amount.toString()
                },
                duration: { 
                    seconds: Math.floor(duration), 
                    nanos: 0 
                },
                streamType: streamType || 0,
                periods: periods || [],
                cancellable: cancellable || false,
                paymentFee: { 
                    denom: paymentDenom,
                    amount: '100000'
                }
            };

            const streamSendMsg = {
                typeUrl: '/OmniFlix.streampay.v1.MsgStreamSend',
                value: stream
            };
            console.log('streamSendMsg', streamSendMsg);

            const fee = {
                amount: [{
                    denom: paymentDenom,
                    amount: '100000'
                }],
                gas: '5000000'
            };

            const tx = await client.signAndBroadcast(
                address,
                [streamSendMsg],
                fee,
                "sending stream using Eliza"
            );
            console.log('tx', tx);

            return {
                streamId: tx.transactionHash,
                code: tx.code,
                rawLog: tx.rawLog,
                transactionHash: tx.transactionHash
            };
        } catch (e) {
            elizaLogger.error(`Stream send failed: ${e}`);
            throw new Error(`Failed to send stream: ${e}`);
        }
    }

    async stopStream(
        streamId: string
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.streampay.v1.MsgStopStream", MsgStopStream);

            const stop = {
                sender: address,
                streamId
            };

            const stopStreamMsg = {
                typeUrl: '/OmniFlix.streampay.v1.MsgStopStream',
                value: stop
            };

            const tx = await client.signAndBroadcast(
                address,
                [stopStreamMsg],
                "auto",
                "Stop Stream using Eliza"
            );
            return tx;
        } catch (error) {
            elizaLogger.error('Error in stopStream:', error);
            throw new Error(`Failed to stop stream: ${error.message}`);
        }
    }

    async claimStreamedAmount(
        streamId: string
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.streampay.v1.MsgClaimStreamedAmount", MsgClaimStreamedAmount);

            console.log('claimer', address, 'streamId', streamId);
            const claim = {
                claimer: address,
                streamId: streamId
            };

            const claimStreamMsg = {
                typeUrl: '/OmniFlix.streampay.v1.MsgClaimStreamedAmount',
                value: claim
            };
            console.log('claimStreamMsg', claimStreamMsg);

            const tx = await client.signAndBroadcast(
                address,
                [claimStreamMsg],
                "auto",
                "Claim Streamed Amount using Eliza"
            );
            console.log('tx', tx);
            return tx;
        } catch (error) {
            elizaLogger.error('Error in claimStreamedAmount:', error);
            throw new Error(`Failed to claim streamed amount: ${error.message}`);
        }
    }
}
import { elizaLogger } from "@elizaos/core";
import { DeliverTxResponse } from "@cosmjs/stargate";
import { WalletProvider } from "../wallet";
import { Coin } from "@cosmjs/stargate";
import { 
    MsgStreamSend,
    MsgStopStream,
    MsgClaimStreamedAmount,
} from 'flixjs/OmniFlix/streampay/v1/tx';

export interface Duration {
    seconds: number;
    nanos: number;
}

export interface Period {
    amount: Coin;
    duration: Duration;
}

export interface StreamSendResponse {
    streamId: string;
    code: number;
    rawLog?: string;
    transactionHash?: string;
}

export class StreamPayProvider extends WalletProvider {
    constructor(wallet: WalletProvider) {
        super();
        Object.assign(this, wallet);
    }

    async streamSend(
        recipientAddress: string,
        amount: Coin,
        duration: Duration,
        streamType: number = 0,
        periods: Period[] = [],
        cancellable: boolean = false,
        paymentFee?: Coin
    ): Promise<StreamSendResponse> {
        try {
            const address = await this.getAddress();
            const client = await this.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.streampay.v1.MsgStreamSend", MsgStreamSend);

            const stream = {
                sender: address,
                recipient: recipientAddress,
                amount: amount,
                duration: duration,
                streamType: streamType,
                periods: periods,
                cancellable: cancellable,
                paymentFee: paymentFee || { denom: amount.denom, amount: "0" }
            };

            const streamSendMsg = {
                typeUrl: '/OmniFlix.streampay.v1.MsgStreamSend',
                value: stream
            };

            const tx = await client.signAndBroadcast(
                address,
                [streamSendMsg],
                "auto",
                "Created Send Stream using Eliza"
            );
            return {
                streamId: tx.transactionHash,
                code: tx.code || 0,
                rawLog: tx.rawLog,
                transactionHash: tx.transactionHash
            };
        } catch (error) {
            elizaLogger.error('Error in streamSend:', error);
            throw new Error(`Failed to send stream: ${error.message}`);
        }
    }

    async stopStream(
        streamId: string
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.getAddress();
            const client = await this.getClient();
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
            const address = await this.getAddress();
            const client = await this.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.streampay.v1.MsgClaimStreamedAmount", MsgClaimStreamedAmount);

            const claim = {
                recipient: address,
                streamId
            };

            const claimStreamMsg = {
                typeUrl: '/OmniFlix.streampay.v1.MsgClaimStreamedAmount',
                value: claim
            };

            const tx = await client.signAndBroadcast(
                address,
                [claimStreamMsg],
                "auto",
                "Claim Streamed Amount using Eliza"
            );
            return tx;
        } catch (error) {
            elizaLogger.error('Error in claimStreamedAmount:', error);
            throw new Error(`Failed to claim streamed amount: ${error.message}`);
        }
    }
}
import { DeliverTxResponse } from "@cosmjs/stargate";
import { WalletProvider } from "./wallet";
import {
    MsgCreateDenom,
    MsgMint,
    MsgChangeAdmin,
    MsgBurn,
    MsgSetDenomMetadata,
    MsgForceTransfer,
    MsgUpdateParams,
} from '@omniflixnetwork/omniflixjs/osmosis/tokenfactory/v1beta1/tx';

export class TokenFactoryProvider {
    private wallet: WalletProvider;

    constructor(wallet: WalletProvider) {
        this.wallet = wallet;
    }

    async createDenom(subdenom: string): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();
        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgCreateDenom", MsgCreateDenom);
        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgCreateDenom",
            value: MsgCreateDenom.fromPartial({
                sender: address,
                subdenom: subdenom
            })
        };
    
        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }

    async mintTokens(denom: string, amount: string, recipient: string): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();
        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgMint", MsgMint);

        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgMint",
            value: MsgMint.fromPartial({
                sender: address,
                amount: {
                    denom: denom,
                    amount: amount
                },
                mintToAddress: recipient
            })
        };
    
        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }

    async changeAdmin(
        sender: string,
        denom: string,
        newAdmin: string
    ): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();
        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgChangeAdmin", MsgChangeAdmin);

        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgChangeAdmin",
            value: MsgChangeAdmin.fromPartial({
                sender: sender,
                denom: denom,
                newAdmin: newAdmin
            })
        };
    
        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }

    async burnTokens(
        sender: string,
        amount: string,
        denom: string,
    ): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();
        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgBurn", MsgBurn);

        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgBurn",
            value: MsgBurn.fromPartial({
                sender: sender,
                amount: {
                    amount: amount.toString(),
                    denom: denom,
                }
            })
        };

        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }

    async setDenomMetadata(denom: string, metadata: any): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();

        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata", MsgSetDenomMetadata);
    
        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgSetDenomMetadata",
            value: MsgSetDenomMetadata.fromPartial({
                sender: address,
                metadata: metadata
            })
        };
    
        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }

    async forceTransfer(sender: string, recipient: string, amount: string, denom: string): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();
        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgForceTransfer", MsgForceTransfer);

        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgForceTransfer",
            value: MsgForceTransfer.fromPartial({
                sender: sender,
                recipient: recipient,
                amount: {
                    denom: denom,
                    amount: amount
                }
            })
        };
    
        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }

    async updateParams(params: Params): Promise<DeliverTxResponse> {
        const address = await this.wallet.getAddress();
        const client = await this.wallet.getClient();
        client.registry.register("/osmosis.tokenfactory.v1beta1.MsgUpdateParams", MsgUpdateParams);

        const msg = {
            typeUrl: "/osmosis.tokenfactory.v1beta1.MsgUpdateParams",
            value: MsgUpdateParams.fromPartial(params)
        };
    
        return await client.signAndBroadcast(
            address,
            [msg],
            {
                amount: [{ denom: "uflix", amount: "5000" }],
                gas: "2500000"
            }
        );
    }
}
import { elizaLogger } from "@elizaos/core";
import { DeliverTxResponse, createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { WalletProvider } from "../wallet";
import { MsgCreateDenom, MsgUpdateDenom, MsgTransferDenom, MsgMintONFT, MsgTransferONFT, MsgBurnONFT } from '@omniflixnetwork/omniflixjs/OmniFlix/onft/v1beta1/tx';
import { QueryClientImpl } from "@omniflixnetwork/omniflixjs/OmniFlix/onft/v1beta1/query";

export class ONFTProvider {
    private wallet: WalletProvider;

    constructor(wallet: WalletProvider) {
        this.wallet = wallet;
    }

    async createDenom(
        id: string,
        name: string,
        symbol: string,
        description?: string,
        previewUri?: string,
        schema?: string,
        uri?: string,
        uriHash?: string,
        data?: string,
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.onft.v1beta1.MsgCreateDenom", MsgCreateDenom);

            const denom = {
                id,
                symbol,
                name,
                description,
                previewUri,
                schema,
                sender: address,
                uri,
                uriHash,
                data,
                creationFee: {
                    denom: 'uflix',
                    amount: '25000000',
                },
                royaltyReceivers: [],
            };
            const createDenomMsg = {
                typeUrl: '/OmniFlix.onft.v1beta1.MsgCreateDenom',
                value: denom
            };
            const tx = await client.signAndBroadcast(
                address,
                [createDenomMsg],
                "auto",
                "Created denom using Eliza"
            );
            return tx;
        } catch (e) {
            elizaLogger.error(`Error in createDenom: ${e}`);
            throw e;
        }
    }

    async updateDenom(
        id: string,
        name?: string,
        description?: string,
        previewUri?: string,
        royaltyReceivers?: Array<Object>,
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.onft.v1beta1.MsgUpdateDenom", MsgUpdateDenom);

            const updateDenom = {
                id,
                name,
                description,
                previewUri,
                sender: address,
                royaltyReceivers,
            };
            const updateDenomMsg = {
                typeUrl: '/OmniFlix.onft.v1beta1.MsgUpdateDenom',
                value: updateDenom
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };
            const tx = await client.signAndBroadcast(
                address,
                [updateDenomMsg],
                fee,
                "Updated denom using Eliza"
            );
            return tx;
        } catch (e) {
            elizaLogger.error(`Error in updateDenom: ${e}`);
            throw e;
        }
    }

    async transferDenom(
        id: string,
        recipient: string,
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.onft.v1beta1.MsgTransferDenom", MsgTransferDenom);

            const transferDenom = {
                id,
                recipient,
                sender: address,
            };
            const transferDenomMsg = {
                typeUrl: '/OmniFlix.onft.v1beta1.MsgTransferDenom',
                value: transferDenom
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };
            const tx = await client.signAndBroadcast(
                address,
                [transferDenomMsg],
                fee,
                "Transferred denom using Eliza"
            );
            return tx;
        } catch (e) {
            elizaLogger.error(`Error in transferDenom: ${e}`);
            throw e;
        }
    }

    async mintONFT(
        id: string,
        denomId: string,
        name: string,
        mediaUri: string,
        previewUri?: string,
        uriHash?: string,
        description?: string,
        data?: string,
        transferable?: boolean,
        extensible?: boolean,
        nsfw?: boolean,
        royaltyShare?: string,
        recipient?: string,
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.onft.v1beta1.MsgMintONFT", MsgMintONFT);

            const mintONFT = {
                id,
                denomId,
                metadata: {
                    name,
                    description: description || '',
                    mediaUri,
                    previewUri: previewUri || mediaUri,
                    uriHash: uriHash || '',
               },
                data,
                transferable,
                extensible,
                nsfw,
                royaltyShare: royaltyShare || "10000000000000000",
                recipient: recipient || address,
                sender: address,
            };
            const mintONFTMsg = {
                typeUrl: '/OmniFlix.onft.v1beta1.MsgMintONFT',
                value: mintONFT
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };
            const tx = await client.signAndBroadcast(
                address,
                [mintONFTMsg],
                fee,
                "Minted ONFT using Eliza"
            );
            return tx;
        } catch (e) {
            elizaLogger.error(`Error in mintONFT: ${e}`);
            throw e;
        }
    }

    async transferONFT(
        id: string,
        denomId: string,
        recipient: string,
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.onft.v1beta1.MsgTransferONFT", MsgTransferONFT);

            const transferONFT = {
                id,
                denomId,
                recipient,
                sender: address,
            };
            const transferONFTMsg = {
                typeUrl: '/OmniFlix.onft.v1beta1.MsgTransferONFT',
                value: transferONFT
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };
            const tx = await client.signAndBroadcast(
                address,
                [transferONFTMsg],
                fee,
                "Transferred ONFT using Eliza"
            );
            return tx;
        } catch (e) {
            elizaLogger.error(`Error in transferONFT: ${e}`);
            throw e;
        }
    }

    async burnONFT(
        id: string,
        denomId: string,
    ): Promise<DeliverTxResponse> {
        try {
            const address = await this.wallet.getAddress();
            const client = await this.wallet.getClient();
            if (!address) {
                throw new Error("Could not get address");
            }
            client.registry.register("/OmniFlix.onft.v1beta1.MsgBurnONFT", MsgBurnONFT);

            const burnONFT = {
                id,
                denomId,
                sender: address,
            };
            const burnONFTMsg = {
                typeUrl: '/OmniFlix.onft.v1beta1.MsgBurnONFT',
                value: burnONFT
            };
            const fee = {
                amount: [{
                    denom: 'uflix',
                    amount: '50000'
                }],
                gas: '5000000'
            };
            const tx = await client.signAndBroadcast(
                address,
                [burnONFTMsg],
                fee,
                "Burned ONFT using Eliza"
            );
            return tx;
        } catch (e) {
            elizaLogger.error(`Error in burnONFT: ${e}`);
            throw e;
        }
    }

    async getDenom(
        id: string
    ): Promise<any> {
        try {
            let tmClient;
            const rpcEndpoint = process.env.OMNIFLIX_RPC_ENDPOINT;

            if (!rpcEndpoint) {
                elizaLogger.error("RPC endpoint not found");
                return null;
            }
            tmClient = await Tendermint34Client.connect(rpcEndpoint);
            
            // Create query client
            const queryClient = QueryClient.withExtensions(tmClient);
            const rpcClient = createProtobufRpcClient(queryClient);
            
            // Create OmniFlix query client
            const onftQueryClient = new QueryClientImpl(rpcClient);

            // Make the Query Request to get only denom info
            const response = await onftQueryClient.Denom({
                denomId: id
            });

        return response.denom;
        } catch (e) {
            elizaLogger.error(`Error in getDenom: ${e}`);
            throw e;
        }
    }

    async getNFTs(
        denomId: string,
    ): Promise<any> {
        try {
            const address = await this.wallet.getAddress();
            if (!address) {
                throw new Error("Could not get address");
            }

            let tmClient;
            const rpcEndpoint = process.env.OMNIFLIX_RPC_ENDPOINT;

            if (!rpcEndpoint) {
                elizaLogger.error("RPC endpoint not found");
                return null;
            }
            tmClient = await Tendermint34Client.connect(rpcEndpoint);
            
            // Create query client
            const queryClient = QueryClient.withExtensions(tmClient);
            const rpcClient = createProtobufRpcClient(queryClient);
            
            // Create OmniFlix query client
            const onftQueryClient = new QueryClientImpl(rpcClient);

            // Make the Query Request to get only denom info
            const response = await onftQueryClient.Collection({
                denomId: denomId,
            });
            console.log(response);

        return response.collection.onfts;
        } catch (e) {
            elizaLogger.error(`Error in getNFTs: ${e}`);
            throw e;
        }
    }

    async getSingleNFT(
        denomId: string,
        nftId: string,
    ): Promise<any> {
        try {
            const address = await this.wallet.getAddress();
            if (!address) {
                throw new Error("Could not get address");
            }

            let tmClient;
            const rpcEndpoint = process.env.OMNIFLIX_RPC_ENDPOINT;

            if (!rpcEndpoint) {
                elizaLogger.error("RPC endpoint not found");
                return null;
            }
            tmClient = await Tendermint34Client.connect(rpcEndpoint);
            
            // Create query client
            const queryClient = QueryClient.withExtensions(tmClient);
            const rpcClient = createProtobufRpcClient(queryClient);
            
            // Create OmniFlix query client
            const onftQueryClient = new QueryClientImpl(rpcClient);

            // Make the Query Request to get only denom info
            const response = await onftQueryClient.ONFT({
                denomId: denomId,
                id: nftId,
            });

        return response.onft;
        } catch (e) {
            elizaLogger.error(`Error in getNFT: ${e}`);
            throw e;
        }
    }
}

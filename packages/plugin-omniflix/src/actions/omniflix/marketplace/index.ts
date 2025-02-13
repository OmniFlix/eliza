import { type Action } from "@elizaos/core";
import listNFT from "./list_nft.ts";
import deListNFT from "./de_list_nft.ts";
import buyNFT from "./buy_nft.ts";
import createAuction from "./create_auction.ts";
import placeBid from "./place_bid.ts";
import cancelAuction from "./cancel_auction.ts";
import getListingsByPriceDenom from "./get_listings_by_price_denom.ts";
import getListing from "./get_listing.ts";

export const marketPlaceActions: Action[] = [
    listNFT,
    deListNFT,
    buyNFT,
    createAuction,
    placeBid,
    cancelAuction,
    getListingsByPriceDenom,
    getListing,
];
export default marketPlaceActions;

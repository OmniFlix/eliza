import { type Action } from "@elizaos/core";
import listNFT from "./list_nft.ts";
import deListNFT from "./de_list_nft.ts";
import buyNFT from "./buy_nft.ts";
import createAuction from "./create_auction.ts";
import placeBid from "./place_bid.ts";
import cancelAuction from "./cancel_auction.ts";
import getListingsByPriceDenom from "./get_listings_by_price_denom.ts";
import getListing from "./get_listing.ts";
import getMyListings from "./get_my_listings.ts";
import getListingByNFT from "./get_listing_by_nft.ts";
import getMyListingsByPriceDenom from "./get_my_listings_by_price_denom.ts";
import getAuctionsByPriceDenom from "./get_auctions_by_price_denom.ts";
import getAuction from "./get_auction.ts";
import getMyAuctions from "./get_my_auctions.ts";
import getAuctionByNFT from "./get_auction_by_nft.ts";
import getMyAuctionsByPriceDenom from "./get_my_auctions_by_price_denom.ts";

export const marketPlaceActions: Action[] = [
    listNFT,
    deListNFT,
    buyNFT,
    createAuction,
    placeBid,
    cancelAuction,
    getListingsByPriceDenom,
    getListing,
    getMyListings,
    getListingByNFT,
    getMyListingsByPriceDenom,
    getAuctionsByPriceDenom,
    getAuction,
    getMyAuctions,
    getAuctionByNFT,
    getMyAuctionsByPriceDenom,
];
export default marketPlaceActions;

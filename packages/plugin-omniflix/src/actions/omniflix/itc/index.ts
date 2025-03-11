import { type Action } from "@elizaos/core";
import createCampaign from "./create_itc_campaign";
import cancelCampaign from "./cancel_itc_campaign";
import claimCampaign from "./itc_campaign_claim";
import depositCampaign from "./deposit_itc_campaign";

export const itcActions: Action[] = [
    createCampaign,
    cancelCampaign,
    claimCampaign,
    depositCampaign
];
export default itcActions;

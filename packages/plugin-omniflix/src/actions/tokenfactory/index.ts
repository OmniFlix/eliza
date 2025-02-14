import { type Action } from "@elizaos/core";
import createDenom from "./create_denom.ts";
import mintTokens from "./mint_tokens.ts";
import burnTokens from "./burn_tokens.ts";
import changeAdmin from "./change_admin.ts";
import setDenomMetadata from "./set_denom_metadata.ts";
import forceTransfer from "./force_transfer.ts";
import updateParams from "./update_params.ts";

export const tokenFactoryActions: Action[] = [
    createDenom,
    mintTokens,
    burnTokens,
    changeAdmin,
    setDenomMetadata,
    forceTransfer,
    updateParams,
];
export default tokenFactoryActions;

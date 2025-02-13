import { type Action } from "@elizaos/core";
import createDenom from "./create_denom.ts";
import mintTokens from "./mint_tokens.ts";
import burnTokens from "./burn_tokens.ts";
import changeAdmin from "./change_admin.ts";

export const tokenFactoryActions: Action[] = [
    createDenom,
    mintTokens,
    burnTokens,
    changeAdmin
];
export default tokenFactoryActions;

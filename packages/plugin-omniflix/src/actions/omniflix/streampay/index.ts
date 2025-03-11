import { type Action } from "@elizaos/core";
import streamSend from "./stream_send.ts";
import stopStream from "./stop_stream.ts";
import claimStreamedAmount from "./claim_streamed_amount.ts";

export const streampayActions: Action[] = [
    streamSend, 
    stopStream,
    claimStreamedAmount, 
];
export default streampayActions;

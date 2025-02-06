import { bankActions } from "./bank";
import { stakingActions } from "./staking";
import { govActions } from "./gov";
import { onftActions } from "./omniflix/onft";
import { marketPlaceActions } from "./omniflix/market_place";
import { streampayActions } from "./omniflix/streampay";

export const actions = [
    ...bankActions, 
    ...stakingActions, 
    ...govActions, 
    ...onftActions,
    ...marketPlaceActions,
    ...streampayActions
];

export default actions;

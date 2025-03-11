import { bankActions } from "./bank";
import { stakingActions } from "./staking";
import { govActions } from "./gov";
import { onftActions } from "./omniflix/onft";
import { marketPlaceActions } from "./omniflix/marketplace";
import { itcActions } from "./omniflix/itc";
import { streampayActions } from "./omniflix/streampay";

export const actions = [
    ...bankActions, 
    ...stakingActions, 
    ...govActions, 
    ...onftActions,
    ...marketPlaceActions,
    ...itcActions,
    ...streampayActions
];

export default actions;

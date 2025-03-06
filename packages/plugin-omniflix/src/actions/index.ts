import { bankActions } from "./bank";
import { stakingActions } from "./staking";
import { govActions } from "./gov";
import { onftActions } from "./omniflix/onft";
import { marketPlaceActions } from "./omniflix/marketplace";
import { itcActions } from "./omniflix/itc";

export const actions = [
    ...bankActions, 
    ...stakingActions, 
    ...govActions, 
    ...onftActions,
    ...marketPlaceActions,
    ...itcActions,
];

export default actions;

import { bankActions } from "./bank";
import { stakingActions } from "./staking";
import { govActions } from "./gov";
import { onftActions } from "./omniflix/onft";
import { marketPlaceActions } from "./omniflix/marketplace";
import { tokenFactoryActions } from "./tokenfactory";
import { itcActions } from "./omniflix/itc";
import { streampayActions } from "./omniflix/streampay";

export const actions = [
    ...bankActions, 
    ...stakingActions, 
    ...govActions, 
    ...onftActions,
    ...marketPlaceActions,
    ...tokenFactoryActions,
    ...itcActions,
    ...streampayActions
];

export default actions;

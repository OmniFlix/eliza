import { bankActions } from "./bank";
import { stakingActions } from "./staking";
import { govActions } from "./gov";
import { onftActions } from "./omniflix/onft";

export const actions = [...bankActions, ...stakingActions, ...govActions, ...onftActions];

export default actions;

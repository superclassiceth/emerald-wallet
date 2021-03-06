import {
  ActionTypes,
  AddAccountAction,
  IAddAccountState,
  NextPageAction,
  SetBlockchainAction, SetTypeAction,
  SetWalletAction
} from "./types";
import {isFulfilled} from "./selectors";

const TOTAL_STEPS = 4; // select wallet -> select chain -> select type -> action

export const INITIAL_STATE: IAddAccountState = {
  step: 0
};

function onNextPage(state: IAddAccountState, action: NextPageAction): IAddAccountState {
  if (state.step < TOTAL_STEPS && isFulfilled(state, state.step)) {
    return Object.assign({}, state, {step: state.step + 1})
  }
  return state;
}

function onSetWallet(state: IAddAccountState, action: SetWalletAction): IAddAccountState {
  return Object.assign({}, state, {walletId: action.value})
}

function onSetBlockchain(state: IAddAccountState, action: SetBlockchainAction): IAddAccountState {
  return Object.assign({}, state, {blockchain: action.value})
}

function onSetType(state: IAddAccountState, action: SetTypeAction): IAddAccountState {
  return Object.assign({}, state, {type: action.value})
}

export function reducer (
  state: IAddAccountState = INITIAL_STATE,
  action: AddAccountAction
): IAddAccountState {
  switch (action.type) {
    case ActionTypes.NEXT_PAGE:
      return onNextPage(state, action);
    case ActionTypes.SET_WALLET:
      return onSetWallet(state, action);
    case ActionTypes.SELECT_BLOCKCHAIN:
      return onSetBlockchain(state, action);
    case ActionTypes.SELECT_TYPE:
      return onSetType(state, action);
    default:
      return state;
  }
}
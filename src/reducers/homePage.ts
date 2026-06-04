import {
  init as _init,
  type State as rState,
  type Thunk,
} from "@chhsiao1981/use-thunk";

export const myClass = "pttbbs-web/HomePage";

export interface State extends rState {
  theDate?: Date;
}

export const defaultState: State = {};

// init
export const init = (myID: string): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = { theDate };
    dispatch(_init({ myID, state }));
  };
};

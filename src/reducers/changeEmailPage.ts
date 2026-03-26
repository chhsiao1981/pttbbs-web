import {
  init as _init,
  setData as _setData,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const myClass = "pttbbs-web/ChangeEmailPage";

export interface State extends State_t {
  theDate?: Date;
  userID: string;
  token: string;
  isDone: boolean;
}

export const defaultState: State = {
  userID: "",
  token: "",
  isDone: false,
  errmsg: "",
};

// init
export const init = (
  myID: string,
  userID: string,
  token: string,
): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, {
      theDate,
      userID,
      token,
    });
    dispatch(_init({ myID, state: state }));
    dispatch(getData(myID, userID, token));
  };
};

const getData = (myID: string, userID: string, token: string): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.changeEmail(
      userID,
      token,
    );

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg, isDone: true }));
      return;
    }

    dispatch(_setData(myID, { data, isDone: true }));
  };
};

export const sleepAndRedirect = (
  _myID: string,
  userID: string,
): Thunk<State> => {
  return async (_, _1) => {
    setTimeout(() => {
      goUserHome(userID);
    }, 5000);
  };
};

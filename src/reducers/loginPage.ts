import {
  init as _init,
  setData as _setData,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const myClass = "pttbbs-web/LoginPage";

export interface State extends State_t {
  theDate?: Date;
}

export const defaultState: State = { errmsg: "" };

// init
export const init = (myID: string): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, { theDate });
    dispatch(_init({ myID, state }));
  };
};

export const login = (
  myID: string,
  username: string,
  password: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.login(
      username,
      password,
    );

    if (!status) {
      dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status === 401) {
      dispatch(_setData(myID, { errmsg: errors.ERR_PASSWD }));
      return;
    }

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
      return;
    }
    if (!data) {
      dispatch(_setData(myID, { errmsg: "no data" }));
      return;
    }

    window.location.href = "/user/" + data.user_id + "/favorites";
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, { errmsg: "" }));
  };
};

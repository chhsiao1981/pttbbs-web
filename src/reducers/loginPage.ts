import { init as _init, setData, type Thunk } from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const myClass = "pttbbs-web/LoginPage";

export interface State extends State_t {
  theDate?: Date;
  isRequested: boolean;
}

export const defaultState: State = { errmsg: "", isRequested: false };

// init
export const init = (myID: string): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, { theDate });
    dispatch(_init({ myID, state }));
  };
};

export const attemptLogin = (
  myID: string,
  input: string,
  authRequestID: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(setData<State>(myID, { isRequested: true }));
    const { errmsg, status } = await serverUtils.attemptLogin(
      input,
      authRequestID,
    );
    if (errmsg) {
      dispatch(setData<State>(myID, { errmsg }));
      return;
    }

    if (!status) {
      dispatch(setData<State>(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status !== 200) {
      dispatch(setData<State>(myID, { errmsg: `status not 200: ${status}` }));
      return;
    }

    dispatch(setData<State>(myID, { isRequested: true }));
  };
};

export const reset = (myID: string): Thunk<State> => {
  return (dispatch, _) => {
    const state: State = Object.assign({}, defaultState);
    dispatch(setData<State>(myID, state));
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return (dispatch, _) => {
    dispatch(setData<State>(myID, { errmsg: "" }));
  };
};

export const login = (
  myID: string,
  input: string,
  verifyCode: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.login(input, verifyCode);

    if (errmsg) {
      dispatch(setData<State>(myID, { errmsg }));
      return;
    }

    if (!status) {
      dispatch(setData<State>(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status === 401) {
      dispatch(setData<State>(myID, { errmsg: errors.ERR_PASSWD }));
      return;
    }

    if (status !== 200) {
      dispatch(setData<State>(myID, { errmsg }));
      return;
    }

    if (!data) {
      dispatch(setData<State>(myID, { errmsg: "no data" }));
      return;
    }

    window.location.href = "/user/" + data.user_id + "/favorites";
  };
};

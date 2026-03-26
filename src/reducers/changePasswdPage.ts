import {
  init as _init,
  setData as _setData,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const myClass = "pttbbs-web/ChangePasswdPage";

export interface State extends State_t {
  theDate?: Date;
  userID: string;
}

export const defaultState: State = {
  userID: "",
  errmsg: "",
};

// init
export const init = (myID: string, userID: string): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, { theDate, userID });
    dispatch(_init({ myID, state }));
  };
};

export const changePasswd = (
  myID: string,
  userID: string,
  origPassword: string,
  password: string,
  passwordConfirm: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.changePasswd(
      userID,
      origPassword,
      password,
      passwordConfirm,
    );

    if (!status) {
      dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status === 403) {
      dispatch(_setData(myID, { errmsg: errors.ERR_PASSWD }));
      return;
    }

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
      return;
    }
    if (!data) {
      return;
    }

    window.location.href = "/user/" + data.user_id;
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, { errmsg: "" }));
  };
};

import {
  init as _init,
  setData as _setData,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const myClass = "pttbbs-web/attemptChangeEmailPage";

export interface State extends State_t {
  theDate?: Date;
  userID: string;
  isDone: boolean;
}

export const defaultState: State = {
  userID: "",
  isDone: false,
  errmsg: "",
};

// init
export const init = (myID: string, userID: string): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, {
      theDate,
      userID,
    });
    dispatch(_init({ myID, state }));
  };
};

export const changeEmail = (
  myID: string,
  userID: string,
  password: string,
  email: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { errmsg, status } = await serverUtils.attemptChangeEmail(
      userID,
      password,
      email,
    );

    if (!status) {
      dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status === 403) {
      let theErrMsg = errors.ERR_PASSWD;
      if (errmsg === "already exists") {
        theErrMsg = errors.ERR_EMAIL_ALREADY_EXISTS;
      }
      dispatch(_setData(myID, { errmsg: theErrMsg }));
      return;
    }

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
      return;
    }

    dispatch(_setData(myID, { isDone: true }));
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

export const cleanErr = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, { errmsg: "" }));
  };
};

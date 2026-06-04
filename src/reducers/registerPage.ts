import { init as _init, setData, type Thunk } from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const myClass = "demo-pttbbs/RegisterPage";

export interface State extends State_t {
  theDate?: Date;
  infomsg?: string;

  isAttemptRegister: boolean;
}

export const defaultState: State = {
  errmsg: "",
  isAttemptRegister: false,
};

// init
export const init = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    const theDate = new Date();
    const state: State = Object.assign({}, defaultState, { theDate });
    dispatch(_init({ myID, state }));
  };
};

export const attemptRegister = (myID: string, email: string): Thunk<State> => {
  return async (dispatch, _) => {
    const { errmsg, status } = await serverUtils.attemptRegister(email);
    if (errmsg) {
      dispatch(setData<State>(myID, { errmsg }));
      return;
    }
    if (status !== 200) {
      dispatch(
        setData<State>(myID, {
          errmsg: `unable to register: status: ${status}`,
        }),
      );
      return;
    }

    dispatch(setData<State>(myID, { isAttemptRegister: true }));
  };
};

export const register = (
  myID: string,
  username: string,
  password: string,
  passwordConfirm: string,
  email: string,
  over18: boolean,
  verifyCode: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.register(
      username,
      password,
      passwordConfirm,
      email,
      over18,
      verifyCode,
    );

    if (!status) {
      dispatch(setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status === 400) {
      dispatch(setData(myID, { errmsg: errors.ERR_REGISTER }));
      return;
    }

    if (status !== 200) {
      dispatch(setData(myID, { errmsg }));
      return;
    }
    if (!data) {
      return;
    }

    const { user_id } = data;

    goUserHome(user_id);
  };
};

export const cleanMsg = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(setData(myID, { infomsg: "", errmsg: "" }));
  };
};

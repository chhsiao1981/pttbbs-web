import {
  init as _init,
  setData as _setData,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";
import { goUserHome } from "./utils";

export const myClass = "demo-pttbbs/RegisterPage";

export interface State extends State_t {
  theDate?: Date;
  infomsg?: string;
  isSetVerifyEmail: boolean;
}

export const defaultState: State = {
  isSetVerifyEmail: false,

  errmsg: "",
};

// init
export const init = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    const theDate = new Date();
    const state: State = Object.assign({}, defaultState, { theDate });
    dispatch(_init({ myID, state }));
  };
};

export const verifyEmail = (
  myID: string,
  username: string,
  email: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { errmsg, status } = await serverUtils.attemptRegister(
      username,
      email,
    );

    if (!status) {
      dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
      return;
    }

    dispatch(
      _setData(myID, {
        infomsg: errors.INFO_VERIFY_EMAIL,
        isSetVerifyEmail: true,
      }),
    );
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
      dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }

    if (status === 400) {
      dispatch(_setData(myID, { errmsg: errors.ERR_REGISTER }));
      return;
    }

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
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
    dispatch(_setData(myID, { infomsg: "", errmsg: "" }));
  };
};

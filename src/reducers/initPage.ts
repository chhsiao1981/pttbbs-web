import { init as _init, setData, type Thunk } from "@chhsiao1981/use-thunk";
import { STATUS_OK } from "../constants";
import type { State as State_t } from "../types";
import * as serverUtils from "./serverUtils";

export const myClass = "pttbbs-web/InitPage";

export interface State extends State_t {}

export const defaultState: State = {
  errmsg: "",
};

export const init = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    const theDate = new Date();
    const state: State = Object.assign({}, defaultState, { theDate });
    dispatch(_init({ myID, state }));
  };
};

export const submit = (
  myID: string,
  username: string,
  realName: string,
  birthDate: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const { status, errmsg } = await serverUtils.init(
      username,
      realName,
      birthDate,
    );
    if (errmsg) {
      dispatch(setData<State>(myID, { errmsg }));
      return;
    }
    if (status !== STATUS_OK) {
      dispatch(setData<State>(myID, { errmsg: `status is not ok: ${status}` }));
      return;
    }

    window.location.href = "/";
  };
};

export const cleanErr = (myID: string): Thunk<State> => {
  return (dispatch, _) => {
    dispatch(setData<State>(myID, { errmsg: "" }));
  };
};

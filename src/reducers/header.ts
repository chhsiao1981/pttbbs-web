import {
  init as _init,
  setData as _setData,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { State as State_t } from "../types";
import * as errors from "./errors";
import * as serverUtils from "./serverUtils";

export const myClass = "pttbbs-web/Header";

export interface State extends State_t {
  username: string;
  nickname: string;
  isInit: boolean;
}

export const defaultState: State = {
  username: "",
  nickname: "",
  isInit: false,

  errmsg: "",
};

export const init = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    const state = Object.assign({}, defaultState, { isInit: true });
    dispatch(_init({ myID, state }));
    dispatch(getData(myID));
  };
};

const getData = (myID: string): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.getUsername();

    if (!status) {
      dispatch(_setData(myID, { errmsg: errors.ERR_NETWORK }));
      return;
    }
    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
      return;
    }
    if (!data) {
      return;
    }

    dispatch(_setData(myID, { userID: data.user_id }));
  };
};

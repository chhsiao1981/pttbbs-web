import { init as _init, setData, type Thunk } from "@chhsiao1981/use-thunk";
import type { State as State_t, UserDetail } from "../types";
import * as serverUtils from "./serverUtils";

export const myClass = "pttbbs-web/ProfilePage";

export interface State extends State_t, UserDetail {
  theDate?: Date;
}

export const defaultState: State = {
  username: "",
  nickname: "",
  realname: "",
  birthdate: "",

  is_government_id: true,
  is_mobile_id: true,
  over18: false,

  flag: 0,
  perm: 0,
  login_days: 0,
  posts: 0,
  first_login: 0,
  last_login: 0,
  last_ip: "",
  last_host: "",
  money: 0,
  pttemail: "",
  justify: "",

  pager_ui: 0,
  pager: 0,
  invisible: false,
  exmail: 0,
  career: "",
  role: 0,
  last_seen: 0,
  time_set_angel: 0,
  time_play_angel: 0,
  last_song: 0,
  login_view: 0,
  violation: 0,

  five_win: 0,
  five_lose: 0,
  five_tie: 0,

  chc_win: 0,
  chc_lose: 0,
  chc_tie: 0,

  conn6_win: 0,
  conn6_lose: 0,
  conn6_tie: 0,

  go_win: 0,
  go_lose: 0,
  go_tie: 0,

  dark_win: 0,
  dark_lose: 0,
  dark_tie: 0,

  chess_rank: 0,

  ua_version: 0,

  signature: 0,
  badpost: 0,
  angel: "",
  time_remove_bad_post: 0,
  time_violate_law: 0,
  deleted: false,
  update_ts: 0,
  perm2: false,

  email: "",
  email_ts: 0,
  twofactor_enabled: false,
  twofactor_enabled_ts: 0,
  idemail: "",
  idemail_set: false,
  idemail_ts: 0,

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

export const getData = (myID: string, userID: string): Thunk<State> => {
  return async (dispatch, _) => {
    const { data, errmsg, status } = await serverUtils.getUserInfo(userID);

    if (status !== 200) {
      dispatch(setData<State>(myID, { errmsg }));
      return;
    }
    if (!data) {
      return;
    }

    dispatch(setData<State>(myID, data));
  };
};

import {
  init as _init,
  setData as _setData,
  getState,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { BoardSummary_i, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { mergeList, santizeBoard } from "./utils";

export const myClass = "pttbbs-web/UserFavoritesPage";

export interface State extends State_t {
  theDate?: Date;
  level: string;
  startIdx: string;
  scrollTo?: any;
  scrollToRow?: number;
  lastPre: string;
  lastNext: string;
  isBusyLoading: boolean;
  list: BoardSummary_i[];
  nextIdx: string;
  isPreEnd: boolean;
  isNextEnd: boolean;
}

export const defaultState: State = {
  level: "",
  startIdx: "",
  lastPre: "",
  lastNext: "",
  isBusyLoading: false,
  list: [],
  nextIdx: "",
  isPreEnd: false,
  isNextEnd: false,

  errmsg: "",
};

export const init = (
  myID: string,
  userID: string,
  level: string,
  startIdx: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const theDate = new Date();
    const state: State = Object.assign({}, defaultState, {
      theDate,
      level,
      startIdx,
    });
    dispatch(_init({ myID, state }));
    dispatch(getBoards(myID, userID, level, startIdx, false, false));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, data));
  };
};

export const getBoards = (
  myID: string,
  userID: string,
  level: string,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
): Thunk<State> => {
  return async (dispatch, getClassState) => {
    const state = getClassState();
    const me = getState(state, myID);
    if (!me) {
      return;
    }
    const myList = me.list || [];

    //check busy
    const lastPre = me.lastPre || "";
    const lastNext = me.lastNext || "";
    const isBusyLoading = me.isBusyLoading || false;
    if (isBusyLoading) {
      return;
    }

    if (desc) {
      if (lastPre === startIdx) {
        return;
      }
    } else {
      if (lastNext === startIdx) {
        return;
      }
    }

    dispatch(_setData(myID, { isBusyLoading: true }));

    const { data, errmsg, status } = await serverUtils.loadFavoriteBoards(
      userID,
      level,
      startIdx,
      desc,
    );
    if (status !== 200) {
      dispatch(_setData(myID, { errmsg, isBusyLoading: false }));
      return;
    }
    if (!data) {
      dispatch(_setData(myID, { errmsg: "no data", isBusyLoading: false }));
      return;
    }

    let dataList = data.list || [];
    dataList = dataList.map((each) => santizeBoard(each));

    const newList = mergeList(myList, dataList, desc, isExclude);

    const toUpdate: Partial<State> = {
      list: newList,
    };
    if (!desc) {
      toUpdate.nextIdx = data.next_idx;
      toUpdate.lastNext = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isNextEnd = true;
      }
    } else {
      toUpdate.scrollToRow = dataList.length - 1; //only dataList.length - 1 new items.
      toUpdate.lastPre = startIdx;
      toUpdate.isBusyLoading = false;
      if (!data.next_idx) {
        toUpdate.isPreEnd = true;
      }
    }

    console.log("doUserFavoritesPage.GetBoards: to update:", toUpdate);
    dispatch(_setData(myID, toUpdate));
  };
};

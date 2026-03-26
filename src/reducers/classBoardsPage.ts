import {
  init as _init,
  setData as _setData,
  getState,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { BoardSummary_i, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { mergeList, santizeBoard } from "./utils";

export const myClass = "pttbbs-web/ClassBoardsPage";

export interface State extends State_t {
  theDate?: Date;
  clsID: number;
  startIdx: string;
  scrollTo?: any;
  list: BoardSummary_i[];
  lastPre: string;
  lastNext: string;
  isBusyLoading: boolean;
  nextIdx: string;
  scrollToRow: number;
  isPreEnd: boolean;
  isNextEnd: boolean;
}

export const defaultState: State = {
  clsID: 0,
  startIdx: "",
  list: [],
  lastPre: "",
  lastNext: "",
  isBusyLoading: false,
  nextIdx: "",
  scrollToRow: 0,
  isPreEnd: false,
  isNextEnd: false,

  errmsg: "",
};

export const init = (
  myID: string,
  clsID: number,
  startIdx: string,
): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, {
      theDate,
      clsID,
      startIdx,
      scrollTo: null,
      list: [],
      lastPre: "",
      lastNext: "",
      isBusyLoading: false,
      nextIdx: "",
      scrollToRow: 0,
      isPreEnd: false,
      isNextEnd: false,
    });
    dispatch(_init({ myID, state }));
    dispatch(getBoards(myID, clsID, startIdx, false, false));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, data));
  };
};

export const getBoards = (
  myID: string,
  clsID: number,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
): Thunk<State> => {
  clsID = clsID || 1; //clsID default by 1. (no clsID == 0)
  return async (dispatch, getClassState) => {
    const classState = getClassState();
    const me = getState(classState, myID);
    if (!me) {
      return;
    }
    const myList = me.list;

    //check busy
    const lastPre = me.lastPre;
    const lastNext = me.lastNext;
    const isBusyLoading = me.isBusyLoading;
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

    // api
    const { data, errmsg, status } = await serverUtils.loadClassBoards(
      clsID,
      startIdx,
      desc,
    );

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg, isBusyLoading: false }));
      return;
    }
    if (!data) {
      return;
    }

    // integrate list
    let dataList = data.list;
    dataList = dataList.map((each) => santizeBoard(each));

    const newList = mergeList(myList, dataList, desc, isExclude);

    // to update
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

    dispatch(_setData(myID, toUpdate));
  };
};

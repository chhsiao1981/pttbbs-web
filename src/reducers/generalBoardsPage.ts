import {
  init as _init,
  setData as _setData,
  getState,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import type { BoardSummary_i, State as State_t } from "../types";
import * as serverUtils from "./serverUtils";
import { mergeList, santizeBoard } from "./utils";

export const myClass = "demo-pttbbs/GeneralBoardsPage";

export interface State extends State_t {
  theDate?: Date;
  startIdx: string;
  scrollTo?: any;
  list: BoardSummary_i[];
  lastPre: string;
  lastNext: string;
  isBusyLoading: boolean;
  nextIdx: string;
  scrollToRow: number;
  isNextEnd: boolean;
  isPreEnd: boolean;
  searchKeyword: string;
  lastSearchKeyword: string;
}

export const defaultState: State = {
  startIdx: "",
  list: [],
  lastPre: "",
  lastNext: "",
  isBusyLoading: false,
  nextIdx: "",
  scrollTo: null,
  scrollToRow: 0,
  isNextEnd: false,
  isPreEnd: false,
  searchKeyword: "",
  lastSearchKeyword: "",

  errmsg: "",
};

export interface State_m extends Partial<State> {}

export const init = (
  myID: string,
  searchKeyword: string,
  startIdx: string,
  isByClass: boolean,
): Thunk<State> => {
  const theDate = new Date();
  return async (dispatch, _) => {
    const state: State = Object.assign({}, defaultState, {
      theDate,
      startIdx,
      searchKeyword,
    });
    dispatch(_init({ myID, state }));
    dispatch(getBoards(myID, searchKeyword, startIdx, false, false, isByClass));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, data));
  };
};

export const getBoards = (
  myID: string,
  searchKeyword: string,
  startIdx: string,
  desc: boolean,
  isExclude: boolean,
  isByClass: boolean,
): Thunk<State> => {
  return async (dispatch, getClassState) => {
    const state = getClassState();
    const me = getState(state, myID);
    if (!me) {
      return;
    }

    let myList = me.list;

    //check busy
    let lastPre = me.lastPre;
    let lastNext = me.lastNext;
    const isBusyLoading = me.isBusyLoading;

    const myLastSearchKeyword = me.lastSearchKeyword;
    if (searchKeyword !== myLastSearchKeyword) {
      myList = [];
      lastPre = "";
      lastNext = "";
    }

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

    const loadBoards = isByClass
      ? serverUtils.loadGeneralBoardsByClass
      : serverUtils.loadGeneralBoards;

    const { data, errmsg, status } = await loadBoards(
      searchKeyword,
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
      lastSearchKeyword: searchKeyword,
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

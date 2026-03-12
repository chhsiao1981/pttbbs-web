import {
  init as _init,
  setData as _setData,
  getState,
  type Thunk,
} from "@chhsiao1981/use-thunk";
import * as serverUtils from "./serverUtils";
//import * as errors from './errors'

import type { Content, Line, State as State_t } from "../types";

export const myClass = "demo-pttbbs/ManualPage";

export interface State extends State_t {
  theDate?: Date;
  scrollTo?: any;
  isPreEnd: boolean;
  comments: Line[];
  scrollToRow?: number;
  content: Line[];
}

export const defaultState: State = {
  isPreEnd: true,
  comments: [],
  content: [],
  errmsg: "",
};

export const init = (
  myID: string,
  bid: string,
  path: string,
  startIdx: string,
): Thunk<State> => {
  return async (dispatch, _) => {
    const theDate = new Date();
    const state: State = Object.assign({}, defaultState, { theDate });
    dispatch(_init({ myID, state }));
    dispatch(getManualContent(myID, bid, path, startIdx));
  };
};

export const setData = (myID: string, data: Partial<State>): Thunk<State> => {
  return async (dispatch, _) => {
    dispatch(_setData(myID, data));
  };
};

//getManualContent
//
//1. 拿到 content.
//2. parse content.
//3. contentComments.
export const getManualContent = (
  myID: string,
  bid: string,
  path: string,
  startIdx: string,
): Thunk<State> => {
  return async (dispatch, getClassState) => {
    const { data, errmsg, status } = await serverUtils.getManual(
      bid,
      path,
      startIdx,
    );

    console.log(
      "getManualContent: data:",
      data,
      "status:",
      status,
      "myID:",
      myID,
    );

    if (status !== 200) {
      dispatch(_setData(myID, { errmsg }));
      return;
    }
    if (!data) {
      return;
    }

    dispatch(_setData(myID, data));

    const content = data.content;
    const lines = parseLines(content);

    const classState = getClassState();
    const me = getState(classState, myID);
    if (!me) {
      return;
    }

    const isPreEnd = me.isPreEnd || false;
    const comments = me.comments || [];
    const contentComments = isPreEnd ? lines.concat(comments) : comments;

    dispatch(_setData(myID, { content: lines, contentComments }));
  };
};

const parseLines = (content: Content): Line[] => {
  return content.map((runes) => ({ runes }));
};

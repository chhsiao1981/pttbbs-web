import {
  genUUID,
  getDefaultID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import QueryString from "query-string";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoUserFavoritesPage from "../reducers/userFavoritesPage";
import type { BoardSummary_i } from "../types";
import BoardList from "./BoardList";
import Empty from "./Empty";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoUserFavoritesPage = ThunkModuleToFunc<typeof DoUserFavoritesPage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [classUserFavoritesPage, doUserFavoritesPage] = useThunk<
    DoUserFavoritesPage.State,
    TDoUserFavoritesPage
  >(DoUserFavoritesPage);
  const [userFavoritesPageID, _setUserFavoritesPageID] = useState(genUUID);
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);

    const query = QueryString.parse(window.location.search);
    const { start_idx: queryStartIdx, level: queryLevel } = query;
    const startIdx = (queryStartIdx || "") as string;
    const level = (queryLevel || "") as string;

    doUserFavoritesPage.init(userFavoritesPageID, userid, level, startIdx);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
    if (funcbarRef.current) {
      setFuncbarHeight(funcbarRef.current.clientHeight);
    }
  }, [headerRef.current, funcbarRef.current]);

  //get data
  const boardsPage = getState(classUserFavoritesPage);
  if (!boardsPage) {
    return <Empty />;
  }
  const myID = getDefaultID(classUserFavoritesPage);
  // const errmsg = boardsPage.errmsg || "";
  const boards = boardsPage.list;
  const isPreEnd = boardsPage.isPreEnd;
  const isNextEnd = boardsPage.isNextEnd;
  const scrollToRow = boardsPage.scrollToRow;
  const level = boardsPage.level;

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const headerTitle = "我的最愛";

  const loadPre = (item: BoardSummary_i) => {
    if (item.numIdx === 1 || isPreEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }
    doUserFavoritesPage.getBoards(myID, userid, level, idx, true, true);
  };

  const loadNext = (item: BoardSummary_i) => {
    if (isNextEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }

    doUserFavoritesPage.getBoards(myID, userid, level, idx, false, true);
  };

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (typeof scrollToRow === "undefined") {
      return false;
    }

    doUserFavoritesPage.setData(myID, { scrollToRow: undefined });
    return true;
  };

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);

  const renderBoards = () => {
    if (boards.length === 0) {
      const style = {
        height: listHeight,
      };
      return (
        <div className="container" style={style}>
          <h3 className="mx-4">目前找不到看板喔～</h3>
        </div>
      );
    } else {
      return (
        <BoardList
          boards={boards}
          width={width}
          height={listHeight}
          loadPre={loadPre}
          loadNext={loadNext}
          scrollToRow={scrollToRow}
          onVerticalScroll={onVerticalScroll}
          scrollTop={scrollTop}
        />
      );
    }
  };

  const loptions = [{ text: "搜尋看板", action: () => {} }];

  const roptions = [
    {
      text: "熱門看板",
      action: () => {
        window.location.href = "/boards/popular";
      },
    },
    {
      text: "所有看板",
      action: () => {
        window.location.href = "/boards";
      },
    },
    {
      text: "分類看板",
      action: () => {
        window.location.href = "/cls/1";
      },
    },
  ];

  return (
    <div className={pageStyles.root}>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={classHeader} />
      </div>
      {renderBoards()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};

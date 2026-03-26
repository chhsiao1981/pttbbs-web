import {
  genUUID,
  getDefaultID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import QueryString from "query-string";
import { useEffect, useRef, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import * as DoGeneralBoardsPage from "../reducers/generalBoardsPage";
import * as DoHeader from "../reducers/header";
import type { BoardSummary_i } from "../types";
import BoardList from "./BoardList";
import Empty from "./Empty";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import pageStyles from "./Page.module.css";
import SearchBar from "./SearchBar";

type TDoGeneralBoardsPage = ThunkModuleToFunc<typeof DoGeneralBoardsPage>;
type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};
export default (_props: Props) => {
  const [classGeneralBoardsPage, doGeneralBoardsPage] = useThunk<
    DoGeneralBoardsPage.State,
    TDoGeneralBoardsPage
  >(DoGeneralBoardsPage);
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

  // eslint-disable-next-line
  const [isByClass, _setIsByClass] = useState(true);

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);
  const [searching, setSearching] = useState(false);

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const headerID = genUUID();
    doHeader.init(headerID);

    const generalBoardsPageID = genUUID();
    const query = QueryString.parse(window.location.search);
    const { start_idx: queryStartIdx, title: queryTitle } = query;
    const searchKeyword = (queryTitle || "") as string;
    const startIdx = (queryStartIdx || "") as string;

    doGeneralBoardsPage.init(
      generalBoardsPageID,
      searchKeyword,
      startIdx,
      isByClass,
    );
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
  const boardsPage = getState(classGeneralBoardsPage);
  if (!boardsPage) {
    return <Empty />;
  }
  const myID = getDefaultID(classGeneralBoardsPage);
  // const errmsg = boardsPage.errmsg || "";
  const boards = boardsPage.list;
  let searchKeyword = boardsPage.searchKeyword;
  const isNextEnd = boardsPage.isNextEnd;
  const isPreEnd = boardsPage.isPreEnd;
  const scrollToRow = boardsPage.scrollToRow;

  const header = getState(classHeader);
  if (!header) {
    return <Empty />;
  }
  const myUserID = header.user_id;

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const headerTitle = "所有看板";

  const loadPre = (item: BoardSummary_i) => {
    if (item.numIdx === 1 || isPreEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }
    doGeneralBoardsPage.getBoards(
      myID,
      searchKeyword,
      idx,
      true,
      true,
      isByClass,
    );
  };

  const loadNext = (item: BoardSummary_i) => {
    if (isNextEnd) {
      return;
    }

    const idx = item.idx || "";
    if (!idx) {
      return;
    }

    doGeneralBoardsPage.getBoards(
      myID,
      searchKeyword,
      idx,
      false,
      true,
      isByClass,
    );
  };

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (typeof scrollToRow === "undefined") {
      return false;
    }

    doGeneralBoardsPage.setData(myID, { scrollToRow: undefined });
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

  const roptions = [];
  if (myUserID && myUserID !== config.PTT_GUEST) {
    roptions.push({
      text: "我的最愛",
      action: () => {
        window.location.href = "/user/" + myUserID + "/favorites";
      },
    });
  }
  roptions.push({
    text: "熱門看板",
    action: () => {
      window.location.href = "/boards/popular";
    },
  });
  roptions.push({
    text: "分類看板",
    action: () => {
      window.location.href = "/cls/1";
    },
  });

  const onSearchSubmit = () => {
    searchKeyword === "" ? setSearching(false) : setSearching(true);
    // clear articles
    // load more
    doGeneralBoardsPage.getBoards(
      myID,
      searchKeyword,
      "",
      false,
      false,
      isByClass,
    );
  };

  const onSearchClear = () => {
    setSearching(false);
    searchKeyword = "";
    doGeneralBoardsPage.setData(myID, { searchKeyword });
    doGeneralBoardsPage.getBoards(
      myID,
      searchKeyword,
      "",
      false,
      false,
      isByClass,
    );
  };

  const renderHeader = () => {
    return (
      <div
        className={"col d-flex justify-content-between align-items-center px-4"}
      >
        <div className="w-25 "></div>
        <span className="p-0" style={{ fontSize: "x-large" }}>
          {headerTitle}
        </span>
        <div className="w-25">
          <SearchBar
            text={searchKeyword}
            setText={(text: string) => {
              doGeneralBoardsPage.setData(myID, { searchKeyword: text });
            }}
            onSearch={onSearchSubmit}
            searching={searching}
            onClear={onSearchClear}
            prompt={"搜尋板名..."}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={pageStyles.root}>
      <div ref={headerRef}>
        <Header
          title={headerTitle}
          stateHeader={classHeader}
          renderHeader={renderHeader}
        />
      </div>
      {renderBoards()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};

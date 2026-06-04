import {
  genUUID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoHotBoardsPage from "../reducers/hotBoardsPage";
import BoardList from "./BoardList";
import Empty from "./Empty";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHotBoardsPage = ThunkModuleToFunc<typeof DoHotBoardsPage>;
type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [classHotBoardsPage, doHotBoardsPage] = useThunk<
    DoHotBoardsPage.State,
    TDoHotBoardsPage
  >(DoHotBoardsPage);
  const [stateHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const headerID = genUUID();
    doHeader.init(headerID);

    const hotBoardsPageID = genUUID();
    doHotBoardsPage.init(hotBoardsPageID);
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
  const hotBoardsPage = getState(classHotBoardsPage);
  if (!hotBoardsPage) {
    return <Empty />;
  }
  // const errmsg = hotBoardsPage.errmsg || "";
  const boards = hotBoardsPage.list;

  const header = getState(stateHeader) || { userID: "" };
  const myUserID = header.userID;

  const width = innerWidth;
  //let boardListHeight = innerHeight * SCREEN_RATIO
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const headerTitle = "熱門看板";

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);

  const renderBoardList = () => {
    if (!hotBoardsPage?.isBusyLoading && boards.length === 0) {
      const style: CSSProperties = {
        width: innerWidth,
        height: listHeight,
      };

      return (
        <div style={style}>
          <h3 className="mx-4">還沒有熱門看板喔～</h3>
        </div>
      );
    } else {
      return <BoardList boards={boards} width={width} height={listHeight} />;
    }
  };

  // const loptions = [{ text: "搜尋看板", action: () => {} }];
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
    text: "全部看板",
    action: () => {
      window.location.href = "/boards";
    },
  });
  roptions.push({
    text: "分類看板",
    action: () => {
      window.location.href = "/cls/1";
    },
  });

  // NOTE: ref can only be used directly on html tags to get element attributes
  // Will fail if used on React components. e.g. Header
  return (
    <div className={pageStyles.root}>
      <div ref={headerRef}>
        <Header title={headerTitle} />
      </div>
      {renderBoardList()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={[]} optionsRight={[]} />
      </div>
    </div>
  );
};

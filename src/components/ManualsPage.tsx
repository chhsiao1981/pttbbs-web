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
import { useKey } from "react-use";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoManualsPage from "../reducers/manualsPage";
import type { ManArticleSummary_i, PttOption } from "../types";
import Empty from "./Empty";
import EmptyList from "./EmptyList";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import ManualList from "./ManualList";
import styles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoManualsPage = ThunkModuleToFunc<typeof DoManualsPage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

// biome-ignore lint/complexity/noBannedTypes: props
type HeaderProps = {};

export default (_props: Props) => {
  //init
  const { bid: paramsBid, path: paramsPath } = useParams();
  const bid = paramsBid || "";
  const path = paramsPath || "";
  const pathList = path.split("/");
  const dirname = pathList.slice(0, pathList.length - 1).join("/");
  let parentUrl = `/board/${bid}/manual`;
  if (dirname !== "") {
    parentUrl += "/" + dirname;
  }

  const [classManualsPage, doManualsPage] = useThunk<
    DoManualsPage.State,
    TDoManualsPage
  >(DoManualsPage);
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);

  const [_errMsg, _setErrMsg] = useState("");

  //keys
  useKey("ArrowLeft", (_e) => {
    window.location.href = parentUrl;
  });

  //render
  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const [scrollTop, setScrollTop] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const headerID = genUUID();
    doHeader.init(headerID);

    const manualsPageID = genUUID();
    const query = QueryString.parse(window.location.search);
    const { start_idx: queryStartIdx, title: queryTitle } = query;
    const searchTitle = (queryTitle || "") as string;
    const startIdx = (queryStartIdx || "") as string;

    doManualsPage.init(manualsPageID, bid, path, searchTitle, startIdx);
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
  const manualsPage = getState(classManualsPage);
  if (!manualsPage) {
    return <Empty />;
  }
  const myID = getDefaultID(classManualsPage);
  // const errmsg = manualsPage.errmsg || "";
  const brdname = manualsPage.brdname;
  const title = manualsPage.title;
  const scrollToRow = manualsPage.scrollToRow;
  const manuals = manualsPage.allManuals;

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  const headerTitle = "(精華區) " + brdname + " - " + title;

  const loadPre = (_item: ManArticleSummary_i) => {};

  const loadNext = (_item: ManArticleSummary_i) => {};

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (scrollToRow === null) {
      return false;
    }

    doManualsPage.setData(myID, { scrollToRow: undefined });
    return true;
  };

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderManuals = () => {
    if (manuals.length === 0) {
      return (
        <EmptyList
          prompt="這個精華區目前沒有文章喔～"
          width={width}
          height={listHeight}
        />
      );
    } else {
      return (
        <ManualList
          manuals={manuals}
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

  const loptions: PttOption[] = [];
  let roptions: PttOption[] = [
    { text: "看板", url: `/board/${bid}/articles` },
    { text: "看板設定/說明", action: () => {} },
  ];
  if (path !== "") {
    const roptions_p: PttOption[] = [
      { text: "離開", url: parentUrl, hotkey: "←" },
    ];
    roptions = roptions_p.concat(roptions);
  }

  const renderHeader = (_props: HeaderProps) => {
    return (
      <div
        className={"col d-flex justify-content-between align-items-center px-4"}
      >
        <div className="w-25 "></div>
        <span className="p-0" style={{ fontSize: "x-large" }}>
          {headerTitle}
        </span>
        <div className="w-25"></div>
      </div>
    );
  };

  // NOTE: ref can only be used directly on html tags to get element attributes
  // Will fail if used on React components.
  return (
    <div className={styles.root}>
      <div ref={headerRef}>
        <Header
          title={headerTitle}
          stateHeader={classHeader}
          renderHeader={renderHeader}
        />
      </div>
      {renderManuals()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};

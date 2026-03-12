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
import * as DoManualPage from "../reducers/manualPage";
import type { Line, PttOption } from "../types";
import Article from "./Article";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import styles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoManualPage = ThunkModuleToFunc<typeof DoManualPage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};
export default (_props: Props) => {
  const [classManualPage, doManualPage] = useThunk<
    DoManualPage.State,
    TDoManualPage
  >(DoManualPage);
  const [manualPageID, _setManualPageID] = useState(genUUID);

  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  // eslint-disable-next-line
  const [_errMsg, _setErrMsg] = useState("");

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
    const startIdx = (query.start_idx || "") as string;

    doManualPage.init(manualPageID, bid, path, startIdx);
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

  //render

  useKey("ArrowLeft", (_e) => {
    window.location.href = parentUrl;
  });

  //get data
  const manualPage = getState(classManualPage) || DoManualPage.defaultState;
  const myID = getDefaultID(classManualPage);
  // const errmsg = manualPage.errmsg || "";
  const brdname = manualPage.brdname;
  const title = manualPage.title;
  const content = manualPage.content;
  const scrollToRow = manualPage.scrollToRow;

  //keys

  const width = innerWidth;
  const listHeight = innerHeight - headerHeight - funcbarHeight;

  let fullTitle = "";
  fullTitle += title;
  const headerTitle = `(精華區) ${brdname} - ${fullTitle}`;

  const loadPre = (_item: Line) => {};
  const loadNext = (_item: Line) => {};

  const onVerticalScroll = (scrollTop: number): boolean => {
    setScrollTop(scrollTop);
    if (scrollToRow === null) {
      return false;
    }

    doManualPage.setData(myID, { scrollToRow: undefined });

    return true;
  };

  // const allErrMsg = errors.mergeErr(errMsg, errmsg);
  const renderManual = () => {
    return (
      <Article
        lines={content}
        width={width}
        height={listHeight}
        loadPre={loadPre}
        loadNext={loadNext}
        scrollToRow={scrollToRow}
        onVerticalScroll={onVerticalScroll}
        scrollTop={scrollTop}
      />
    );
  };

  const loptions: PttOption[] = [];

  const roptions: PttOption[] = [{ text: "離開", url: parentUrl, hotkey: "←" }];

  return (
    <div className={styles.root}>
      <div ref={headerRef}>
        <Header title={headerTitle} stateHeader={classHeader} />
      </div>
      {renderManual()}
      <div ref={funcbarRef}>
        <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
      </div>
    </div>
  );
};

import {
  genUUID,
  getDefaultID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import {
  type FocusEvent,
  type MouseEvent,
  type SubmitEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { DropdownList } from "react-widgets";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoNewArticlePage from "../reducers/newArticlePage";
import type { EditLine } from "../types";
import Editor from "./Editor";
import Empty from "./Empty";
import FunctionBar from "./FunctionBar";
import Header from "./Header";
import InitConsts from "./InitConsts";
import styles from "./NewArticlePage.module.css";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoNewArticlePage = ThunkModuleToFunc<typeof DoNewArticlePage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};
export default (_props: Props) => {
  const [classNewArticlePage, doNewArticlePage] = useThunk<
    DoNewArticlePage.State,
    TDoNewArticlePage
  >(DoNewArticlePage);
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);

  const [headerHeight, setHeaderHeight] = useState(0);
  const [funcbarHeight, setFuncbarHeight] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const funcbarRef = useRef<HTMLDivElement>(null);
  const [isShowCursor, setIsShowCursor] = useState(true);
  const isShowCursorRef = useRef(isShowCursor);

  // eslint-disable-next-line
  const [errMsg, setErrMsg] = useState("");

  const [isInitConsts, setIsInitConsts] = useState(false);

  //init
  const { bid: paramsBid } = useParams();
  const bid = paramsBid || "";
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const headerID = genUUID();
    doHeader.init(headerID);

    const newArticlePageID = genUUID();

    doNewArticlePage.init(newArticlePageID, bid);

    const interval = setInterval(() => {
      setIsShowCursor(!isShowCursorRef.current);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isInitConsts) {
      return;
    }
  }, [isInitConsts]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.clientHeight);
    }
    if (funcbarRef.current) {
      setFuncbarHeight(funcbarRef.current.clientHeight);
    }
  }, [headerRef.current, funcbarRef.current]);

  const { width: innerWidth, height: innerHeight } = useWindowSize();
  const screenWidth = innerWidth;
  const screenHeight = innerHeight - headerHeight - funcbarHeight;

  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedColumn, setSelectedColumn] = useState(0);

  const [title, setTitle] = useState("");

  const [content, setContent] = useState<EditLine[]>([]);

  //get data
  const newArticlePage = getState(classNewArticlePage);
  if (!newArticlePage) {
    return <Empty />;
  }
  const myID = getDefaultID(classNewArticlePage);
  const errmsg = newArticlePage.errmsg || "";
  const brdname = newArticlePage.brdname;
  const postTypes = newArticlePage.post_type.map((each) => ({
    value: each,
    label: "[" + each + "]",
  }));

  const theClass = newArticlePage.theClass;
  const setTheClass = (newClass: string) => {
    doNewArticlePage.setData(myID, { theClass: newClass });
  };

  const submit = (_e: SubmitEvent) => {
    if (!theClass) {
      showErrMsg("您忘記類別囉～");
      return;
    }
    if (!title) {
      showErrMsg("您忘記標題囉～");
      return;
    }
    doNewArticlePage.submit(myID, bid, theClass, title, content);
  };

  const allErrMsg: string[] = [];
  if (errMsg) {
    allErrMsg.push(errMsg);
  }
  if (errmsg) {
    allErrMsg.push(errmsg);
  }
  const renderError = () => {
    return (
      <span className={"nav-link " + styles.error}>{allErrMsg.join(",")}</span>
    );
  };

  const loptions = [
    { text: "發表文章", action: submit },
    { render: renderError },
  ];
  const roptions = [
    { text: selectedRow + 1 + "," + (selectedColumn + 1) },
    { text: "離開", url: `/board/${bid}/articles` },
  ];

  const onFocus = (_e: FocusEvent) => {
    //console.log('NewArticlePage: onFocus: start')
  };

  const onBlur = (_e: FocusEvent) => {
    //console.log('NewArticlePage: onBlur: start')
  };

  const showErrMsg = (text: string) => {
    setErrMsg(text);
    setTimeout(() => cleanErrMsg(), 1000);
  };

  const cleanErrMsg = () => {
    setErrMsg("");
    doNewArticlePage.setData(myID, { errmsg: "" });
  };

  const onMouseDownHeader = (_e: MouseEvent) => {
    //console.log('NewArticlePage: onMouseDownHeader: start')
  };

  const classStyle = {
    width: "170px",
    display: "inline-block",
  };

  const renderHeader = () => {
    return (
      <div className={"col " + styles.title}>
        <span>{brdname} - </span>
        <DropdownList
          style={classStyle}
          containerClassName={styles["title-class"]}
          data={postTypes}
          value={theClass}
          dataKey="value"
          textField="label"
          onChange={(item) => {
            setTheClass(item.value);
          }}
        />
        <input
          className={styles["title-input"]}
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={title}
          onMouseDown={onMouseDownHeader}
          placeholder={"標題:"}
        />
      </div>
    );
  };

  return (
    <>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: onFocus and onBlur on the whole page */}
      <div className={pageStyles.root} onFocus={onFocus} onBlur={onBlur}>
        <div ref={headerRef}>
          <Header
            title={""}
            renderHeader={renderHeader}
            stateHeader={classHeader}
          />
        </div>

        <Editor
          contentLines={content}
          setContentLines={setContent}
          width={screenWidth}
          height={screenHeight}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          selectedColumn={selectedColumn}
          setSelectedColumn={setSelectedColumn}
        />

        <div ref={funcbarRef}>
          <FunctionBar optionsLeft={loptions} optionsRight={roptions} />
        </div>
        <InitConsts
          windowWidth={innerWidth}
          isMobile={false}
          isInitConsts={isInitConsts}
          setIsInitConsts={setIsInitConsts}
        />
      </div>
    </>
  );
};

import {
  genUUID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import QueryString from "query-string";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoSetIDEmailPage from "../reducers/setIDEmailPage";
import Empty from "./Empty";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoSetIDEmailPage = ThunkModuleToFunc<typeof DoSetIDEmailPage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [classSetIDEmailPage, doSetIDEmailPage] = useThunk<
    DoSetIDEmailPage.State,
    TDoSetIDEmailPage
  >(DoSetIDEmailPage);
  const [setIDEmailPageID, _setSetIDEmailPageID] = useState(genUUID);

  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const { token: queryToken } = QueryString.parse(window.location.search);
    const token = (queryToken || "") as string;
    doHeader.init(headerID);

    doSetIDEmailPage.init(setIDEmailPageID, userid, token);
  }, []);

  //get data
  const setIDEmailPage =
    getState(classSetIDEmailPage) || DoSetIDEmailPage.defaultState;
  const errmsg = setIDEmailPage.errmsg || "";
  const isDone = setIDEmailPage.isDone;
  const data = setIDEmailPage.data;

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!isDone) {
      return;
    }

    doSetIDEmailPage.sleepAndRedirect(setIDEmailPageID, userid);
  }, [isDone]);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const renderData = () => {
    // @ts-expect-error the type of data is unknown
    if (!data.idemail) {
      return <Empty />;
    }

    // @ts-expect-error the type of data is unknown
    return <span className="">您的認證信箱已更改為 {data.idemail} 囉～</span>;
  };

  const renderInfo = () => {
    if (!isDone) {
      return <Empty />;
    }

    return <span className="">將會回到您的個人資訊</span>;
  };

  return (
    <div className={pageStyles.root} style={style}>
      <div className={"container"} style={style}>
        <Header title="更改認證信箱" stateHeader={classHeader} />
        <div className="row">
          <div className="col">{renderData()}</div>
          <div className="col">
            <span className={pageStyles.errMsg}>{errmsg}</span>
          </div>
          <div className="col">{renderInfo()}</div>
        </div>
      </div>
    </div>
  );
};

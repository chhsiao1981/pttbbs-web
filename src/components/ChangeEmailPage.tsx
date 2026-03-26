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
import * as DoChangeEmailPage from "../reducers/changeEmailPage";
import * as DoHeader from "../reducers/header";
import Empty from "./Empty";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoChangeEmailPage = ThunkModuleToFunc<typeof DoChangeEmailPage>;
type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [classChangeEmailPage, doChangeEmailPage] = useThunk<
    DoChangeEmailPage.State,
    TDoChangeEmailPage
  >(DoChangeEmailPage);
  const [changeEmailPageID, _setChangeEmailPageID] = useState(genUUID);

  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!userid) {
      return;
    }
    const { token: paramsToken } = QueryString.parse(window.location.search);
    const token = (paramsToken || "") as string;

    doHeader.init(headerID);
    doChangeEmailPage.init(changeEmailPageID, userid, token);
  }, [userid]);

  //get data
  const changeEmailPage =
    getState(classChangeEmailPage) || DoChangeEmailPage.defaultState;
  let errmsg = changeEmailPage.errmsg || "";
  const isDone = changeEmailPage.isDone;
  const data = changeEmailPage.data;

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!isDone) {
      return;
    }

    doChangeEmailPage.sleepAndRedirect(changeEmailPageID, userid);
  }, [isDone]);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const renderData = () => {
    // @ts-expect-error data is unknown
    if (!data.email) {
      return <Empty />;
    }

    return (
      <span className="">
        {/* @ts-expect-error data is unknown */}
        您的聯絡信箱已更改為 {data.email} 囉～(將會回到您的個人資訊)
      </span>
    );
  };

  if (errmsg) {
    errmsg += " (將會回到您的個人資訊)";
  }

  return (
    <div className={pageStyles.root} style={style}>
      <div className={"container"} style={style}>
        <Header title="更改聯絡信箱" stateHeader={classHeader} />
        <div className="row">
          <div className="col">{renderData()}</div>
          <div className="col">
            <span className={pageStyles.errMsg}>{errmsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import {
  genUUID,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as DoUserPage from "../reducers/userInfoPage";
import Empty from "./Empty";
import * as errors from "./errors";
import Header from "./Header";
import pageStyles from "./Page.module.css";
import { TSToDateTimeStr } from "./utils";

type TDoUserPage = ThunkModuleToFunc<typeof DoUserPage>;

export default () => {
  const [userPageID, _setUserPageID] = useState(genUUID);
  const useUserPage = useThunk<DoUserPage.State, TDoUserPage>(DoUserPage);
  const [userPage, doUserPage] = mustGetStateByThunk(useUserPage);
  const { errmsg } = userPage;

  // eslint-disable-next-line
  const [errMsg, _setErrMsg] = useState("");

  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doUserPage.init(userPageID, userid);
  }, []);

  // event handlers
  const changePassword = () => {
    window.location.href = "/user/" + userid + "/resetpassword";
  };

  const changeEmail = () => {
    window.location.href = "/user/" + userid + "/attemptchangeemail";
  };

  const setIDEmail = () => {
    window.location.href = "/user/" + userid + "/attemptsetidemail";
  };

  const renderPttEmail = () => {
    if (!userPage.pttemail) {
      return <span>我在 {config.BRAND} 的 Email 是 (還沒有設定～)</span>;
    }
    if (!userPage.justify) {
      return (
        <span>
          我在 {config.BRAND} 的 Email 是 {userPage.pttemail} (審核: 還沒有通過)
        </span>
      );
    }

    return (
      <span>
        我在 {config.BRAND} 的 Email 是 {userPage.pttemail} (審核:{" "}
        {userPage.justify})
      </span>
    );
  };

  const renderPost = () => {
    if (!userPage) {
      return <Empty />;
    }
    const badposts = !userPage.bad_post
      ? ""
      : " (被退 " + userPage.bad_post + " 篇)";

    return (
      <span>
        我已經 po 了 {userPage.posts} 篇文章{badposts}
      </span>
    );
  };

  const renderOver18 = () => {
    if (!userPage) {
      return <Empty />;
    }
    const isOver18Str = !userPage.over18 ? "還沒" : "已經";
    const isOver18Suffix = !userPage.over18 ? "捏" : "囉";

    return (
      <span>
        我{isOver18Str}18歲{isOver18Suffix}～
      </span>
    );
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  const title = userid + "的資訊";

  let email = userPage.email || "(還沒有設定～)";
  if (userPage.email && !userPage.email_set) {
    email += "(正在設定～)";
  }

  let idemail = userPage.idemail || "(還沒有設定～)";
  if (userPage.idemail && !userPage.idemail_set) {
    idemail += "(正在設定～)";
  }

  // const career = userPage.Career || "(某個角落)";

  //render
  if (!userPageID) {
    return <Empty />;
  }
  return (
    <div className={"vh-100 " + pageStyles.root}>
      <Header title={title} />
      <div className={"container"}>
        <div className="row">
          <div className="col">
            <span>
              我是 {userPage.username}({userPage.nickname}) {userPage.realname}
            </span>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={changePassword}
            >
              我想換密碼～
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">{renderPttEmail()}</div>
        </div>
        <div className="row">
          <div className="col">
            <span>我平常聯絡的 Email 是 {email}</span>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={changeEmail}
            >
              我想換聯絡 Email
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我認證的 Email 是 {idemail}</span>
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              onClick={setIDEmail}
            >
              我想換認證 Email
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我有 {userPage.money} P 幣～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我已經上站 {userPage.login_days} 天了～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我上次上站的 IP: {userPage.last_ip} ({userPage.last_host}) 時間:{" "}
              {TSToDateTimeStr(userPage.last_login)}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">{renderPost()}</div>
        </div>
        <div className="row">
          <div className="col">{renderOver18()}</div>
        </div>
        <div className="row">
          <div className="col">
            <span>我平常在 {userPage.career} 畫圈圈～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的五子棋: 贏: {userPage.five_win} 輸: {userPage.five_lose} 和:{" "}
              {userPage.five_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的六子棋: 贏: {userPage.conn6_win} 輸: {userPage.conn6_lose} 和:{" "}
              {userPage.conn6_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的象棋: 贏: {userPage.chc_win} 輸: {userPage.chc_lose} 和:{" "}
              {userPage.chc_tie} 等級: {userPage.chess_rank}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的暗棋: 贏: {userPage.dark_win} 輸: {userPage.dark_lose} 和:{" "}
              {userPage.dark_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的圍棋: 贏: {userPage.go_win} 輸: {userPage.go_lose} 和:{" "}
              {userPage.go_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span className={pageStyles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import {
  genUUID,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { type CSSProperties, useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoProfilePage from "../reducers/profilePage";
import * as errors from "./errors";
import Header from "./Header";
import pageStyles from "./Page.module.css";
import { tsToDateTimeStr } from "./utils";

type TDoProfilePage = ThunkModuleToFunc<typeof DoProfilePage>;
type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

export default () => {
  const [profilePageID] = useState(genUUID);
  const useProfilePage = useThunk<DoProfilePage.State, TDoProfilePage>(
    DoProfilePage,
  );
  const [profilePage, doProfilePage] = mustGetStateByThunk(useProfilePage);
  const {
    nickname,
    realname,
    birthdate,

    is_government_id,
    is_mobile_id,
    over18,

    errmsg,
  } = profilePage;

  const useHeader = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [header] = mustGetStateByThunk(useHeader);
  const { username } = header;

  const { width: innerWidth } = useWindowSize(10, 0);
  const { t } = useTranslation();

  const [errMsg, _setErrMsg] = useState("");

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doProfilePage.init(profilePageID);
  }, []);

  // event handlers

  const renderPost = () => {
    const badposts = !profilePage.bad_post
      ? ""
      : " (被退 " + profilePage.bad_post + " 篇)";

    return (
      <span>
        我已經 po 了 {profilePage.posts} 篇文章{badposts}
      </span>
    );
  };

  const renderOver18 = () => {
    const isOver18Str = !over18 ? "還沒" : "已經";
    const isOver18Suffix = !over18 ? "捏" : "囉";

    return (
      <span>
        我{isOver18Str}18歲{isOver18Suffix}～
      </span>
    );
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  const title = "我的資訊";

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  const classNameGovernmentID = is_government_id ? "" : "hide";
  const classNameMobileID = is_mobile_id ? "" : "hide";
  const classNameSpace = is_government_id || is_mobile_id ? "" : "hide";

  //render
  return (
    <div className={"vh-100 " + pageStyles.root} style={rootStyle}>
      <Header title={title} />
      <div className={"container"}>
        <div className="row">
          <div className="col">
            <span>
              我是 {username} ({nickname})
            </span>
            <span className={classNameSpace}> </span>
            <OverlayTrigger
              overlay={<Tooltip>{t("profile.withMobileID")}</Tooltip>}
            >
              <span className={classNameMobileID}>🙂</span>
            </OverlayTrigger>
            <OverlayTrigger
              overlay={<Tooltip>{t("profile.withGovernmentID")}</Tooltip>}
            >
              <span className={classNameGovernmentID}>😄</span>
            </OverlayTrigger>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我有 {profilePage.money} P 幣～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>我已經上站 {profilePage.login_days} 天了～</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我上次上站的 IP: {profilePage.last_ip} ({profilePage.last_host})
              時間: {tsToDateTimeStr(profilePage.last_login)}
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
            <span>
              我的五子棋: 贏: {profilePage.five_win} 輸: {profilePage.five_lose}{" "}
              和: {profilePage.five_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的六子棋: 贏: {profilePage.conn6_win} 輸:{" "}
              {profilePage.conn6_lose} 和: {profilePage.conn6_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的象棋: 贏: {profilePage.chc_win} 輸: {profilePage.chc_lose} 和:{" "}
              {profilePage.chc_tie} 等級: {profilePage.chess_rank}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的暗棋: 贏: {profilePage.dark_win} 輸: {profilePage.dark_lose}{" "}
              和: {profilePage.dark_tie}
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span>
              我的圍棋: 贏: {profilePage.go_win} 輸: {profilePage.go_lose} 和:{" "}
              {profilePage.go_tie}
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

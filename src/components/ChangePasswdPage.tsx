import {
  genUUID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import * as DoChangePasswdPage from "../reducers/changePasswdPage";
import * as DoHeader from "../reducers/header";
import * as errors from "./errors";
import Header from "./Header";
import styles from "./Page.module.css";

type TDoChangePasswdPage = ThunkModuleToFunc<typeof DoChangePasswdPage>;
type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [classChangePasswdPage, doChangePasswdPage] = useThunk<
    DoChangePasswdPage.State,
    TDoChangePasswdPage
  >(DoChangePasswdPage);
  const [changePasswdPageID, _setChangePasswdPageID] = useState(genUUID);
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  const [origPasswd, setOrigPasswd] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errMsg, setErrMsg] = useState("");

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);

    doChangePasswdPage.init(changePasswdPageID, userid);
  }, []);

  //get data
  const changePasswdPage =
    getState(classChangePasswdPage) || DoChangePasswdPage.defaultState;
  const userID = changePasswdPage.userID;
  const errmsg = changePasswdPage.errmsg || "";

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const cleanErr = () => {
    setErrMsg("");
    doChangePasswdPage.cleanErr(changePasswdPageID);
  };

  const changeOrigPasswd = (origPasswd: string) => {
    setOrigPasswd(origPasswd);
    cleanErr();
  };

  const changePassword = (password: string) => {
    setPassword(password);
    cleanErr();
  };

  const changePasswordConfirm = (passwordConfirm: string) => {
    setPasswordConfirm(passwordConfirm);
    cleanErr();
  };

  const submit = () => {
    if (password !== passwordConfirm) {
      setErrMsg("新的密碼不相符合喔～");
      return;
    }

    doChangePasswdPage.changePasswd(
      changePasswdPageID,
      userID,
      origPasswd,
      password,
      passwordConfirm,
    );
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  return (
    <div className={styles.root} style={style}>
      <div className={"container"} style={style}>
        <Header title="我想換密碼" stateHeader={classHeader} />
        <div className="row">
          <div className="col">
            <span>我是 {userID}</span>
          </div>
        </div>
        <div className="row">
          <input
            className="form-control"
            type="password"
            placeholder="原本的密碼:"
            aria-label="OrigPasswd"
            value={origPasswd}
            onChange={(e) => changeOrigPasswd(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            className="form-control"
            type="password"
            placeholder="新的密碼:"
            aria-label="Password"
            value={password}
            onChange={(e) => changePassword(e.target.value)}
          />
        </div>

        <div className="row">
          <input
            className="form-control"
            type="password"
            placeholder="確認新的密碼:"
            aria-label="Password"
            value={passwordConfirm}
            onChange={(e) => changePasswordConfirm(e.target.value)}
          />
        </div>

        <div className="row">
          <div>
            <button type="button" className="btn btn-primary" onClick={submit}>
              我確定要改密碼～
            </button>
          </div>
          <div className="col">
            <span className={styles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

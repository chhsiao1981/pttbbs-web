import {
  genUUID,
  getDefaultID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import { useEffect, useState } from "react";
import * as DoHeader from "../reducers/header";
import * as DoLoginPage from "../reducers/loginPage";
import Empty from "./Empty";
import * as errors from "./errors";
import Header from "./Header";
import styles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoLoginPage = ThunkModuleToFunc<typeof DoLoginPage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};
export default (_props: Props) => {
  const [classLoginPage, doLoginPage] = useThunk<
    DoLoginPage.State,
    TDoLoginPage
  >(DoLoginPage);
  const [loginPageID, _setLoginPageID] = useState(genUUID);
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);
    doLoginPage.init(loginPageID);
  }, []);

  //get data
  const loginPage = getState(classLoginPage) || DoLoginPage.defaultState;
  const myID = getDefaultID(classLoginPage);
  const errmsg = loginPage.errmsg || "";

  const cleanErr = () => {
    setErrMsg("");
    doLoginPage.cleanErr(myID);
  };

  const changeUsername = (username: string) => {
    setUsername(username);
    cleanErr();
  };

  const changePassword = (password: string) => {
    setPassword(password);
    cleanErr();
  };

  // ---------- Handlers -------------

  const login = () => {
    doLoginPage.login(myID, username, password);
  };

  const register = () => {
    window.location.href = "/register";
  };

  const forgotPassword = () => {
    window.location.href = "/forgetPassword";
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  // -------- Component Instance ----------
  const headerTitle = `\\歡迎登入 ${config.BRAND}～/`;

  if (!myID) {
    return <Empty />;
  }
  return (
    <div className={"vh-100 " + styles.root}>
      <Header title={headerTitle} stateHeader={classHeader} />
      <div className={"container mt-5 "}>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Username:"
              aria-label="Username"
              value={username}
              onChange={(e) => changeUsername(e.target.value)}
            />
            <input
              className="form-control mb-3"
              type="password"
              placeholder="Password:"
              aria-label="Password"
              value={password}
              onChange={(e) => changePassword(e.target.value)}
            />
            <div className="d-flex justify-content-between">
              <div>
                <button
                  type="button"
                  className="btn btn-primary mr-3"
                  onClick={login}
                >
                  我要登入
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={register}
                >
                  我想註冊
                </button>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={forgotPassword}
              >
                我忘記密碼了 Orz
              </button>
            </div>
            <span className={styles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

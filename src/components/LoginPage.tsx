import {
  genUUID,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [loginPageID, _setLoginPageID] = useState(genUUID);
  const useLoginPage = useThunk<DoLoginPage.State, TDoLoginPage>(DoLoginPage);
  const [loginPage, doLoginPage] = mustGetStateByThunk(useLoginPage);
  const { errmsg } = loginPage;

  const [headerID, _setHeaderID] = useState(genUUID);
  const useHeader = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [_header, doHeader] = mustGetStateByThunk(useHeader);

  const [username, setUsername] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { t } = useTranslation();

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);
    doLoginPage.init(loginPageID);
  }, []);

  const cleanErr = () => {
    setErrMsg("");
    doLoginPage.cleanErr(loginPageID);
  };

  const changeUsername = (username: string) => {
    setUsername(username);
    cleanErr();
  };

  // ---------- Handlers -------------

  const login = () => {
    // doLoginPage.login(loginPageID, username);
  };

  const register = () => {
    window.location.href = "/register";
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  // -------- Component Instance ----------
  const title = `${t("login.titlePrefix")}${config.BRAND}${t("login.titlePostfix")}`;

  if (!loginPageID) {
    return <Empty />;
  }
  return (
    <div className={"vh-100 " + styles.root}>
      <Header title={title} />
      <div className={"container mt-5 "}>
        <div className="row">
          <div className="col-12 col-md-6 mx-auto">
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Email or Username:"
              aria-label="Username"
              value={username}
              onChange={(e) => changeUsername(e.target.value)}
            />
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={login}
              >
                {t("login.login")}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={register}
              >
                {t("login.register")}
              </button>
            </div>
            <span className={styles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

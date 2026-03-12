import {
  genUUID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";
import * as DoAttemptSetIDEmailPage from "../reducers/attemptSetIDEmailPage";
import * as DoHeader from "../reducers/header";
import Empty from "./Empty";
import * as errors from "./errors";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoAttemptSetIDEmailPage = ThunkModuleToFunc<
  typeof DoAttemptSetIDEmailPage
>;
type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};
export default (_props: Props) => {
  const [classAttemptSetIDEmailPage, doAttemptSetIDEmailPage] = useThunk<
    DoAttemptSetIDEmailPage.State,
    TDoAttemptSetIDEmailPage
  >(DoAttemptSetIDEmailPage);
  const [attemptSetIDEmailPageID, _setSttemptSetIDEmailPageID] =
    useState(genUUID);

  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID, _setHeaderID] = useState(genUUID);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");

  //init
  const { userid: paramsUserID } = useParams();
  const userid = paramsUserID || "";

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!userid) {
      return;
    }

    doHeader.init(headerID);

    doAttemptSetIDEmailPage.init(attemptSetIDEmailPageID, userid);
  }, [userid]);

  //get data
  const attemptSetIDEmailPage =
    getState(classAttemptSetIDEmailPage) ||
    DoAttemptSetIDEmailPage.defaultState;

  const userID = attemptSetIDEmailPage.userID;
  const errmsg = attemptSetIDEmailPage.errmsg || "";
  const isDone = attemptSetIDEmailPage.isDone;

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    if (!userid) {
      return;
    }
    if (!isDone) {
      return;
    }

    doAttemptSetIDEmailPage.sleepAndRedirect(attemptSetIDEmailPageID, userid);
  }, [isDone, userid]);

  //render
  const { height: innerHeight } = useWindowSize();
  const style = {
    height: innerHeight + "px",
  };

  const cleanErr = () => {
    setErrMsg("");
    doAttemptSetIDEmailPage.cleanErr(attemptSetIDEmailPageID);
  };

  const changePassword = (password: string) => {
    setPassword(password);
    cleanErr();
  };

  const changeEmail = (email: string) => {
    setEmail(email);
    cleanErr();
  };

  const submit = () => {
    if (!email) {
      setErrMsg("您是忘記您的 email 了？～");
      return;
    }
    if (!password) {
      setErrMsg("您是忘記您的密碼了？～");
      return;
    }
    doAttemptSetIDEmailPage.SetIDEmail(
      attemptSetIDEmailPageID,
      userID,
      password,
      email,
    );
    cleanErr();
  };

  const renderData = () => {
    if (!isDone) {
      return <Empty />;
    }

    return <span>已經成功送出確認信囉～請您到您設定的信箱確認～</span>;
  };

  const allErrMsg = errors.mergeErr(errMsg, errmsg);

  return (
    <div className={pageStyles.root} style={style}>
      <div className={"container"}>
        <Header title="我想換認證 Email" stateHeader={classHeader} />
        <div className="row">
          <div className="col">
            <span>我是 {userID}</span>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              type="text"
              placeholder="新的認證 Email:"
              aria-label="email"
              value={email}
              onChange={(e) => changeEmail(e.target.value)}
            />
          </div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col">
            <input
              className="form-control"
              type="password"
              placeholder="我的密碼:"
              aria-label="password"
              value={password}
              onChange={(e) => changePassword(e.target.value)}
            />
          </div>
          <div className="col"></div>
        </div>
        <div className="row">
          <div className="col">
            <button type="button" className="btn btn-primary" onClick={submit}>
              我確定要換認證 Email～
            </button>
          </div>
          <div className="col">{renderData()}</div>
          <div className="col">
            <span className={pageStyles.errMsg}>{allErrMsg}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

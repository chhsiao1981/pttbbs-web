import {
  genUUID,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { type SubmitEventHandler, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as DoHeader from "../reducers/header";
import * as DoRegisterPage from "../reducers/registerPage";
import Empty from "./Empty";
import * as errors from "./errors";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoRegisterPage = ThunkModuleToFunc<typeof DoRegisterPage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const useRegisterPage = useThunk<DoRegisterPage.State, TDoRegisterPage>(
    DoRegisterPage,
  );
  const [registerPageID, _setRegisterPageID] = useState(genUUID);
  const [registerPage, doRegisterPage] = mustGetStateByThunk(useRegisterPage);

  const [_classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(
    DoHeader,
  );
  const [headerID, _setHeaderID] = useState(genUUID);

  const [email, setEmail] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  // error message
  const [errEmail, setErrEmail] = useState("");

  const { t } = useTranslation();

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);
    doRegisterPage.init(registerPageID);
  }, []);

  //get data

  const cleanErr = () => {
    doRegisterPage.cleanMsg(registerPageID);
  };

  // ---------- Helper functions ---------

  // ---------- Input Field Handlers -------------
  const changeEmail = (text: string) => {
    setEmail(text);
    if (!text) {
      setErrEmail("");
      cleanErr();
      return;
    }

    if (
      text.indexOf("@") === -1 ||
      text[0] === "@" ||
      text[text.length - 1] === "@" ||
      text[0] === "." ||
      text[text.length - 1] === "."
    ) {
      setErrEmail(errors.ERR_EMAIL_WRONGFORMAT);
    } else {
      setErrEmail("");
      cleanErr();
    }
  };

  const onSubmit: SubmitEventHandler = (e) => {
    console.info("RegisterPage: onSubmit");

    // cleanErr();

    setIsSubmit(true);

    // doRegisterPage.attemptRegister(email);

    e.preventDefault();
    e.stopPropagation();
  };

  // -------- Component Instance ----------
  const headerTitle = t("register.title");

  if (!registerPageID) {
    return <Empty />;
  }
  const isDisabled = !!errEmail || !email;

  const classInfo = isSubmit ? "" : "hide";

  return (
    <div className={"vh-100 " + pageStyles.root}>
      <Header title={headerTitle} />
      <div className="container mt-4">
        <div className="col-12 col-md-6 mx-auto">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="emailField">{t("register.emailAddress")}:</label>
              <div className="input-group">
                <input
                  id="emailField"
                  className="form-control"
                  type="email"
                  placeholder="Email:"
                  aria-label="Email"
                  value={email}
                  onChange={(e) => changeEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="row">
              <button
                className="btn btn-primary mt-2"
                type="submit"
                disabled={isDisabled}
              >
                {t("register.registerAccount")}
              </button>
            </div>
            <div className="row mt-4">
              <div className="col">
                <span className={pageStyles.errMsg}>{errEmail}</span>
              </div>
            </div>
            <div className="row mt-4">
              <div className="col">
                <span className={classInfo}>{t("register.info")}</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

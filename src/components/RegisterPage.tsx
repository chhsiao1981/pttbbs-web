import {
  genUUID,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import {
  type CSSProperties,
  type SubmitEventHandler,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoRegisterPage from "../reducers/registerPage";
import * as errors from "./errors";
import Header from "./Header";
import pageStyles from "./Page.module.css";
import { validateEmail } from "./utils";

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
  const { isAttemptRegister, errmsg } = registerPage;

  const [_classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(
    DoHeader,
  );
  const [headerID, _setHeaderID] = useState(genUUID);

  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  // error message
  const [errEmail, setErrEmail] = useState("");

  const { t } = useTranslation();
  const { width: innerWidth } = useWindowSize(10, 0);

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

  const changeEmail = (text: string) => {
    setEmail(text);

    setErrEmail("");
    cleanErr();

    const isValid = validateEmail(text);
    setIsValidEmail(isValid);
  };

  const onSubmit: SubmitEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateEmail(email)) {
      setErrEmail(errors.ERR_EMAIL_WRONGFORMAT);
    }

    doRegisterPage.attemptRegister(registerPageID, email);
  };

  const headerTitle = t("register.title");

  const isDisabledInput = isAttemptRegister;
  const isDisabledButton = isAttemptRegister || !isValidEmail || !email;
  const classInfo = isAttemptRegister ? "" : "hide";

  const allErrMsg = errEmail || errmsg;

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  return (
    <div className={"vh-100 " + pageStyles.root} style={rootStyle}>
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
                  disabled={isDisabledInput}
                />
              </div>
            </div>
            <div className="row">
              <button
                className="btn btn-primary mt-2"
                type="submit"
                disabled={isDisabledButton}
              >
                {t("register.registerAccount")}
              </button>
            </div>
            <div className="row mt-4">
              <div className="col">
                <span className={pageStyles.errMsg}>{allErrMsg}</span>
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

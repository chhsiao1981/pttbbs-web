import type { ClassState } from "@chhsiao1981/use-thunk";
import config from "config";
import { GITHUB_LINK } from "../constants";
import type { State } from "../reducers/header";
import Empty from "./Empty";
import styles from "./Header.module.css";

type Props = {
  title: string;
  renderHeader?: any;
  stateHeader: ClassState<State>;
};

export default (props: Props) => {
  const {
    title: paramsTitle,
    renderHeader: paramsRenderHeader,
    // stateHeader,
  } = props;

  // const me = getState(stateHeader);
  // const meUserID = me ? me.user_id : "";
  // const userID = meUserID || "";

  // Links
  /*
  const renderUserHome = () => {
    let text = "hi~ " + userID;
    let url = "/user/" + userID;
    if (!userID || userID === config.PTT_GUEST) {
      text = "登入/註冊";
      url = "/login";
    }
    return (
      <a className={"pull-right " + styles["navbar-link"]} href={url}>
        {text}
      </a>
    );
  };
  */

  const renderHeader = () => {
    if (paramsRenderHeader) {
      return paramsRenderHeader();
    }

    const title = paramsTitle || "";
    if (typeof title === "function") {
      // @ts-expect-error because title is function
      return <div className={"col " + styles.title}>{title()}</div>;
    } else {
      return <div className={"col " + styles.title}>{title}</div>;
    }
  };

  const renderTerm = () => {
    if (!config.TERM_URL) {
      return <Empty />;
    }

    return (
      <a className={styles["navbar-link"]} href={config.TERM_URL}>
        Term
      </a>
    );
  };

  return (
    <nav className={"navbar navbar-dark " + styles.root}>
      <a
        className={
          styles["navbar-brand"] + " " + "navbar-brand " + styles["navbar-link"]
        }
        href={"/"}
      >
        {config.BRAND}
      </a>
      {renderTerm()}
      {renderHeader()}
      {/* renderUserHome() */}
      <a className={styles["navbar-link"]} href={GITHUB_LINK}>
        <i className={"ml-3 bi bi-github " + styles.logo}></i>
      </a>
    </nav>
  );
};

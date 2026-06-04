import {
  type ClassState,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { GITHUB_LINK } from "../constants";
import * as DoHeader from "../reducers/header";
import Empty from "./Empty";
import styles from "./Header.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

type Props = {
  title: string | (() => ReactNode);
  renderHeader?: any;
  stateHeader: ClassState<DoHeader.State>;
};

export default (props: Props) => {
  const { title: paramsTitle, renderHeader: propsRenderHeader } = props;

  const useHeader = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [header, doHeader, headerID] = mustGetStateByThunk(useHeader);
  const { username } = header;

  const { t } = useTranslation();

  // Links
  const renderUserHome = () => {
    const text = username ? `hi~ ${username}` : t("login/register");
    const url = username ? `/user/${username}` : "/login";

    return (
      <a className={"pull-right " + styles["navbar-link"]} href={url}>
        {text}
      </a>
    );
  };

  const renderHeader = () => {
    if (propsRenderHeader) {
      return propsRenderHeader();
    }

    const title = paramsTitle || "";
    if (typeof title === "function") {
      return <div className={`col ${styles.title}`}>{title()}</div>;
    } else {
      return <div className={`col ${styles.title}`}>{title}</div>;
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
      {renderUserHome()}
      <a className={styles["navbar-link"]} href={GITHUB_LINK}>
        <i className={"ml-3 bi bi-github " + styles.logo}></i>
      </a>
    </nav>
  );
};

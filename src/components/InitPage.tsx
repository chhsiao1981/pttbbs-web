import {
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { type CSSProperties, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

export default () => {
  const useHeader = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [header] = mustGetStateByThunk(useHeader);
  const { username } = header;
  const { width: innerWidth } = useWindowSize(10, 0);
  const { t } = useTranslation();

  const [realName, setRealName] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const rootStyle: CSSProperties = {
    width: innerWidth,
  };

  const onSubmit = () => {};
  const onChangeUsername = () => {};

  return (
    <div className={"vh-100 " + pageStyles.root} style={rootStyle}>
      <Header title={t("init.title")} />
      <div className="container mt-4">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              placeholder="Username:"
              aria-label="Username"
              value={username}
              onChange={onChangeUsername}
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder={`${t("init.realName")}:`}
              aria-label="realName"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              required
            />
            <input
              className="form-control"
              type="text"
              placeholder={`${t("init.birthDate")}:`}
              aria-label="birthdate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
            <div className="row">
              <button
                className="btn btn-primary mt-2"
                type="submit"
                // disabled={isDisabledButton}
              >
                {t("init.submit")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

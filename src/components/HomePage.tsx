import {
  genUUID,
  mustGetStateByThunk,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import { type CSSProperties, useEffect, useState } from "react";
import useWindowSize from "../hooks/useWindowSize";
import * as DoHeader from "../reducers/header";
import * as DoHomePage from "../reducers/homePage";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoHomePage = ThunkModuleToFunc<typeof DoHomePage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [homePageID] = useState(genUUID);
  const [_classHomePage, doHomePage] = useThunk<DoHomePage.State, TDoHomePage>(
    DoHomePage,
  );

  const useHeader = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [header, _doHeader, _headerID] = mustGetStateByThunk(useHeader);
  const { username } = header;

  const { width: innerWidth, height: innerHeight } = useWindowSize();

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHomePage.init(homePageID);
  }, []);

  useEffect(() => {
    if (!username) {
      return;
    }

    if (username === config.PTT_GUEST) {
      window.location.href = "/boards/popular";
    } else {
      window.location.href = "/user/" + username + "/favorites";
    }
  }, [username]);

  //get data

  const style: CSSProperties = {
    width: innerWidth,
    height: innerHeight,
  };

  return (
    <div className={pageStyles.root} style={style}>
      <Header title={""} />
    </div>
  );
};

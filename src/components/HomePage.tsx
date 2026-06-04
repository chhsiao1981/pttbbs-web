import {
  genUUID,
  getDefaultID,
  getState,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import config from "config";
import { type CSSProperties, useEffect } from "react";
import useWindowSize from "../hooks/useWindowSize";
import type { State as Header_s } from "../reducers/header";
import * as DoHeader from "../reducers/header";
import * as DoHomePage from "../reducers/homePage";
import Empty from "./Empty";
import Header from "./Header";
import pageStyles from "./Page.module.css";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;
type TDoHomePage = ThunkModuleToFunc<typeof DoHomePage>;

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  const [classHomePage, doHomePage] = useThunk<DoHomePage.State, TDoHomePage>(
    DoHomePage,
  );
  const [classHeader, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);

  const { width: innerWidth, height: innerHeight } = useWindowSize();

  //init
  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    const headerID = genUUID();
    doHeader.init(headerID);

    const homePageID = genUUID();
    doHomePage.init(homePageID);
  }, []);

  const header: Header_s = getState(classHeader) || DoHeader.defaultState;
  const userID = header.userID;

  useEffect(() => {
    if (!userID) {
      return;
    }

    if (userID === config.PTT_GUEST) {
      window.location.href = "/boards/popular";
    } else {
      window.location.href = "/user/" + userID + "/favorites";
    }
  }, [userID]);

  //get data
  const myID = getDefaultID(classHomePage);

  if (!myID) {
    return <Empty />;
  }

  const style: CSSProperties = {
    width: innerWidth,
    height: innerHeight,
  };

  return (
    <div className={pageStyles.root} style={style}>
      <Header title={""} stateHeader={classHeader} />
    </div>
  );
};

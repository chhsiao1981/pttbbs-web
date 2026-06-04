import {
  genUUID,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import InitPage from "../components/InitPage";
import * as DoHeader from "../reducers/header";

type TDoHeader = ThunkModuleToFunc<typeof DoHeader>;

export default () => {
  const [_, doHeader] = useThunk<DoHeader.State, TDoHeader>(DoHeader);
  const [headerID] = useState(genUUID);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffect
  useEffect(() => {
    doHeader.init(headerID);
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/init" element={<InitPage />} />
      </Routes>
    </Router>
  );
};

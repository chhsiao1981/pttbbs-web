import {
  genUUID,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../components/LoginPage";
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
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

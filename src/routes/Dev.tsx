import {
  genUUID,
  type ThunkModuleToFunc,
  useThunk,
} from "@chhsiao1981/use-thunk";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ArticlePage from "../components/ArticlePage";
import ArticlesPage from "../components/ArticlesPage";
import AttemptChangeEmailPage from "../components/AttemptChangeEmailPage";
import AttemptSetIDEmailPage from "../components/AttemptSetIDEmailPage";
import ChangeEmailPage from "../components/ChangeEmailPage";
import ChangePasswdPage from "../components/ChangePasswdPage";
import ClassBoardsPage from "../components/ClassBoardsPage";
import ErrorPage from "../components/ErrorPage";
import GeneralBoardsPage from "../components/GeneralBoardsPage";
import HomePage from "../components/HomePage";
import HotBoardsPage from "../components/HotBoardsPage";
import InitPage from "../components/InitPage";
import LoginPage from "../components/LoginPage";
import ManualsPage from "../components/ManualsPage";
import NewArticlePage from "../components/NewArticlePage";
import RegisterPage from "../components/RegisterPage";
import SetIDEmailPage from "../components/SetIDEmailPage";
import UserFavoritesPage from "../components/UserFavoritesPage";
import UserInfoPage from "../components/UserInfoPage";
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
        <Route path="/" element={<HomePage />} />
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/init" element={<InitPage />} />
        <Route path="/user/:userid" element={<UserInfoPage />} />
        <Route
          path="/user/:userid/resetpassword"
          element={<ChangePasswdPage />}
        />
        <Route
          path="/user/:userid/attemptchangeemail"
          element={<AttemptChangeEmailPage />}
        />
        <Route path="/user/:userid/changeemail" element={<ChangeEmailPage />} />
        <Route
          path="/user/:userid/attemptsetidemail"
          element={<AttemptSetIDEmailPage />}
        />
        <Route path="/user/:userid/setidemail" element={<SetIDEmailPage />} />
        <Route path="/user/:userid/favorites" element={<UserFavoritesPage />} />
        <Route path="/cls/:clsID" element={<ClassBoardsPage />} />
        <Route path="/boards" element={<GeneralBoardsPage />} />
        <Route path="/boards/popular" element={<HotBoardsPage />} />
        <Route path="/board/:bid/articles" element={<ArticlesPage />} />
        <Route path="/board/:bid/article/:aid" element={<ArticlePage />} />
        <Route path="/board/:bid/post" element={<NewArticlePage />} />
        <Route path="/board/:bid/manual" element={<ManualsPage />} />
        <Route path="/board/:bid/manual/:path/*" element={<ManualsPage />} />
      </Routes>
    </Router>
  );
};

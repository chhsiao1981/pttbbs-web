import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ArticlePage from "../components/ArticlePage";
import ArticlesPage from "../components/ArticlesPage";
import ClassBoardsPage from "../components/ClassBoardsPage";
import GeneralBoardsPage from "../components/GeneralBoardsPage";
import HomePage from "../components/HomePage";
import HotBoardsPage from "../components/HotBoardsPage";
import ManualsPage from "../components/ManualsPage";
import NewArticlePage from "../components/NewArticlePage";
import UserFavoritesPage from "../components/UserFavoritesPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cls/:clsID" element={<ClassBoardsPage />} />
        <Route path="/boards" element={<GeneralBoardsPage />} />
        <Route path="/boards/popular" element={<HotBoardsPage />} />
        <Route path="/board/:bid/articles" element={<ArticlesPage />} />
        <Route path="/user/:userid/favorites" element={<UserFavoritesPage />} />
        <Route path="/board/:bid/article/:aid" element={<ArticlePage />} />
        <Route path="/board/:bid/post" element={<NewArticlePage />} />
        <Route path="/board/:bid/manual" element={<ManualsPage />} />
        <Route path="/board/:bid/manual/:path/*" element={<ManualsPage />} />
      </Routes>
    </Router>
  );
};

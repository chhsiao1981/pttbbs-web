import "./vendors";
import "./index.css";
import { registerThunk, ThunkContext } from "@chhsiao1981/use-thunk";
import config from "config";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as DoArticlePage from "./reducers/articlePage";
import * as DoArticlesPage from "./reducers/articlesPage";
import * as DoAttemptChangeEmailPage from "./reducers/attemptChangeEmailPage";
import * as DoAttemptSetIDEmailPage from "./reducers/attemptSetIDEmailPage";
import * as DoChangeEmailPage from "./reducers/changeEmailPage";
import * as DoChangePasswdPage from "./reducers/changePasswdPage";
import * as DoClassBoardsPage from "./reducers/classBoardsPage";
import * as DoGeneralBoardsPage from "./reducers/generalBoardsPage";
import * as DoHeader from "./reducers/header";
import * as DoHomePage from "./reducers/homePage";
import * as DoHotBoardsPage from "./reducers/hotBoardsPage";
import * as DoLoginPage from "./reducers/loginPage";
import * as DoManualPage from "./reducers/manualPage";
import * as DoManualsPage from "./reducers/manualsPage";
import * as DoNewArticlePage from "./reducers/newArticlePage";
import * as DoRegisterPage from "./reducers/registerPage";
import * as DoSetIDEmailPage from "./reducers/setIDEmailPage";
import * as DoUserFavoritesPage from "./reducers/userFavoritesPage";
import * as DoUserInfoPage from "./reducers/userInfoPage";
import reportWebVitals from "./reportWebVitals";
import Routes from "./routes/ChangePasswd";
import "./i18n";

// @ts-expect-error registerThunk
registerThunk(DoArticlePage);
// @ts-expect-error registerThunk
registerThunk(DoArticlesPage);
// @ts-expect-error registerThunk
registerThunk(DoAttemptChangeEmailPage);
// @ts-expect-error registerThunk
registerThunk(DoAttemptSetIDEmailPage);
// @ts-expect-error registerThunk
registerThunk(DoChangeEmailPage);
// @ts-expect-error registerThunk
registerThunk(DoChangePasswdPage);
// @ts-expect-error registerThunk
registerThunk(DoClassBoardsPage);
// @ts-expect-error registerThunk
registerThunk(DoGeneralBoardsPage);
// @ts-expect-error registerThunk
registerThunk(DoHeader);
// @ts-expect-error registerThunk
registerThunk(DoHomePage);
// @ts-expect-error registerThunk
registerThunk(DoHotBoardsPage);
// @ts-expect-error registerThunk
registerThunk(DoLoginPage);
// @ts-expect-error registerThunk
registerThunk(DoManualPage);
// @ts-expect-error registerThunk
registerThunk(DoManualsPage);
// @ts-expect-error registerThunk
registerThunk(DoNewArticlePage);
// @ts-expect-error registerThunk
registerThunk(DoRegisterPage);
// @ts-expect-error registerThunk
registerThunk(DoSetIDEmailPage);
// @ts-expect-error registerThunk
registerThunk(DoUserFavoritesPage);
// @ts-expect-error registerThunk
registerThunk(DoUserInfoPage);

//title
document.getElementsByTagName("title")[0].innerHTML = config.BRAND;

//react
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThunkContext>
      <Routes />
    </ThunkContext>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import Routes from "./routes/ChangeEmail";
import "./vendors";
import "./index.css";
import { ThunkContext } from "@chhsiao1981/use-thunk";
import config from "config";

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

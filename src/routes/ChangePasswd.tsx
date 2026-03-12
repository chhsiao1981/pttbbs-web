import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChangePasswdPage from "../components/ChangePasswdPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/user/:userid/resetpassword"
          element={<ChangePasswdPage />}
        />
      </Routes>
    </Router>
  );
};

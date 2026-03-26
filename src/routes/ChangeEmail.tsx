import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ChangeEmailPage from "../components/ChangeEmailPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userid/changeemail" element={<ChangeEmailPage />} />
      </Routes>
    </Router>
  );
};

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import UserInfoPage from "../components/UserInfoPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userid" element={<UserInfoPage />} />
      </Routes>
    </Router>
  );
};

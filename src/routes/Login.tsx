import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import LoginPage from "../components/LoginPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

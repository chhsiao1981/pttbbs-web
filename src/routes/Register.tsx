import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import RegisterPage from "../components/RegisterPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import HomePage from "../components/HomePage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

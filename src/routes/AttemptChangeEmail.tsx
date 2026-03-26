import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AttemptChangeEmailPage from "../components/AttemptChangeEmailPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/user/:userid/attemptchangeemail"
          element={<AttemptChangeEmailPage />}
        />
      </Routes>
    </Router>
  );
};

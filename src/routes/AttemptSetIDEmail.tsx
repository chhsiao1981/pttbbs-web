import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AttemptSetIDEmailPage from "../components/AttemptSetIDEmailPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route
          path="/user/:userid/attemptsetidemail"
          element={<AttemptSetIDEmailPage />}
        />
      </Routes>
    </Router>
  );
};

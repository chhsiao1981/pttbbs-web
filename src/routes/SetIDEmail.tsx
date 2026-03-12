import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SetIDEmailPage from "../components/SetIDEmailPage";

// biome-ignore lint/complexity/noBannedTypes: props
type Props = {};

export default (_props: Props) => {
  return (
    <Router>
      <Routes>
        <Route path="/user/:userid/setidemail" element={<SetIDEmailPage />} />
      </Routes>
    </Router>
  );
};

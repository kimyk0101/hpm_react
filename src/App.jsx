import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHome from "../src/pages/mainPage";
import LoginPage from "../src/pages/loginPage";
import JoinPage from "../src/pages/joinPage";
// import Board from "../src/components/Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
      </Routes>
    </Router>
  );
}

export default App;

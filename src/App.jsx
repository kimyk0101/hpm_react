import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Board from "../src/components/Board";
import Login from "../src/components/Login";
import MainHome from "../src/components/MainHome";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

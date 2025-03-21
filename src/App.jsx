import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "../src/components/Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Board />} />
      </Routes>
    </Router>
  );
}

export default App;

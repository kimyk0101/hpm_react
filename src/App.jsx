import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHome from "../src/pages/mainPage";
import LoginPage from "../src/pages/loginPage";
import JoinPage from "../src/pages/joinPage";
import Mypage from "./pages/MyPage/MyPage";
import EditProfile from "./pages/Mypage/EditProfile/EditProfile";
import CommunityPage from "../src/pages/communityPage";
import CommunityDetailPage from "../src/pages/communityDetailPage";
import CommunityPostCreatePage from "../src/pages/communityPostCreatePage";
import MountainReviewPage from "../src/pages/mountainReviewPage";
import RestaurantReviewPage from "../src/pages/restaurantReviewPage";
import "./css/reset.css";
// import Board from "../src/components/Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/edit" element={<EditProfile />} />
        <Route path="/communities" element={<CommunityPage />} />
        <Route path="/communities/:id" element={<CommunityDetailPage />} />
        <Route path="/create-community-post" element={<CommunityPostCreatePage />} />
        <Route path="/mountainReviews" component={MountainReviewPage} />
        <Route path="/restaurantReviews" component={RestaurantReviewPage} />
      </Routes>
    </Router>
  );
}

export default App;

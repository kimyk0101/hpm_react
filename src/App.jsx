import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHome from "../src/pages/mainPage";
import LoginPage from "../src/pages/loginPage";
import JoinPage from "../src/pages/joinPage";
import Mypage from "./pages/MyPage/MyPage";
import EditProfile from "./pages/Mypage/EditProfile/EditProfile";
import CommunityList from "./pages/community/community";
import CreateCommunityPost from "./pages/community/createCommunityPost";
import CommunityDetail from "./pages/community/communityDetail";
import MountainReviewList from "./pages/mountainReview/mountainReview";
import CreateMountainReview from "./pages/mountainReview/createMountainReview";
import MountainReviewDetail from "./pages/mountainReview/mountainReviewDetail";
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

        {/* 자유 게시판 */}
        <Route path="/communities" element={<CommunityList />} />  {/* 자유 게시판 목록 */}
        <Route path="/communities/new" element={<CreateCommunityPost />} />  {/* 자유 게시판 작성 */}
        <Route path="/communities/:id" element={<CommunityDetail />} />  {/* 자유 게시판 상세 */}

        {/* 등산 후기 */}
        <Route path="/mountain-reviews" element={<MountainReviewList />} />  {/* 등산 후기 목록 */}
        <Route path="/mountain-reviews/new" element={<CreateMountainReview />} />  {/* 등산 후기 작성 */}
        <Route path="/mountain-reviews/:id" element={<MountainReviewDetail />} />  {/* 등산 후기 상세 */}

        {/* 맛집 후기 */}
        {/* <Route path="/restaurant-reviews" element={<RestaurantReviewList />} />   */}
        {/* 맛집 후기 목록 */}
        {/* <Route path="/restaurant-reviews/new" element={<CreateRestaurantReview />} />   */}
        {/* 맛집 후기 작성 */}
        {/* <Route path="/restaurant-reviews/:id" element={<RestaurantReviewDetail />} />   */}
        {/* 맛집 후기 상세 */}
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainHome from "./pages/mainPage";
import LoginPage from "../src/pages/loginPage";
import JoinPage from "../src/pages/joinPage";
import LoginJoin from "../src/pages/login-joinPage";
import Mypage from "./pages/MyPage/MyPage";
import EditProfile from "./pages/Mypage/EditProfile/EditProfile";
import MyPostsPage from "./pages/Mypage/history/MyPostsPage";
import SearchPage from "./pages/Search/SearchPage";
import CommunityList from "./pages/community/community";
import CreateCommunityPost from "./pages/community/createCommunityPost";
import CommunityDetail from "./pages/community/communityDetail";
import MountainReviewList from "./pages/mountainReview/mountainReview";
import CreateMountainReview from "./pages/mountainReview/createMountainReview";
import MountainReviewDetail from "./pages/mountainReview/mountainReviewDetail";
import RestaurantReviewList from "./pages/restaurantReview/restaurantReview";
import CreateRestaurantReview from "./pages/restaurantReview/createRestaurantReview";
import RestaurantReviewDetail from "./pages/restaurantReview/restaurantReviewDetail";
import AllClubs from "./pages/club/allClubs";
import ClubComments from "./pages/club/clubComments";
import ChatSendbird from "./pages/club/chatSendbird";

import MountainMap from "./pages/mountain/list_map";
import MountainList from "./pages/mountain/mountainList";
// import MountainDetail from "./pages/mountain/mountainDetail";
import "./css/reset.css";
// import Board from "../src/components/Board";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-join" element={<LoginJoin />} />
        <Route path="/join" element={<JoinPage />} />
        {/* 마이페이지 */}
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/mypostspage" element={<MyPostsPage />} />
        <Route path="/mypage/edit" element={<EditProfile />} />
        <Route path="/search" element={<SearchPage />} />
        {/* 자유 게시판 */}
        <Route path="/communities" element={<CommunityList />} />{" "}
        {/* 자유 게시판 목록 */}
        <Route path="/communities/new" element={<CreateCommunityPost />} />{" "}
        {/* 자유 게시판 작성 */}
        <Route path="/communities/:id" element={<CommunityDetail />} />{" "}
        {/* 자유 게시판 상세 */}
        {/* 등산 후기 */}
        <Route path="/mountain-reviews" element={<MountainReviewList />} />{" "}
        {/* 등산 후기 목록 */}
        <Route
          path="/mountain-reviews/new"
          element={<CreateMountainReview />}
        />{" "}
        {/* 등산 후기 작성 */}
        <Route
          path="/mountain-reviews/:id"
          element={<MountainReviewDetail />}
        />{" "}
        {/* 등산 후기 상세 */}
        {/* 맛집 후기 */}
        <Route
          path="/restaurant-reviews"
          element={<RestaurantReviewList />}
        />{" "}
        {/* 맛집 후기 목록 */}
        <Route
          path="/restaurant-reviews/new"
          element={<CreateRestaurantReview />}
        />{" "}
        {/* 맛집 후기 작성 */}
        <Route
          path="/restaurant-reviews/:id"
          element={<RestaurantReviewDetail />}
        />{" "}
        {/* 맛집 후기 상세 */}
        <Route
          path="/restaurant-reviews"
          element={<RestaurantReviewList />}
        />{" "}
        {/* 맛집 후기 목록 */}
        <Route
          path="/restaurant-reviews/new"
          element={<CreateRestaurantReview />}
        />{" "}
        {/* 맛집 후기 작성 */}
        <Route
          path="/restaurant-reviews/:id"
          element={<RestaurantReviewDetail />}
        />{" "}
        {/* 맛집 후기 상세 */}
        {/* 모임 */}
        <Route path="/clubs" element={<AllClubs />} /> {/* 산 모임들 목록 */}
        <Route path="/clubs/:id" element={<ClubComments />} />{" "}
        {/* 각각의 산 모임 페이지 */}


        <Route path="/chatSendbird/:id" element={<ChatSendbird />} />{" "}
        {/* 샌드버드 채팅방 이동 페이지 */}


        {/* 산 지도  */}
        <Route path="/mountain/list_map" element={<MountainMap />} />
        {/* 산 목록 */}
        <Route path="/mountain/list" element={<MountainList />} />
        {/* 산 단건 목록 */}
        {/* <Route path="/mountain/:id" element={<MountainDetail />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

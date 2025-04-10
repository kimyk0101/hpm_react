import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdArrowBack, MdArrowUpward } from "react-icons/md";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../components/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/DefaultLayout.css";
import MountainReviewCard from "../mountainReview/mountainReviewCard";
import "../../css/MountainReview.css";

const MountainReviewList = () => {
  const API_URL = "http://localhost:8088/api/mountain-reviews";

  const location = useLocation(); // 라우터 location 정보 가져오기
  const [searchQuery, setSearchQuery] = useState(
    location.state?.mountainName || "" // 초기값에 산 이름 자동 설정
  );

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  // const mountainName = location.state?.mountainName || "";

  // 로그인 상태 확인
  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8088/api/users/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
        console.log("로그인 유저 정보:", data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("📥 게시글 데이터:", data);

      const postData = data.map((mReview) => ({
        id: mReview.id,
        name: mReview.name,
        nickname: mReview.nickname,
        location: mReview.location,
        courseName: mReview.course_name,
        difficultyLevel: mReview.difficulty_level,
        content: mReview.content,
        updateDate: mReview.update_date,
        usersId: mReview.users_id,
        mountainsId: mReview.mountains_id,
        mountainCoursesId: mReview.mountain_courses_id,
        likes: mReview.likes,
        commentCount: mReview.comment_count,
      }));

      setPosts(postData);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCommentChange = () => {
    fetchPosts(); // 댓글 변경 시 전체 게시글 다시 불러오기
  };

  // 작성하기 버튼 클릭 시
  const goToPostCreate = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다!");
      navigate("/login");
      return;
    }
    navigate("/mountain-reviews/new");
  };

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 2000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 초기값 설정을 위한 주석처리 ( 확인 필요 )
  // const [searchQuery, setSearchQuery] = useState(""); // ← 검색어 상태 추가

  // 검색어로 필터링된 게시글
  const filteredPosts = posts.filter((post) =>
    post.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>

      <DefaultLayout>
        <div className="mReview-feed-page">
          <button onClick={() => navigate("/")} className="mReview-back-button">
            <MdArrowBack
              size={42}
              className="mReview-back-button-default-icon"
            />
            <MdArrowBack size={42} className="mReview-back-button-hover-icon" />
          </button>

          <button
            onClick={goToPostCreate}
            className="create-mReview-post-button-fixed"
            data-text="작성하기"
          >
            <span>작성하기</span>
          </button>

          {/* 검색창 */}
          <div className="mReview-search-container">
            <input
              type="text"
              placeholder="산 이름으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mReview-search-input"
            />
          </div>

          {/* 게시글 리스트 */}
          <div className="mReview-post-list">
            {filteredPosts.map((post) => (
              // {posts.map((post) => (
              <MountainReviewCard
                key={post.id}
                post={post}
                currentUser={user}
                onCommentChange={handleCommentChange}
              />
            ))}
          </div>

          {/* 상단 이동 버튼 */}
          {showScrollTop && (
            <button
              className="mReview-scroll-top-button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <MdArrowUpward />
            </button>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default MountainReviewList;

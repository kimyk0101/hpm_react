import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineBackspace } from "react-icons/md"; // 뒤로가기

const CommunityPage = () => {
  const API_URL = "http://localhost:8088/api/communities"; // API URL

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부

   // 로그인 상태 확인 함수
   const checkLoginStatus = async () => {
    try {
      const response = await fetch(
        "http://localhost:8088/api/users/session",
        {
          method: "GET",
          credentials: "include", // 쿠키를 포함하여 요청
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data); // 로그인된 사용자 정보 저장
        console.log(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, []);

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const postData = Object.values(data).map((community) => ({
        id: community.id,
        nickname: community.nickname,
        title: community.title,
        content: community.content,
        updateDate: community.update_date,
      }));

      setPosts(postData); // 상태 업데이트
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  const navigate = useNavigate();

  //  상세 페이지로 이동
  const goToDetail = (postId) => {
    navigate(`/communities/${postId}`);
  };

  //  뒤로가기 (메인 페이지로 이동)
  const onBack = () => {
    navigate("/");
  };

  // 게시글 작성 페이지로 이동
  const goToPostCreate = () => {
    navigate("/create-community-post");
  };

  return (
    <div>
      <h2>자유게시판</h2>
      <div className="communityPage">
        {/* 뒤로가기 버튼을 상단에 위치시킴 */}
        <button onClick={onBack} className="communityPage-back-button">
          <MdOutlineBackspace />
        </button>

        {/* 게시글 목록 표시 */}
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <div
                className="product-card"
                onClick={() => goToDetail(post.id)} // post.id를 전달
                style={{ cursor: "pointer" }}
              >
                <h3>{post.title}</h3>
                <p>{post.content}</p>
                <p>작성자: {post.nickname}</p>
                <p>작성일: {new Date(post.updateDate).toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* 게시글 등록 */}
        <button onClick={goToPostCreate} className="communityPage-create-post">
          작성하기
        </button>
      </div>
    </div>
  );
};

export default CommunityPage;

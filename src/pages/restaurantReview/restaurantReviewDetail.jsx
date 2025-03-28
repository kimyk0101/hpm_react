import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MdOutlineBackspace } from "react-icons/md"; // 뒤로가기
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/DefaultLayout.css";

function RestaurantReviewDetail() {
  const { id } = useParams();
  const rReviewId = parseInt(id, 10); // String -> Long 타입으로 변환
  const API_URL = `http://localhost:8088/api/restaurant-reviews/${rReviewId}`;
  const [post, setPost] = useState(null);
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [editPost, setEditPost] = useState(null); // ✨ 수정할 게시글 상태 추가

  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8088/api/users/session", {
        method: "GET",
        credentials: "include", // 쿠키를 포함하여 요청
      });

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

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(API_URL); // API 요청
      const data = await response.json(); // 응답 데이터 처리

      // 서버 응답에서 usersId 필드 확인 후 클라이언트에서 처리
      console.log(data); // 데이터 확인

      const postData = {
        id: data.id,
        name: data.name,
        nickname: data.nickname,
        location: data.location,
        rate: data.rate,
        title: data.title,
        content: data.content,
        updateDate: new Date(data.update_date),
        usersId: data.users_id,
        // mountainsId: data.mountains_id,
      };
      console.log(postData);

      setPost(postData); // 상태 업데이트
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPostDetail();
  }, [rReviewId]);

  // 게시글 수정
  const handleEditPost = async (e) => {
    e.preventDefault();

    const updatedPost = {
      name: editPost.name,
      location: editPost.location,
      rate: editPost.rate,
      title: editPost.title,
      content: editPost.content,
    };

    try {
      await fetch(API_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
      // 수정 후 게시글 목록 갱신
      fetchPostDetail();
      setEditPost(null); // 수정 완료 후 수정 폼 초기화
    } catch (error) {
      console.error("게시글 수정 실패:", error);
    }
  };

  // 게시글 수정 폼 열기
  const handleEditClick = (post) => {
    setEditPost(post);
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usersId: user.id }), // 로그인한 사용자의 usersId를 전달
      });

      // response.ok로 삭제 성공 여부 확인
      if (response.ok) {
        alert("게시글 삭제 성공");
        // 삭제 후 목록 갱신 (리스트 페이지로 이동)
        navigate("/restaurant-reviews");
      } else {
        // 실패 시 에러 출력
        console.error("게시글 삭제 실패", await response.json());
      }
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
    }
  };

  // 뒤로가기 버튼
  const onBack = () => {
    navigate("/restaurant-reviews"); // 리스트 페이지로 이동
  };

  return (
    <div>
      <DefaultLayout
        headerProps={{
          title: "하이펜타",
          showLogo: true,
          showIcons: { search: true },
        }}
      >
        <h2>게시글 상세보기</h2>
        <div className="restaurantReview-detail">
          {/* 뒤로가기 버튼 */}
          <button onClick={onBack} className="rReview-back-button">
            <MdOutlineBackspace />
          </button>
          {post ? (
            <div>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <p>작성자: {post.nickname}</p>
              <p>작성일: {post.updateDate.toLocaleString()}</p>
            </div>
          ) : (
            <p>게시글을 불러오는 중...</p>
          )}
          {/* 게시글 수정 폼 */}
          {editPost && (
            <div>
              <h3>게시글 수정</h3>
              <form onSubmit={handleEditPost}>
                <input
                  type="text"
                  value={editPost.title}
                  onChange={(e) =>
                    setEditPost({ ...editPost, title: e.target.value })
                  }
                  placeholder="제목"
                  required
                />
                <input
                  type="text"
                  value={editPost.name}
                  onChange={(e) =>
                    setEditPost({ ...editPost, name: e.target.value })
                  }
                  placeholder="맛집 이름"
                />
                <textarea
                  value={editPost.location}
                  onChange={(e) =>
                    setEditPost({ ...editPost, location: e.target.value })
                  }
                  placeholder="맛집 위치"
                />
                <input
                  type="text"
                  value={editPost.rate}
                  onChange={(e) =>
                    setEditPost({ ...editPost, rate: e.target.value })
                  }
                  placeholder="별점"
                />
                {/* TODO: 별점 산 아이콘으로 변경 */}
                <textarea
                  value={editPost.content}
                  onChange={(e) =>
                    setEditPost({ ...editPost, content: e.target.value })
                  }
                  placeholder="내용"
                  required
                />
                <button type="submit">수정 완료</button>
                <button type="button" onClick={() => setEditPost(null)}>
                  취소
                </button>
              </form>
            </div>
          )}
          {/* 로그인된 사용자와 게시글 작성자가 일치할 경우에만 삭제 버튼 표시 */}
          {/* {isLoggedIn && user.id === post?.usersId && (
            <button onClick={handleDeletePost}>삭제</button>
          )} */}

          {/* 로그인된 사용자와 게시글 작성자가 일치할 경우에만 수정 버튼 표시 */}
          {/* {isLoggedIn && user.id === post?.usersId && (
            <button onClick={handleEditClick}
            >수정</button>
          )} */}
          {!post || post.usersId === undefined ? (
            <p>게시글 정보를 불러오는 중...</p>
          ) : (
            <>
              {console.log(
                "🔍 조건 체크: isLoggedIn:",
                isLoggedIn,
                "| user.id:",
                user.id,
                "| post.usersId:",
                post?.usersId
              )}
              {isLoggedIn && user.id === post?.usersId ? (
                <>
                  {console.log("🔥 버튼 렌더링됨!")}
                  <button onClick={handleDeletePost}>삭제</button>
                  <button onClick={() => handleEditClick(post)}>수정</button>
                </>
              ) : (
                console.log("🚨 조건 불충족! 버튼 숨김")
              )}
            </>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
}

export default RestaurantReviewDetail;

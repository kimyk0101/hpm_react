import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/DefaultLayout.css";

const CreateMountainReview = () => {
  const API_URL = "http://localhost:8088/api/mountain-reviews"; // API URL
  const navigate = useNavigate();
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부

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

  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 16).replace("T", " ");
  };

  const [newPost, setNewPost] = useState({
    name: "",
    location: "",
    course: "",
    level: "",
    title: "",
    content: "",
    updateDate: formatDate(new Date()),
  });

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다!");
      return;
    }

    const postData = {
      id: newPost.id || null,
      name: newPost.name,
      location: newPost.location,
      course: newPost.course,
      level: newPost.level,
      title: newPost.title,
      content: newPost.content,
      update_date: formatDate(newPost.updateDate),
      users_id: parseInt(user.id, 10), // String → Number 변환
      mountains_id: 1,
    };

    console.log("📌 서버로 전송할 데이터:", JSON.stringify(postData, null, 2)); // JSON 데이터 확인

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`❌ 서버 응답 오류: ${errorText}`);
      }

      // ✅ 응답이 비어있는 경우를 대비
      const text = await response.text();
      const data = text ? JSON.parse(text) : {}; // 빈 응답이면 빈 객체로 처리

      console.log("✅ 게시글 작성 성공:", data);
      alert("게시물이 성공적으로 등록되었습니다!");
      navigate("/mountain-reviews");
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
      alert("게시물 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/mountain-reviews"); // 취소 시 리스트 페이지로 이동
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
        <h3>새 게시글 작성</h3>
        {!isLoggedIn && (
          <div>
            <p>
              로그인한 사용자만 게시물을 작성할 수 있습니다. 로그인 해주세요.
            </p>
          </div>
        )}
        <form onSubmit={handlePostSubmit}>
          <input
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="제목"
            required
          />
          <input
            type="text"
            value={newPost.name}
            onChange={(e) => setNewPost({ ...newPost, name: e.target.value })}
            placeholder="산 이름"
          />
          <textarea
            value={newPost.location}
            onChange={(e) =>
              setNewPost({ ...newPost, location: e.target.value })
            }
            placeholder="산 위치"
          />
          <input
            type="text"
            value={newPost.course}
            onChange={(e) => setNewPost({ ...newPost, course: e.target.value })}
            placeholder="등산 코스"
          />
          <input
            type="text"
            value={newPost.level}
            onChange={(e) => setNewPost({ ...newPost, level: e.target.value })}
            placeholder="등산 난이도"
          />
          <textarea
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            placeholder="내용"
            required
          />
          <button type="submit" disabled={!isLoggedIn}>
            게시글 등록
          </button>
          <button type="button" onClick={handleCancel}>
            취소
          </button>
        </form>
      </DefaultLayout>
    </div>
  );
};

export default CreateMountainReview;

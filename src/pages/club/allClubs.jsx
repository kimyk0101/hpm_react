import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/AllClubs.css";

const AllClubs = () => {
  const API_URL = "http://localhost:8088/api/clubs";
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchClubs = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setClubs(data);
    } catch (error) {
      console.error("클럽 목록을 불러오는 중 오류 발생:", error);
      setError("클럽 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8088/api/users/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    fetchClubs();
    checkLoginStatus();
  }, []);

  const handleImageClick = (clubId) => { // clubId 매개변수 추가
    if (!isLoggedIn) {
      if (window.confirm("로그인한 사용자만 모임에 참여할 수 있습니다. 로그인 하시겠습니까?")) {
        navigate("/login");
      }
    } else {
      navigate(`/clubs/${clubId}`); // clubs/:id로 이동
    }
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
        <div className="clubsPage">
          <button onClick={() => navigate("/")} className="clubs-back-button">
            뒤로 가기
          </button>
          <br />
          <br />

          {error && <p style={{ color: "red" }}>{error}</p>}

          {clubs.length > 0 ? (
            <div className="club-cards-container">
              {clubs.map((club) => (
                <div key={club.id} className="club-card">
                  <h3>{club.name}</h3>
                  <img
                    src={`${import.meta.env.BASE_URL}clubs-images/${club.id}.jpg`}
                    alt={club.name}
                    onClick={() => handleImageClick(club.id)} // clubId 전달
                    style={{ cursor: "pointer" }}
                  />
                  <p className="club-title">{club.title}</p>
                  <p>{club.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>클럽 목록을 불러오는 중이거나, 클럽이 없습니다.</p>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default AllClubs;
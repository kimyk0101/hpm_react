import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";
import "../css/LoginPage.css";

const API_URL = "http://localhost:8088/api/users/login";

const Login = () => {
  const [loginData, setLoginData] = useState({
    userId: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth();

  //  로그인
  const handleLogin = async (e) => {
    e.preventDefault();

    //  // 로그인 데이터를 서버에 전송할 형식으로 변환
     const { userId, ...formDataToSend } = loginData;
     const formDataToSendWithUserId = { ...formDataToSend, user_id: userId }; // userId를 user_id로 변환
 

    try {
      const response = await fetch(API_URL, {
        //  사용자 로그인 정보를 JSON 형식으로 전송
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //  서버로 요청을 보낼 때 세션 쿠키 자동 포함
        body: JSON.stringify(formDataToSendWithUserId), // 변환된 데이터를 서버로 전송
      });

      // 응답이 JSON인지 확인
    if (!response.ok) {
      const errorText = await response.text();  // 응답 본문을 텍스트로 받음
      setErrorMsg("서버 오류: " + errorText);
      return;
    }

    const data = await response.json();
    setIsLoggedIn(true);
    setUser(data);
    navigate("/");
  } catch (error) {
    console.error("로그인 에러:", error);
    setErrorMsg("서버 오류 또는 네트워크 에러");
  }
};

  return (
    <DefaultLayout
      headerProps={{
        showBack: true,
        title: "로그인",
        showIcons: { search: true },
      }}
    >
      <div className="login-container">
        <h2 className="login-title">로그인</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="아이디"
            value={loginData.userId}
            onChange={(e) =>
              setLoginData({ ...loginData, userId: e.target.value })
            }
          />
          <input
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          {errorMsg && <p className="login-error">{errorMsg}</p>}
          <button className="login-button" type="submit">
            로그인
          </button>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";
import "../css/LoginPage.css";

const API_URL = "http://localhost:8088/api/users/login"; // Spring Boot 로그인 엔드포인트

const Login = () => {
  const [loginData, setLoginData] = useState({
    user_id: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth();

  //  로그인
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        //  사용자 로그인 정보를 JSON 형식으로 전송
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //  서버로 요청을 보낼 때 세션 쿠키 자동 포함
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.message || "로그인 실패");
        return;
      }

      const data = await response.json();
      setIsLoggedIn(true);
      console.log("data", data);
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
            value={loginData.user_id}
            onChange={(e) =>
              setLoginData({ ...loginData, user_id: e.target.value })
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

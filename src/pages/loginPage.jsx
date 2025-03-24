import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/loginPage.css";
// import { MdOutlineBackspace } from "react-icons/md"; // 뒤로가기

const LoginPage = () => {
  const API_USER_URL = "http://localhost:8088/api/users"; 

  const [loginData, setLoginData] = useState({
    user_id: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

    // 뒤로가기 버튼
    const onBack = () => {
      navigate("/"); 
    };

  //  로그인
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_USER_URL + `/login`, {
        //  사용자 로그인 정보를 JSON 형식으로 전송
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", //  서버로 요청을 보낼 때 세션 쿠키 자동 포함
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      console.log("data", data);

      navigate("/");
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMsg(errorData.message || "로그인 실패");
        return;
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setErrorMsg("서버 오류 또는 네트워크 에러");
    }
  };

  return (
    <div className="login-container">
      <button onClick={onBack} className="login-back-button">
        뒤로가기
      </button>
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
  );
};

export default LoginPage;

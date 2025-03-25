import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const AuthButtons = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, setUser, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8088/api/users/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        navigate("/"); // 홈으로 이동
      } else {
        console.error("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 에러", error);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="auth-buttons">
      {isLoggedIn ? (
        <>
          <button onClick={handleLogout}>로그아웃</button>
          <button onClick={() => navigate("/mypage")}>마이페이지</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>로그인</button>
          <button onClick={() => navigate("/signup")}>회원가입</button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;

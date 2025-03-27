import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const MypageHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="mypage-header">
      <h2>{user?.nickname}</h2>
      <div className="header-actions">
        <button onClick={() => navigate("/mypage/edit")}>정보 수정</button>
        <button onClick={() => navigate("/mypage/groups")}>모임 목록</button>
      </div>
    </header>
  );
};

export default MypageHeader;

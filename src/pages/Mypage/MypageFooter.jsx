import { useNavigate } from "react-router-dom";

const MypageFooter = () => {
  const navigate = useNavigate();

  const handleWithdraw = () => {
    navigate("/withdraw"); // 탈퇴 페이지로 이동
  };

  return (
    <footer className="mypage-footer">
      <div>
        <h4>문의/안내</h4>
        <ul>
          <li onClick={() => navigate("/notice")}>공지사항</li>
          <li onClick={() => navigate("/inquiry")}>문의하기</li>
        </ul>
      </div>

      <div>
        <h4>서비스 관리</h4>
        <ul>
          <li onClick={() => navigate("/terms/privacy")}>개인정보 이용약관</li>
          <li onClick={() => navigate("/terms/location")}>
            위치기반서비스 이용약관
          </li>
          <li onClick={handleWithdraw}>회원 탈퇴</li>
        </ul>
      </div>
    </footer>
  );
};

export default MypageFooter;

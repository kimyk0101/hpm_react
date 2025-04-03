import { useNavigate } from "react-router-dom";

const MypageContent = () => {
  const navigate = useNavigate();

  return (
    <section className="mypage-content">
      <h3>내 활동</h3>
      <ul>
        <li onClick={() => navigate("/mypage/mypostspage?tab=community")}>
          커뮤니티
        </li>
        <li onClick={() => navigate("/mypage/hiking")}>등산 후기</li>
        <li onClick={() => navigate("/mypage/food")}>맛집 리뷰</li>
        <li onClick={() => navigate("")}>모임</li>
      </ul>
    </section>
  );
};

export default MypageContent;

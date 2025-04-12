import ReviewColumn from "./ReviewColumn";
import { GiMountainCave } from "react-icons/gi";
import "../../styles/components/reviewSection.css";

const ReviewSection = () => {
  return (
    <section className="review-split-section">
      {/* 왼쪽: 등산 후기 영역 */}
      <ReviewColumn
        title="등산 후기"
        description="생생한 등산 경험을 공유해 보세요"
        link="/mountain-reviews"
      />

      {/* 가운데: 산 아이콘 */}
      <div className="mountain-icon">
        <GiMountainCave size={100} />
      </div>

      {/* 오른쪽: 맛집 후기 영역 */}
      <ReviewColumn
        title="맛집 후기"
        description="등산하고 찾아가는 나만의 맛집을 알려주세요."
        link="/restaurant-reviews"
      />
    </section>
  );
};

export default ReviewSection;

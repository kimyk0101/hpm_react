import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import CommunityPreview from "./CommunityPreview";
import "../../../css/CommunitySection.css";

const CommunitySection = () => {
  const navigate = useNavigate();

  return (
    <section className="community-section-container">
      <div className="community-left">
        <CommunityPreview />
      </div>

      {/* <div className="community-arrow">→</div> */}

      <div className="community-right">
        <h3>등산만큼, 수다도 필요하니까</h3>
        <p>
          오늘 산 얘기해도 좋고, 그냥 오늘 얘기해도 좋아요.
          <br />
          같이 떠들 사람, 여기 다 모였어요.
        </p>

        <button
          className="go-community-btn"
          onClick={() => navigate("/communities")}
        >
          <FiArrowRight />
        </button>
      </div>
    </section>
  );
};

export default CommunitySection;

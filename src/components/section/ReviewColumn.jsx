import { useNavigate } from "react-router-dom";

const ReviewColumn = ({ title, description, link }) => {
  const navigate = useNavigate();

  return (
    <div className="review-column">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="review-button" onClick={() => navigate(link)}>
        바로 가기
      </button>
    </div>
  );
};

export default ReviewColumn;

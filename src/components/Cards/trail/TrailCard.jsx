// components/Main/TrailCard.jsx
import TrailImage from "./TrailImage";
import TrailDetails from "./TrailDetails";
import "../../../css/TrailCard.css";

const TrailCard = ({ image, mountainName, cardInfo }) => {
  return (
    <div className="slider-card">
      <TrailImage image={image} mountainName={mountainName} />
      <TrailDetails cardInfo={cardInfo} />
    </div>
  );
};

export default TrailCard;

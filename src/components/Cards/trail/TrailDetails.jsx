const TrailDetails = ({ cardInfo }) => {
  return (
    <div className="card-details">
      <p>
        <strong>{cardInfo.name}</strong>
      </p>
      <p>거리: {cardInfo.distance}</p>
      <p>난이도: {cardInfo.level}</p>
    </div>
  );
};

export default TrailDetails;

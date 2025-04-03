const TrailDetails = ({ mountainName, cardInfo }) => {
  return (
    <div className="card-details">
      <p>
        <strong>{mountainName}</strong>
      </p>
      <p className="trail-course">{cardInfo.name}</p>
      <div className="trail-meta">
        <p>{cardInfo.distance}</p>
        <p>{cardInfo.time}</p>
        <p>{cardInfo.level}</p>
      </div>
    </div>
  );
};

export default TrailDetails;

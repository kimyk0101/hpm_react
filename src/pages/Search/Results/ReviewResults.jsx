import React from "react";

const ReviewResults = ({ data, submittedQuery }) => {
  if (!data || data.length === 0) {
    return (
      <p className="no-result">
        “{submittedQuery}”과 관련된 검색 결과가 없습니다.
      </p>
    );
  }

  return (
    <ul className="review-list">
      {data.map((item) => (
        <li key={item.id} className="review-item">
          <h4 className="review-title">{item.title}</h4>
          <p className="review-meta">
            작성자: {item.nickname} | 작성일: {item.update_date}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default ReviewResults;

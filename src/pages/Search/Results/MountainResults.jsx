import React from "react";

const MountainResults = ({ data, submittedQuery }) => {
  if (!data || data.length === 0) {
    return (
      <p className="no-result">
        “{submittedQuery}”과 관련된 검색 결과가 없습니다.
      </p>
    );
  }

  return (
    <ul className="mountain-list">
      {data.map((item) => (
        <li key={item.id} className="mountain-item">
          <h4 className="mountain-title">{item.name}</h4>
          <p className="mountain-meta">
            위치: {item.location} | 난이도: {item.level}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default MountainResults;

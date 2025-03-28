// CommunityResults.jsx
import React from "react";
import { Link } from "react-router-dom";
import { highlightKeyword } from "../../../utils/highlightKeyword";

const CommunityResults = ({ data, submittedQuery }) => {
  if (!data || data.length === 0) {
    return (
      <p className="no-result">
        “{submittedQuery}”과 관련된 검색 결과가 없습니다.
      </p>
    );
  }

  return (
    <ul className="community-list">
      {data.map((item) => (
        <li key={item.id} className="community-item">
          <Link to={`/communities/${item.id}`} className="community-link">
            <h4 className="community-title">
              {highlightKeyword(item.title, submittedQuery)}
            </h4>
            <div className="community-content-wrapper">
              <p className="community-content">
                {highlightKeyword(item.content, submittedQuery)}
              </p>
              {/* 이미지 필드가 있다면 렌더링. 현재는 없으므로 안전 처리 */}
              {item.imageUrls?.length > 0 && (
                <img
                  src={item.imageUrls[0]}
                  alt="썸네일"
                  className="community-thumbnail"
                />
              )}
            </div>
            <p className="community-author">작성자: {item.nickname}</p>
            <p className="community-meta">
              작성일: {item.update_date} | 댓글 수: 0
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default CommunityResults;

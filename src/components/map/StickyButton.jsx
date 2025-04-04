import React from "react";
import { Link, useLocation } from "react-router-dom";

const StickyButton = () => {
  const location = useLocation();

  return (
    <div className="sticky-button">
      {location.pathname === "/mountain/list" ? (
        <Link to="/mountain/list_map">
          <button>지도 보기</button>
        </Link>
      ) : location.pathname === "/mountain/list_map" ? (
        <Link to="/mountain/list">
          <button>목록 보기</button>
        </Link>
      ) : null}
    </div>
  );
};

export default StickyButton;

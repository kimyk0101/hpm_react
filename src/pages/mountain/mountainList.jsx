import React, { useState, useEffect } from "react";
import axios from "axios";
import StickyButton from "../../components/map/StickyButton"; // StickyButton 컴포넌트 임포트
import "../../css/mountain.css"; // CSS 파일 분리

function MountainList() {
  const [mountains, setMountains] = useState([]); // 전체 산 데이터 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태
  const [filteredMountains, setFilteredMountains] = useState([]); // 검색 결과 상태

  // 전체 산 데이터 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8088/api/mountains") // 전체 산 데이터를 조회하는 API 호출
      .then((response) => {
        setMountains(response.data);
        setFilteredMountains(response.data); // 초기 상태에서는 전체 데이터를 필터링 결과로 설정
      })
      .catch((error) => {
        console.error("산 데이터 불러오기 오류:", error);
      });
  }, []);

  // 검색 기능: 키워드가 변경될 때마다 필터링 수행
  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setFilteredMountains(mountains); // 검색어가 없으면 전체 데이터를 보여줌
    } else {
      const filtered = mountains.filter(
        (mountain) =>
          mountain.name.includes(searchKeyword) || // 이름으로 필터링
          mountain.location.includes(searchKeyword) // 위치로 필터링
      );
      setFilteredMountains(filtered);
    }
  }, [searchKeyword, mountains]);

  return (
    <div className="mountain-list">
      {/* 검색창 */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="산 이름 또는 위치를 검색하세요"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)} // 검색어 상태 업데이트
        />
      </div>

      {/* 산 목록 */}
      <div className="mountain-grid">
        {filteredMountains.length > 0 ? (
          filteredMountains.map((mountain) => (
            <div key={mountain.id} className="mountain-card">
              <div
                className="card-image"
                style={{
                  backgroundImage: `url(${
                    mountain.image || "/default-image.jpg"
                  })`,
                }}
              >
                {/* 카드 이미지 */}
              </div>
              <div className="card-content">
                <h3>{mountain.name}</h3>
                <p>📍 {mountain.location}</p>
                <p>⛰ {mountain.height}m</p>
                <a href={`/mountain/${mountain.id}`} className="detail-link">
                  상세 보기 →
                </a>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">검색 결과가 없습니다.</p>
        )}
        <StickyButton className="no-style" />
      </div>
    </div>
  );
}

export default MountainList;

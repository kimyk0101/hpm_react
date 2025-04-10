import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 네비게이션을 위한 훅
import { motion, AnimatePresence } from "framer-motion"; // Framer Motion 임포트
import StickyButton from "../../components/map/StickyButton"; // StickyButton 컴포넌트 임포트
import "../../css/mountain.css"; // CSS 파일 분리

function MountainList() {
  const [mountains, setMountains] = useState([]); // 전체 산 데이터 상태
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태
  const [filteredMountains, setFilteredMountains] = useState([]); // 검색 결과 상태
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태
  const navigate = useNavigate(); // 라우팅을 위한 네비게이션 훅

  // 전체 산 데이터와 대표 이미지 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8088/api/mountains") // 전체 산 데이터를 조회하는 API 호출
      .then((response) => {
        const mountainsData = response.data;

        // 각 산별 대표 이미지 병렬 요청
        const imageRequests = mountainsData.map((mountain) =>
          axios
            .get(`http://localhost:8088/api/mountains/${mountain.id}/image`)
            .then((res) => ({
              ...mountain,
              image: `http://localhost:8088${res.data.image_url}`, // 이미지 URL 생성
            }))
            .catch(() => ({
              ...mountain,
              image: null, // 이미지가 없을 경우 null 처리
            }))
        );

        Promise.all(imageRequests)
          .then((mountainsWithImages) => {
            setMountains(mountainsWithImages);
            setFilteredMountains(mountainsWithImages);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("이미지 로드 실패:", error);
            setIsLoading(false);
          });
      })
      .catch((error) => {
        console.error("산 데이터 불러오기 오류:", error);
        setIsLoading(false); // 오류 발생 시에도 로딩 상태 해제
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
      <div className="mReview-search-container">
        <input
          type="text"
          placeholder="산 이름으로 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="mReview-search-input"
        />
      </div>

      {/* 산 목록 */}
      <div className="mountain-grid">
        <AnimatePresence>
          {isLoading ? (
            <motion.p
              className="loading-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              데이터를 불러오는 중입니다...
            </motion.p>
          ) : filteredMountains.length > 0 ? (
            filteredMountains.map((mountain) => (
              <motion.div
                key={mountain.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="mountain-card"
              >
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url(${
                      mountain.image || "/default-image.jpg"
                    })`,
                  }}
                ></div>
                <div className="card-content">
                  <h3>{mountain.name}</h3>
                  <p>📍 {mountain.location}</p>
                  <p>⛰ {mountain.height}m</p>
                  <div className="button-group">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="detail-button"
                      onClick={() =>
                        navigate(`/mountain/${mountain.id}`, {
                          state: { mountainName: mountain.name },
                        })
                      }
                    >
                      상세 보기
                    </motion.button>
                    {/* 후기 버튼 그룹 */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="review-button"
                      onClick={() =>
                        navigate("/mountain-reviews", {
                          state: { mountainName: mountain.name },
                        })
                      }
                    >
                      등산후기
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="review-button"
                      onClick={() =>
                        navigate("/restaurant-reviews", {
                          state: { mountainName: mountain.name },
                        })
                      }
                    >
                      맛집후기
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.p
              className="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              검색 결과가 없습니다.
            </motion.p>
          )}
        </AnimatePresence>
        <StickyButton className="no-style" />
      </div>
    </div>
  );
}

export default MountainList;

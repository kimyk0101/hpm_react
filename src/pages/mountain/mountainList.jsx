import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import StickyButton from "../../Components/Map/StickyButton";
import "../../styles/pages/mountain.css";

function MountainList() {
  const [mountains, setMountains] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredMountains, setFilteredMountains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // API 호출 최적화 (병렬 처리 + 에러 핸들링)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: mountainsData } = await axios.get(
          "http://localhost:8088/api/mountains"
        );

        const mountainsWithImages = await Promise.all(
          mountainsData.map(async (mountain) => {
            try {
              const { data: imageData } = await axios.get(
                `http://localhost:8088/api/mountains/${mountain.id}/image`
              );
              return {
                ...mountain,
                image: encodeURI(imageData.imageUrl),
              };
            } catch (error) {
              console.error(`산 ${mountain.id} 이미지 로드 실패:`, error);
              return {
                ...mountain,
                image: null,
              };
            }
          })
        );

        setMountains(mountainsWithImages);
        setFilteredMountains(mountainsWithImages);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 검색 기능
  useEffect(() => {
    const filtered = searchKeyword
      ? mountains.filter(
          (mountain) =>
            mountain.name.includes(searchKeyword) ||
            mountain.location.includes(searchKeyword)
        )
      : mountains;
    setFilteredMountains(filtered);
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
                {/* 이미지 영역 */}
                <div
                  className="card-image"
                  style={{
                    backgroundImage: `url(${mountain.image})`,
                  }}
                ></div>

                {/* 카드 내용 */}
                <div className="card-content">
                  <h3>{mountain.name}</h3>
                  <p>📍 {mountain.location}</p>
                  <p>⛰ {mountain.height}m</p>
                  <div className="button-group">
                    {/* 상세 보기 버튼 */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="detail-button"
                      onClick={() => navigate(`/mountain/${mountain.id}`)}
                    >
                      상세 보기
                    </motion.button>

                    {/* 등산후기 버튼 */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="review-button"
                      onClick={() =>
                        navigate("/mountain-reviews", {
                          state: { mountainName: mountain.name }, // 산 이름 전달
                        })
                      }
                    >
                      등산후기
                    </motion.button>

                    {/* 맛집후기 버튼 */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="review-button"
                      onClick={() =>
                        navigate("/restaurant-reviews", {
                          state: { mountainName: mountain.name }, // 산 이름 전달
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
        <StickyButton
          className="no-style"
          showHome={true}
          showBack={true}
          showMap={true}
          showList={false}
          showScrollTop={true}
          showWrite={false}
          homePath="/"
          backPath="/previous"
          mapPath="/mountain/list_map"
        />
      </div>
    </div>
  );
}

export default MountainList;

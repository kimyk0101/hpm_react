import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/MountainDetail.css";

function MountainDetail() {
  const { id } = useParams();
  const [mountain, setMountain] = useState(null);
  const [courses, setCourses] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlays = useRef([]);

  // 데이터 가져오기
  useEffect(() => {
    axios
      .get(`http://localhost:8088/api/mountains/${id}`)
      .then((response) => setMountain(response.data))
      .catch((error) => console.error("산 정보 불러오기 오류:", error));

    axios
      .get(`http://localhost:8088/api/mountains/${id}/courses`)
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("코스 정보 불러오기 오류:", error));
  }, [id]);

  // 카카오맵 초기화
  useEffect(() => {
    if (mountain) {
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_MAPS_API_KEY
      }&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.kakao.maps.load(() => {
          const mapContainer = mapRef.current;
          const mapOption = {
            center: new window.kakao.maps.LatLng(
              mountain.latitude,
              mountain.longitude
            ),
            level: 5,
          };

          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          mapInstance.current = map;
          showMountainMarker(map);
        });
      };

      return () => document.head.removeChild(script);
    }
  }, [mountain]);

  // 산 마커 표시 함수
  const showMountainMarker = (map) => {
    clearOverlays();

    const markerPosition = new window.kakao.maps.LatLng(
      mountain.latitude,
      mountain.longitude
    );

    const marker = new window.kakao.maps.Marker({
      position: markerPosition,
      image: new window.kakao.maps.MarkerImage(
        "https://i.ibb.co/QZk1h2W/30x30.png",
        new window.kakao.maps.Size(30, 30)
      ),
    });

    marker.setMap(map);
    overlays.current.push(marker);

    const labelContent = `
      <div class="mountain-label">
        ${mountain.name}
      </div>
    `;
    const labelOverlay = new window.kakao.maps.CustomOverlay({
      content: labelContent,
      position: markerPosition,
      yAnchor: -0.01,
    });

    labelOverlay.setMap(map);
    overlays.current.push(labelOverlay);
  };

  const clearOverlays = () => {
    overlays.current.forEach((overlay) => overlay.setMap(null));
    overlays.current = [];
  };

  if (!mountain) return <div className="loading">로딩 중...</div>;

  return (
    <div className="mountain-detail">
      {/* 헤더 섹션 */}
      <div className="header-section">
        <h1>{mountain.name}</h1>
        <div className="meta-info">
          <span>📍 {mountain.location}</span>
          <span>⛰ {mountain.height}m</span>
        </div>
      </div>

      {/* 지도 영역 */}
      <div className="map-container">
        <div ref={mapRef} className="map"></div>
      </div>

      {/* 상세 정보 섹션 */}
      <div className="info-section">
        <h3>🏔️ 선정 이유</h3>
        <p>{mountain.selection_reason}</p>

        <h3>🚌 대중교통 안내</h3>
        <p>{mountain.transportation_info}</p>
      </div>

      {/* 등산 코스 목록 */}
      <div className="courses-section">
        <h2>등산 코스 목록</h2>
        {courses.length === 0 ? (
          <p className="no-course">등산 코스가 없습니다.</p>
        ) : (
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                <div className="course-info">
                  <p>📏 길이: {course.length}km</p>
                  <p>⏱️ 소요 시간: {course.duration}</p>
                  <p>🧗 난이도: {course.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MountainDetail;

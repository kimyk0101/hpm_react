import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/MountainDetail.css";

const weatherDescKo = {
  200: "가벼운 비를 동반한 천둥구름",
  201: "비를 동반한 천둥구름",
  202: "강한 비를 동반한 천둥구름",
  210: "약한 천둥구름",
  211: "천둥구름",
  212: "강한 천둥구름",
  221: "불규칙적인 천둥구름",
  230: "약한 비를 동반한 천둥구름",
  231: "진눈깨비를 동반한 천둥구름",
  232: "강한 진눈깨비를 동반한 천둥구름",
  300: "가벼운 안개비",
  301: "안개비",
  302: "강한 안개비",
  310: "가벼운 적은비",
  311: "적은비",
  312: "강한 적은비",
  313: "소나기성 적은비",
  314: "강한 소나기성 적은비",
  321: "소나기성 안개비",
  500: "약한 비",
  501: "중간 비",
  502: "강한 비",
  503: "매우 강한 비",
  504: "극심한 비",
  511: "진눈깨비",
  520: "약한 소나기성 비",
  521: "소나기성 비",
  522: "강한 소나기성 비",
  531: "불규칙적인 소나기성 비",
  600: "약한 눈",
  601: "눈",
  602: "강한 눈",
  611: "진눈깨비",
  612: "소나기성 진눈깨비",
  613: "소나기성 눈",
  615: "약한 비와 눈",
  616: "비와 눈",
  620: "약한 소나기성 눈",
  621: "소나기성 눈",
  622: "강한 소나기성 눈",
  701: "박무",
  711: "연기",
  721: "안개",
  731: "모래, 먼지",
  741: "안개",
  751: "모래",
  761: "먼지",
  762: "화산재",
  771: "돌풍",
  781: "토네이도",
  800: "맑음",
  801: "약간 흐린 구름",
  802: "흐린 구름",
  803: "매우 흐린 구름",
  804: "흐림",
};

const useWeather = (lat, lon) => {
  const [weather, setWeather] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState([]);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        // 현재 날씨
        const currentRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
              units: "metric",
            },
          }
        );

        // 미래 날씨 (5일 예보)
        const forecastRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
              units: "metric",
            },
          }
        );

        // 데이터 가공
        const processedCurrent = {
          temp: Math.round(currentRes.data.main.temp),
          description:
            weatherDescKo[currentRes.data.weather[0].id] ||
            currentRes.data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${currentRes.data.weather[0].icon}@2x.png`,
        };

        const processedForecast = forecastRes.data.list
          .filter((_, index) => index % 8 === 0)
          .map((item) => ({
            date: new Date(item.dt * 1000),
            temp: Math.round(item.main.temp),
            description:
              weatherDescKo[item.weather[0].id] || item.weather[0].description,
            icon: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
          }));

        setWeather(processedCurrent);
        setWeatherForecast(processedForecast);
      } catch (error) {
        console.error("날씨 데이터 오류:", error);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, weatherForecast };
};

function MountainDetail() {
  const { id } = useParams();
  const [mountain, setMountain] = useState(null);
  const [courses, setCourses] = useState([]);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const overlays = useRef([]);

  // 날씨 데이터 가져오기
  const { weather, weatherForecast } = useWeather(
    mountain?.latitude,
    mountain?.longitude
  );

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

  // 코스 클릭 시 네이버 지도 웹으로 이동
  const handleCourseClick = (course) => {
    const encodedCourseName = encodeURIComponent(course.courseName); // 검색어 URL-safe 인코딩
    const naverMapUrl = `https://map.naver.com/v5/search/${encodedCourseName}`;
    window.open(naverMapUrl, "_blank"); // 새 탭에서 네이버 지도 열기
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

      {/* 날씨 섹션 */}
      {weather && (
        <div className="weather-section">
          <h2>⛅ 현재 날씨</h2>
          <div className="current-weather">
            <img src={weather.icon} alt="날씨 아이콘" />
            <div className="weather-info">
              <p>온도: {weather.temp}°C</p>
              <p>{weather.description}</p>
            </div>
          </div>

          {weatherForecast.length > 0 && (
            <>
              <h3>📅 5일간 예보</h3>
              <div className="forecast-grid">
                {weatherForecast.map((day, index) => (
                  <div key={index} className="forecast-card">
                    <p>
                      {day.date.toLocaleDateString("ko-KR", {
                        weekday: "short",
                      })}
                    </p>
                    <img src={day.icon} alt="날씨 아이콘" />
                    <p>{day.temp}°C</p>
                    <p>{day.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

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
              <div
                key={course.mountainsId}
                className="course-card"
                onClick={() => handleCourseClick(course)}
              >
                <h3>{course.courseName}</h3>
                <div className="course-info">
                  <p>📏 길이: {course.courseLength}</p>
                  <p>⏱️ 소요 시간: {course.courseTime}</p>
                  <p>🧗 난이도: {course.difficultyLevel}</p>
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

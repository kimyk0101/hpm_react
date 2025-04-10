import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../css/MountainDetail.css";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const [sunTimes, setSunTimes] = useState(null);

  const fetchSunTimesForTomorrow = async (lat, lon) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD 형식

    try {
      const response = await axios.get(`https://api.sunrise-sunset.org/json`, {
        params: {
          lat,
          lng: lon,
          date: formattedDate,
          formatted: 0, // UTC 시간 반환
        },
      });

      return {
        sunrise: new Date(response.data.results.sunrise),
        sunset: new Date(response.data.results.sunset),
      };
    } catch (error) {
      console.error("Sunrise-Sunset API 오류:", error);
      return null;
    }
  };

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        const currentRes = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat,
              lon,
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
              units: "metric",
              lang: "kr",
            },
          }
        );

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

        const sunTimesForTomorrow = await fetchSunTimesForTomorrow(lat, lon);

        setSunTimes(sunTimesForTomorrow);
        setWeather(processedCurrent);
        setWeatherForecast(processedForecast);
      } catch (error) {
        console.error("날씨 데이터 오류:", error);
      }
    };

    fetchWeather();
  }, [lat, lon]);

  return { weather, weatherForecast, sunTimes };
};

function MountainDetail() {
  const { id } = useParams();
  const [mountain, setMountain] = useState(null);
  const [courses, setCourses] = useState([]);
  const mapRef = useRef(null);

  // 오늘 기준 다음 날 계산
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const { weather, weatherForecast, sunTimes } = useWeather(
    mountain?.latitude,
    mountain?.longitude
  );

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
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            const mapContainer = mapRef.current;
            if (!mapContainer) return;

            const mapOption = {
              center: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              level: 5,
            };

            const mapInstance = new window.kakao.maps.Map(
              mapContainer,
              mapOption
            );

            // 마커 설정 및 추가
            const markerImage = new window.kakao.maps.MarkerImage(
              "https://i.ibb.co/QZk1h2W/30x30.png",
              new window.kakao.maps.Size(30, 30),
              { offset: new window.kakao.maps.Point(15, 25) }
            );

            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              map: mapInstance,
              image: markerImage,
            });

            // 라벨 추가
            new window.kakao.maps.CustomOverlay({
              content: `<div class="custom-label">${mountain.name}</div>`,
              position: marker.getPosition(),
              yAnchor: -0.2,
              map: mapInstance,
            });
          });
        }
      };

      return () => document.head.removeChild(script);
    }
  }, [mountain]);

  if (!mountain) return <div className="loading">로딩 중...</div>;

  return (
    <div className="mountain-detail">
      <h1>{mountain.name}</h1>
      <p>
        ⛰ 높이: {mountain.height} 📍 위치: {mountain.location}
      </p>
      <motion.button
        className="search-button"
        whileHover={{ scale: 1.1, backgroundColor: "#ff6f61" }}
        whileTap={{ scale: 0.9 }}
        onClick={() =>
          window.open(
            `https://map.naver.com/v5/search/${mountain.name} 맛집 `,
            "_blank"
          )
        }
      >
        주변 맛집 검색
      </motion.button>{" "}
      {/* 지도 표시 */}
      <div ref={mapRef} className="map-detail-container"></div>
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>현재 날씨</h2>
          <p>온도: {weather.temp}°C</p>
          <p>설명: {weather.description}</p>
          <img src={weather.icon} alt="날씨 아이콘" />
        </motion.div>
      )}
      {weatherForecast.length > 0 && (
        <motion.div
          className="forecast-section"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3>📅 날씨 예보</h3>
          <div className="forecast-grid">
            {weatherForecast.map((day, index) => (
              <motion.div
                key={index}
                className="forecast-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <p>
                  {day.date.toLocaleDateString("ko-KR", { weekday: "short" })}
                </p>
                <img src={day.icon} alt="날씨 아이콘" />
                <p>{day.temp}°C</p>
                <p>{day.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {sunTimes && (
        <div>
          <h2>일출 및 일몰</h2>
          <p>🌄 일출 시간: {sunTimes.sunrise.toLocaleTimeString()}</p>
          <p>🌅 일몰 시간: {sunTimes.sunset.toLocaleTimeString()}</p>
          <p className="meta-info">기준 날짜: {formattedDate}</p>
        </div>
      )}
      <div className="info-section">
        <h3>🏔️ 선정 이유</h3>
        <p>{mountain.selection_reason}</p>

        <h3>🚌 대중교통 안내</h3>
        <p>{mountain.transportation_info}</p>
      </div>
      <div className="courses-section">
        {/* 산 이름 + 맛집 검색 버튼 */}
        <div className="search-section">
          <h2>등산 코스 목록</h2>
        </div>
        <div className="courses-grid">
          {courses.map((course) => (
            <div
              key={course.mountainsId}
              className="course-card"
              onClick={() =>
                window.open(
                  `https://map.naver.com/v5/search/${course.courseName}`,
                  "_blank"
                )
              }
            >
              <h3>{course.courseName}</h3>
              <p>길이: {course.courseLength}</p>
              <p>소요 시간: {course.courseTime}</p>
              <p>난이도: {course.difficultyLevel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MountainDetail;

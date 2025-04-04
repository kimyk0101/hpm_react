import React, { useRef, useEffect, useState } from "react";
import StickyButton from "../../components/map/StickyButton"; // StickyButton 컴포넌트 임포트
import "../../css/map.css";

function MountainMap() {
  const mapRef = useRef(null);
  const [markerInfo, setMarkerInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAPS_API_KEY
    }&autoload=false`;
    document.head.appendChild(script);

    const onLoadKakaoAPI = () => {
      window.kakao.maps.load(() => {
        const options = {
          center: new window.kakao.maps.LatLng(
            37.041192752028714,
            127.47055598966082
          ),
          level: 13,
        };
        const map = new window.kakao.maps.Map(mapRef.current, options);

        // 각 산에 대한 마커 이미지 URL
        const markerImages = {
          한라산: "https://i.ibb.co/QZk1h2W/30x30.png",
          지리산: "https://i.ibb.co/QZk1h2W/30x30.png",
          설악산: "https://i.ibb.co/QZk1h2W/30x30.png",
          태백산: "https://i.ibb.co/QZk1h2W/30x30.png",
          소백산: "https://i.ibb.co/QZk1h2W/30x30.png",
          속리산: "https://i.ibb.co/QZk1h2W/30x30.png",
          관악산: "https://i.ibb.co/QZk1h2W/30x30.png",
          북한산: "https://i.ibb.co/QZk1h2W/30x30.png",
        };

        // 마커 위치 정의
        const positions = [
          {
            title: "한라산",
            latlng: new window.kakao.maps.LatLng(33.361413, 126.529395),
            content: "제주도에 위치한 한라산입니다.",
            height: "1950m",
            image: markerImages["한라산"],
            link: "/mountain/hallasan",
          },
          {
            title: "지리산",
            latlng: new window.kakao.maps.LatLng(35.336943, 127.730641),
            content: "경상남도와 전라남도에 걸쳐 있는 지리산입니다.",
            height: "1915m",
            image: markerImages["지리산"],
            link: "/mountain/jirisan",
          },
          {
            title: "설악산",
            latlng: new window.kakao.maps.LatLng(38.118333, 128.483333),
            content: "강원도에 위치한 설악산입니다.",
            height: "1708m",
            image: markerImages["설악산"],
            link: "/mountain/seoraksan",
          },
          {
            title: "태백산",
            latlng: new window.kakao.maps.LatLng(37.083333, 128.916667),
            content: "강원도에 위치한 태백산입니다.",
            height: "1563m",
            image: markerImages["태백산"],
            link: "/mountain/taebaeksan",
          },
          {
            title: "소백산",
            latlng: new window.kakao.maps.LatLng(36.966667, 128.45),
            content: "충청북도에 위치한 소백산입니다.",
            height: "1439m",
            image: markerImages["소백산"],
            link: "/mountain/sobaeksan",
          },
          {
            title: "속리산",
            latlng: new window.kakao.maps.LatLng(36.533333, 127.783333),
            content: "충청북도에 위치한 속리산입니다.",
            height: "1067m",
            image: markerImages["속리산"],
            link: "/mountain/songnisan",
          },
          {
            title: "관악산",
            latlng: new window.kakao.maps.LatLng(37.433333, 126.966667),
            content: "서울특별시에 위치한 관악산입니다.",
            height: "639m",
            image: markerImages["관악산"],
            link: "/mountain/gwanaksan",
          },
          {
            title: "북한산",
            latlng: new window.kakao.maps.LatLng(37.666667, 126.983333),
            content: "서울특별시와 경기도에 걸쳐 있는 북한산입니다.",
            height: "836m",
            image: markerImages["북한산"],
            link: "/mountain/bukhansan",
          },
        ];

        // 마커 이미지 속성 정의
        const imageSize = new window.kakao.maps.Size(30, 30),
          imageOption = { offset: new window.kakao.maps.Point(15, 25) };

        // 마커에 마우스 오버 효과를 위한 이미지 준비
        const hoverImage = new window.kakao.maps.MarkerImage(
          "https://i.ibb.co/hxb1GQ90/mountains.png", // hover 이미지 URL
          imageSize,
          imageOption
        );

        // 줌 레벨에 따른 마커 이미지 크기 변경 함수
        const changeMarkerImage = () => {
          const level = map.getLevel();
          positions.forEach((position, index) => {
            const marker = markers[index];
            if (level <= 9) {
              // 줌 레벨이 9 이하일 때 기본 이미지 사용
              const defaultImage = new window.kakao.maps.MarkerImage(
                markerImages[position.title],
                imageSize,
                imageOption
              );
              marker.setImage(defaultImage);
            } else {
              // 줌 레벨이 10 이상일 때 더 큰 이미지 사용
              const largeImageSize = new window.kakao.maps.Size(30, 30);
              const largeImage = new window.kakao.maps.MarkerImage(
                markerImages[position.title],
                largeImageSize,
                imageOption
              );
              marker.setImage(largeImage);
            }
          });
        };

        // 위치 배열을 사용하여 마커 생성
        const markers = [];

        positions.forEach((position) => {
          const markerImage = new window.kakao.maps.MarkerImage(
            markerImages[position.title],
            imageSize,
            imageOption
          );
          const marker = new window.kakao.maps.Marker({
            position: position.latlng,
            image: markerImage,
          });
          marker.setMap(map);
          markers.push(marker);

          // 마커에 마우스 오버 이벤트 등록
          window.kakao.maps.event.addListener(marker, "mouseover", function () {
            marker.setImage(hoverImage);
          });

          // 마커에 마우스 아웃 이벤트 등록
          window.kakao.maps.event.addListener(marker, "mouseout", function () {
            marker.setImage(markerImage);
          });

          // 마커 아래에 라벨 추가
          const label = new window.kakao.maps.CustomOverlay({
            map: map,
            position: position.latlng,
            content: `<div style="background-color: transparent; padding: 5px; font-size: 11px; font-weight:bold;">${position.title}</div>`,
            yAnchor: 0,
          });
          label.setMap(map);

          // 마커 클릭 이벤트 등록
          window.kakao.maps.event.addListener(marker, "click", function () {
            setMarkerInfo(position);
            setIsOpen(true);
            setSelectedMarker(marker); // 선택된 마커 저장
            marker.setImage(hoverImage); // 선택된 마커의 이미지를 호버 이미지로 변경
          });
        });

        // 줌 이벤트 등록
        window.kakao.maps.event.addListener(
          map,
          "zoom_changed",
          changeMarkerImage
        );

        changeMarkerImage(); // 초기화
      });
    };

    script.addEventListener("load", onLoadKakaoAPI);

    return () => {
      script.removeEventListener("load", onLoadKakaoAPI);
    };
  }, []);

  return (
    <div className="map-container">
      <div className="map" style={{ position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
        {isOpen && markerInfo && (
          <div className="info-box">
            <div className="mountain-card">
              <img
                src={markerInfo.image}
                alt={markerInfo.title}
                className="mountain-image"
              />
              <div className="mountain-info">
                <div className="mountain-header">
                  <h2 className="mountain-title">{markerInfo.title}</h2>
                  <span className="mountain-badge">{markerInfo.badge}</span>
                </div>
                <p className="mountain-location">
                  {markerInfo.height} · {markerInfo.region}
                </p>
                <p className="mountain-description">{markerInfo.description}</p>
                <div className="mountain-stats">
                  <span>코스 {markerInfo.courses}</span>
                  <span>실시간 {markerInfo.realtime}</span>
                  <span>후기 {markerInfo.reviews}</span>
                  <div onClick={() => setIsOpen(false)}>닫기</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <StickyButton /> {/* StickyButton 추가 */}
    </div>
  );
}

export default MountainMap;

import React, { useRef, useEffect, useState } from "react";
import StickyButton from "../../components/map/StickyButton"; // StickyButton 컴포넌트 임포트
import "../../css/map.css";

function MountainMap() {
  const mapRef = useRef(null);
  const [markerInfo, setMarkerInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mountains, setMountains] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8088/api/mountains")
      .then((response) => response.json())
      .then((data) => {
        setMountains(data);
        setIsLoaded(true);
      });

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
          default: "https://i.ibb.co/QZk1h2W/30x30.png",
        };

        // 마커 이미지 속성 정의
        const imageSize = new window.kakao.maps.Size(30, 30),
          imageOption = { offset: new window.kakao.maps.Point(15, 25) };

        // 마커에 마우스 오버 효과를 위한 이미지 준비
        const hoverImage = new window.kakao.maps.MarkerImage(
          "https://i.ibb.co/hxb1GQ90/mountains.png", // hover 이미지 URL
          imageSize,
          imageOption
        );

        // 위치 배열을 사용하여 마커 생성
        const markers = [];

        if (isLoaded) {
          mountains.forEach((mountain) => {
            const markerImage = new window.kakao.maps.MarkerImage(
              markerImages.default,
              imageSize,
              imageOption
            );
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              image: markerImage,
            });
            marker.setMap(map);
            markers.push(marker);

            // 마커에 마우스 오버 이벤트 등록
            window.kakao.maps.event.addListener(
              marker,
              "mouseover",
              function () {
                marker.setImage(hoverImage);
              }
            );

            // 마커에 마우스 아웃 이벤트 등록
            window.kakao.maps.event.addListener(
              marker,
              "mouseout",
              function () {
                marker.setImage(markerImage);
              }
            );

            // 마커 아래에 라벨 추가
            const label = new window.kakao.maps.CustomOverlay({
              map: map,
              position: new window.kakao.maps.LatLng(
                mountain.latitude,
                mountain.longitude
              ),
              content: `<div style="background-color: transparent; padding: 5px; font-size: 11px; font-weight:bold;">${mountain.name}</div>`,
              yAnchor: 0,
            });
            label.setMap(map);

            // 마커 클릭 이벤트 등록
            window.kakao.maps.event.addListener(marker, "click", function () {
              setMarkerInfo({
                title: mountain.name,
                latlng: new window.kakao.maps.LatLng(
                  mountain.latitude,
                  mountain.longitude
                ),
                content: mountain.description,
                height: mountain.height,
                location: mountain.location,
                selectionReason: mountain.selection_reason,
                image: "https://i.ibb.co/QZk1h2W/30x30.png",
              });
              setIsOpen(true);
              setSelectedMarker(marker); // 선택된 마커 저장
              marker.setImage(hoverImage); // 선택된 마커의 이미지를 호버 이미지로 변경
            });
          });
        }
      });
    };

    script.addEventListener("load", onLoadKakaoAPI);

    return () => {
      script.removeEventListener("load", onLoadKakaoAPI);
    };
  }, [isLoaded]);

  return (
    <div className="map-container">
      <div className="map" style={{ position: "relative" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }}></div>
      </div>
      {isOpen && markerInfo && (
        <div className="info-box-bottom">
          <div className="mountain-card">
            <img
              src={markerInfo.image}
              alt={markerInfo.title}
              className="mountain-image"
            />
            <div className="mountain-info">
              <div className="mountain-header">
                <h2 className="mountain-title">{markerInfo.title}</h2>
              </div>
              <p className="mountain-location">위치: {markerInfo.location}</p>
              <p className="mountain-height">고도: {markerInfo.height}m</p>
              <p className="mountain-selection-reason">
                선정이유: {markerInfo.selectionReason}
              </p>
              <div className="button-group">
                <button
                  className="detail-button"
                  onClick={async () => {
                    const mountainName = markerInfo.title;
                    try {
                      const response = await fetch(
                        `http://localhost:8088/api/mountains/name/${mountainName}`
                      );
                      const mountainId = await response.text(); // 산 ID를 문자열로 받음
                      if (mountainId) {
                        window.location.href = `/mountain/${mountainId}`;
                      } else {
                        console.error("산 ID가 없습니다.");
                      }
                    } catch (error) {
                      console.error("산 ID 조회 실패:", error);
                    }
                  }}
                >
                  상세보기
                </button>
                <button className="review-button">등산후기</button>
                <button
                  className="close-button"
                  onClick={() => setIsOpen(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <StickyButton className="no-style" />
    </div>
  );
}

export default MountainMap;

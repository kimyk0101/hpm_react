import React, { useRef, useEffect, useState } from "react";
import "../../css/DefaultLayout.css";
import "../../css/map.css"; // map.css 파일 임포트

function KakaoMap() {
  const mapRef = useRef(null);
  const [markerInfo, setMarkerInfo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_API
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
          한라산: "https://i.ibb.co/6cNgZxb6/free-icon-mountain.png",
          지리산: "https://i.ibb.co/hxb1GQ90/mountains.png",
          설악산: "https://i.ibb.co/JwYFpyhH/placeholder.png",
          태백산: "https://i.ibb.co/JwYFpyhH/placeholder.png",
          소백산: "https://i.ibb.co/6cNgZxb6/free-icon-mountain.png",
          속리산: "https://i.ibb.co/hxb1GQ90/mountains.png",
          관악산: "https://i.ibb.co/JwYFpyhH/placeholder.png",
          북한산: "https://i.ibb.co/JwYFpyhH/placeholder.png",
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
        const imageSize = new window.kakao.maps.Size(64, 69),
          imageOption = { offset: new window.kakao.maps.Point(27, 69) };

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
              const largeImageSize = new window.kakao.maps.Size(80, 90);
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

          // 마커 아래에 라벨 추가
          const label = new window.kakao.maps.CustomOverlay({
            map: map,
            position: position.latlng,
            content: `<div style="background-color: #fff; border: 1px solid #ddd; padding: 5px; font-size: 12px;">${position.title}</div>`,
            yAnchor: 1.5,
          });
          label.setMap(map);

          // 마커 클릭 이벤트 등록
          window.kakao.maps.event.addListener(marker, "click", function () {
            setMarkerInfo(position);
            setIsOpen(true);
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "relative", // 추가
      }}
    >
      <div ref={mapRef} style={{ width: "1024px", height: "1157px" }}></div>
      {isOpen && markerInfo && (
        <div
          style={{
            position: "absolute",
            right: "30%",
            left: "25%", // 좌측 여백
            width: "55%", // 너비 설정
            bottom: "0px",
            padding: "20px",
            backgroundColor: "#f1f1f1",
            border: "1px solid #ddd",
            borderRadius: "5px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <h2>{markerInfo.title}</h2>
          <p>고도: {markerInfo.height}</p>
          <p>{markerInfo.content}</p>
          <img src={markerInfo.image} width="100" height="100" />
          <button onClick={() => (window.location.href = markerInfo.link)}>
            상세보기
          </button>
          <button onClick={() => setIsOpen(false)}>닫기</button>
        </div>
      )}
    </div>
  );
}

export default KakaoMap;

import { useEffect, useState } from "react";
import TrailImage from "./TrailImage";
import TrailDetails from "./TrailDetails";
import "../../../styles/components/trailCard.css";

const TrailCard = ({ mountainId, mountainName }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [cardInfo, setCardInfo] = useState({
    name: "",
    distance: "",
    time: "",
    level: "",
  });
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    // 대표 이미지 불러오기
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/mountains/${mountainId}/image`
        );
        if (!response.ok) throw new Error("이미지 응답 오류");
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } catch (err) {
        console.error("대표 이미지 불러오기 실패:", err);
      }
    };

    // 코스 정보 불러오기
    const fetchCourse = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/mountains/${mountainId}/courses`
        );
        if (!response.ok) throw new Error("코스 응답 오류");
        const data = await response.json();

        if (data.length > 0) {
          const { courseName, courseLength, courseTime, difficultyLevel } =
            data[0];
          setCardInfo({
            name: courseName,
            distance: courseLength,
            time: courseTime,
            level: difficultyLevel,
          });
        }
      } catch (err) {
        console.error("코스 정보 불러오기 실패:", err);
      }
    };

    if (mountainId) {
      fetchImage();
      fetchCourse();
    }
  }, [mountainId]);
  return (
    <>
      <div className="slider-card">
        <TrailImage image={imageUrl} mountainName={mountainName} />
        <TrailDetails mountainName={mountainName} cardInfo={cardInfo} />
      </div>
    </>
  );
};

export default TrailCard;

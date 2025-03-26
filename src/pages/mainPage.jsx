import DefaultLayout from "../layouts/DefaultLayout";
import DefaultSlider from "../components/slider/DefaultSlider";
import TrailCard from "../components/Cards/trail/TrailCard";
import CommuCard from "../components/Cards/community/CommuCard";
import MtReviewCard from "../components/Cards/Review/Mountain/MtReviewCard";
import trailData from "../data/trailData";
import commuData from "../data/commuData";
import mtReviewData from "../data/mtReviewData";
import "../css/DefaultLayout.css";

const MainHome = () => {
  return (
    <DefaultLayout
      headerProps={{
        title: "하이펜타",
        showLogo: true,
        showIcons: { search: true },
      }}
    >
      <div className="trail-slider-container">
        <h2>🌄 추천 산행 코스</h2>
        <DefaultSlider visibleCount={3}>
          {trailData.map((trail) => (
            <TrailCard
              key={trail.id}
              image={trail.image}
              mountainName={trail.mountainName}
              cardInfo={trail.cardInfo}
            />
          ))}
        </DefaultSlider>
      </div>
      <div className="community-slider-container">
        <h2>💬 커뮤니티 인기 글</h2>
        <DefaultSlider visibleCount={3}>
          {commuData.map((post) => (
            <CommuCard
              key={post.id}
              title={post.title}
              content={post.content}
              author={post.author}
            />
          ))}
        </DefaultSlider>
      </div>
      <div className="mountain-slider-container">
        <h2>🥾 인기 등산 후기</h2>{" "}
        <DefaultSlider visibleCount={3}>
          {mtReviewData.map((mountain) => (
            <MtReviewCard
              key={mountain.id}
              mountainName={mountain.mountainName}
              title={mountain.title}
              content={mountain.content}
              courseName={mountain.courseName}
              level={mountain.level}
              author={mountain.author}
              date={mountain.date}
            />
          ))}
        </DefaultSlider>
      </div>
    </DefaultLayout>
  );
};

export default MainHome;

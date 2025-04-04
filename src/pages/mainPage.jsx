import DefaultLayout from "../layouts/DefaultLayout";
import Header from "../components/Header/Header";
import ContentContainer from "../layouts/ContentContainer";
import DefaultSlider from "../components/slider/DefaultSlider";
import TrailCard from "../components/Cards/trail/TrailCard";
import CommunitySection from "../components/Cards/community/CommunitySection";
import ReviewSection from "../components/section/ReviewSection";
import MtReviewCard from "../components/Cards/Review/Mountain/MtReviewCard";
import trailData from "../data/trailData";
import mtReviewData from "../data/mtReviewData";
import MainHeaderImage from "./main/MainHeaderImage";
import ViewAllButton from "../components/common/ViewAllButton";
import { Link } from "react-router-dom";
import "../css/DefaultLayout.css";
import "../css/MainPage.css";
import "../css/StickyButton.css";

const MainHome = () => {
  return (
    <>
      <header className="header-container home-section">
        <ContentContainer>
          <Header
            title="하이펜타"
            showLogo={true}
            showIcons={{ search: true }}
          />
        </ContentContainer>
      </header>
      <MainHeaderImage />
      <DefaultLayout
        headerProps={{
          title: "하이펜타",
          showLogo: true,
          showIcons: { search: true },
        }}
      >
        <div className="trail-slider-container home-section">
          <h2>추천 산행 코스</h2>
          <DefaultSlider visibleCount={4} className="trail-slider">
            {trailData.map((trail) => (
              <TrailCard
                key={trail.id}
                image={trail.image}
                mountainName={trail.mountainName}
                cardInfo={trail.cardInfo}
              />
            ))}
          </DefaultSlider>
          <ViewAllButton to="/trailDetail" />
        </div>

        <div className="commu-section-full-bg home-section">
          <div className="commu-inner">
            <CommunitySection />
          </div>
        </div>
        {/* <div className="mountain-slider-container home-section">
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
        </div> */}
        <div className="review-section-container">
          <ReviewSection />
        </div>
        <div className="sticky-button">
          <Link to="/mountain/list_map" aria-label="산 목록 지도 보기">
            <img
              src="https://i.ibb.co/6cNgZxb6/free-icon-mountain.png"
              alt="산 아이콘"
            />
          </Link>
        </div>
      </DefaultLayout>
    </>
  );
};

export default MainHome;

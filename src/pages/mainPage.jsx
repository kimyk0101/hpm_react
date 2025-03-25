import DefaultLayout from "../layouts/DefaultLayout";
import DefaultSlider from "../components/slider/DefaultSlider";
import TrailCard from "../components/Cards/trail/TrailCard";
import trailData from "../data/trailData";
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
      <h2>🏔 추천 산행 코스</h2>
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
    </DefaultLayout>
  );
};

export default MainHome;

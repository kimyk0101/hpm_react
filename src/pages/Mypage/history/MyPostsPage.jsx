// components/mypage/MyPostsPage.jsx
import { useSearchParams } from "react-router-dom";
import CommunityTab from "./community/CommunityTab";
import MountainTab from "./mountain/MountainTab";
import RestaurentTab from "./restaurant/RestaurantTab";
import DefaultLayout from "../../../layouts/DefaultLayout";
import Header from "../../../components/Header/Header";
import ContentContainer from "../../../layouts/ContentContainer";
import "../../../css/MyPostsPage.css";

const MyPostsPage = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const renderTabContent = () => {
    switch (tab) {
      case "community":
        return <CommunityTab />;
      case "mountain":
        return <MountainTab />;
      case "restaurant":
        return <RestaurentTab />;
      default:
        return <p>잘못된 탭입니다.</p>;
    }
  };

  return (
    <>
      <header className="header-container">
        <ContentContainer>
          <Header
            title="하이펜타"
            showBack={true}
            showIcons={{ search: true }}
          />
        </ContentContainer>
      </header>
      <DefaultLayout
        headerProps={{
          showBack: true,
          title: "My",
          showIcons: { search: true },
        }}
      >
        <div className="mypage-posts-page">
          <h3>내 활동 내역</h3>
          <div className="tab-wrapper">{renderTabContent()}</div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default MyPostsPage;

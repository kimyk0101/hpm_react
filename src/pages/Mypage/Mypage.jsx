// /pages/Mypage/Mypage.jsx
import MypageHeader from "./MypageHeader";
import MypageContent from "./MypageContent";
import MypageFooter from "./MypageFooter";
import DefaultLayout from "../../layouts/DefaultLayout";
import Header from "../../components/Header/Header";
import ContentContainer from "../../layouts/ContentContainer";
import "../../css/Mypage.css";

const Mypage = () => {
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
      <DefaultLayout>
        <div className="mypage-layout">
          <MypageHeader />
          <MypageContent />
          <MypageFooter />
        </div>
      </DefaultLayout>
    </>
  );
};

export default Mypage;

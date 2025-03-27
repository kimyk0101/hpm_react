// /pages/Mypage/Mypage.jsx
import MypageHeader from "./MypageHeader";
import MypageContent from "./MypageContent";
import MypageFooter from "./MypageFooter";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/Mypage.css";

const Mypage = () => {
  return (
    <DefaultLayout
      headerProps={{
        showBack: true,
        title: "My",
        showIcons: { search: true },
      }}
    >
      <div className="mypage-layout">
        <MypageHeader />
        <MypageContent />
        <MypageFooter />
      </div>
    </DefaultLayout>
  );
};

export default Mypage;

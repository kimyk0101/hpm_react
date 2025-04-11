import MypageHeader from "./MypageHeader";
import MypageContent from "./MypageContent";
import MypageFooter from "./MypageFooter";
import DefaultLayout from "../../layouts/DefaultLayout";
import Header from "../../components/Header/Header";
import ContentContainer from "../../layouts/ContentContainer";
import "../../css/Mypage.css";
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트

const Mypage = () => {
    const navigate = useNavigate(); // useNavigate 훅 호출

    return (
        <>
            <header className="header-container">
                <ContentContainer>
                    <Header
                        title="하이펜타"
                        showBack={false}
                        showLogo={true}
                        showIcons={{ search: true }}
                        menuItems={[
                            { label: "커뮤니티", onClick: () => navigate("/communities") },
                            { label: "등산 후기", onClick: () => navigate("/hiking-reviews") },
                            { label: "맛집 후기", onClick: () => navigate("/restaurant-reviews") },
                            { label: "모임", onClick: () => navigate("/clubs") },
                        ]}
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
import Header from "../components/Header/Header";
import ContentContainer from "./ContentContainer";
import "../css/DefaultLayout.css";

// import Footer from "./Footer";

const DefaultLayout = ({ children, headerProps }) => (
  <>
    <header className="header-container">
      <ContentContainer>
        <Header {...headerProps} />
      </ContentContainer>
    </header>

    <ContentContainer>
      <main className="main-content">{children}</main>
    </ContentContainer>
    {/* <Footer /> */}
  </>
);

export default DefaultLayout;

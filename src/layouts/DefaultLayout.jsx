import Header from "../components/Header/Header";
import ContentContainer from "./ContentContainer";
import "../css/DefaultLayout.css";
// import Footer from "./Footer";

const DefaultLayout = ({ children, headerProps }) => (
  <>
    <Header {...headerProps} />
    <main className="main-content">
      <ContentContainer>{children}</ContentContainer>
    </main>
    {/* <Footer /> */}
  </>
);

export default DefaultLayout;

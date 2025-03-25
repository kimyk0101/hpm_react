import Header from "../components/Header/Header";
import "../css/DefaultLayout.css";
// import Footer from "./Footer";

const DefaultLayout = ({ children, headerProps }) => (
  <>
    <Header {...headerProps} />
    <main className="main-content">{children}</main>
    {/* <Footer /> */}
  </>
);

export default DefaultLayout;

import Header from "../components/Header/Header";
// import Footer from "./Footer";

const DefaultLayout = ({ children, headerProps }) => (
  <>
    <Header {...headerProps} />
    <main>{children}</main>
    {/* <Footer /> */}
  </>
);

export default DefaultLayout;

import DefaultLayout from "../layouts/DefaultLayout";
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
      <div classNmae="main-container">
        <h1>메인 홈페이지</h1>
      </div>
    </DefaultLayout>
  );
};

export default MainHome;

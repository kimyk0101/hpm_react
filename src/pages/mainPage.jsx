import DefaultLayout from "../layouts/DefaultLayout";

const MainHome = () => {
  return (
    <DefaultLayout
      headerProps={{
        title: "하이펜타",
        showLogo: true,
      }}
    >
      <div classNmae="main-container">
        <h1>메인 홈페이지</h1>
      </div>
    </DefaultLayout>
  );
};

export default MainHome;

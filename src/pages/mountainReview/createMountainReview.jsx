import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../components/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import { MdArrowBack } from "react-icons/md";
import "../../css/DefaultLayout.css";
import "../../css/CreateMountainReview.css";

const CreateMountainReview = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 유지
  const [user, setUser] = useState([]); // 사용자 정보
  const API_URL = "http://localhost:8088/api/mountain-reviews";

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8088/api/users/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 더미 산 정보
  const dummyMountains = [
    { id: 1, name: "한라산", location: "제주특별자치도" },
    { id: 2, name: "지리산", location: "전라남도" },
    { id: 3, name: "설악산", location: "강원도" },
    { id: 4, name: "북한산", location: "서울특별시" },
    { id: 5, name: "소백산", location: "충청북도" },
  ];

  // 더미 코스 정보
  const dummyCourses = {
    1: [
      // 한라산
      { id: 2, course_name: "백록담 코스", difficulty_level: "어려움" },
      { id: 3, course_name: "관음사 코스", difficulty_level: "중" },
    ],
    2: [
      // 지리산
      { id: 4, course_name: "어리목 코스", difficulty_level: "중" },
    ],
    3: [
      // 설악산
      { id: 5, course_name: "성판악 코스", difficulty_level: "쉬움" },
    ],
    4: [], // 북한산 → 아직 코스 없음
    5: [], // 소백산 → 아직 코스 없음
  };

  const [searchMountain, setSearchMountain] = useState("");
  const [filteredMountains, setFilteredMountains] = useState(dummyMountains);
  const [selectedMountain, setSelectedMountain] = useState(null);

  const [searchCourse, setSearchCourse] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 날짜를 "yyyy-MM-dd HH:mm:ss" 형식으로 변환하는 함수
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 초까지 포함된 형식
  };

  const [newPost, setNewPost] = useState({
    // title: "",
    content: "",
    name: "",
    location: "",
    courseName: "",
    difficultyLevel: "",
    updateDate: new Date(),
    mountainsId: "",
    mountainCoursesId: "",
  });

  // const [newPost, setNewPost] = useState({
  //   title: "",
  //   content: "",
  //   location: "",
  //   updateDate: new Date(),
  //   mountainsId: "",
  //   mountainCoursesId: "",
  // });

  // useEffect(() => {
  //   fetch("http://localhost:8088/api/mountains")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const mountainOptions = data.map((m) => ({
  //         value: m.id,
  //         label: m.name,
  //       }));
  //       setMountains(mountainOptions);
  //     });
  // }, []);

  // useEffect(() => {
  //   if (newPost.mountainsId) {
  //     fetch(
  //       `http://localhost:8088/api/mountain-courses?mountainId=${newPost.mountainsId}`
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         const courseOptions = data.map((c) => ({
  //           value: c.id,
  //           label: `${c.name} (${c.difficultyLevel})`,
  //         }));
  //         setCourses(courseOptions);
  //       });
  //   }
  // }, [newPost.mountainsId]);

  // 산 검색 필터링
  useEffect(() => {
    setFilteredMountains(
      dummyMountains.filter((m) =>
        m.name.toLowerCase().includes(searchMountain.toLowerCase())
      )
    );
  }, [searchMountain]);

  // 코스 필터링
  useEffect(() => {
    if (selectedMountain) {
      setFilteredCourses(
        dummyCourses[selectedMountain.id].filter((course) =>
          course.course_name.toLowerCase().includes(searchCourse.toLowerCase())
        )
      );
    } else {
      setFilteredCourses([]);
    }
  }, [searchCourse, selectedMountain]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다!");
      return;
    }

    const postData = {
      // title: newPost.title,
      content: newPost.content,
      name: selectedMountain?.name,
      location: selectedMountain?.location,
      course_name: selectedCourse?.course_name,
      difficulty_level: selectedCourse?.difficulty_level,
      update_date: formatDate(newPost.updateDate),
      users_id: parseInt(user.id, 10),
      mountains_id: selectedMountain?.id,
      mountain_courses_id: selectedCourse?.id,
    };

    // const postData = {
    //   title: newPost.title,
    //   content: newPost.content,
    //   location: newPost.location,
    //   update_date: formatDate(newPost.updateDate),
    //   users_id: parseInt(user.id, 10),
    //   mountains_id: parseInt(newPost.mountainsId, 10),
    //   mountain_courses_id: parseInt(newPost.mountainCoursesId, 10),
    // };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        alert("게시물이 성공적으로 등록되었습니다!");
        navigate("/mountain-reviews");
      } else {
        alert("게시글 등록 실패");
      }
    } catch (error) {
      console.error("❌ 게시글 작성 실패:", error);
    }
  };

  const handleCancel = () => {
    navigate("/mountain-reviews");
  };

  const textareaRef = useRef(null);

  // 자동 높이 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "150px";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [newPost.content]);

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>
      <DefaultLayout>
        <div className="mReviewPage-create">
          <button
            onClick={() => navigate("/mountain-reviews")}
            className="m-create-back-button"
          >
            <MdArrowBack
              size={42}
              className="m-create-back-button-default-icon"
            />
            <MdArrowBack
              size={42}
              className="m-create-back-button-hover-icon"
            />
          </button>

          <h2>새 게시물</h2>

          {isLoggedIn && (
            <form onSubmit={handlePostSubmit} className="m-post-form">
              {/* <input
                type="text"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                placeholder="제목"
                required
              /> */}

              <input
                type="text"
                placeholder="산 이름 검색"
                value={searchMountain}
                onChange={(e) => setSearchMountain(e.target.value)}
              />
              <ul>
                {filteredMountains.map((mountain) => (
                  <li
                    key={mountain.id}
                    onClick={() => {
                      setSelectedMountain(mountain);
                      setNewPost({
                        ...newPost,
                        mountainsId: mountain.id,
                        name: mountain.name,
                        location: mountain.location,
                        mountainCoursesId: "",
                        courseName: "",
                        difficultyLevel: "",
                      });
                      setSearchMountain(mountain.name);
                      setSearchCourse("");
                      setSelectedCourse(null);
                      setFilteredMountains([]);
                      setFilteredCourses([]);
                    }}
                  >
                    {mountain.name} ({mountain.location})
                  </li>
                ))}
              </ul>

              {selectedMountain && (
                <>
                  <input
                    type="text"
                    placeholder="등산 코스 검색"
                    value={searchCourse}
                    onChange={(e) => setSearchCourse(e.target.value)}
                  />
                  <ul>
                    {filteredCourses.map((course) => (
                      <li
                        key={course.id}
                        onClick={() => {
                          setSelectedCourse(course);
                          setNewPost({
                            ...newPost,
                            mountainCoursesId: course.id,
                            courseName: course.course_name,
                            difficultyLevel: course.difficulty_level,
                          });
                          setSearchCourse(course.course_name);
                        }}
                      >
                        {course.course_name} ({course.difficulty_level})
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <textarea
                className="m-post-content"
                value={newPost.content}
                ref={textareaRef}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="내용"
                required
              />

              <div className="m-post-button-container">
                <button
                  type="submit"
                  className="m-post-save"
                  data-text="게시글 등록"
                >
                  <span>게시글 등록</span>
                </button>
                <button
                  type="button"
                  className="m-post-cancel"
                  onClick={handleCancel}
                  data-text="취소"
                >
                  <span>취소</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </DefaultLayout>
    </div>
  );
};

export default CreateMountainReview;

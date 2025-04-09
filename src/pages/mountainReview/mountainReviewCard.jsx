import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext.jsx";
import CommentSection from "./CommentSection.jsx";
import "../../css/MountainReviewCard.css";
import MountainReviewLikeButton from "./MountainReviewLikeButton.jsx";

const MountainReviewCard = ({ post, currentUser }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount ?? 0);
  const [isEditing, setIsEditing] = useState(false);
  const [editPost, setEditPost] = useState({
    content: post.content,
    mountainsId: post.mountainsId,
    mountainCoursesId: post.mountainCoursesId,
  });
  const { user, isLoggedIn } = useAuth();

  const isAuthor = user?.id === post.usersId;

  const dummyMountains = [
    { id: 1, name: "한라산", location: "제주특별자치도" },
    { id: 2, name: "지리산", location: "전라남도" },
    { id: 3, name: "설악산", location: "강원도" },
    { id: 4, name: "북한산", location: "서울특별시" },
    { id: 5, name: "소백산", location: "충청북도" },
  ];

  const dummyCourses = {
    1: [
      { id: 2, course_name: "백록담 코스", difficulty_level: "어려움" },
      { id: 3, course_name: "관음사 코스", difficulty_level: "중" },
    ],
    2: [{ id: 4, course_name: "어리목 코스", difficulty_level: "중" }],
    3: [{ id: 5, course_name: "성판악 코스", difficulty_level: "쉬움" }],
    4: [],
    5: [],
  };

  const [searchMountain, setSearchMountain] = useState("");
  const [filteredMountains, setFilteredMountains] = useState(dummyMountains);
  const [selectedMountain, setSelectedMountain] = useState(null);

  const [searchCourse, setSearchCourse] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleEditChange = (e) => {
    setEditPost({ ...editPost, content: e.target.value });
  };

  //  게시물 수정
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      id: post.id,
      mountains_id: selectedMountain?.id ?? editPost.mountainsId,
      mountain_courses_id: selectedCourse?.id ?? editPost.mountainCoursesId,
      content: editPost.content,
    };

    try {
      await fetch(`http://localhost:8088/api/mountain-reviews/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      alert("게시물이 수정되었습니다!");
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("게시물 수정 실패:", error);
    }
  };

  //  게시물 삭제
  const handleDelete = async () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmed) return;

    try {
      await fetch(`http://localhost:8088/api/mountain-reviews/${post.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usersId: user.id }),
      });

      alert("게시물이 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("게시물 삭제 중 오류 발생:", error);
    }
  };

  //  상대적 시간 계산
  const formatRelativeDate = (date) => {
    const now = new Date();
    const parsedDate = new Date(date.replace(" ", "T"));
    const diffMs = now - parsedDate;
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    if (days < 30) return `${Math.floor(days / 7)}주 전`;
    return `${Math.floor(days / 30)}개월 전`;
  };

  const [isExpanded, setIsExpanded] = useState(false);

  //  더보기
  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="mReview-card-wrapper">
      <div className="mReview-post-card">
        {isAuthor && (
          <div className="mReview-card-options">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowOptions((prev) => !prev);
              }}
              className="mReview-card-options-button"
            >
              <FiMoreVertical />
            </button>

            {showOptions && (
              <div className="mReview-card-dropdown">
                <button onClick={handleEditClick}>수정</button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}

        {isEditing ? (
          <form className="mReview-edit-form" onSubmit={handleEditSubmit}>
            <input
              type="text"
              placeholder="산 이름 검색"
              value={searchMountain}
              onChange={(e) => {
                const keyword = e.target.value;
                setSearchMountain(keyword);
                setFilteredMountains(
                  dummyMountains.filter((m) =>
                    m.name.toLowerCase().includes(keyword.toLowerCase())
                  )
                );
              }}
            />
            <ul>
              {filteredMountains.map((m) => (
                <li
                  key={m.id}
                  className={selectedMountain?.id === m.id ? "selected" : ""}
                  onClick={() => {
                    setSelectedMountain(m);
                    setFilteredCourses(dummyCourses[m.id] || []);
                    setSelectedCourse(null);
                    setSearchMountain(m.name);
                    setFilteredMountains([]);
                  }}
                >
                  {m.name}
                </li>
              ))}
            </ul>

            {filteredCourses.length > 0 && (
              <>
                <input
                  type="text"
                  placeholder="코스 검색"
                  value={searchCourse}
                  onChange={(e) => {
                    const keyword = e.target.value;
                    setSearchCourse(keyword);
                    setFilteredCourses(
                      dummyCourses[selectedMountain?.id]?.filter((c) =>
                        c.course_name
                          .toLowerCase()
                          .includes(keyword.toLowerCase())
                      )
                    );
                  }}
                />
                <ul>
                  {filteredCourses.map((c) => (
                    <li
                      key={c.id}
                      className={selectedCourse?.id === c.id ? "selected" : ""}
                      onClick={() => {
                        setSelectedCourse(c);
                        setSearchCourse(c.course_name);
                        setFilteredCourses([]);
                      }}
                    >
                      {c.course_name} ({c.difficulty_level})
                    </li>
                  ))}
                </ul>
              </>
            )}

            <textarea
              value={editPost.content}
              onChange={handleEditChange}
              rows={5}
              required
            />

            <div>
              <button type="submit">저장</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                취소
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="mReview-post-header">
              <span className="mReview-post-nickname">{post.nickname}</span>
              <span className="mReview-post-meta">
                {post.name} · {post.courseName} ·{" "}
                {formatRelativeDate(post.updateDate)}
              </span>
            </div>

            {post.imageUrl && (
              <div className="mReview-post-image">
                <img src={post.imageUrl} alt="mountain review" />
              </div>
            )}

            <div className={isExpanded ? "" : "mr-content-preview"}>
              {post.content}
            </div>

            {post.content.length > 75 && (
              <button onClick={toggleExpanded} className="mr-see-more-btn">
                {isExpanded ? "접기" : "더보기"}
              </button>
            )}

            {post.tags?.length > 0 && (
              <div className="mReview-post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="mReview-post-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mReview-post-reactions">
              <MountainReviewLikeButton
                reviewId={post.id}
                currentUserId={currentUser?.id} 
              />

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments((prev) => !prev);
                }}
              >
                <span>
                  💬{" "}
                  {commentCount !== null && commentCount !== undefined
                    ? commentCount
                    : 0}
                </span>
              </span>
            </div>

            {showComments && (
              <CommentSection
                mReviewId={post.id}
                user={user}
                onCommentChange={(newCount) => setCommentCount(newCount)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MountainReviewCard;

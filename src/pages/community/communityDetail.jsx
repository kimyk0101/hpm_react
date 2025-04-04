import React, { useEffect, useState } from "react";
import { redirect, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { MdArrowBack } from "react-icons/md"; // 뒤로가기 버튼
import ContentContainer from "../../layouts/ContentContainer";
import Header from "../../components/Header/Header";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/DefaultLayout.css";
import "../../css/CommunityDetail.css";

function CommunityDetail() {
  const { id } = useParams();
  const communityId = parseInt(id, 10); // String -> Long 타입으로 변환
  const API_COMMUNITY_URL = `http://localhost:8088/api/communities/${communityId}`;
  const API_COMMENT_URL = `http://localhost:8088/api/communities/${communityId}/comments`;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [user, setUser] = useState([]); //  login 부분
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
  const [editPost, setEditPost] = useState(null); // 수정할 게시글 상태 추가
  const [editComment, setEditComment] = useState(null); // 수정할 댓글 상태 추가
  const [replyingTo, setReplyingTo] = useState(null); // 어떤 댓글에 대댓글을 다는지
  const [replyContent, setReplyContent] = useState(""); // 대댓글 내용
  const [editReply, setEditReply] = useState(null);
  const [replies, setReplies] = useState({});

  const navigate = useNavigate(); // useNavigate 훅 사용

  // 로그인 상태 확인 함수
  const checkLoginStatus = async () => {
    try {
      const response = await fetch("http://localhost:8088/api/users/session", {
        method: "GET",
        credentials: "include", // 쿠키를 포함하여 요청
      });

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUser(data); // 로그인된 사용자 정보 저장
        console.log(data);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  }, []);

  const fetchPostDetail = async () => {
    try {
      const response = await fetch(API_COMMUNITY_URL); // API 요청
      const data = await response.json(); // 응답 데이터 처리

      // 서버 응답에서 usersId 필드 확인 후 클라이언트에서 처리
      console.log(data); // 데이터 확인

      const postData = {
        id: data.id,
        nickname: data.nickname,
        title: data.title,
        content: data.content,
        updateDate: new Date(data.update_date),
        usersId: data.users_id,
        views: data.views,
      };
      console.log(postData);

      setPost(postData); // 상태 업데이트
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
    }
  };
  // ✅ 게시글 상세 정보 가져오기
  useEffect(() => {
    fetchPostDetail();
  }, [communityId]); // 게시글 ID가 바뀔 때만 실행

  // 게시글 수정
  const handleEditPost = async (e) => {
    e.preventDefault();

    const updatedPost = {
      id: editPost.id,
      title: editPost.title,
      content: editPost.content,
    };

    try {
      await fetch(API_COMMUNITY_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });
      // 수정 후 게시글 목록 갱신
      fetchPostDetail();
      setEditPost(null); // 수정 완료 후 수정 폼 초기화

      // 수정 완료 알림
      alert("수정이 완료되었습니다");
    } catch (error) {
      console.error("게시글 수정 실패:", error);
    }
  };

  const handleDeletePost = async () => {
    // 삭제 확인 대화 상자
    const isConfirmed = window.confirm("정말 삭제할까요?");

    // 사용자가 삭제를 확인하면 삭제 진행
    if (isConfirmed) {
      try {
        const response = await fetch(API_COMMUNITY_URL, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ usersId: user.id }), // 로그인한 사용자의 usersId를 전달
        });

        // response.ok로 삭제 성공 여부 확인
        if (response.ok) {
          alert("게시글 삭제 성공");
          // 삭제 후 목록 갱신 (리스트 페이지로 이동)
          navigate("/communities");
        } else {
          // 실패 시 에러 출력
          console.error("게시글 삭제 실패", await response.json());
        }
      } catch (error) {
        console.error("게시글 삭제 중 오류 발생:", error);
      }
    } else {
      // 사용자가 취소를 클릭한 경우
      console.log("삭제가 취소되었습니다.");
    }
  };

  // 전체 댓글 트리 구조 만들기
  const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
      comment.children = []; // 자식 초기화
      map[comment.id] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parent_id === null) {
        roots.push(comment); // 최상위 부모
      } else {
        const parent = map[comment.parent_id];
        if (parent) {
          parent.children.push(comment);
        }
      }
    });

    return roots;
  };

  // 댓글 불러오기 (부모 댓글 + 자식 댓글)
  const fetchComments = async () => {
    try {
      const response = await fetch(API_COMMENT_URL);
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.warn("댓글 데이터가 없습니다.");
        setComments([]);
        return;
      }

      const treeData = buildCommentTree(data);
      setComments(treeData);
      console.log("🌳 트리 구조로 변환된 댓글 데이터:", treeData);
    } catch (error) {
      console.error("댓글 불러오기 실패:", error);
    }
  };

  // `communityId` 변경될 때만 실행
  useEffect(() => {
    fetchComments();
  }, [communityId]);

  const [newComment, setNewComment] = useState("");
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

  // 댓글 추가
  const handleSubmitComment = async () => {
    if (!newComment || newComment.trim() === "") {
      alert("댓글을 입력하세요.");
      return;
    }

    const commentData = {
      id: newComment.id || null,
      content: newComment, // 반드시 문자열이어야 함!
      update_date: formatDate(new Date()),
      users_id: parseInt(user.id, 10),
      communities_id: communityId,
      parent_id: null,
    };

    try {
      const response = await fetch(API_COMMENT_URL, {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      setNewComment(""); // 댓글 입력창 초기화
      fetchComments();
    } catch (error) {
      console.error("댓글 추가 실패:", error);
    }
  };

  // 댓글 수정
  const handleEditComment = async (e) => {
    e.preventDefault();

    if (!editComment.content.trim()) {
      return;
    }

    const commentId = parseInt(editComment.id, 10);
    const API_COMMENT_URL = `http://localhost:8088/api/communities/comments/${commentId}`;

    try {
      const response = await fetch(API_COMMENT_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editComment.content }),
      });

      if (!response.ok) throw new Error("댓글 수정 실패");

      fetchComments(); // 댓글 수정 후 다시 불러오기
      setEditComment(null); // 수정 성공 후 초기화
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  // 수정 버튼 클릭 시, 해당 댓글의 내용을 가져오기
  const handleEditClick = (comment) => {
    setEditComment({ id: comment.id, content: comment.content });
  };

  // 댓글 삭제
  const handleDeleteComment = async (id) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!isConfirmed) return;

    const commentId = parseInt(id, 10);
    const API_COMMENT_URL = `http://localhost:8088/api/communities/comments/${commentId}`;

    try {
      const response = await fetch(API_COMMENT_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usersId: user.id }), // 본인 확인
      });

      if (response.ok) {
        alert("댓글이 삭제되었습니다.");
        fetchComments(); // 삭제 후 다시 불러오기 (상태 관리 통일)
      } else {
        const errorData = await response.json();
        console.error("댓글 삭제 실패", errorData);
        alert("댓글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("댓글 삭제 중 오류 발생:", error);
      alert("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 대댓글 입력창 토글
  const toggleReply = (commentId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다");
      return;
    }
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  //  대댓글 생성
  const handleReplySubmit = async (parentId) => {
    if (!replyContent[parentId]?.trim()) {
      alert("답글을 입력하세요");
      return;
    }

    const replyData = {
      content: replyContent[parentId],
      update_date: formatDate(new Date()),
      users_id: parseInt(user.id, 10),
      parent_id: parentId, // 꼭 필요!
    };

    try {
      const response = await fetch(
        `http://localhost:8088/api/communities/${communityId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(replyData),
        }
      );

      if (!response.ok) throw new Error(`서버 오류: ${response.status}`);

      setReplyContent((prev) => ({ ...prev, [parentId]: "" }));
      fetchComments(); // 전체 댓글 + 대댓글 새로 불러오기
    } catch (error) {
      console.error("대댓글 추가 실패:", error);
    }
  };

  // 대댓글 수정
  const handleEditReplyClick = (reply) => {
    setEditReply(reply);
  };

  const handleEditReply = async (replyId) => {
    if (!editReply.content.trim()) return;

    try {
      const response = await fetch(
        `http://localhost:8088/api/communities/comments/replies/${replyId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editReply.content }),
        }
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) => ({
            ...comment,
            children: comment.children.map((r) =>
              r.id === replyId ? { ...r, content: editReply.content } : r
            ),
          }))
        );
        setEditReply(null); // 수정 입력창 닫기
      }
    } catch (error) {
      console.error("대댓글 수정 실패:", error);
    }
  };

  //  대댓글 삭제
  const handleDeleteReply = async (replyId) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");
    if (!isConfirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8088/api/communities/comments/replies/${replyId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usersId: user.id }), // 본인 확인
        }
      );

      if (response.ok) {
        alert("답글이 삭제되었습니다.");
        setComments((prevComments) =>
          prevComments.map((comment) => ({
            ...comment,
            children: comment.children.filter((r) => r.id !== replyId),
          }))
        );
      } else {
        const errorData = await response.json();
        console.error("답글 삭제 실패", errorData);
        alert("답글 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("답글 삭제 중 오류 발생:", error);
      alert("답글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 뒤로가기 버튼
  const onBack = () => {
    navigate("/communities"); // 리스트 페이지로 이동
  };

  return (
    <div>
      <ContentContainer>
        <Header title="하이펜타" showLogo={true} showIcons={{ search: true }} />
      </ContentContainer>
      <DefaultLayout>
        <div className="communityPage-detail">
          {/* 뒤로가기 버튼 */}
          <button
            onClick={() => navigate("/communities")}
            className="c-detail-back-button"
          >
            <MdArrowBack
              size={42}
              className="c-detail-back-button-default-icon"
            />
            <MdArrowBack
              size={42}
              className="c-detail-back-button-hover-icon"
            />
          </button>
          <h2>
            게시글 상세보기{" "}
            {editPost && <span className="c-edit-label"> &lt;수정중&gt;</span>}
          </h2>

          {post ? (
            editPost ? (
              // ✨ 게시글 수정 폼
              <div className="c-detail-edit-form">
                <div className="c-detail-input-container">
                  <h3>
                    <input
                      type="text"
                      value={editPost.title}
                      onChange={(e) =>
                        setEditPost({ ...editPost, title: e.target.value })
                      }
                      placeholder="제목"
                      required
                      className="c-detail-edit-title"
                    />
                  </h3>
                  <div className="c-detail-tooltip">
                    수정할 수 있는 부분입니다
                  </div>
                </div>
                <p className="c-detail-nickname">{post.nickname}</p>

                <div className="c-detail-meta">
                  <p className="c-detail-date">
                    {post.updateDate.toLocaleString()}
                  </p>
                  <p className="c-detail-views">조회 {post.views}</p>
                </div>
                <div className="c-detail-input-container">
                  <textarea
                    value={editPost.content}
                    onChange={(e) =>
                      setEditPost({ ...editPost, content: e.target.value })
                    }
                    placeholder="내용을 입력하세요..."
                    required
                    className="c-detail-edit-content"
                  />
                  <div className="c-detail-tooltip">
                    수정할 수 있는 부분입니다
                  </div>
                </div>

                <div className="c-detail-buttons">
                  <button
                    type="submit"
                    onClick={handleEditPost}
                    className="c-detail-save"
                    data-text="수정 완료"
                  >
                    <span>수정 완료</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPost(null)}
                    className="c-detail-cancel"
                    data-text="취소"
                  >
                    <span>취소</span>
                  </button>
                </div>
              </div>
            ) : (
              // ✨ 게시글 상세 보기
              <div className="c-detail-post">
                <h3>{post.title}</h3>
                <p className="c-detail-nickname">{post.nickname}</p>
                <div className="c-detail-meta">
                  <p className="c-detail-date">
                    {new Date(post.updateDate).toLocaleString("ko-KR", {
                      hour12: false, // 24시간 형식으로 표시
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                  <p className="c-detail-views">조회 {post.views}</p>
                </div>
                <p className="c-detail-content">{post.content}</p>
              </div>
            )
          ) : (
            <p>게시글을 불러오는 중...</p>
          )}
          {/* 로그인된 사용자와 게시글 작성자가 일치할 경우에만 수정, 삭제 버튼 표시 */}

          {isLoggedIn && user.id === post?.usersId && !editPost && (
            <div className="c-detail-buttons">
              <button
                className="c-detail-edit-delete-button"
                onClick={() => setEditPost(post)} // 기존 방식 변경
                data-text="수정"
              >
                <span>수정</span>
              </button>
              <button
                className="c-detail-edit-delete-button"
                onClick={handleDeletePost}
                data-text="삭제"
              >
                <span>삭제</span>
              </button>
            </div>
          )}

          {/* 댓글 */}
          <div className="c-detail-comments">
            {/* 댓글 목록 */}
            {comments.length === 0 && (
              <div className="c-detail-no-comments">첫 댓글을 남겨보세요</div>
            )}

            {comments.map((comment) => {
              const isAuthor = user?.id === comment.users_id; // 작성자 여부 체크

              return (
                <div key={comment.id} className="c-detail-comment">
                  {/* 닉네임 + 작성자 표시 */}
                  <div className="c-detail-comment-header">
                    <span className="c-detail-comment-nickname">
                      {comment.nickname}
                    </span>
                    {isAuthor && (
                      <span className="c-detail-comment-author-badge">
                        작성자
                      </span>
                    )}
                  </div>

                  {/* 댓글 수정 중일 경우 textarea 표시 */}
                  {editComment && editComment.id === comment.id ? (
                    <div className="c-detail-comment-edit-wrapper">
                      <textarea
                        className="c-detail-comment-textarea"
                        value={editComment.content}
                        onChange={(e) =>
                          setEditComment({
                            ...editComment,
                            content: e.target.value,
                          })
                        }
                      />
                      <div className="c-detail-comment-edit-buttons">
                        <button
                          className="c-detail-comment-edit-button"
                          onClick={handleEditComment}
                        >
                          수정 완료
                        </button>
                        <button
                          className="c-detail-comment-edit-button"
                          onClick={() => setEditComment(null)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 수정 모드 아닐 때의 댓글 내용 (클릭하면 답글 보이게)
                    // <p
                    //   className="c-detail-comment-content"
                    //   onClick={() => fetchReplies(comment.id)}
                    // >
                    //   {comment.content}
                    // </p>
                    <p className="c-detail-comment-content">
                      {comment.content}
                    </p>
                  )}

                  {/* 댓글 작성일 + 답글쓰기 버튼 */}
                  <div className="c-detail-comment-meta">
                    <span className="c-detail-comment-updateDate">
                      {comment.update_date}
                    </span>
                    <button
                      className="c-detail-comment-reply-button"
                      onClick={() => toggleReply(comment.id)}
                    >
                      답글 쓰기
                    </button>
                  </div>

                  {/* 댓글 수정/삭제 버튼 */}
                  {isLoggedIn && isAuthor && !editComment && (
                    <div className="c-detail-comments-buttons">
                      <button
                        className="c-detail-comments-edit-delete-button"
                        onClick={() => handleEditClick(comment)}
                      >
                        수정
                      </button>
                      <button
                        className="c-detail-comments-edit-delete-button"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        삭제
                      </button>
                    </div>
                  )}

                  {/* 대댓글 입력 창 */}
                  {isLoggedIn && replyingTo === comment.id && (
                    <div className="c-detail-reply-input">
                      <textarea
                        value={replyContent[comment.id] || ""}
                        onChange={(e) =>
                          setReplyContent({
                            ...replyContent,
                            [comment.id]: e.target.value,
                          })
                        }
                        placeholder="답글을 입력하세요."
                      />
                      <button
                        className="c-detail-reply-input-button"
                        onClick={() => handleReplySubmit(comment.id)}
                      >
                        답글 작성
                      </button>
                    </div>
                  )}

                  {/* 대댓글 목록 */}
                  {comment.children && comment.children.length > 0 && (
                    <div className="c-detail-replies">
                      {comment.children.map((reply) => {
                        const isReplyAuthor = user?.id === reply.users_id;

                        return (
                          <div key={reply.id} className="c-detail-reply">
                            {/* 닉네임 + 작성자 배지 */}
                            <div className="c-detail-reply-header">
                              <span className="c-detail-reply-nickname">
                                {reply.nickname}
                              </span>
                              {isReplyAuthor && (
                                <span className="c-detail-reply-author-badge">
                                  작성자
                                </span>
                              )}
                            </div>

                            {/* 답글 수정 모드 */}
                            {editReply && editReply.id === reply.id ? (
                              <div className="c-detail-reply-edit-wrapper">
                                <textarea
                                  className="c-detail-reply-textarea"
                                  value={editReply.content}
                                  onChange={(e) =>
                                    setEditReply({
                                      ...editReply,
                                      content: e.target.value,
                                    })
                                  }
                                />
                                <div className="c-detail-reply-edit-buttons">
                                  <button
                                    className="c-detail-reply-edit-button"
                                    onClick={() => handleEditReply(reply.id)}
                                  >
                                    수정 완료
                                  </button>
                                  <button
                                    className="c-detail-reply-edit-button"
                                    onClick={() => setEditReply(null)}
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                {/* 답글 내용 */}
                                <p className="c-detail-reply-content">
                                  {reply.content}
                                </p>

                                {/* 답글 작성일 */}
                                <span className="c-detail-comment-updateDate">
                                  {reply.update_date}
                                </span>

                                {/* 답글 수정/삭제 버튼 */}
                                {isLoggedIn && isReplyAuthor && (
                                  <div className="c-detail-reply-buttons">
                                    <button
                                      className="c-detail-replies-edit-delete-button"
                                      onClick={() =>
                                        handleEditReplyClick(reply)
                                      }
                                    >
                                      수정
                                    </button>
                                    <button
                                      className="c-detail-replies-edit-delete-button"
                                      onClick={() =>
                                        handleDeleteReply(reply.id)
                                      }
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* 댓글 입력 창을 가장 아래쪽으로 이동 */}
            {isLoggedIn ? (
              <div className="c-detail-comment-input">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="댓글을 입력하세요..."
                />
                <button
                  className="c-detail-comment-input-button"
                  onClick={handleSubmitComment}
                >
                  댓글 작성
                </button>
              </div>
            ) : (
              <p className="c-login-redirect-message">
                댓글을 작성하려면 로그인하세요.
                <span>
                  <button
                    className="c-detail-login-redirect"
                    onClick={() => navigate("/login")}
                  >
                    &lt;로그인 하러 가기&gt;
                  </button>
                </span>
              </p>
            )}
          </div>
        </div>
      </DefaultLayout>
    </div>
  );
}

export default CommunityDetail;

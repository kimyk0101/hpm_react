import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DefaultLayout from "../../layouts/DefaultLayout";
import "../../css/ClubComments.css";
import { useAuth } from "../../contexts/AuthContext";
import Modal from "react-modal";

const ClubComments = () => {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCommentContent, setNewCommentContent] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState("");
    const [deleteCommentId, setDeleteCommentId] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const { user } = useAuth();
    const [isChatModalOpen, setIsChatModalOpen] = useState(false); // 채팅방 입장 모달 상태 추가

    const modalRef = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8088/api/club-comments/clubs/${id}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
                }
                const data = await response.json();
                setComments(data.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)));
            } catch (error) {
                console.error("공지사항 목록을 불러오는 중 오류 발생:", error);
                setError(`공지사항 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
            }
        };

        fetchComments();
        Modal.setAppElement("#root");
    }, [id]);

    const openModal = () => {
        setIsModalOpen(true);
        if (modalRef.current) {
            modalRef.current.focus();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openChatModal = () => {
        setIsChatModalOpen(true);
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
    };

    const handleChatEnter = () => {
        openChatModal();
    };

    const handleCommentSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:8088/api/club-comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newCommentContent,
                    clubsId: id,
                    usersId: user.id,
                    updateDate: new Date(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const updatedCommentsResponse = await fetch(`http://localhost:8088/api/club-comments/clubs/${id}`);
            const updatedCommentsData = await updatedCommentsResponse.json();
            setComments(updatedCommentsData.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)));

            closeModal();
            setNewCommentContent("");
        } catch (error) {
            console.error("공지사항 등록 중 오류 발생:", error);
            setError(`공지사항 등록 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const openEditModal = (comment) => {
        if (user.id !== comment.usersId) {
            alert("작성자만 수정 가능합니다.");
            return;
        }

        setEditingCommentId(comment.id);
        setEditedCommentContent(comment.content);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
    };

    const handleUpdateComment = async () => {
        try {
            const response = await fetch(`http://localhost:8088/api/club-comments/${editingCommentId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: editedCommentContent,
                    updateDate: new Date(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const updatedCommentsResponse = await fetch(`http://localhost:8088/api/club-comments/clubs/${id}`);
            const updatedCommentsData = await updatedCommentsResponse.json();
            setComments(updatedCommentsData.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)));

            closeEditModal();
            setEditingCommentId(null);
            setEditedCommentContent("");
        } catch (error) {
            console.error("공지사항 수정 중 오류 발생:", error);
            setError(`공지사항 수정 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    const openDeleteModal = (commentId, usersId) => {
        if (user.id !== usersId) {
            alert("작성자만 삭제 가능합니다.");
            return;
        }

        setDeleteCommentId(commentId);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeleteCommentId(null);
    };

    const confirmDeleteComment = async () => {
        if (deleteCommentId) {
            await handleDeleteComment(deleteCommentId);
            closeDeleteModal();
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8088/api/club-comments/${commentId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
            }

            const updatedCommentsResponse = await fetch(`http://localhost:8088/api/club-comments/clubs/${id}`);
            const updatedCommentsData = await updatedCommentsResponse.json();
            setComments(updatedCommentsData.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)));
        } catch (error) {
            console.error("공지사항 삭제 중 오류 발생:", error);
            setError(`공지사항 삭제 중 오류가 발생했습니다: ${error.message}`);
        }
    };

    return (
        <div>
            <DefaultLayout
                headerProps={{
                    title: "하이펜타",
                    showLogo: true,
                    showIcons: { search: true },
                }}
            >
                <div className="club-comments-page">
                    <div className="button-container">
                        <button onClick={handleChatEnter} className="chat-button">
                            채팅방 입장
                        </button>
                        <button onClick={openModal} className="add-comment-button">
                            공지사항 등록
                        </button>
                    </div>
                    <button onClick={() => navigate("/clubs")} className="back-button">
                        뒤로 가기
                    </button>
                    <h2>공지사항</h2>

                    {error && <p style={{ color: "red" }}>{error}</p>}

                    {comments.length > 0 ? (
                        <table className="comments-table">
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>내용</th>
                                    <th>작성자</th>
                                    <th>작성일</th>
                                    <th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comments.map((comment, index) => {
                                    const date = new Date(comment.updateDate);
                                    const formattedDate = date.toLocaleDateString("ko-KR", {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    });
                                    const formattedTime = date.toLocaleTimeString("ko-KR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <tr key={comment.id}>
                                            <td>{comments.length - index}</td>
                                            <td>{comment.content}</td>
                                            <td>{comment.nickname}</td>
                                            <td>{`${formattedDate} ${formattedTime}`}</td>
                                            <td>
                                                <button onClick={() => openEditModal(comment)}>수정</button>
                                                <button onClick={() => openDeleteModal(comment.id, comment.usersId)}>삭제</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p>공지사항이 없습니다.</p>
                    )}

                    {isModalOpen && (
                        <Modal
                            isOpen={isModalOpen}
                            onRequestClose={closeModal}
                            contentLabel="공지사항 등록 모달"
                            ref={modalRef}
                            className={{
                                base: "modal-content",
                                overlay: "modal-overlay",
                            }}
                        >
                            <div className="modal-content">
                                <h2>공지사항 등록</h2>
                                <textarea value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} placeholder="공지사항 내용을 입력하세요." />
                                <div className="modal-buttons">
                                    <button onClick={handleCommentSubmit}>등록</button>
                                    <button onClick={closeModal}>취소</button>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {isEditModalOpen && (
                        <Modal
                            isOpen={isEditModalOpen}
                            onRequestClose={closeEditModal}
                            contentLabel="공지사항 수정 모달"
                            ref={modalRef}
                            className={{
                                base: "modal-content",
                                overlay: "modal-overlay",
                            }}
                        >
                            <div className="modal-content">
                                <h2>공지사항 수정</h2>
                                <textarea value={editedCommentContent} onChange={(e) => setEditedCommentContent(e.target.value)} placeholder="공지사항 내용을 수정하세요." />
                                <div className="modal-buttons">
                                    <button onClick={handleUpdateComment}>저장</button>
                                    <button onClick={closeEditModal}>취소</button>
                                </div>
                            </div>
                        </Modal>
                    )}

                    {isDeleteModalOpen && (
                        <Modal
                            isOpen={isDeleteModalOpen}
                            onRequestClose={closeDeleteModal}
                            contentLabel="공지사항 삭제 확인 모달"
                            ref={modalRef}
                            className={{
                                base: "modal-content",
                                overlay: "modal-overlay",
                            }}
                        >
                            <div className="modal-content">
                                <h2>공지사항 삭제 확인</h2>
                                <p>정말 삭제하시겠습니까?</p>
                                <div className="modal-buttons">
                                    <button onClick={confirmDeleteComment}>예</button>
                                    <button onClick={closeDeleteModal}>아니오</button>
                                </div>
                            </div>
                        </Modal>
                    )}
                    {isChatModalOpen && (
                        <Modal
                            isOpen={isChatModalOpen}
                            onRequestClose={closeChatModal}
                            contentLabel="채팅방 입장 모달"
                            className={{
                                base: "modal-content",
                                overlay: "modal-overlay",
                            }}
                        >
                            <div className="modal-content">
                                <h2>채팅방 입장</h2>
                                <p>채팅방에 입장하시겠습니까?</p>
                                <div className="modal-buttons">
                                    <button onClick={() => navigate(`/chatSendbird/${id}`)}>입장</button>
                                    <button onClick={closeChatModal}>취소</button>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
            </DefaultLayout>
        </div>
    );
};

export default ClubComments;
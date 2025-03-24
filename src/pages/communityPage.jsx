import React, { useEffect, useState } from "react";
import "../css/Board.css"; // CSS 파일 연결

const API_URL = "http://localhost:8088/api/communities";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("게시글 불러오기 실패:", error);
    }
  };

  // 글 작성
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (error) {
      console.error("작성 실패:", error);
    }
  };

  // 글 삭제
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="board-container">
      <h1 className="board-title">📌 게시판</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="textarea"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="submit-button" type="submit">
          작성하기
        </button>
      </form>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            <button
              className="delete-button"
              onClick={() => handleDelete(post.id)}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Board;

import React, { useState, useEffect } from 'react';

const MountainReviewPage = () => {
  const [posts, setPosts] = useState([]);

  // 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8088/api/reviews'); // API 주소
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('게시글 불러오기 실패:', error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <h2>등산 후기</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MountainReviewPage;

import React, { useState, useEffect } from 'react';

const RestaurantReviewPage = () => {
  const [posts, setPosts] = useState([]);

  // 게시글 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8088/api/restaurants'); // API 주소
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
      <h2>맛집 후기</h2>
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

export default RestaurantReviewPage;

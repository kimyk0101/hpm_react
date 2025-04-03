import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

const RestaurentPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // TODO: API 연동 예정
    const fetchPosts = async () => {
      const dummy = [
        { id: 1, title: "맛집 리뷰 1", date: "2025-04-01" },
        { id: 2, title: "맛집 리뷰 2", date: "2025-04-02" },
      ];
      setPosts(dummy);
    };

    if (user?.id) fetchPosts();
  }, [user]);

  return (
    <div>
      <h4>내가 쓴 맛집 리뷰</h4>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> <span>{post.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurentPosts;

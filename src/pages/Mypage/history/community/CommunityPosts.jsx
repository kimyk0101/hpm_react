import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";

const CommunityPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: API 연동 예정
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8088/api/communities/my/${user.id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("글 목록을 불러오지 못했습니다.");

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user?.id) fetchPosts();
  }, [user]);

  return (
    <div>
      <h4>내가 쓴 커뮤니티 글</h4>
      <ul>
        {posts.map((post) => (
          <li
            key={post.id}
            className="post-item"
            onClick={() => navigate(`/communities/${post.id}`)}
            style={{ cursor: "pointer" }}
          >
            <strong className="post-title">{post.title}</strong>
            <div className="post-meta">
              {/* <span>{post.nickname}</span> */}
              <span>{post.update_date?.slice(0, 10)}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommunityPosts;

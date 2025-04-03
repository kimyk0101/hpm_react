import { useEffect, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";

const MountainComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // TODO: API 연동 예정
    const fetchComments = async () => {
      const dummy = [
        { id: 301, content: "등산 댓글 1입니다", date: "2025-04-01" },
        { id: 302, content: "등산 댓글 2입니다", date: "2025-04-02" },
      ];
      setComments(dummy);
    };

    if (user?.id) fetchComments();
  }, [user]);

  return (
    <div>
      <h4>내가 쓴 등산 댓글</h4>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <span>{comment.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MountainComments;

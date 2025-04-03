// ✅ components/mypage/ProfileImage.jsx
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import PreviewModal from "../../components/modal/PreviewModal";
import { FaEdit } from "react-icons/fa";

const ProfileImage = () => {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const fileInputRef = useRef();
  const menuRef = useRef();
  const selectedFileRef = useRef(null);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const res = await fetch(
          `http://localhost:8088/api/userPhoto/view/${user.id}`
        );
        const data = (await res.ok) ? await res.json() : null;

        if (data?.file_path) {
          setImageUrl(`http://localhost:8088${data.file_path}?t=${Date.now()}`);
        } else {
          setImageUrl("/default-profile.jpg");
        }
      } catch (err) {
        console.error("사진 불러오기 실패:", err);
        setImageUrl("/default-profile.jpg");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) fetchPhoto();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
      setIsPreviewOpen(true);
    };
    reader.readAsDataURL(file);
    selectedFileRef.current = file;
  };

  const confirmUpload = async () => {
    const file = selectedFileRef.current;
    if (!file || !user?.id) return;

    try {
      const formData = new FormData();
      formData.append("usersId", user.id);
      formData.append("photo", file);

      const res = await fetch("http://localhost:8088/api/userPhoto/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // console.log("응답 데이터", data);
        // setImageUrl(`http://localhost:8088${data.file_path}?t=${Date.now()}`);
        const imageUrl = `http://localhost:8088${
          data.file_path
        }?t=${Date.now()}`;
        // console.log("업로드 후 이미지 URL:", imageUrl);
        setImageUrl(imageUrl);
        setIsPreviewOpen(false);
        setMenuOpen(false);
      }
    } catch (err) {
      console.error("업로드 실패:", err);
    }
  };

  const handleDelete = async () => {
    const confirm = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirm) return;

    try {
      const res = await fetch(
        `http://localhost:8088/api/userPhoto/delete/${user.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setImageUrl("/default-profile.jpg");
        alert("사진이 삭제되었습니다.");
      }
    } catch (err) {
      console.error("삭제 실패:", err);
    }
  };

  return (
    <div className="profile-wrapper">
      <div
        className="profile-img-container"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {!isLoading && (
          <img
            src={imageUrl}
            alt="프로필"
            className={`profile-img ${!isLoading ? "profile-img-loaded" : ""}`}
          />
        )}

        <div className="edit-menu-wrapper">
          <FaEdit className="edit-icon" />
          {menuOpen && (
            <div
              className="profile-menu"
              ref={menuRef}
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => fileInputRef.current.click()}>
                프로필 사진 변경
              </button>
              <button onClick={handleDelete}>프로필 사진 삭제</button>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e.target.files[0])}
      />

      {isPreviewOpen && (
        <PreviewModal
          imageUrl={previewUrl}
          onConfirm={confirmUpload}
          onCancel={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default ProfileImage;

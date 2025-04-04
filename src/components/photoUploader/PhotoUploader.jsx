// ✅ components/PhotoUploader/PhotoUploader.jsx
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import "../../css/PhotoUploader.css";

const PhotoUploader = forwardRef(
  ({ onChange, initialPhotos = [], onDeleteServerPhoto }, ref) => {
    const [localImages, setLocalImages] = useState([]); // 아직 서버에 저장되지 않은 이미지
    const [serverImages, setServerImages] = useState([]); // 서버에서 가져온 기존 이미지
    const fileInputRef = useRef();

    // 🔁 초기 서버 이미지 주입 (게시글 수정 시)
    useEffect(() => {
      if (initialPhotos && initialPhotos.length > 0) {
        setServerImages(initialPhotos);
      }
    }, [initialPhotos]);

    const handleFiles = (files) => {
      const newFiles = Array.from(files);
      const combined = [...localImages, ...newFiles];
      setLocalImages(combined);
      onChange([...serverImages, ...combined]);
    };

    const handleDeleteLocal = (index) => {
      const updated = localImages.filter((_, i) => i !== index);
      setLocalImages(updated);
      onChange([...serverImages, ...updated]);
    };

    const handleDeleteServer = (photo) => {
      if (onDeleteServerPhoto) {
        onDeleteServerPhoto(photo.id);
      }
      const updated = serverImages.filter((p) => p.id !== photo.id);
      setServerImages(updated);
      onChange([...updated, ...localImages]);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    };

    const handleInputChange = (e) => {
      handleFiles(e.target.files);
    };

    useImperativeHandle(ref, () => ({
      getFiles: () => localImages,
    }));

    return (
      <div
        className="photo-uploader-wrapper"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* ✅ 서버 이미지 미리보기 */}
        {serverImages.length > 0 && (
          <div className="preview-container">
            {serverImages.map((photo, index) => (
              <div key={`server-${index}`} className="preview-image">
                <img
                  src={`http://localhost:8088${photo.file_path}`}
                  alt="server"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleDeleteServer(photo)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ 로컬 이미지 미리보기 */}
        {localImages.length > 0 && (
          <div className="preview-container">
            {localImages.map((file, index) => (
              <div key={`local-${index}`} className="preview-image">
                <img src={URL.createObjectURL(file)} alt="preview" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => handleDeleteLocal(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 등록 버튼은 항상 보이게 */}
        <div className="upload-button-container">
          <button
            type="button"
            className="upload-button"
            onClick={() => fileInputRef.current.click()}
          >
            이미지
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    );
  }
);

export default PhotoUploader;

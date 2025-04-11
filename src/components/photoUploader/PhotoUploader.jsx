import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import "../../css/PhotoUploader.css";

const PhotoUploader = forwardRef(
  (
    { onChange, initialPhotos = [], onDeleteServerPhoto, className = "" },
    ref
  ) => {
    const [localImages, setLocalImages] = useState([]); // 아직 서버에 저장되지 않은 이미지
    const [serverImages, setServerImages] = useState([]); // 서버에서 가져온 기존 이미지
    const fileInputRef = useRef();

    // 🔁 초기 서버 이미지 주입 (게시글 수정 시)
    useEffect(() => {
      if (initialPhotos && initialPhotos.length > 0) {
        setServerImages(initialPhotos);
      }
    }, [initialPhotos]);

    const MAX_IMAGE_COUNT = 8; // 최대 이미지 개수

    const handleFiles = (files) => {
      const newFiles = Array.from(files);

      // 전체 개수 계산 (기존 서버 이미지 + 로컬 이미지 + 새로 추가될 이미지)
      const totalCount =
        serverImages.length + localImages.length + newFiles.length;

      if (totalCount > MAX_IMAGE_COUNT) {
        alert(`이미지는 최대 ${MAX_IMAGE_COUNT}장까지 업로드할 수 있습니다.`);
        return;
      }

      // ✅ 로컬 이미지 상태는 오직 newFiles 기준
      const updatedLocal = [...localImages, ...newFiles];
      setLocalImages(updatedLocal);

      // ✅ 서버 이미지 + 로컬 이미지만 합쳐서 상위로 전달
      onChange([...serverImages, ...updatedLocal]);
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
      getServerPhotos: () => serverImages.map((photo) => photo.file_name), // 또는 photo.id
    }));

    return (
      <div
        className={`photo-uploader-wrapper ${className}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {(serverImages.length > 0 || localImages.length > 0) && (
          <>
            <div className="preview-container">
              {serverImages.map((photo, index) => (
                <div key={`server-${index}`} className="preview-image">
                  <img src={photo.file_path} alt="server" />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleDeleteServer(photo)}
                  >
                    &times;
                  </button>
                </div>
              ))}
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

            {/* ✅ 프리뷰 아래 하단 바 */}
            <div className="bottom-bar">
              <p className="image-count">
                {serverImages.length + localImages.length} / {MAX_IMAGE_COUNT}
              </p>
            </div>
          </>
        )}

        {/* ✅ 업로드 버튼은 항상 보이게 */}
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

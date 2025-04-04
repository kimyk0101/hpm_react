// ✅ components/PhotoUploader/PhotoUploader.jsx
import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import "../../css/PhotoUploader.css";

const PhotoUploader = forwardRef(({ onChange }, ref) => {
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef();

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const combined = [...previewImages, ...newFiles];
    setPreviewImages(combined);
    onChange(combined);
  };

  const handleDelete = (index) => {
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    onChange(updated);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
  };

  // 외부에서 파일을 추가할 수 있도록 ref 메서드 노출
  useImperativeHandle(ref, () => ({
    addExternalFile: (file) => handleFiles([file]),
    getFiles: () => previewImages,
  }));

  return (
    <div
      className="photo-uploader-wrapper"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* ✅ 이미지가 있을 때만 보여주기 */}
      {previewImages.length > 0 && (
        <div className="preview-container">
          {previewImages.map((file, index) => (
            <div key={index} className="preview-image">
              <img src={URL.createObjectURL(file)} alt="preview" />
              <button
                type="button"
                className="remove-btn"
                onClick={() => handleDelete(index)}
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
});

export default PhotoUploader;

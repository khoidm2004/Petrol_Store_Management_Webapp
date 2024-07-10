// Hook uses to preview and change the image
import { useState } from "react";

const usePreviewImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const maxFileSizeInBytes = 2 * 1024 * 1024; // File max size 2MB

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > maxFileSizeInBytes) {
        setSelectedFile(null);
        setError({
          Title: "Lỗi",
          Message: "Kích thước file phải nhỏ hơn 2MB",
          Status: "error",
        });
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedFile(reader.result);
        setError(null);
      };

      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setError(null);
    }
  };
  return { selectedFile, error, setSelectedFile, handleImageChange };
};

export default usePreviewImage;

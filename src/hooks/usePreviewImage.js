// Hook uses to preview and change the image
import { useState } from "react";

const usePreviewImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const maxFileSizeInBytes = 2 * 1024 * 1024; // File max size 2MB

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size > maxFileSizeInBytes) {
        setSelectedFile(null);
        return {
          Title: "Error",
          Message: "File size must be less than 2MB",
          Status: "error",
        };
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  };
  return { selectedFile, setSelectedFile, handleImageChange };
};

export default usePreviewImage;

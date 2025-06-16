"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
}

const FileUpload = ({ onSuccess, onProgress, fileType }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please select a video file");
      }
    }

    if (file.size > 100 * 1024 * 1024) {
      setError("File size should be less than 100MB");
    }

    return true;
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !validateFile(file)) return;

    setUploading(true);
    setError(null);

    try {
      const authResponse = await fetch("/api/imagekit-auth");
      const authData = await authResponse.json();
      const res = await upload({
        file,
        fileName: file.name,
        publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
        signature: authData.authenticationParams.signature,
        expire: authData.authenticationParams.expire,
        token: authData.authenticationParams.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const percent = (event.loaded / event.total) * 100;
            onProgress(Math.round(percent));
          }
        },
      });

      setUploading(false);
      onSuccess(res);
      console.log("ImageKit Upload Response:", res);
    } catch (error) {
      if (
        error instanceof ImageKitInvalidRequestError ||
        error instanceof ImageKitServerError ||
        error instanceof ImageKitUploadNetworkError ||
        error instanceof ImageKitAbortError
      ) {
        setError(error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileType === "video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />

      {uploading && <div>Uploading...</div>}

      {error && <div>{error}</div>}
    </>
  );
};

export default FileUpload;

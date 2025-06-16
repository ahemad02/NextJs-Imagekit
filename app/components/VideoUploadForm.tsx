"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import { useNotification } from "./Notification";
import { useRouter } from "next/navigation";

export default function VideoUploadForm() {
  const { showNotification } = useNotification();

  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting form with:", {
      title,
      description,
      videoUrl,
      thumbnailUrl,
    });

    if (!videoUrl || !title || !description) {
      showNotification("All fields are required", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          videoUrl,
          thumbnailUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      showNotification("Video uploaded successfully", "success");

      router.push("/");

      // Optionally reset form
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setThumbnailUrl("");
    } catch (err: any) {
      showNotification(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4"
    >
      <h2 className="text-2xl font-bold">Upload a Video</h2>

      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea textarea-bordered w-full"
          required
        ></textarea>
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={(res) => {
            console.log("Upload success response:", res);
            setVideoUrl(res.url);
            setThumbnailUrl(res.url); // Optional — make sure this comes in response
          }}
        />
        {videoUrl && (
          <p className="text-sm text-green-500 mt-2">
            Video uploaded successfully
          </p>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Uploading..." : "Submit"}
      </button>
    </form>
  );
}

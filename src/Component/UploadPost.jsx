// PostUpload.js
import React, { useState } from "react";
import axios from "axios";

function UploadPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage("⚠️ Please select an image.");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user._id;

      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);
      formData.append("userId", userId);

      const res = await axios.post("https://instagram-clone-backend-v35p.onrender.com/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("✅ " + res.data.message);
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to upload post.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
        📸 Upload Post
      </h2>

      {message && (
        <p
          style={{
            textAlign: "center",
            color: message.includes("✅") ? "green" : "red",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Caption */}
        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            resize: "none",
            marginBottom: "15px",
            fontSize: "14px",
          }}
          rows="3"
        />

        {/* File Input */}
        <label
          style={{
            display: "block",
            background: "#f5f5f5",
            border: "2px dashed #bbb",
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            cursor: "pointer",
            color: "#555",
            fontSize: "14px",
            marginBottom: "15px",
          }}
        >
          {image ? "✅ Image Selected" : "📂 Click to select an image"}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>

        {/* Preview */}
        {preview && (
          <div style={{ marginBottom: "15px" }}>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#1565c0")}
          onMouseOut={(e) => (e.target.style.background = "#1976d2")}
        >
          🚀 Upload
        </button>
      </form>
    </div>
  );
}

export default UploadPost;

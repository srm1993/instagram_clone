import React, { useState } from "react";
import axios from "axios";

function UploadReel() {
  const [reel, setReel] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const user = JSON.parse(localStorage.getItem("user"));
    formData.append("userId", user._id);
    formData.append("reel", reel);
    formData.append("caption", caption);

    try {
      const res = await axios.post("http://localhost:8000/api/uploadReel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(res.data.message);
      setReel(null);
      setCaption("");
      setPreview(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReelChange = (e) => {
    const file = e.target.files[0];
    setReel(file);
    setPreview(URL.createObjectURL(file)); // show reel preview
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px",
          borderRadius: "16px",
          width: "400px",
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
            fontWeight: "bold",
            fontSize: "22px",
            color: "#222",
          }}
        >
          🎥 Upload Reel
        </h2>

        {/* Reel Preview */}
        {preview && (
          <div style={{ marginBottom: "15px" }}>
            <video
              src={preview}
              controls
              style={{
                width: "100%",
                maxHeight: "250px",
                borderRadius: "12px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Input */}
          <label
            style={{
              display: "block",
              background: "#f8f9fa",
              padding: "14px",
              border: "2px dashed #bbb",
              borderRadius: "10px",
              marginBottom: "15px",
              cursor: "pointer",
              color: "#555",
              fontSize: "14px",
              transition: "0.3s",
            }}
          >
            {reel ? "✅ Reel Selected" : "📂 Click to select a reel"}
            <input
              type="file"
              accept="video/*"
              required
              onChange={handleReelChange}
              style={{ display: "none" }}
            />
          </label>

          {/* Caption */}
          <textarea
            placeholder="Add a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows="3"
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
          />

          {/* Upload Button */}
          <button
            type="submit"
            style={{
              background: "#ff006e",
              color: "#fff",
              padding: "12px 15px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
              fontSize: "15px",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#d90466")}
            onMouseOut={(e) => (e.target.style.background = "#ff006e")}
          >
            🚀 Upload Reel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadReel;

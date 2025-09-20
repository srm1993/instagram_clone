import React, { useState } from "react";
import axios from "axios";

function AddProfile() {
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;

  const handleChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file)); // show preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("userId", userId);

    try {
      const result = await axios.post("https://instagram-clone-backend-v35p.onrender.com/api/addProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(result.data.message);
      localStorage.setItem("user", JSON.stringify(result.data.user));

      if (result.data.filePath) {
        setUploadedImage("https://instagram-clone-backend-v35p.onrender.com" + result.data.filePath);
        setPreview(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f9f9f9, #f1f1f1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 30px",
          borderRadius: "16px",
          width: "360px",
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
        }}
      >
        <h2
          style={{
            marginBottom: "25px",
            fontWeight: "bold",
            color: "#222",
            fontSize: "20px",
          }}
        >
          Add Profile Picture
        </h2>

        {/* Show Preview or Uploaded */}
        {(preview || uploadedImage) && (
          <div style={{ marginBottom: "20px" }}>
            <img
              src={preview || uploadedImage}
              alt="Profile"
              style={{
                width: "130px",
                height: "130px",
                objectFit: "cover",
                borderRadius: "50%",
                border: preview
                  ? "3px solid #ddd"
                  : "3px solid #3897f0",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            {uploadedImage && (
              <p style={{ fontSize: "14px", color: "#28a745", marginTop: "10px" }}>
                ✅ Profile Updated
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* File Input */}
          <label
            style={{
              display: "block",
              background: "#f8f9fa",
              padding: "12px",
              border: "2px dashed #ccc",
              borderRadius: "10px",
              marginBottom: "18px",
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            📂 {profilePicture ? "Image Selected" : "Click to select profile picture"}
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              required
              onChange={handleChange}
              style={{ display: "none" }}
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              background: "#3897f0",
              color: "#fff",
              padding: "12px 16px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              width: "100%",
              fontSize: "15px",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#2e81d0")}
            onMouseOut={(e) => (e.target.style.background = "#3897f0")}
          >
            🚀 Upload
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProfile;

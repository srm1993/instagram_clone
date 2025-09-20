import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaCommentDots, FaShare } from "react-icons/fa";

function ViewReels() {
  const [reels, setReels] = useState([]);
  const [likes, setLikes] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});
  const [commentInput, setCommentInput] = useState({});
  const [comments, setComments] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/reels")
      .then((res) => {
        setReels(res.data);
        const initLikes = {};
        const initComments = {};
        res.data.forEach((r) => {
          initLikes[r._id] = r.likes?.length || 0;
          initComments[r._id] = r.comments || [];
        });
        setLikes(initLikes);
        setComments(initComments);
      })
      .catch((err) => console.log(err));
  }, []);

  // Like reel
  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:8000/api/${id}/like`, {
        userId: user._id,
      });

      setLikes((prev) => ({
        ...prev,
        [id]: prev[id] + 1,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Toggle comment box
  const toggleCommentBox = (id) => {
    setShowCommentBox((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Handle comment input change
  const handleInputChange = (id, value) => {
    setCommentInput((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Post comment
  const handleComment = async (id) => {
    const text = commentInput[id];
    if (!text || !text.trim()) return;

    try {
      await axios.post(`http://localhost:8000/api/${id}/comment`, {
        userId: user._id,
        text,
      });

      setComments((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), { userId: user, text }],
      }));

      setCommentInput((prev) => ({
        ...prev,
        [id]: "",
      }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#000",
      }}
    >
      {reels.map((reel) => (
        <div
          key={reel._id}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#000",
            color: "#fff",
          }}
        >
          {/* Video */}
          <video
            src={`http://localhost:8000/reels/${reel.videoUrl}`}
            controls={false}
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Caption & Info */}
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              left: "20px",
              color: "#fff",
              textShadow: "0 2px 5px rgba(0,0,0,0.6)",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0" }}>
              @{reel.userId?.username || "user_name"}
            </h4>
            <p style={{ margin: 0, maxWidth: "250px", fontSize: "14px" }}>
              {reel.caption}
            </p>
          </div>

          {/* Right Side Action Buttons */}
          <div
            style={{
              position: "absolute",
              right: "20px",
              bottom: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              fontSize: "20px",
            }}
          >
            {/* Like */}
            <div
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() => handleLike(reel._id)}
            >
              {likes[reel._id] > 0 ? (
                <FaHeart color="red" size={28} />
              ) : (
                <FaRegHeart size={28} />
              )}
              <p style={{ margin: "5px 0 0 0", fontSize: "13px" }}>
                {likes[reel._id] || 0}
              </p>
            </div>

            {/* Comment */}
            <div
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() => toggleCommentBox(reel._id)}
            >
              <FaCommentDots size={26} />
              <p style={{ margin: "5px 0 0 0", fontSize: "13px" }}>
                {comments[reel._id]?.length || 0}
              </p>
            </div>

            {/* Share */}
            <div style={{ cursor: "pointer", textAlign: "center" }}>
              <FaShare size={24} />
              <p style={{ margin: "5px 0 0 0", fontSize: "13px" }}>Share</p>
            </div>
          </div>

          {/* Comment Section */}
          {showCommentBox[reel._id] && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                background: "rgba(0,0,0,0.7)",
                padding: "10px",
                borderRadius: "8px",
                color: "#fff",
              }}
            >
              {/* Comment List */}
              <div
                style={{
                  maxHeight: "120px",
                  overflowY: "auto",
                  marginBottom: "10px",
                }}
              >
                {comments[reel._id]?.map((c, i) => (
                  <p key={i} style={{ margin: "5px 0" }}>
                    <b>{c.userId?.username || user.username}:</b> {c.text}
                  </p>
                ))}
              </div>

              {/* Input + Post Button */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput[reel._id] || ""}
                  onChange={(e) =>
                    handleInputChange(reel._id, e.target.value)
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => handleComment(reel._id)}
                  style={{
                    background: "#ff0050",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewReels;

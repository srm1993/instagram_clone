import React, { useEffect, useState } from "react";
import axios from "axios";

function LandingPage() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) // logged-in user
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("https://instagram-clone-backend-v35p.onrender.com/api/posts");
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`https://instagram-clone-backend-v35p.onrender.com/api/posts/${postId}/like`, {
        userId: currentUser._id,
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      await axios.post(`https://instagram-clone-backend-v35p.onrender.com/api/posts/${postId}/comment`, {
        userId: currentUser._id,
        text,
      });
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async (followUserId) => {
    try {
      // if already following → unfollow
      const isFollowing = currentUser.following.includes(followUserId);

      await axios.post("https://instagram-clone-backend-v35p.onrender.com/api/users/follow", {
        userId: currentUser._id,
        followId: followUserId,
      });

      // update currentUser in localStorage + state
      let updatedUser;
      if (isFollowing) {
        updatedUser = {
          ...currentUser,
          following: currentUser.following.filter((id) => id !== followUserId),
        };
      } else {
        updatedUser = {
          ...currentUser,
          following: [...currentUser.following, followUserId],
        };
      }

      setCurrentUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="feed" style={{ maxWidth: "600px", margin: "20px auto" }}>
      {posts.map((post) => (
        <div
          key={post._id}
          className="post-card"
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            marginBottom: "20px",
            padding: "10px",
          }}
        >
          {/* User Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`https://instagram-clone-backend-v35p.onrender.com/profiles/${post.userId.profilePicture}`}
                alt="profile"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <strong>{post.userId.username}</strong>
            </div>

            {post.userId._id !== currentUser._id && (
              <button
                onClick={() => handleFollowToggle(post.userId._id)}
                style={{
                  backgroundColor: currentUser.following.includes(post.userId._id)
                    ? "#ddd"
                    : "#007bff",
                  color: currentUser.following.includes(post.userId._id)
                    ? "#000"
                    : "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {currentUser.following.includes(post.userId._id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>

          {/* Post Image */}
          <div style={{ marginTop: "10px" }}>
            <img
              src={`https://instagram-clone-backend-v35p.onrender.com/posts/${post.image}`}
              alt="post"
              style={{ width: "100%", borderRadius: "10px" }}
            />
          </div>

          {/* Caption */}
          <p style={{ marginTop: "10px" }}>{post.caption}</p>

          {/* Like Button */}
          <button onClick={() => handleLike(post._id)}>
            ❤️ {post.likes.length} Likes
          </button>

          {/* Comments */}
          <div style={{ marginTop: "10px" }}>
            <strong>Comments:</strong>
            {post.comments.map((c) => (
              <div
                key={c._id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <img
                  src={`https://instagram-clone-backend-v35p.onrender.com/profiles/${c.userId.profilePicture}`}
                  alt="profile"
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span>
                  <strong>{c.userId.username}</strong>: {c.text}
                </span>
              </div>
            ))}
          </div>

          {/* Add Comment */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleComment(post._id, e.target.comment.value);
              e.target.comment.value = "";
            }}
            style={{ marginTop: "10px" }}
          >
            <input
              type="text"
              name="comment"
              placeholder="Add a comment..."
              style={{ width: "80%", padding: "5px" }}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default LandingPage;

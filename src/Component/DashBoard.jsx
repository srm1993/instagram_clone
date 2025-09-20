import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function DashBoard() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [editingPostId, setEditingPostId] = useState(null);
  const [newCaption, setNewCaption] = useState("");

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

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `https://instagram-clone-backend-v35p.onrender.com/api/posts/${postId}/comment/${commentId}`,
        {
          data: { userId: currentUser._id },
        }
      );
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async (followUserId) => {
    try {
      const isFollowing = currentUser.following.includes(followUserId);

      await axios.post("https://instagram-clone-backend-v35p.onrender.com/api/users/follow", {
        userId: currentUser._id,
        followId: followUserId,
      });

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

  const startEditing = (post) => {
    setEditingPostId(post._id);
    setNewCaption(post.caption);
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setNewCaption("");
  };

  const saveCaption = async (postId) => {
    try {
      await axios.put(`https://instagram-clone-backend-v35p.onrender.com/api/posts/${postId}/caption`, {
        userId: currentUser._id,
        caption: newCaption,
      });
      setEditingPostId(null);
      setNewCaption("");
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #fdfbfb, #ebedee)",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        {posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              marginTop: "100px",
              color: "#999",
              fontSize: "20px",
              fontWeight: "500",
            }}
          >
            ✨ No posts here yet... Be the first to share something!
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                marginBottom: "40px",
                overflow: "hidden",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(0,0,0,0.1)";
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 18px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`https://instagram-clone-backend-v35p.onrender.com/profiles/${post.userId.profilePicture}`}
                    alt="profile"
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      marginRight: "12px",
                      objectFit: "cover",
                      border: "2px solid #0095f6",
                    }}
                  />
                  <strong style={{ fontSize: "15px" }}>
                    {post.userId.username}
                  </strong>
                </div>

                {post.userId._id !== currentUser._id && (
                  <button
                    onClick={() => handleFollowToggle(post.userId._id)}
                    style={{
                      background: currentUser.following.includes(post.userId._id)
                        ? "#efefef"
                        : "linear-gradient(45deg, #0095f6, #0077c2)",
                      color: currentUser.following.includes(post.userId._id)
                        ? "#000"
                        : "#fff",
                      border: "none",
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontWeight: "500",
                    }}
                  >
                    {currentUser.following.includes(post.userId._id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>

              {/* Post Image */}
              {post.image && (
                <img
                  src={`https://instagram-clone-backend-v35p.onrender.com/posts/${post.image}`}
                  alt="post"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Actions */}
              <div style={{ padding: "12px 18px" }}>
                <button
                  onClick={() => handleLike(post._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "24px",
                    marginRight: "12px",
                    color: post.likes.includes(currentUser._id) ? "red" : "black",
                    transition: "transform 0.2s ease",
                  }}
                >
                  {post.likes.includes(currentUser._id) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
                <span style={{ fontWeight: "bold", fontSize: "15px" }}>
                  {post.likes.length} likes
                </span>
              </div>

              {/* Caption (Editable if owner) */}
              <div style={{ padding: "0 18px 10px" }}>
                {editingPostId === post._id ? (
                  <div>
                    <input
                      type="text"
                      value={newCaption}
                      onChange={(e) => setNewCaption(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px",
                        marginBottom: "5px",
                        fontSize: "14px",
                      }}
                    />
                    <button
                      onClick={() => saveCaption(post._id)}
                      style={{
                        background: "#0095f6",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        marginRight: "5px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      style={{
                        background: "#eee",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p style={{ margin: 0 }}>
                    <strong>{post.userId.username}</strong> {post.caption}{" "}
                    {post.userId._id === currentUser._id && (
                      <button
                        onClick={() => startEditing(post)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#0095f6",
                          cursor: "pointer",
                          fontSize: "12px",
                          marginLeft: "8px",
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </p>
                )}
              </div>

              {/* Comments */}
              <div style={{ padding: "0 18px 10px" }}>
                {post.comments.map((c) => (
                  <p
                    key={c._id}
                    style={{
                      margin: "5px 0",
                      fontSize: "14px",
                      color: "#444",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>{c.userId.username}</strong> {c.text}
                    </span>
                    {c.userId._id === currentUser._id && (
                      <button
                        onClick={() => handleDeleteComment(post._id, c._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "red",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        🗑️
                      </button>
                    )}
                  </p>
                ))}
              </div>

              {/* Add Comment */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleComment(post._id, e.target.comment.value);
                  e.target.comment.value = "";
                }}
                style={{
                  borderTop: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  padding: "12px 18px",
                  background: "#fafafa",
                }}
              >
                <input
                  type="text"
                  name="comment"
                  placeholder="Add a comment..."
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    background: "transparent",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#0095f6",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Post
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashBoard;

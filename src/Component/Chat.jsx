import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:8000");

function Chat() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [followers, setFollowers] = useState([]);
  const [selectedFollower, setSelectedFollower] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const chatEndRef = useRef(null);

  // join socket
  useEffect(() => {
    socket.emit("join", currentUser._id);

    // Fetch followers of current user
    axios
      .get(`https://instagram-clone-backend-v35p.onrender.com/api/followers/${currentUser._id}`)
      .then((res) => setFollowers(res.data))
      .catch((err) => console.error(err));
  }, [currentUser._id]);

  // fetch messages when a follower is selected
  useEffect(() => {
    if (!selectedFollower) return;

    // Fetch chat history
    axios
      .get(
        `https://instagram-clone-backend-v35p.onrender.com/api/messages/${currentUser._id}/${selectedFollower._id}`
      )
      .then((res) => setChat(res.data))
      .catch((err) => console.error(err));

    // Listen for new messages
    socket.on("receiveMessage", (data) => {
      if (
        data.senderId === selectedFollower._id ||
        data.receiverId === selectedFollower._id
      ) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedFollower, currentUser._id]);

  // Auto scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      senderId: currentUser._id,
      receiverId: selectedFollower._id,
      text: message,
    };

    // send via socket
    socket.emit("sendMessage", newMsg);

    // update local UI
    setChat((prev) => [...prev, newMsg]);
    setMessage("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "500px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Followers list */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        <h4
          style={{
            textAlign: "center",
            padding: "10px",
            background: "#f0f0f0",
            margin: 0,
          }}
        >
          Followers
        </h4>
        {followers.map((f) => (
          <div
            key={f._id}
            onClick={() => setSelectedFollower(f)}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              background:
                selectedFollower && selectedFollower._id === f._id
                  ? "#e6e6e6"
                  : "transparent",
              borderBottom: "1px solid #eee",
              transition: "background 0.2s",
            }}
          >
            <img
              src={`http://localhost:8000/profiles/${f.profilePicture}`}
              alt={f.username}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              {f.username}
            </span>
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          background: "#f9f9f9",
        }}
      >
        {selectedFollower ? (
          <>
            {/* Chat header */}
            <div
              style={{
                padding: "10px",
                borderBottom: "1px solid #ccc",
                background: "#ededed",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={`http://localhost:8000/profiles/${selectedFollower.profilePicture}`}
                alt={selectedFollower.username}
                style={{
                  width: "35px",
                  height: "35px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              <h3 style={{ margin: 0, fontSize: "16px" }}>
                {selectedFollower.username}
              </h3>
            </div>

            {/* Chat messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
              }}
            >
              {chat.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.senderId === currentUser._id
                        ? "flex-end"
                        : "flex-start",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      background:
                        msg.senderId === currentUser._id
                          ? "#dcf8c6"
                          : "#ffffff",
                      padding: "8px 12px",
                      borderRadius: "16px",
                      maxWidth: "60%",
                      boxShadow: "0px 1px 2px rgba(0,0,0,0.1)",
                      wordWrap: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef}></div>
            </div>

            {/* Message input */}
            <div
              style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ccc",
                background: "#fff",
              }}
            >
              <input
                type="text"
                value={message}
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "20px",
                  border: "1px solid #ccc",
                  outline: "none",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  marginLeft: "8px",
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "20px",
                  background: "#007bff",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            <p>Select a follower to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;

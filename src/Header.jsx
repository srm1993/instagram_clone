import { Link } from "react-router-dom";
import { FaInstagram, FaPlusSquare, FaVideo, FaCommentDots } from "react-icons/fa";
import { AiOutlineUserAdd } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

function Header({ isLoggedIn }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  };

  const navStyle = {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    fontSize: "22px", // Icon size
    color: "#333",
  };

  const iconStyle = {
    color: "#333",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const buttonStyle = {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "22px",
    color: "#e74c3c",
  };

  return (
    <header style={headerStyle}>
      {/* Logo / Brand */}
      <Link
        to={isLoggedIn ? "/dashboard" : "/"}
        style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
      >
        {/* Profile Image OR Instagram Logo */}
        {user && user.profilePicture ? (
          <img
            src={`http://localhost:8000/profiles/${user.profilePicture}`}
            alt="Profile"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #ddd",
            }}
          />
        ) : (
          <FaInstagram size={32} color="#e1306c" /> // Instagram icon
        )}
      </Link>

      {/* Navigation */}
      <nav style={navStyle}>
        {isLoggedIn ? (
          <>
            <Link to="/addProfile" style={iconStyle} title="Change Profile">
              <AiOutlineUserAdd />
            </Link>
            <Link to="/uploadPost" style={iconStyle} title="Upload Post">
              <FaPlusSquare />
            </Link>
            <Link to="/uploadReel" style={iconStyle} title="Upload Reels">
              <FaVideo />
            </Link>
            <Link to="/viewReels" style={iconStyle} title="Reels">
              🎞️
            </Link>
            <Link to="/chat" style={iconStyle} title="Chat">
              <FaCommentDots />
            </Link>
            <button
              style={buttonStyle}
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              title="Logout"
            >
              <MdLogout />
            </button>
          </>
        ) : (
          <>
            <Link to="/register" style={iconStyle} title="Register">
              <AiOutlineUserAdd />
            </Link>
            <Link to="/" style={iconStyle} title="Login">
              <FaInstagram />
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;

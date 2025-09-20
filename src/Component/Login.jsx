import React, { useState } from "react";
import axios from "axios";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://instagram-clone-backend-v35p.onrender.com/api/login", formData);
            alert(res.data.message);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            window.location.href = "/dashboard";
        } catch (err) {
            if (err.response) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Something went wrong");
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Instagram Logo */}
                <h1 style={styles.logo}>Instagram</h1>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>
                        Log In
                    </button>
                </form>

                {message && <p style={styles.message}>{message}</p>}

                {/* <div style={styles.divider}>OR</div>

        <a href="#" style={styles.fbLogin}>
          Log in with Facebook
        </a>

        <a href="#" style={styles.forgotPassword}>
          Forgot password?
        </a> */}
            </div>

            <div style={styles.signupBox}>
                <p>
                    Don’t have an account?{" "}
                    <a href="/register" style={styles.link}>Sign up</a>
                </p>
            </div>
        </div>
    );
}

// Styles similar to Instagram login
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
        fontFamily: "Arial, sans-serif",
    },
    card: {
        width: "350px",
        border: "1px solid #dbdbdb",
        padding: "40px 30px",
        background: "#fff",
        textAlign: "center",
    },
    logo: {
        fontFamily: "'Billabong', cursive",
        fontSize: "48px",
        marginBottom: "30px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "3px",
        border: "1px solid #dbdbdb",
        background: "#fafafa",
    },
    button: {
        marginTop: "10px",
        padding: "8px",
        fontSize: "14px",
        fontWeight: "bold",
        borderRadius: "5px",
        border: "none",
        background: "#3897f0",
        color: "#fff",
        cursor: "pointer",
    },
    divider: {
        margin: "20px 0",
        fontSize: "12px",
        color: "#999",
    },
    fbLogin: {
        display: "block",
        color: "#385185",
        fontWeight: "bold",
        textDecoration: "none",
        marginBottom: "10px",
    },
    forgotPassword: {
        display: "block",
        fontSize: "12px",
        color: "#00376b",
        textDecoration: "none",
        marginTop: "10px",
    },
    signupBox: {
        marginTop: "15px",
        width: "350px",
        padding: "20px",
        border: "1px solid #dbdbdb",
        textAlign: "center",
        background: "#fff",
    },
    link: {
        color: "#3897f0",
        textDecoration: "none",
        fontWeight: "bold",
    },
    message: {
        marginTop: "15px",
        color: "red",
        fontWeight: "bold",
    },
};

export default Login;

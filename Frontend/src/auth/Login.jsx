

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./Auth.css";

function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Get setUser from AuthContext
    const { setUser } = useAuth();


    const handleLogin = async (e) => {

        e.preventDefault();

        if (!username || !password) {
            setMessage("Please enter username and password");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                // ⭐ IMPORTANT:
                // Store logged-in user in AuthContext
                setUser(data.user);

                setMessage("Login successful!");

                setTimeout(() => {
                    navigate("/");
                }, 500);

            } else {

                setMessage(
                    data.message || "Login failed"
                );

            }

        } catch (error) {

            console.log("Login error:", error);

            setMessage(
                "Server error. Please try again."
            );

        }
    };


    return (

        <div className="auth-container">

            <div className="auth-box">

                <h1>Login</h1>

                <p className="auth-subtitle">
                    Login to your SigmaGPT account
                </p>


                <form onSubmit={handleLogin}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />


                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />


                    <button type="submit">
                        Login
                    </button>

                </form>


                {message && (

                    <p className="auth-message">
                        {message}
                    </p>

                )}


                <p className="auth-link">

                    Don't have an account?{" "}

                    <span
                        onClick={() =>
                            navigate("/signup")
                        }
                    >
                        Sign Up
                    </span>

                </p>

            </div>

        </div>
    );
}


export default Login;
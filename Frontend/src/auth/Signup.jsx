

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import "./Auth.css";

function Signup() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // Get setUser from AuthContext
    const { setUser } = useAuth();


    const handleSignup = async (e) => {

        e.preventDefault();

        if (!email || !username || !password) {

            setMessage("Please fill all fields");

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:8080/api/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        email,
                        username,
                        password
                    })
                }
            );


            const data = await response.json();


            if (response.ok) {

                // ⭐ IMPORTANT:
                // Backend automatically logs in user
                // after successful signup.
                // So update AuthContext here.
                setUser(data.user);

                setMessage("Signup successful!");

                setTimeout(() => {
                    navigate("/");
                }, 500);

            } else {

                setMessage(
                    data.message || "Signup failed"
                );

            }

        } catch (error) {

            console.log("Signup error:", error);

            setMessage(
                "Server error. Please try again."
            );

        }
    };


    return (

        <div className="auth-container">

            <div className="auth-box">

                <h1>Sign Up</h1>

                <p className="auth-subtitle">
                    Create your SigmaGPT account
                </p>


                <form onSubmit={handleSignup}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />


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
                        Sign Up
                    </button>

                </form>


                {message && (

                    <p className="auth-message">
                        {message}
                    </p>

                )}


                <p className="auth-link">

                    Already have an account?{" "}

                    <span
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </span>

                </p>

            </div>

        </div>
    );
}


export default Signup;
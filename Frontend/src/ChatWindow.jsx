

import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { ScaleLoader } from "react-spinners";
import { useAuth } from "./auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function ChatWindow() {
    const navigate = useNavigate();
    const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setPrevChats,
    setNewChat,
    allThreads,
    setAllThreads
    } = useContext(MyContext);

    const { user, logout } = useAuth();

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        if (!user) {
        alert("Please login first");
        navigate("/login");
        return;
        }
        
        setLoading(true);
        setNewChat(false);

        console.log("message ", prompt, " threadId ", currThreadId);

        const options = {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );

            // const res = await response.json();

            // console.log(res);

            // setReply(res.reply);

            const res = await response.json();

console.log(res);

if (!response.ok) {
    console.log("Chat error:", res);
    return;
}

setReply(res.reply);

// Add new thread to Sidebar history
setAllThreads((prevThreads) => {

    const alreadyExists = prevThreads.some(
        (thread) => thread.threadId === currThreadId
    );

    if (alreadyExists) {
        return prevThreads;
    }

    return [
        {
            threadId: currThreadId,
            title: prompt
        },
        ...prevThreads
    ];
});


        } catch (err) {
            console.log(err);
        }

        setLoading(false);
    };

    // Append new chat to prevChats
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prevChats) => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt
                },
                {
                    role: "assistant",
                    content: reply
                }
            ]);
        }

        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    };

    const handleLogin = () => {
    setIsOpen(false);
    navigate("/login");
    };

    const handleSignup = () => {
    setIsOpen(false);
    navigate("/signup");
    };

    // LOGOUT
    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <div className="chatWindow">

            {/* NAVBAR */}
            <div className="navbar">

                <span>
                    Knowledge-Flow❤️
                    <i className="fa-solid fa-chevron-down"></i>
                </span>

                <div
                    className="userIconDiv"
                    onClick={handleProfileClick}
                >
                    <span className="userIcon">
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>

            </div>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="dropDown">

                    <div className="dropDownItem">
                        <i className="fa-solid fa-gear"></i>
                        Settings
                    </div>

                    <div className="dropDownItem">
                        <i className="fa-solid fa-cloud-arrow-up"></i>
                        Upgrade plan
                    </div>

                    {/* USER LOGIN STATUS */}

                    {user ? (
                        <>
                            <div className="dropDownItem">
                                <i className="fa-solid fa-user"></i>
                                {user.username}
                            </div>

                            <div
                                className="dropDownItem"
                                onClick={handleLogout}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                Log out
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className="dropDownItem"
                                onClick={handleLogin}
                            >
                                <i className="fa-solid fa-right-to-bracket"></i>
                                Log in
                            </div>

                            <div
                                className="dropDownItem"
                                onClick={handleSignup}
                            >
                                <i className="fa-solid fa-user-plus"></i>
                                Sign up
                            </div>
                        </>
                    )}

                </div>
            )}

            {/* CHAT */}
            <Chat />

            {/* LOADING */}
            <ScaleLoader
                color="#fff"
                loading={loading}
            />

            {/* CHAT INPUT */}
            <div className="chatInput">

                <div className="inputBox">

                    <input
                        placeholder="Ask anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" ? getReply() : ""
                        }
                    />

                    <div
                        id="submit"
                        onClick={getReply}
                    >
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>

                </div>

                <p className="info">
                    Knowledge-Flow can make mistakes. Check important info.
                    See Cookie Preferences.
                </p>

            </div>

        </div>
    );
}

export default ChatWindow;
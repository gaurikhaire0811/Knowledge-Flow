
import "./App.css";
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login.jsx";
import Signup from "./auth/Signup.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";


function ChatApp() {

    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);
    const [currThreadId, setCurrThreadId] = useState(uuidv1());
    const [prevChats, setPrevChats] = useState([]);
    const [newChat, setNewChat] = useState(true);
    const [allThreads, setAllThreads] = useState([]);

    const providerValues = {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        setCurrThreadId,
        newChat,
        setNewChat,
        prevChats,
        setPrevChats,
        allThreads,
        setAllThreads
    };

    return (
        <div className="app">

            <MyContext.Provider value={providerValues}>

                <Sidebar />
                <ChatWindow />

            </MyContext.Provider>

        </div>
    );
}


function App() {

    return (
        <BrowserRouter>

            <AuthProvider>

                <Routes>

                    <Route
                        path="/"
                        element={<ChatApp />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                </Routes>

            </AuthProvider>

        </BrowserRouter>
    );
}


export default App;
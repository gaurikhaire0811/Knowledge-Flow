
import "./Sidebar.css";
import { useContext, useEffect, useState } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import { useAuth } from "./auth/AuthContext.jsx";
import blackLogo from "./assets/blacklogo.png";

function Sidebar() {

    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats
    } = useContext(MyContext);

    const { user, loading } = useAuth();

    const [searchTerm, setSearchTerm] = useState("");

    // Get current user's chats
    const getAllThreads = async () => {

        try {

            const response = await fetch(
                "https://knowledge-flow-hqul.onrender.com/api/thread",
                {
                    credentials: "include"
                }
            );

            // If user is not logged in
            if (!response.ok) {

                setAllThreads([]);

                return;
            }

            const res = await response.json();

            const filteredData = res.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            }));

            setAllThreads(filteredData);

        } catch (err) {

            console.log(err);

            setAllThreads([]);
        }
    };


    // Load chats whenever logged-in user changes
    useEffect(() => {

        if (loading) {
            return;
        }

        if (user) {

            getAllThreads();

        } else {

            // IMPORTANT:
            // Clear old user's chats after logout
            setAllThreads([]);

        }

    }, [user, loading]);


    const createNewChat = () => {

        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
        setSearchTerm("");

    };


    const changeThread = async (newThreadId) => {

        setCurrThreadId(newThreadId);

        try {

            const response = await fetch(
                `https://knowledge-flow-hqul.onrender.com/api/thread/${newThreadId}`,
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {

                console.log("Failed to load thread");

                return;
            }

            const res = await response.json();

            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (err) {

            console.log(err);
        }
    };


    const deleteThread = async (threadId) => {

        try {

            const response = await fetch(
                `https://knowledge-flow-hqul.onrender.com/api/thread/${threadId}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            const res = await response.json();

            console.log(res);

            if (!response.ok) {
                return;
            }

            setAllThreads(prev =>
                prev.filter(thread => thread.threadId !== threadId)
            );

            if (threadId === currThreadId) {
                createNewChat();
            }

        } catch (err) {

            console.log(err);
        }
    };


    // Search chats by title
    const filteredThreads = allThreads?.filter(thread =>
        thread.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
    );


    return (
        <section className="sidebar">

            {/* New Chat Button */}

            <button onClick={createNewChat}>

                <img
                 src={blackLogo}
                 alt="gpt logo"
                 className="logo"
                />

                <span>
                    <i className="fa-solid fa-pen-to-square"></i>
                </span>

            </button>


            {/* Search Box */}

            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search chats..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <i className="fa-solid fa-magnifying-glass"></i>

            </div>


            {/* Chat History */}

            <ul className="history">

                {filteredThreads?.map((thread) => (

                    <li
                        key={thread.threadId}
                        onClick={() => changeThread(thread.threadId)}
                        className={
                            thread.threadId === currThreadId
                                ? "highlighted"
                                : ""
                        }
                    >

                        {thread.title}

                        <i
                            className="fa-solid fa-trash"
                            onClick={(e) => {

                                e.stopPropagation();

                                deleteThread(thread.threadId);

                            }}
                        ></i>

                    </li>

                ))}

            </ul>


            <div className="sign">

                <p>
                    By Gauri Khaire &hearts;
                </p>

            </div>

        </section>
    );
}

export default Sidebar;
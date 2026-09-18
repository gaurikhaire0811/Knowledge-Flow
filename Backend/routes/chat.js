
import express from "express";
import passport from "passport";
import User from "../models/user.js";
import Thread from "../models/thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

//test
router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "abc",
            title: "Testing New Thread2"
        });

        const response = await thread.save();
        res.send(response);
    } catch(err) {
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});



router.get("/thread", async (req, res) => {

    // Check if user is logged in
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: "Login required"
        });
    }

    try {

        // Get only logged-in user's threads
        const threads = await Thread.find({
            user: req.user._id
        }).sort({
            updatedAt: -1
        });

        res.json(threads);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Failed to fetch threads"
        });

    }
});



router.delete("/thread/:threadId", async (req, res) => {

    // Check if user is logged in
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: "Login required"
        });
    }

    const { threadId } = req.params;

    try {

        // Delete only the logged-in user's thread
        const deletedThread = await Thread.findOneAndDelete({
            threadId: threadId,
            user: req.user._id
        });

        if (!deletedThread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.status(200).json({
            success: "Thread deleted successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Failed to delete thread"
        });
    }
});

router.get("/thread/:threadId", async (req, res) => {

    // Check if user is logged in
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: "Login required"
        });
    }

    const { threadId } = req.params;

    try {

        // Find only this thread belonging to logged-in user
        const thread = await Thread.findOne({
            threadId: threadId,
            user: req.user._id
        });

        if (!thread) {
            return res.status(404).json({
                error: "Thread not found"
            });
        }

        res.json(thread.messages);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Failed to fetch chat"
        });
    }
});





router.post("/chat", async (req, res) => {

    // Check if user is logged in
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            error: "Login required"
        });
    }

    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    try {

        // Find thread belonging to logged-in user
        let thread = await Thread.findOne({
            threadId: threadId,
            user: req.user._id
        });

        // If thread does not exist, create new thread
        if (!thread) {

            thread = new Thread({
                threadId: threadId,
                title: message,

                // Connect thread with logged-in user
                user: req.user._id,

                messages: [
                    {
                        role: "user",
                        content: message
                    }
                ]
            });

        } else {

            // Existing thread
            thread.messages.push({
                role: "user",
                content: message
            });
        }

        // Get AI response
        const assistantReply = await getOpenAIAPIResponse(message);

        // Add AI response
        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        // Save thread
        await thread.save();

        res.json({
            reply: assistantReply
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});




// SIGN UP

router.post("/register", async (req, res) => {

    try {

        const { email, username, password } = req.body;

        // Check fields
        if (!email || !username || !password) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Create user
        const newUser = new User({
            email: email,
            username: username
        });

        // Create password using passport-local-mongoose
        const registeredUser = await User.register(
            newUser,
            password
        );

        // Login user automatically after signup
        req.login(registeredUser, (err) => {

            if (err) {
                console.log("LOGIN AFTER SIGNUP ERROR:", err);

                return res.status(500).json({
                    message: "Signup successful but automatic login failed"
                });
            }

            console.log("USER SIGNED UP:", registeredUser.username);

            return res.status(201).json({
                message: "Signup successful",
                user: {
                    id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email
                }
            });

        });

    } catch (err) {

        console.log("SIGNUP ERROR:", err);

        return res.status(500).json({
            message: err.message
        });
    }
});

// LOGIN
router.post(
    "/login",
    passport.authenticate("local"),
    (req, res) => {

        res.json({
            message: "Login successful",
            user: req.user
        });

    }
);


// PROFILE
router.get("/profile", (req, res) => {

    if (req.isAuthenticated()) {

        res.json(req.user);

    } else {

        res.status(401).json({
            message: "Login required"
        });

    }
});


// LOGOUT
router.get("/logout", (req, res) => {

    req.logout((err) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.json({
            message: "Logged out successfully"
        });

    });

});




export default router;
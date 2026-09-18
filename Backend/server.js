


import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";

import chatRoutes from "./routes/chat.js";
import User from "./models/user.js";

const app = express();
const PORT = process.env.PORT || 8080;



// MIDDLEWARE


app.use(express.json());

app.use(cors({
    origin: true,
    credentials: true
}));
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// }));


// SESSION


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));



// PASSPORT


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// ROUTES


app.use("/api", chatRoutes);


// SERVER


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();
});



// DATABASE

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected with Database!");

    } catch (err) {

        console.log("Failed to connect with DB", err);

    }
};

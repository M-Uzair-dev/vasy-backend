import express from "express";
import connectDB from "./config/connectDB.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Routes from "./routes/index.js";
import './utils/cronJobs.js';
import { app, server } from "./sockets/socket.js";
dotenv.config();

connectDB();
const PORT = process.env.PORT || 8080;
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(express.json());
app.use("", Routes);

app.get("/", async (req, res) => {
    try {
        res.send("Server Working!");
    } catch (error) {
        console.log(error);
    }
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
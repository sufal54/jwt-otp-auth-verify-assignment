import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRouter from "./routers/user.router.js";


dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", userRouter);
app.listen(port, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    connectDB();
    console.log("Server started");
})
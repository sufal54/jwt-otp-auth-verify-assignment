import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import { sendMail } from "../config/mailer.config.js";


const router = Router();

router.post("/register", async (req, res) => {
    try {
        const { name, password, email, phone } = req.body;
        if (!name || !password || !email || !phone) {
            return res.status(400).json({ success: false, message: "Require name email phone password" });
        }
        const isUserExists = await userModel.findOne({ $or: [{ email }, { phone }] });

        if (isUserExists) {
            return res.status(406).json({ success: false, message: "User already Exists" });
        }

        const otp = Math.floor(Math.random() * 5000);
        await sendMail(email, otp);
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashPassword,
            otp
        });
        await newUser.save();

        res.status(200).json({ success: true, message: "Created user successfully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post("/verify", async (req, res) => {
    try {
        const { email, phone, otp } = req.body;
        if (!otp || (!email && !phone)) {
            return res.status(400).json({ success: false, message: "Require name (email or phone)" });
        }

        const user = await userModel.findOne({ $or: [{ email }, { phone }] });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        if (user.otp != otp) {
            return res.status(406).json({ success: false, message: "Worng otp" });
        }
        user.isVerify = true;
        await user.save();
        res.status(200).json({ success: true, message: "Verify successfully" });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/login", async (req, res) => {
    try {
        const { phone, email, password } = req.body;
        if ((!email && !phone) || !password) {
            return res.status(400).json({ success: false, message: "Require email password" });
        }

        const user = await userModel.findOne({ $or: [{ email }, { phone }] });;
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const isMatch = bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Worng credntial" });

        }

        const token = await jwt.sign({ user: user._id }, process.env.SECRET_KEY);
        res.cookie("token", token, { httpOnly: true, });
        res.status(200).json({ success: true, message: "Verify successfully" });
    } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

const authMiddle = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthrized token" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decodedToken;
        next();
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

router.get("/profile", authMiddle, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthrized token" });
    }

    try {
        const userData = await userModel.findOne({ _id: req.user.user });
        if (!userData) {
            return res.status(401).json({ success: false, message: "Unauthrized token" });
        }
        res.status(200).json({ success: true, message: "Founded", userData });
    } catch (e) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }

})




export default router;
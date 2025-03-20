import mongoose from "mongoose";

const userSchemea = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
    },
    isVerify: {
        type: Boolean,
        default: false
    }
})

const userModel = mongoose.model("User", userSchemea);

export default userModel;

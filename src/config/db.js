import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGOI_URL).then(() => {
            console.log("MongoDB connected");
        });

    } catch (e) {
        console.error(err);
        console.log("\n\nerror \n")
        process.exit(1);
    }
}
export default connectDB;
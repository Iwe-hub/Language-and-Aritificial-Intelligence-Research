import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            ref: "User",
        },
    },
    { timestamp: true }
);

export default mongoose.model("blacklist", blacklistSchema);
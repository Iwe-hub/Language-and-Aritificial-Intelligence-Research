import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


const userSchema = new mongoose.Schema(
    {
        UserName: {
            type: String,
            required: "Your name is required",
            max: 25,
        },
        email: {
            type: String,
            required: "Your email is required",
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: "Your password is required",
            select: false,
            max: 25,
        },
        role: {
            type: String,
            required: true,
            default: "0x01",
        },
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err)
    };
});

userSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    return jwt.sign(payload, process.env.SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
    });
};


export default mongoose.model('Users', userSchema);
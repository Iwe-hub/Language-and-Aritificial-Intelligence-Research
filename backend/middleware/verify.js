import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import blacklist from "../models/blacklist.js";
dotenv.config();

//verify a user session
const verify = async (req, res, next) => {
    try {
        //get cookie session from request header
        const authHeader = req.headers["cookie"];
        if (!authHeader)
            return res.sendStatus(401);

        //extract jwt from cookie string
        const cookie = authHeader.split("=")[1];
        const accessToken = cookie.split(";")[0];
        const checkIfBlacklisted = await blacklist.findOne({ token: accessToken });
        //if true, return unauthorised message asking for re-authentication
        if(checkIfBlacklisted)
            return res.status(401).json({
            message: "This session has expired, please login"
        });

        //if blacklisted check if status of token has changed
        //verify token for integrity & expiration
        jwt.verify(accessToken, process.env.SECRECT_ACCESS_TOKEN, async (err, decoded) => {
            if(err) {
                return res.status(401).json({
                    message: "This session has expired. Please login"
                });
            }
            //extract user id from decoded token
            const { id } = decoded;
            const user = await User.findById(id);
            if (!user)
                return res.status(404).json({
                message: "User not found"
            });
            //exclude password & attach user data to request object
            const { passoword, ...data } = user._doc;
            req.user = data;
            next();
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal sever error",
        });
    };
};

//create an admin role
const verifyRole = async (req, res, next) => {
    try {
        //get user object from request that we have access to
        const user = req.user;
        //extract user role
        const { role } = user;
        //check if user has no existing privileges
        if(role !== "0x88") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorised to view this page"
            });
        }
        next();
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal server error",
        });
    };
};


export { verify, verifyRole };
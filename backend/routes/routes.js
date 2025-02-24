import { validation, validate } from "../middleware/validate.js";
import User from "../models/user.js";
import express from "express";
import bcrypt from "bcrypt";
import { verify, verifyRole } from "../middleware/verify.js";
import blacklist from "../models/blacklist.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

//initialise export router
const router = express.Router();


//AUTHENTICATION ROUTE
//register users
router.post('/register', validation, validate, async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        //create instance for user
        const newUser = new User({
            userName,
            email,
            password
        });
        //check if user already exists
        const existingUser = await User.findOne({ email })
        if(existingUser)
            return res.status(400).json({
            status: "failed",
            data: [],
            message: "Account already exists, try logging in"
        });

    const savedUser = await newUser.save()
    const { role, ...user_data } = savedUser._doc;
    res.status(200).json({
        status: "success",
        data: [user_data],
        message: "Thank you for registering with us, your account has been successfully created"
    });

    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
    res.send();
})


//login users
router.post('/login', validation, validate, async (req, res) => {
    const { email } = req.body;
    try {
        //check if user exits
        const user = await User.findOne({ email }).select("+password") 
        if (!user)
            return res.status(401).json({
            status: "failed",
            data: [],
            message: "Invalid email or password, please try again"
        });
        //validate password
        const validatePassword = bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        //if invalid return unauthorised response
        if(!validatePassword)
            return res.status(401).json({
               status: "failed",
               data: [],
               message: "invalid email or password, please try again"
        });
        //set user session
        let options = {
            maxAge: 20 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
        };
        //generate user token and set to response header, so that the client sends it back on each request
        const token = user.generateAccessJWT();
        res.cookie("SessionID", token, options)
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal server error",
        });
        //return user info except password
        const { passowrd, ...user_data } = user._doc;
        res.status(200).json({
            status: "success",
            data: [user_data],
            message: " You have successfully loggin in",
        });                                    
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal service error",
        });
    }
    res.send();
})

//implement logout route
router.get('/logout', async (req, res) => {
    try {
        //get cookie session from request header
        const authHeader = req.headers['cookie'];
        if(!authHeader)
            return res.sendStatus(204);
        //if cookie exits split it to retrieve jwt token
        const cookie = authHeader.split('=')[1];
        const accessToken = cookie.split(';')[0];
        const checkIfBlacklisted = await blacklist.findOne({ token: accessToken });
        //if blacklist return no content response
        if(checkIfBlacklisted)
            return res.sendStatus(204);
        //otherwise blacklist token
        const newBlacklist = new blacklist({
            token: accessToken,
        });
        await newBlacklist.save();
        //clear cookie on client request
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({
            message: "You are logged out"
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    };
    res.end();
});


//authenticated users route
router.get('/onboarding', verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to your dashboard",
    });
});

//admin permisssion route
router.get('/admin', verify, verifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the admin portal",
    });
});

//get all users
router.get('/users', verify, verifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
    })
    res.send();
});

//email server
router.post('/emailList', async (req, res) => {
    try {
        const { fullName, email, message } = req.body;
        //validate input
        if(!fullName && !email && !message) {
            return res.status(400).send('all inout required')
        } else {
            //initialise nodemailer server
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth : {
                    user: process.env.email,
                    pass: process.env.password
                },
            });

            const mailOptions = {
                from: fullName,
                to: email,
                subject: null,
                text: message
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log("Email sent: " + info.response)
                }
            });
            res.status(200).send('success')
        }
    } catch (err) {
        return console.log(err, 'error occured')
    };
});

export default router;
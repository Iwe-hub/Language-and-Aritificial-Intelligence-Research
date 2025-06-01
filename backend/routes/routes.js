import { validation, validate } from "../middleware/validate.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";
import express from "express";
import bcrypt from "bcrypt";
import { verify, verifyRole } from "../middleware/verify.js";
import blacklist from "../models/blacklist.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import user from "../models/user.js";
dotenv.config();

//initialise export router
const router = express.Router();


//initialise communication between node and react server
router.get("/v1", (req, res) => {
    res.json({ message: "frontend and backend connected" })
});

//SEO AUTHENTICATION
//initialise google client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

router.post("/auth/google", async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { name, email } = payload;
        let googleUser = await User.findOne({ email });
        if(!googleUser) {
            googleUser = await User.create({
                userName: name,
                email,
                password: null,
                authProvider: "google",
            });
            await googleUser.save();
        }

        const token = googleUser.generateAccessJWT();
        res.cookie('SessionID', token, {
            maxAge: 20 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        });

        res.status(200).json({
            status: 'success',
            data: [{ name, email }],
            message: 'Signed in with Google'
        });
    } catch (err) {
        console.error(err)
        res.status(401).json({
            status: 'error',
            message: 'Google token invalid',
        });
    }
});




//AUTHENTICATION ROUTE
//register users
router.post('/register', validation.registerValidation(), validate, async (req, res) => {
    const { userName, email, password } = req.body;
  
    try {
      // check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          status: "failed",
          data: [],
          message: "Account already exists, try logging in"
        });
      }
  
      // create new user
      const newUser = new User({ 
        userName,
        email,
        password,
      });
      const savedUser = await newUser.save();
      const { role, ...user_data } = savedUser._doc;
  
      // send confirmation email
      const mailOptions = {
        from: process.env.user_email,
        to: email,
        subject: 'Registration successful',
        text: `Hello ${userName},\n\nThank you for registering with us. Your account has been successfully created.`
      };
  
      await transporter.sendMail(mailOptions);
  
      // respond to client
      res.status(200).json({
        sucess: true,
        stattus: "success",
        data: [user_data],
        message: "Thank you for registering with us, your account has been successfully created"
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: "error",
        code: 500,
        data: [],
        message: "Internal Server Error",
      });
    }
  });


//login users
router.post('/login', validation.loginValidation(), validate, async (req, res) => {
    const { email } = req.body;
    try {
        //check if user exits
        const user = await User.findOne({ email }).select("password") 
        if (!user)
            return res.status(401).json({
            status: "failed",
            data: [],
            message: "Invalid email or password, please try again"
        });
        //validate password
        const validatePassword = await bcrypt.compare(
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
    res.end();
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


//implement forgot password configuration
router.post('/forgot-password', validation.forgotPasswordValidation(), validate, async (req, res) => {
    const { email } = req.body;
    try {
        //check user exists
        const forgottenUser = await User.findOne({ email });
        if (!forgottenUser) {
            return res.status(404).json({
                status: "failed",
                message: "No user found with that email address"
            });
        }
        //generate password reset token
        const resetToken = jwt.sign({ email }, process.ENV.SECRE_KEY, {
            expiresIn: '1h'
        });
        //store reset token in user's record
        forgottenUser.passwordResetToken = resetToken;
        await forgottenUser.save();
        
        //create a reset password url with the token
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        //send password reset link to user's email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.user_email,
                password: process.env.password
            }
        });

        const mailOptions = {
            from: process.env.user_email,
            to: email,
            subject: "Password reser request",
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                console.log(error)
                return res.status(500).json({
                    status: "error",
                    message: "There was an error sending the email, please try again later"
                });
            } else {
                return res.status(200).json({
                    status: "success",
                    message: "Password reset link sent to your email"
                });
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal service"
        });
    }
})


//handle password reset
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        //verify reset token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const resetUser = await User.findOne({ email: decoded.email });
        if(!resetUser) {
            return res.status(404).json({
                status: "failed",
                message: "User not found"
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        //save new password
        user.password = hashedPassword;
        await resetUser.save();
        res.status(200).json({
            status: "success",
            message: "Your password has been successfully reset"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
});



//authenticated users route
router.get('/onboarding', verify, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to your dashboard",
    });
});

//ADMIN
//admin permisssion route
router.get('/admin', verify, verifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Welcome to the admin portal",
    });
});

//RETRIEVE ALL USERS
//get all users
router.get('/users', verify, verifyRole, (req, res) => {
    res.status(200).json({
        status: "success",
    })
    res.end();
});

//EMAIL ROUTE
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

//SURVEY ROUTE
//submit survey
// router.post('/submit-survey', async (req, res) => {
//     const { q1, q2, q3, q4, q5 } = req.body;

//     try {
//         const 
//     }
// })

export default router;
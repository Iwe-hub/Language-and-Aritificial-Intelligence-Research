import { validationResult } from "express-validator";
import { check } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};

class validation {
    static registerValidation() {
        return [
            check("userName")
                .notEmpty()
                .withMessage("Your name is required")
                .trim()
                .escape(),
            check("email")
                .isEmail()
                .withMessage("Enter a valid email address")
                .normalizeEmail(),
            check("password")
                .notEmpty()
                .isLength({ min: 6 })
                .withMessage("Must be at least 6 characters long"),
        ];
    }
}

export { validation, validate }


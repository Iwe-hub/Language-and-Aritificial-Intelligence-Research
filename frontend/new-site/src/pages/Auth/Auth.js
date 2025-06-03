import React, { useState} from "react";
import "./Auth.css";

function AuthForm() {
    //states for form inputs
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    //handle register
    const handleRegister = (e) => {
        e.preventDefault();

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if(!emailPattern.test(userEmail)) {
            alert("Please enter a valid email address");
            return;
        }

        if(userPassword.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        const fetchData = {
            method: "POST",
            body: JSON.stringify({ userName, userEmail, userPassword }),
            headers: { "Content-Type": "application/json" },
        };

        fetch("/register", fetchData)
           .then((res) => res.json())
           .then((data) => {
            if(data.success) {
                alert("registration sucessful")
                localStorage.setItem("token", data.token)
                window.location.assign("/onboarding")
            } else {
                alert("error during registration")
            }
           })
           .catch((err) => console.error("Error:", err))
    };

    //handle login
    const handleLogin = (e) => {
        e.preventDefault();

        if(!loginEmail || !loginPassword) {
            alert("Please fill in all fields")
            return;
        }

        const loginData = {
            method: "POST",
            body: JSON.stringify({ loginEmail, loginPassword }),
            headers: { "Content-Type": "application/json" },
        };

        fetch("/login", loginData)
            .then((res) => res.json())
            .then((data) => {
                if(data.success) {
                    localStorage.setItem("token", data.token)
                    if(data.needsOnboarding) {
                        window.location.assign("/onboarding")
                    } else {
                        window.location.assign("/dashboard")
                    }
                } else {
                    alert("invalid login credentials")
                }
            })
            .catch((err) => console.error("error:", err))
    };

    //create register form
    const signUpForm = React.createElement(
        "form",
        { onSubmit: handleRegister },
        React.createElement("h1", null, "Create Account"),
        React.createElement("div", { className: "social-icons" },
            React.createElement("a", { href: "#", className: "icon" }, "Google"),
            React.createElement("a", { href: "#", className: "icon" }, "Facebook"),
            React.createElement("a", { href: "#", className: "icon" }, "Github"),
            React.createElement("a", { href: "#", className: "icon" }, "LinkedIn"),
        ),
        React.createElement("span", null, "or use your email for registration"),
        React.createElement("input", {
            type: "text",
            placeholder: "Name",
            value: userName,
            onChange: (e) => setUserName(e.target.value),
            required: true,
        }),
        React.createElement("input", {
            type: "email",
            placeholder: "Email",
            value: userEmail,
            onChange: (e) => setUserEmail(e.target.value),
            required: true,
        }),
        React.createElement("input", {
            type: "password",
            placeholder: "Password",
            value: userPassword,
            onChange: (e) => setUserPassword(e.target.value),
            required: true,
        }),
        React.createElement(
            "button",
            { type: "submit" },
            "Sign Up"
        )
    );

    //create login form
    const signInForm = React.createElement(
        "form",
        { onSubmit: handleLogin },
        React.createElement("h1", null, "Sign In"),
        React.createElement("div", { className: "social-icons" },
            React.createElement("a", { href: "#", className: "icon" }, "Google"),
            React.createElement("a", { href: "#", className: "icon" }, "Facebook"),
            React.createElement("a", { href: "#", className: "icon" }, "GitHub"),
            React.createElement("a", { href: "#", className: "icon" }, "LinkedIn"),
        ),
        React.createElement("span", null, "or use your email password"),
        React.createElement("input", {
            type: "email",
            placeholder: "Email",
            value: loginEmail, 
            onChange: (e) => setLoginEmail(e.target.value),
            required: true,
        }),
        React.createElement("input", {
            type: "password",
            placeholder: "Password",
            value: loginPassword,
            onChange: (e) => setLoginPassword(e.target.value),
            required: true,
        }),
        React.createElement("a", { href: "#" }, "Forget Your Password?"),
        React.createElement(
            "button",
            { type: "submit" },
            "Sign In"
        )
    );

    //toggle between forms
    const toggleForm = () => {
        const container = document.getElementById("container")
        container.classList.toggle("active")
    };

    return React.createElement(
        "div",
        { className: "container", id: "container" },
        React.createElement(
            "div",
            { className: "form-container sign-up" },
            signUpForm
        ),
        React.createElement(
            "div",
            { className: "form-container sign-in" },
            signInForm
        ),
        React.createElement(
            "div",
            { className: "toggle-container" },
            React.createElement(
                "div",
                { className: "toggle" },
                React.createElement(
                    "div",
                    { className: "toggle-panel toggle-left" },
                    React.createElement("h1", null, "Welcome Back!"),
                    React.createElement("p", null, "Enter your personal details to use all of site features"),
                    React.createElement(
                        "button",
                        { className: "hidden", id: "login", onClick: toggleForm },
                        "Sign In"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "toggle-panel toggle-right" },
                    React.createElement("h1", null, "Hello Friend!"),
                    React.createElement("p", null, "Register with your personal details to use all of site features"),
                    React.createElement(
                        "button",
                        { className: "hidden", id: "register", onClick: toggleForm },
                        "Sign Up"
                    )

                )
            )
        )
    );

}

export default AuthForm;
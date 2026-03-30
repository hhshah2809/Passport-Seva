const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens.js");

// REGISTER
const register = async (req, res) => {
    try {
        const { name, email, aadharNumber, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { aadharNumber }]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            aadharNumber,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// REFRESH ACCESS TOKEN
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || user._id.toString() !== decoded.id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const accessToken = generateAccessToken(user);
            res.status(200).json({ accessToken });
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

// LOGOUT
const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(400).json({ message: "Bad request" });
        }

        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { register, login, refresh, logout };

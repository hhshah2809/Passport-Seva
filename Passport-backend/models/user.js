const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isAadharVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;

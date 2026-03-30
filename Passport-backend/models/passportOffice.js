const mongoose = require("mongoose");

const passportOfficeSchema = new mongoose.Schema({
    officeCode: {
        type: String,
        required: true,
        unique: true
    },
    officeName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    dailyCapacity: {
        normal: {
            type: Number,
            required: true
        },
        tatkaal: {
            type: Number,
            required: true
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model("PassportOffice", passportOfficeSchema);

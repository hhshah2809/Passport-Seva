const PassportApplication = require('../models/passportApplication');
const PassportOffice = require('../models/passportOffice');
const cloudinary = require('../config/cloudinary');
const detectForgery = require("../services/fraudDetectionService");
const User = require("../models/user");

const createApplication = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { applicationType, officeId, appointmentDate, applicantDetails } = req.body;

    // 🔥 GET USER
    const user = await User.findById(req.user.id);

    // 🚨 BLOCK CHECK
    if (user.isBlocked) {
      return res.status(403).json({
        message: "You are blocked due to multiple forged attempts"
      });
    }

    // 🔥 SLOT CHECK (your existing logic)
    const office = await PassportOffice.findById(officeId);
    if (!office) {
      return res.status(404).json({ message: "Passport Office not found" });
    }

    const start = new Date(appointmentDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(appointmentDate);
    end.setHours(23, 59, 59, 999);

    const count = await PassportApplication.countDocuments({
      officeId,
      applicationType,
      appointmentDate: { $gte: start, $lte: end }
    });

    const capacity =
      applicationType === "NORMAL"
        ? office.dailyCapacity.normal
        : office.dailyCapacity.tatkaal;

    if (count >= capacity) {
      return res.status(400).json({ message: "No slots available" });
    }

    // 🚨 DOCUMENT CHECK
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Documents are required" });
    }

    // 🔥 AI FORGERY CHECK (NEW)
    const isForged = await detectForgery(req.files);

    if (isForged) {
      user.fraudCount += 1;

      if (user.fraudCount >= 3) {
        user.isBlocked = true;
      }

      await user.save();

      return res.status(400).json({
        message: "Forged document detected. Application rejected."
      });
    }

    // ✅ Upload documents
    const allowedTypes = ["AADHAR", "BIRTH_CERTIFICATE", "ADDRESS_PROOF", "PHOTO","OTHER"];
    const documents = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      const result = await cloudinary.uploader.upload(file.path);

      documents.push({
        documentType: allowedTypes[i] || "OTHER",
        fileUrl: result.secure_url
      });
    }

    let applicantDetailsObj;
    try {
      applicantDetailsObj = JSON.parse(applicantDetails);
    } catch (err) {
      return res.status(400).json({ message: "Invalid applicantDetails format" });
    }

    const application = await PassportApplication.create({
      user: req.user.id,
      applicationType,
      officeId,
      appointmentDate,
      applicantDetails: applicantDetailsObj,
      documents
    });

    res.status(201).json({ success: true, application });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




const getUserApplications = async (req, res) => {
  try {
    const applications = await PassportApplication.find({
      user: req.user._id
    }).populate("officeId");

    res.json({ success: true, applications });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await PassportApplication.findById(req.params.id)
      .populate("officeId")
      .populate("user");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getApplicationById
};

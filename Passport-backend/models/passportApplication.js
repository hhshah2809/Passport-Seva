const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  documentType: {
    type: String,
    enum: ["AADHAR", "BIRTH_CERTIFICATE", "ADDRESS_PROOF", "PHOTO","OTHER"],
    required: true
  },

  fileUrl: {
    type: String,
    required: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  forgedScore: {
    type: Number,
    default: 0
  }
});

const passportApplicationSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  applicationType: {
    type: String,
    enum: ["NORMAL", "TATKAAL"],
    required: true
  },

  officeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PassportOffice",
    required: false
  },

  appointmentDate: {
    type: Date,
    required: true
  },

  applicantDetails: {
    fatherName: String,
    motherName: String,
    dob: Date,
    gender: String,
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    }
  },

  documents: [documentSchema],   // 👈 IMAGE URL IS HERE

  status: {
    type: String,
    enum: ["SUBMITTED", "APPROVED", "REJECTED"],
    default: "SUBMITTED"
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS"],
    default: "PENDING"
  }

}, { timestamps: true });

module.exports = mongoose.model("PassportApplication", passportApplicationSchema);

const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multer.js');
const verifyToken = require('../middlewares/authMiddleware.js');
const {createApplication,
  getUserApplications,
  getApplicationById} = require('../controllers/passportApplicationController.js');
  // create application
router.post("/create", verifyToken, upload.array("documents",5) ,createApplication);

// get logged-in user's applications
router.get("/my", verifyToken,getUserApplications);

// get application by id
router.get("/:id", getApplicationById);

module.exports = router;
const express = require('express');
const router = express.Router();
 const verifyToken = require('../middlewares/authMiddleware.js');
const verifyAdmin = require('../middlewares/adminMiddleware.js');
const { createOffice } = require('../controllers/passportOfficeController.js');

// Only admin can create a passport office
router.post('/create', verifyToken, verifyAdmin, createOffice);

// Optional: Admin can view all offices
// router.get('/', verifyToken, verifyAdmin, getAllOffices);
const { getAllOffices } = require("../controllers/passportOfficeController");

// GET all active passport offices
router.get("/", getAllOffices);
module.exports = router;

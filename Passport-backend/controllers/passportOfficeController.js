const passportOffice = require('../models/passportOffice.js');

const createOffice = async(req,res) => {
    try{
        const office = await passportOffice.create(req.body);
        res.status(201).json(office);
    }
    catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

// Get all active offices
const getAllOffices = async (req, res) => {
  try {
    const offices = await passportOffice.find({ isActive: true });

    res.status(200).json({
      success: true,
      offices
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getAllOffices, createOffice };



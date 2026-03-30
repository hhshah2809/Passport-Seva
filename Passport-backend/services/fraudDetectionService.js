const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const detectForgery = async (files) => {
  try {
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", fs.createReadStream(file.path));

      const response = await axios.post(
        "http://127.0.0.1:8000/predict",
        formData,
        { headers: formData.getHeaders() }
      );

      if (response.data.prediction === "forged") {
        return true; // 🚨 stop immediately
      }
    }

    return false;

  } catch (error) {
    console.error("FastAPI Error:", error.message);
    return false;
  }
};

module.exports = detectForgery;
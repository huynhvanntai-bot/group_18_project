// Simple login test
require("dotenv").config();
const axios = require("axios");

const testSimpleLogin = async () => {
  try {
    console.log("Testing simple login...");
    
    const response = await axios.post("http://localhost:5000/api/login", {
      email: "admin@gmail.com.com",
      password: "123456"
    });
    
    console.log("✅ Login successful:", response.data);
    
  } catch (error) {
    console.error("❌ Login failed:");
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  }
};

testSimpleLogin();
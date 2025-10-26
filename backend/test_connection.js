// Test server connection
const axios = require("axios");

const testConnection = async () => {
  try {
    console.log("Testing server connection...");
    const response = await axios.get("http://localhost:5000/");
    console.log("✅ Server response:", response.data);
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
  }
};

testConnection();
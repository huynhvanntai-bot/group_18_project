import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ⚠️ backend của bạn đang chạy port 5000
});

export default API;

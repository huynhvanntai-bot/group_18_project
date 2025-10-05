import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // ❌ bỏ /api
});

export default API;

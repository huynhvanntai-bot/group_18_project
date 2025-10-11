import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ⚡ chỉ để /api thôi, KHÔNG thêm /auth
});

export default api;

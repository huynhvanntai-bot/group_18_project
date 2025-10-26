import axios from "axios";

// Read backend host from environment (CRA bakes REACT_APP_* at build time).
// Falls back to localhost for local development.
const backendHost = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: `${backendHost.replace(/\/$/, '')}/api`, // ensure no trailing slash
});

export default api;

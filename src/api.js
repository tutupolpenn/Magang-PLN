// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // sesuaikan dengan URL backend-mu
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;

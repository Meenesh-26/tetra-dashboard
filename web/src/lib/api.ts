import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token automatically to every request
api.interceptors.request.use(
  (config) => {
    // We will retrieve the token from localStorage or cookies depending on the implementation
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("tetra_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true
});

let accessToken = localStorage.getItem("accessToken");

export const setAccessToken = (token) => {
  accessToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/auth/refresh");
        const newAccessToken = res.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        setAccessToken(null);
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;

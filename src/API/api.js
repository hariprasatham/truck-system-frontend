import axios from "axios";


const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

// Function to handle retrying failed requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// Function to get a new access token using the refresh token
const refreshToken = async () => {
  try {

    const response = await axios.post(`${BASEURL}/auth/refresh`,{
      refreshToken: localStorage.getItem("refresh_token"),
    });

    const newAccessToken = response?.data?.access_token;

    // Update tokens in localStorage
    localStorage.setItem("access_token", newAccessToken);
    localStorage.setItem("refresh_token", response?.data?.refresh_token);

    return newAccessToken;
  } catch (error) {
    localStorage.clear();
    window.location.href = "/login";
    return Promise.reject(error);
  }
};


// Interceptor to add access token to request headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshToken();
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
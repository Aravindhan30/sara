import axios from "axios";

/**
 * Determines the correct API base URL based on the environment.
 * Prioritizes an explicit environment variable (REACT_APP_API_URL), 
 * then development (localhost), falling back to the deployed production URL.
 */
const getBaseUrl = () => {
  // 1. Use explicit environment variable if set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 2. Use localhost for development mode
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:5000/api";
  }

  // 3. Fallback to the deployed Render URL for production
  return "https://sarah-app-x3md.onrender.com/api";
};

const api = axios.create({
  baseURL: getBaseUrl(),
  
  // Required for sending cookies/session tokens across domains (client to server).
  withCredentials: true,
});

export default api;

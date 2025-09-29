// frontend/src/services/studentService.js
import axios from 'axios';
import authService from './authService';

// Replace with your Render backend URL
const API_URL = 'https://sarah-app-x3md.onrender.com/api/student/'; 

const getAuthHeaders = () => {
    const user = authService.getCurrentUser();
    return user && user.token ? { 'x-auth-token': user.token } : {};
};

const getDashboardData = () => {
    return axios.get(API_URL + 'dashboard', { headers: getAuthHeaders() });
};

const getProfileData = () => {
    return axios.get(API_URL + 'profile', { headers: getAuthHeaders() });
};

// Add functions for getHostelData, getTransportData, getFeesData...

const studentService = {
    getDashboardData,
    getProfileData,
    // ...
};

export default studentService;

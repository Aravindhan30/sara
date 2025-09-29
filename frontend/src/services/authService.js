const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Function to handle user login
const login = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and role in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userRole', data.role);
            
            // Return user data (including role)
            return data;
        } else {
            // Throw an error with the backend's message
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login service error:', error);
        throw error;
    }
};

// Use named export for 'login' to fix the import error
export { login };
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { LogIn, User, Shield, AlertTriangle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('password');
    const [role, setRole] = useState('Student'); // 'Student' or 'Administrator'
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Tailwind base styles for common elements
    const inputStyle = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-150 shadow-sm";
    const buttonStyle = "w-full py-3 mt-6 text-white font-semibold rounded-lg shadow-lg transition duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500";
    const roleButtonStyle = (selected) => 
        `flex-1 py-3 text-center rounded-lg font-medium transition-colors duration-200 
        ${selected 
            ? 'bg-blue-600 text-white shadow-md' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await login(email, password);
            
            // Check if the role matches the selection on the login page
            if (response.role !== role) {
                setError(`Login successful, but role mismatch. You logged in as ${response.role}, but selected ${role}.`);
                // Clear the token if there's a mismatch to force re-login
                localStorage.removeItem('token');
                localStorage.removeItem('userRole');
                return;
            }

            // Navigate based on the confirmed role
            if (response.role === 'Student') {
                navigate('/student/dashboard');
            } else if (response.role === 'Administrator') {
                navigate('/admin/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            // Display a user-friendly error message
            setError(err.response?.data?.error || 'Invalid credentials or network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex items-center justify-center text-blue-600">
                    <LogIn size={40} className="mr-3" />
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        EduERP System
                    </h2>
                </div>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Integrated Student Management System
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Role Selection */}
                        <div className="flex space-x-2 p-1 bg-gray-50 rounded-xl shadow-inner">
                            <button
                                type="button"
                                onClick={() => setRole('Student')}
                                className={roleButtonStyle(role === 'Student')}
                            >
                                <User size={18} className="inline mr-2" /> Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('Administrator')}
                                className={roleButtonStyle(role === 'Administrator')}
                            >
                                <Shield size={18} className="inline mr-2" /> Administrator
                            </button>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputStyle}
                                placeholder="e.g., demo@example.com"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputStyle}
                                placeholder="••••••••"
                            />
                        </div>
                        
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center p-3 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
                                <AlertTriangle size={20} className="mr-2 flex-shrink-0" />
                                <div>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Sign In Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`${buttonStyle} ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    {/* Demo Credentials Hint (Matching PDF Page 1) */}
                    <div className="mt-6 p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800">
                        <p className="font-semibold mb-1">Demo Credentials:</p>
                        <p>Student Email: <strong>demo@example.com</strong> | Password: <strong>password</strong></p>
                        <p>Admin Email: <strong>admin@example.com</strong> | Password: <strong>password</strong></p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;

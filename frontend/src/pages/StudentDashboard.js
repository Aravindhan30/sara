import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import axios from 'axios';
import { Loader2, TrendingUp, CheckCircle, Clock, Bell, Calendar, Home, DollarSign, Bus, Hotel } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Helper function to render data cards
const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg border-l-4" style={{ borderColor: color }}>
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500 uppercase">{title}</p>
            <Icon size={24} className={color === 'rgba(59, 130, 246, 1)' ? 'text-blue-500' : 'text-gray-400'} style={{ color: color }} />
        </div>
        <p className="mt-1 text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
);

// Helper function to format date/time
const formatTimeAgo = (date) => {
    if (!date) return 'N/A';
    // Simplified time ago calculation for mock data display
    return date.includes('day') || date.includes('hour') ? date : new Date(date).toLocaleDateString();
};

const StudentDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found.');
                }
                
                const response = await axios.get(`${API_BASE_URL}/student/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                setDashboardData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch dashboard data:', err);
                setError('Failed to load dashboard data. Please log in again.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center h-full min-h-[50vh]">
                    <Loader2 size={48} className="animate-spin text-blue-500" />
                    <p className="ml-3 text-lg text-gray-600">Loading Dashboard...</p>
                </div>
            </StudentLayout>
        );
    }

    if (error) {
        return (
            <StudentLayout>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            </StudentLayout>
        );
    }

    const data = dashboardData || {};

    // Determine color based on fee status
    const feeColor = {
        'Paid': 'rgba(16, 185, 129, 1)', // Green
        'Pending': 'rgba(251, 191, 36, 1)', // Yellow
        'Overdue': 'rgba(239, 68, 68, 1)', // Red
        'N/A': 'rgba(156, 163, 175, 1)' // Gray
    }[data.feeStatus] || 'rgba(59, 130, 246, 1)'; // Default Blue

    return (
        <StudentLayout>
            {/* Welcome Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {data.name || 'Student User'}!</h1>
                    <p className="text-gray-500 mt-1">
                        ID: {data.studentID} | Department: {data.department} | Batch: {data.batch}
                    </p>
                </div>
                <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-100 p-2 rounded-full shadow-inner">
                    <Clock size={16} className="mr-1 text-blue-500" />
                    Semester: {data.semester || 'N/A'}
                </div>
            </div>

            {/* Top Stat Cards (Matching PDF Page 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="CGPA" 
                    value={data.cgpa ? data.cgpa.toFixed(1) : 'N/A'} 
                    icon={TrendingUp} 
                    color="rgba(59, 130, 246, 1)" // Blue
                />
                <StatCard 
                    title="Attendance" 
                    value={`${data.attendancePercentage || 'N/A'}%`} 
                    icon={CheckSquare} 
                    color="rgba(16, 185, 129, 1)" // Green
                />
                <StatCard 
                    title="Fees Status" 
                    value={data.feeStatus || 'N/A'} 
                    icon={DollarSign} 
                    color={feeColor} 
                />
                <StatCard 
                    title="Hostel Room" 
                    value={data.hostelRoom || 'N/A'} 
                    icon={Hotel} 
                    color="rgba(249, 115, 22, 1)" // Orange
                />
            </div>
            
            {/* Notifications & Events (Matching PDF Page 2 Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Notifications Panel (2/3 width on desktop) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg h-96 overflow-hidden flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Bell size={20} className="mr-2 text-red-500" /> Notifications
                    </h2>
                    <div className="space-y-4 flex-grow overflow-y-auto">
                        {(data.notifications || []).length > 0 ? (
                            (data.notifications || []).map((notif, index) => (
                                <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg transition hover:shadow-md">
                                    <Clock size={18} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-gray-800 leading-snug">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(notif.time)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <CheckCircle size={32} className="mx-auto text-green-400 mb-2" />
                                No new notifications.
                            </div>
                        )}
                    </div>
                </div>

                {/* Upcoming Events Panel (1/3 width on desktop) */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-96 overflow-hidden flex flex-col">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <Calendar size={20} className="mr-2 text-purple-500" /> Upcoming Events
                    </h2>
                    <div className="space-y-4 flex-grow overflow-y-auto">
                        {(data.upcomingEvents || []).length > 0 ? (
                            (data.upcomingEvents || []).map((event, index) => (
                                <div key={index} className="p-4 border-l-4 border-purple-300 bg-purple-50 rounded-lg">
                                    <p className="font-semibold text-gray-800">{event.title}</p>
                                    <p className="text-sm text-purple-600 mt-1 flex items-center">
                                        <Clock size={14} className="mr-1" />
                                        {event.date}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">
                                <Home size={32} className="mx-auto text-yellow-400 mb-2" />
                                No events scheduled.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentDashboard;

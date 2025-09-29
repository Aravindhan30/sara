import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import axios from 'axios';
import { ClipboardCheck, TrendingUp, AlertTriangle, Loader2, BarChart3, TrendingDown } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const StudentAttendance = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const ATTENDANCE_THRESHOLD = 75; // Standard required attendance percentage

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const token = localStorage.getItem('token');
                // We use the existing /student/dashboard route which contains the overall attendancePercentage
                const response = await axios.get(`${API_BASE_URL}/student/dashboard`, { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                // Mock data structure to fill the Attendance page details
                const mockAttendance = {
                    ...response.data,
                    // Data below mimics what would be fetched from a dedicated attendance endpoint
                    courseAttendance: [
                        { code: 'CS401', name: 'Database Systems', classesHeld: 40, classesAttended: 35, percentage: 87.5 },
                        { code: 'CS402', name: 'Operating Systems', classesHeld: 30, classesAttended: 20, percentage: 66.7 }, // Below threshold
                        { code: 'CS403', name: 'Artificial Intelligence', classesHeld: 40, classesAttended: 40, percentage: 100.0 },
                        { code: 'MA401', name: 'Advanced Calculus', classesHeld: 35, classesAttended: 30, percentage: 85.7 },
                        { code: 'HU401', name: 'Professional Ethics', classesHeld: 20, classesAttended: 15, percentage: 75.0 }, // Exactly threshold
                    ],
                };

                setAttendanceData(mockAttendance);
            } catch (err) {
                console.error('Failed to fetch attendance data:', err);
                setError('Unable to load attendance records. Please check your network or token.');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendanceData();
    }, []);

    const StatusPill = ({ percentage }) => {
        let classes = 'px-3 py-1 text-xs font-bold rounded-full flex items-center justify-center min-w-[100px]';
        let icon = null;
        let text = `${percentage.toFixed(1)}%`;

        if (percentage >= 80) {
            classes += ' bg-teal-100 text-teal-700';
            icon = <TrendingUp size={14} className="mr-1" />;
        } else if (percentage >= ATTENDANCE_THRESHOLD) {
            classes += ' bg-yellow-100 text-yellow-700';
            icon = <ClipboardCheck size={14} className="mr-1" />;
        } else {
            classes += ' bg-red-100 text-red-700 font-extrabold';
            icon = <TrendingDown size={14} className="mr-1" />;
        }
        
        return <span className={classes}>{icon}{text}</span>;
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center h-96">
                    <Loader2 size={40} className="animate-spin text-teal-500" />
                    <p className="ml-3 text-lg text-gray-600">Retrieving Attendance Records...</p>
                </div>
            </StudentLayout>
        );
    }

    if (error || !attendanceData) {
        return (
            <StudentLayout>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertTriangle size={24} className="mr-3" />
                    <p>{error || 'No attendance data found for this account.'}</p>
                </div>
            </StudentLayout>
        );
    }
    
    const courseAttendance = attendanceData.courseAttendance || [];

    return (
        <StudentLayout>
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="text-center mb-10">
                    <ClipboardCheck size={50} className="mx-auto text-teal-600 mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Attendance Tracker</h1>
                    <p className="text-lg text-gray-500">Semester {attendanceData.semester} Daily Records (Pages 12-13)</p>
                </div>

                {/* Overall Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Overall Attendance Percentage</p>
                            <p className="text-4xl font-extrabold text-gray-900 mt-1">{attendanceData.attendancePercentage.toFixed(1)}%</p>
                        </div>
                        <BarChart3 size={48} className="text-teal-400" />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-amber-500">
                        <p className="text-sm font-medium text-gray-500 flex items-center">
                            <AlertTriangle size={16} className="text-amber-500 mr-1" />
                            Minimum Requirement
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{ATTENDANCE_THRESHOLD}%</p>
                        <p className="text-xs text-gray-500 mt-1">Students below this may face academic probation.</p>
                    </div>
                </div>

                {/* Detailed Course Breakdown */}
                <div className="bg-white rounded-xl shadow-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                        <ListChecks size={20} className="mr-2 text-teal-600" />
                        Course-wise Attendance Details
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Held</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Attended</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {courseAttendance.length > 0 ? (
                                    courseAttendance.map((course, index) => (
                                        <tr 
                                            key={index} 
                                            className={`hover:bg-gray-50 transition duration-100 ${course.percentage < ATTENDANCE_THRESHOLD ? 'bg-red-50' : ''}`}
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {course.code}: {course.name}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">{course.classesHeld}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">{course.classesAttended}</td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                                <StatusPill percentage={course.percentage} />
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                                {course.percentage < ATTENDANCE_THRESHOLD ? (
                                                    <span className="text-red-600 font-semibold text-xs">WARNING</span>
                                                ) : (
                                                    <span className="text-green-600 font-medium text-xs">OK</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-500 italic">No course attendance data available.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Action/Warning Panel */}
                    {courseAttendance.some(c => c.percentage < ATTENDANCE_THRESHOLD) && (
                        <div className="mt-8 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                            <p className="font-bold flex items-center">
                                <AlertTriangle size={20} className="mr-2" />
                                Immediate Action Required
                            </p>
                            <p className="text-sm mt-1">You are currently below the required {ATTENDANCE_THRESHOLD}% attendance in one or more subjects. Please contact your instructor immediately.</p>
                        </div>
                    )}

                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentAttendance;

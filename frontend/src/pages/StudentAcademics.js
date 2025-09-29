import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import axios from 'axios';
import { BookOpen, Award, TrendingUp, BarChart2, Loader2, AlertTriangle, ListChecks } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const StudentAcademics = () => {
    const [academicsData, setAcademicsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAcademicsData = async () => {
            try {
                const token = localStorage.getItem('token');
                // We use the existing /student/dashboard route as it contains CGPA/Semester info
                const response = await axios.get(`${API_BASE_URL}/student/dashboard`, { 
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                // Mock data structure to fill the Academics page, as the dashboard endpoint only gives summary data
                const mockAcademics = {
                    ...response.data,
                    currentCourses: [
                        { code: 'CS401', name: 'Database Systems', instructor: 'Dr. Jane Smith', credits: 4, grade: 'A' },
                        { code: 'CS402', name: 'Operating Systems', instructor: 'Prof. John Doe', credits: 3, grade: 'B+' },
                        { code: 'CS403', name: 'Artificial Intelligence', instructor: 'Dr. Emily Chen', credits: 4, grade: 'A-' },
                        { code: 'MA401', name: 'Advanced Calculus', instructor: 'Prof. Alex Lee', credits: 3, grade: 'B' },
                        { code: 'HU401', name: 'Professional Ethics', instructor: 'Dr. Susan Ray', credits: 2, grade: 'A' },
                    ],
                    previousSemesters: [
                        { semester: 3, sgpa: 8.8, gpa: 3.8 },
                        { semester: 2, sgpa: 8.5, gpa: 3.5 },
                        { semester: 1, sgpa: 9.1, gpa: 4.0 },
                    ],
                };

                setAcademicsData(mockAcademics);
            } catch (err) {
                console.error('Failed to fetch academics data:', err);
                setError('Unable to load academic details. Please check your network or token.');
            } finally {
                setLoading(false);
            }
        };

        fetchAcademicsData();
    }, []);

    const GradePill = ({ grade }) => {
        let classes = 'px-3 py-1 text-xs font-bold rounded-full text-white';
        if (grade === 'A' || grade === 'A+') classes += ' bg-green-600';
        else if (grade.startsWith('B')) classes += ' bg-blue-600';
        else if (grade.startsWith('C')) classes += ' bg-yellow-600';
        else classes += ' bg-gray-500';
        
        return <span className={classes}>{grade}</span>;
    };


    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center h-96">
                    <Loader2 size={40} className="animate-spin text-indigo-500" />
                    <p className="ml-3 text-lg text-gray-600">Loading Academic Records...</p>
                </div>
            </StudentLayout>
        );
    }

    if (error || !academicsData) {
        return (
            <StudentLayout>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertTriangle size={24} className="mr-3" />
                    <p>{error || 'No academic data found for this account.'}</p>
                </div>
            </StudentLayout>
        );
    }
    
    const currentCourses = academicsData.currentCourses || [];
    const previousSemesters = academicsData.previousSemesters || [];

    return (
        <StudentLayout>
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="text-center mb-10">
                    <BookOpen size={50} className="mx-auto text-indigo-600 mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Academic Overview</h1>
                    <p className="text-lg text-gray-500">Semester {academicsData.semester} Performance (Page 11)</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Current CGPA</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{academicsData.cgpa || 'N/A'}</p>
                        </div>
                        <Award size={36} className="text-indigo-400" />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-purple-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Current Semester</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{academicsData.semester || 'N/A'}</p>
                        </div>
                        <ListChecks size={36} className="text-purple-400" />
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-teal-500 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Completed Credits</p>
                            {/* Calculation based on mock data for display only */}
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {previousSemesters.reduce((sum, sem) => sum + (sem.gpa ? 18 : 0), 0) + 
                                 currentCourses.reduce((sum, course) => sum + (course.grade ? course.credits : 0), 0)}
                            </p>
                        </div>
                        <TrendingUp size={36} className="text-teal-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Current Courses and Grades (Left - Main Content) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <BookOpen size={20} className="mr-2 text-indigo-600" />
                            Current Semester Courses (Semester {academicsData.semester})
                        </h2>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Midterm Grade</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentCourses.length > 0 ? (
                                        currentCourses.map((course, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition duration-100">
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{course.name}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">{course.credits}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-700">{course.instructor}</td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                                    <GradePill grade={course.grade} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-500 italic">No courses currently registered.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Previous Semester Performance (Right - Side Panel) */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <BarChart2 size={20} className="mr-2 text-indigo-600" />
                            Performance History
                        </h2>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {previousSemesters.length > 0 ? (
                                previousSemesters.map((sem, index) => (
                                    <div key={index} className="border-l-4 border-purple-400 p-3 bg-purple-50 rounded-lg shadow-sm">
                                        <p className="font-semibold text-purple-800">Semester {sem.semester} Results</p>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-gray-700">SGPA:</span>
                                            <span className="font-bold text-purple-900">{sem.sgpa.toFixed(1)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-700">GPA:</span>
                                            <span className="font-bold text-purple-900">{sem.gpa.toFixed(1)}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No previous semester results found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentAcademics;

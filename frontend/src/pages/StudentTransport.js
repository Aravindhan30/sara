import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import axios from 'axios';
import { Bus, MapPin, Clock, User, DollarSign, Loader2, AlertTriangle, Shield, XCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const StudentTransport = () => {
    const [transportData, setTransportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransportData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/student/transport`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTransportData(response.data);
            } catch (err) {
                console.error('Failed to fetch transport data:', err);
                setError('Unable to load transport details. Please check your network.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransportData();
    }, []);

    const InfoRow = ({ icon: Icon, label, value }) => (
        <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
                <Icon size={20} className="text-orange-500 mr-4 flex-shrink-0" />
                <span className="font-medium text-gray-600">{label}</span>
            </div>
            <span className="font-semibold text-gray-800 text-right truncate max-w-[60%]">
                {value || 'N/A'}
            </span>
        </div>
    );

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center h-96">
                    <Loader2 size={40} className="animate-spin text-orange-500" />
                    <p className="ml-3 text-lg text-gray-600">Loading Transport Details...</p>
                </div>
            </StudentLayout>
        );
    }

    if (error || !transportData) {
        return (
            <StudentLayout>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertTriangle size={24} className="mr-3" />
                    <p>{error || 'No transport data found.'}</p>
                </div>
            </StudentLayout>
        );
    }
    
    // Check if the student is a bus user
    const isBusUser = transportData.isBusUser;

    if (!isBusUser) {
        return (
            <StudentLayout>
                <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl text-center">
                    <XCircle size={60} className="mx-auto text-red-400 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Transport Service</h1>
                    <p className="text-lg text-gray-600 mt-2">
                        You are not currently registered for the university bus service.
                    </p>
                    <div className="mt-6 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                        Please contact the transport office to apply for a bus pass.
                    </div>
                </div>
            </StudentLayout>
        );
    }

    return (
        <StudentLayout>
            <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-2xl">
                <div className="text-center mb-8">
                    <Bus size={50} className="mx-auto text-orange-600 mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Transport Details</h1>
                    <p className="text-lg text-gray-500">Your current bus service route and schedule (Pages 6-7)</p>
                </div>
                
                {/* Route and Schedule Card */}
                <div className="border border-gray-200 rounded-xl p-6 sm:p-8 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                        <MapPin size={20} className="mr-2 text-orange-600" />
                        Route Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                        <InfoRow icon={Bus} label="Bus Route Number" value={transportData.route} />
                        <InfoRow icon={MapPin} label="Boarding Stop" value={transportData.stopName} />
                        <InfoRow icon={Clock} label="Bus Arrival Time" value={transportData.arrivalTime} />
                        <InfoRow icon={User} label="Driver Contact" value={transportData.driverContact} />
                    </div>
                </div>

                {/* Additional Schedule Info (Matching PDF Content) */}
                <div className="p-6 bg-orange-50 rounded-xl shadow-inner">
                    <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
                        <Clock size={20} className="mr-2" />
                        Daily Schedule and Fare
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                        <div>
                            <p className="font-semibold">Morning Pickup</p>
                            <p className="text-sm">{transportData.arrivalTime} at {transportData.stopName}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Evening Drop-off</p>
                            <p className="text-sm">{transportData.departureTime} (Campus Departure)</p>
                        </div>
                        <div>
                            <p className="font-semibold flex items-center"><DollarSign size={16} className="mr-1" /> Monthly Fare</p>
                            <p className="text-sm text-green-700 font-bold">$ {transportData.monthlyFare}</p>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentTransport;

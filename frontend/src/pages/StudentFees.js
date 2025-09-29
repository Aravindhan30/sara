import React, { useState, useEffect } from 'react';
import StudentLayout from '../components/StudentLayout';
import axios from 'axios';
import { DollarSign, FileText, CheckCircle, Clock, AlertTriangle, Loader2, Calendar, CreditCard } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const StudentFees = () => {
    const [feeData, setFeeData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeeData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${API_BASE_URL}/student/fees`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFeeData(response.data);
            } catch (err) {
                console.error('Failed to fetch fee data:', err);
                setError('Unable to load fee details. Please check your network or token.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeeData();
    }, []);

    const formatCurrency = (amount) => {
        return amount ? `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '$ 0.00';
    };

    const FeeStatusBadge = ({ status }) => {
        let classes = 'px-3 py-1 rounded-full text-sm font-semibold';
        let icon = null;
        if (status === 'Paid') {
            classes += ' bg-green-100 text-green-700';
            icon = <CheckCircle size={16} className="inline mr-1" />;
        } else if (status === 'Pending') {
            classes += ' bg-yellow-100 text-yellow-700';
            icon = <Clock size={16} className="inline mr-1" />;
        } else if (status === 'Overdue') {
            classes += ' bg-red-100 text-red-700';
            icon = <AlertTriangle size={16} className="inline mr-1" />;
        } else {
            classes += ' bg-gray-100 text-gray-700';
        }
        return <span className={classes}>{icon}{status || 'N/A'}</span>;
    };

    if (loading) {
        return (
            <StudentLayout>
                <div className="flex justify-center items-center h-96">
                    <Loader2 size={40} className="animate-spin text-green-500" />
                    <p className="ml-3 text-lg text-gray-600">Loading Financial Records...</p>
                </div>
            </StudentLayout>
        );
    }

    if (error || !feeData) {
        return (
            <StudentLayout>
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center">
                    <AlertTriangle size={24} className="mr-3" />
                    <p>{error || 'No fee data found for this account.'}</p>
                </div>
            </StudentLayout>
        );
    }
    
    // Default to empty array if not present
    const breakdown = feeData.breakdown || [];
    const paymentHistory = feeData.paymentHistory || [];

    return (
        <StudentLayout>
            <div className="max-w-6xl mx-auto p-4 sm:p-6">
                <div className="text-center mb-10">
                    <DollarSign size={50} className="mx-auto text-green-600 mb-2" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Fees Management</h1>
                    <p className="text-lg text-gray-500">Overview of Semester {feeData.semester} Dues (Pages 8-10)</p>
                </div>

                {/* Main Summary Card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
                        <p className="text-sm font-medium text-gray-500">Total Fee</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{formatCurrency(feeData.totalFee)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <div className="mt-1"><FeeStatusBadge status={feeData.status} /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-blue-500">
                        <p className="text-sm font-medium text-gray-500">Due Date</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1 flex items-center">
                            <Calendar size={20} className="mr-2 text-blue-500" />
                            {feeData.dueDate ? new Date(feeData.dueDate).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                {/* Fee Breakdown and Payment History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Fee Breakdown (Left - Page 8) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <FileText size={20} className="mr-2 text-green-600" />
                            Fee Breakdown (Semester {feeData.semester})
                        </h2>
                        
                        <div className="space-y-3">
                            {breakdown.length > 0 ? (
                                breakdown.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                        <span className="font-semibold text-gray-800">{formatCurrency(item.amount)}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No fee breakdown details available.</p>
                            )}
                        </div>
                    </div>

                    {/* Payment History (Right - Page 9-10) */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center">
                            <CreditCard size={20} className="mr-2 text-green-600" />
                            Payment History
                        </h2>
                        
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {paymentHistory.length > 0 ? (
                                paymentHistory.map((payment, index) => (
                                    <div key={index} className="border-l-4 border-green-400 p-3 bg-green-50 rounded-lg shadow-sm">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-gray-700">Amount Paid:</span>
                                            <span className="text-green-700 font-bold">{formatCurrency(payment.amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Date: {new Date(payment.date).toLocaleDateString()}</span>
                                            <span className="font-medium">{payment.method}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">No previous payments found for this semester.</p>
                            )}
                        </div>

                        {/* Payment Button (Matching PDF) */}
                        {feeData.status !== 'Paid' && (
                            <button 
                                onClick={() => alert('Payment gateway integration placeholder.')} 
                                className="w-full mt-6 flex items-center justify-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition duration-150 shadow-md"
                            >
                                <DollarSign size={20} className="mr-2" />
                                Proceed to Payment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
};

export default StudentFees;

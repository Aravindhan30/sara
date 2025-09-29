import React from 'react';
import AdminLayout from '../components/AdminLayout'; // Now importing the new layout
import { LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => (
    <AdminLayout>
        <div className="text-center p-10 bg-white rounded-xl shadow-lg border-t-4 border-teal-500">
            <LayoutDashboard size={40} className="mx-auto text-teal-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-lg text-gray-500 mt-2">Central Management Panel (Page 14)</p>
            <p className="text-sm text-gray-400 mt-4">We will implement the detailed analytics here next.</p>
        </div>
    </AdminLayout>
);

export default AdminDashboard;

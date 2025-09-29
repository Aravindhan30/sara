import React from 'react';
import AdminLayout from '../components/AdminLayout'; 
import { CreditCard } from 'lucide-react';

const AdminFees = () => (
    <AdminLayout>
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
            <CreditCard size={40} className="mx-auto text-green-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Fees & Transactions</h1>
            <p className="text-lg text-gray-500 mt-2">Manage Fee Structures and Payments (Coming Soon)</p>
        </div>
    </AdminLayout>
);

export default AdminFees;

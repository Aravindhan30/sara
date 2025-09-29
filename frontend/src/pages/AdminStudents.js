import React from 'react';
import AdminLayout from '../components/AdminLayout'; 
import { Users } from 'lucide-react';

const AdminStudents = () => (
    <AdminLayout>
        <div className="text-center p-10 bg-white rounded-xl shadow-lg">
            <Users size={40} className="mx-auto text-blue-600 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800">Student Management</h1>
            <p className="text-lg text-gray-500 mt-2">View, Add, and Edit Student Records (Coming Soon)</p>
        </div>
    </AdminLayout>
);

export default AdminStudents;

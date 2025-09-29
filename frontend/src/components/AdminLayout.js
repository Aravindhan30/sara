import React, { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Users, CreditCard, Menu, X, UserCog } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Use useLocation to check the current path

    // Ensure only Admin can access this layout
    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'Admin') {
            // Redirect to login if not authenticated as Admin
            navigate('/'); 
        }
    }, [navigate]);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { name: 'Manage Students', icon: Users, path: '/admin/students' },
        { name: 'Manage Fees', icon: CreditCard, path: '/admin/fees' },
    ];

    const Sidebar = () => (
        <div className="flex flex-col h-full bg-gray-900 text-white w-64 fixed lg:relative z-30 transition-transform duration-300 ease-in-out transform">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h1 className="text-xl font-extrabold text-teal-400 flex items-center">
                    <UserCog className="mr-2" size={24} /> ADMIN PORTAL
                </h1>
                <button 
                    className="lg:hidden text-white" 
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>
            
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors duration-200 ${
                            location.pathname === item.path 
                                ? 'bg-teal-600 text-white font-bold shadow-lg' 
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="mr-3" size={20} />
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 rounded-lg text-left text-red-400 hover:bg-gray-700 transition-colors duration-200"
                >
                    <LogOut className="mr-3" size={20} />
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Mobile Sidebar */}
            <div 
                className={`fixed inset-0 bg-gray-900 bg-opacity-75 z-20 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className={`fixed h-full z-40 lg:relative ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <Sidebar />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header/Top Bar */}
                <header className="flex items-center justify-between p-4 bg-white shadow-md lg:hidden">
                    <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600">
                        <Menu size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                    <div className="w-6"></div> {/* Placeholder for balance */}
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

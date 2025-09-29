import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Home, User, DollarSign, Bus, Hotel, BookOpen, LogOut, Menu, X, CheckSquare, Zap, Clock } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', icon: Home, path: '/student/dashboard' },
    { name: 'Profile', icon: User, path: '/student/profile' },
    { name: 'Fees', icon: DollarSign, path: '/student/fees' },
    { name: 'Hostel', icon: Hotel, path: '/student/hostel' },
    { name: 'Transport', icon: Bus, path: '/student/transport' },
    { name: 'Academics', icon: BookOpen, path: '/student/academics' },
    { name: 'Attendance', icon: CheckSquare, path: '/student/attendance' },
];

const StudentLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Get the current route name for the header title
    const currentRoute = navItems.find(item => location.pathname.startsWith(item.path));
    const headerTitle = currentRoute ? currentRoute.name : 'Dashboard';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const NavItem = ({ item }) => (
        <NavLink
            to={item.path}
            className={({ isActive }) => 
                `flex items-center p-3 rounded-xl transition-all duration-200 
                ${isActive
                    ? 'bg-blue-600 text-white shadow-lg font-semibold'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`
            }
            onClick={() => setIsSidebarOpen(false)}
        >
            <item.icon size={20} className="mr-4" />
            <span className="truncate">{item.name}</span>
        </NavLink>
    );

    const Sidebar = () => (
        <div className="flex flex-col h-full">
            {/* Logo and Name */}
            <div className="flex items-center justify-between p-4 mb-6 border-b border-gray-200 lg:justify-start">
                <div className="flex items-center">
                    <Zap size={30} className="text-blue-600 mr-2" />
                    <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">
                        EduERP
                    </h1>
                </div>
                <button 
                    className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavItem key={item.name} item={item} />
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 rounded-xl transition-colors duration-200 text-red-600 hover:bg-red-50"
                >
                    <LogOut size={20} className="mr-4" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 font-inter">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-shrink-0 w-64 bg-white border-r border-gray-200 shadow-xl">
                <Sidebar />
            </div>

            {/* Mobile Sidebar (Modal) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 lg:hidden" 
                    role="dialog" 
                    aria-modal="true"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    {/* Overlay */}
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    
                    {/* Sidebar Panel */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-md flex-shrink-0">
                    <div className="flex items-center">
                        <button
                            className="p-2 mr-4 text-gray-500 lg:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {headerTitle}
                        </h2>
                    </div>
                    {/* User Info (Matching PDF Page 2) */}
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-900">Student User</p>
                            <p className="text-xs text-gray-500">CS2023001</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            S
                        </div>
                    </div>
                </header>

                {/* Main Content (Child Components) */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
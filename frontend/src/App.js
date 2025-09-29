import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Pages
import Login from './components/Login';

// Student Pages (Requires StudentLayout)
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentHostel from './pages/StudentHostel';
import StudentTransport from './pages/StudentTransport';
import StudentFees from './pages/StudentFees';
import StudentAcademics from './pages/StudentAcademics';
import StudentAttendance from './pages/StudentAttendance';

// Admin Pages (Requires AdminLayout)
import AdminDashboard from './pages/AdminDashboard';
import AdminStudents from './pages/AdminStudents'; // Placeholder created
import AdminFees from './pages/AdminFees'; // Placeholder created


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route - Default Landing Page */}
        <Route path="/" element={<Login />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/hostel" element={<StudentHostel />} />
        <Route path="/student/transport" element={<StudentTransport />} />
        <Route path="/student/fees" element={<StudentFees />} />
        <Route path="/student/academics" element={<StudentAcademics />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/fees" element={<AdminFees />} />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';

// Component Imports
import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import AdminRoute from './components/AdminRoute'; // <-- IMPORT THE NEW ADMIN ROUTE PROTECTOR

// Page Imports
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import AdminInbox from './features/admin/AdminInbox'; // <-- IMPORT THE NEW ADMIN PAGE

function App() {
 
  return (
    <div className="bg-gemini-bg-light dark:bg-gemini-bg-dark text-gemini-text-light dark:text-gemini-text-dark font-sans transition-colors duration-300 min-h-screen">
      <Routes>
       
        {/* --- Public Routes (Accessible to everyone) --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* --- Admin Route (Protected) --- */}
        {/* This route requires the user to be logged in (AuthRoute) AND have an admin claim (AdminRoute) */}
        <Route 
          path="/admin" 
          element={
            <AuthRoute>
              <AdminRoute>
                <AdminInbox />
              </AdminRoute>
            </AuthRoute>
          } 
        />
        
        {/* --- Main Protected Route (For all logged-in users) --- */}
        {/* The '/*' is a wildcard that matches any other path */}
        <Route 
          path="/*" 
          element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
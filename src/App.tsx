import { Routes, Route } from 'react-router-dom';

// Component Imports
import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import GuestRoute from './components/GuestRoute'; // <-- IMPORT GUEST ROUTE
import AdminRoute from './components/AdminRoute';

// Page Imports
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import AdminPage from './features/admin/AdminPage';

function App() {
 
  return (
    <div className="bg-background text-text-primary font-sans transition-colors duration-300 min-h-screen">
      <Routes>
       
        {/* --- GUEST ROUTES --- */}
        {/* These routes are only accessible to users who are NOT logged in. */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        
        {/* --- ADMIN ROUTE (Protected) --- */}
        <Route 
          path="/admin" 
          element={
            <AuthRoute>
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            </AuthRoute>
          } 
        />
        
        {/* --- MAIN PROTECTED LAYOUT (For all logged-in users) --- */}
        {/* This is the default route for authenticated users. */}
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
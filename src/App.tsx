import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import GuestRoute from './components/GuestRoute';
import AdminRoute from './components/AdminRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import AdminPage from './features/admin/AdminPage';

function App() {
  return (
    <div className="bg-background text-text-primary font-sans transition-colors duration-300 min-h-screen">
      <Routes>
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        
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
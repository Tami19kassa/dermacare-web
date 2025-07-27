import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import AdminRoute from './components/AdminRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import AdminPage from './features/admin/AdminPage'; // <-- IMPORT THE NEW ADMIN PAGE

function App() {
  return (
    <div className="... min-h-screen">
      <Routes>
        {/* ... (public routes are the same) */}
        
        {/* --- MODIFIED ADMIN ROUTE --- */}
        <Route 
          path="/admin"
          element={
            <AuthRoute>
              <AdminRoute>
                {/* Render the new AdminPage which contains the inbox */}
                <AdminPage />
              </AdminRoute>
            </AuthRoute>
          } 
        />
        
        {/* ... (main protected route is the same) */}
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
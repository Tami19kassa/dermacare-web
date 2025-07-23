import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';

function App() {
 
  return (
    <div className="bg-gemini-bg-light dark:bg-gemini-bg-dark text-gemini-text-light dark:text-gemini-text-dark font-sans transition-colors duration-300 min-h-screen">
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
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
import { Routes, Route } from 'react-router-dom';
// We no longer need useEffect or initializeModel here
import { useTheme } from './hooks/useTheme';

import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';

function App() {
  const { theme } = useTheme();

  // The useEffect for initializing the model has been removed.
  // It is no longer needed.

  return (
    <div className="bg-gemini-bg-light dark:bg-gemini-bg-dark text-gemini-text-light dark:text-gemini-text-dark font-sans transition-colors duration-300 min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* We use a modal for articles, so a dedicated route is not needed */}

        {/* The main layout for all protected paths */}
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
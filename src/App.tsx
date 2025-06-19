import { Routes, Route } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import Layout from './components/layout/Layout';
import AuthRoute from './components/AuthRoute';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import ForgotPassword from './features/auth/ForgotPassword';
import ArticleDetail from './features/info/ArticleDetail';

function App() {
  const { theme } = useTheme();

  return (
    <div className="bg-gemini-bg-light dark:bg-gemini-bg-dark text-gemini-text-light dark:text-gemini-text-dark font-sans transition-colors duration-300 min-h-screen">
      <Routes>
        {/* Public routes available to everyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected route for detailed article pages */}
        <Route 
          path="/article/:id" 
          element={
            <AuthRoute>
              <ArticleDetail />
            </AuthRoute>
          } 
        />
        
        {/* The main application layout for all other protected paths */}
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
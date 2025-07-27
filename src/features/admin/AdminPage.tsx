import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import AdminInbox from './AdminInbox';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gemini-bg-light dark:bg-gemini-bg-dark text-gemini-text-light dark:text-gemini-text-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* --- Page Header --- */}
        <header className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 mr-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        {/* --- Main Content Area --- */}
        <main>
          {/* We render the AdminInbox component here */}
          <AdminInbox />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import AdminInbox from './AdminInbox';
import AdminManager from './AdminManager'; // <-- IMPORT

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gemini-bg-light dark:bg-gemini-bg-dark text-gemini-text-light dark:text-gemini-text-dark p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8"> {/* <-- ADD space-y-8 */}
        <header className="flex items-center">
          <button 
            onClick={() => navigate('/')} 
            className="p-2 mr-4 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        <main className="space-y-8"> {/* <-- ADD space-y-8 */}
          <AdminManager /> {/* <-- ADD THE ADMIN MANAGER COMPONENT */}
          <AdminInbox />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
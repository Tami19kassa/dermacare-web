import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUserPlus, FiUserMinus } from 'react-icons/fi';
import { makeUserAdmin, removeAdminRole } from '../../services/firestoreService';

const AdminManager: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action: 'add' | 'remove') => {
    if (!email.trim()) {
      toast.error('Please enter a user\'s email address.');
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading(`${action === 'add' ? 'Adding' : 'Removing'} admin role...`);
    try {
      const actionFunction = action === 'add' ? makeUserAdmin : removeAdminRole;
      const result: any = await actionFunction({ email: email.trim() });
      toast.success(result.data.message, { id: toastId });
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-2xl p-6 shadow-md border border-black/5 dark:border-white/5">
      <h3 className="text-lg font-medium mb-4 text-text-primary">Manage Admin Roles</h3>
      <div className="flex items-center space-x-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email to add or remove"
          className="flex-1 p-2 bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <button onClick={() => handleAction('add')} disabled={isLoading} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><FiUserPlus/></button>
        <button onClick={() => handleAction('remove')} disabled={isLoading} className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><FiUserMinus/></button>
      </div>
      <p className="text-xs text-text-secondary mt-2">
        Note: The user must already have an account. This change will take effect on their next login.
      </p>
    </div>
  );
};
export default AdminManager;
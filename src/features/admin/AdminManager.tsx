import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUserPlus, FiUserMinus } from 'react-icons/fi';

// Import the callable Cloud Function wrappers from your service file
import { makeUserAdmin, removeAdminRole } from '../../services/firestoreService';

const AdminManager: React.FC = () => {
  // State to hold the email from the input field
  const [email, setEmail] = useState('');
  // State to handle the loading status while the Cloud Function is executing
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles both adding and removing an admin role.
   * @param action - A string, either 'add' or 'remove', to determine which function to call.
   */
  const handleAction = async (action: 'add' | 'remove') => {
    // 1. Basic Validation: Ensure the email field is not empty.
    if (!email.trim()) {
      toast.error('Please enter a user\'s email address.');
      return;
    }

    // 2. Set loading state and provide initial feedback to the user.
    setIsLoading(true);
    const toastId = toast.loading(`${action === 'add' ? 'Adding' : 'Removing'} admin role...`);
    
    try {
      // 3. Choose which Cloud Function to call based on the action.
      const actionFunction = action === 'add' ? makeUserAdmin : removeAdminRole;
      
      // 4. Call the selected Cloud Function with the email as payload.
      // The result object has a 'data' property which contains the response from the function.
      const result: any = await actionFunction({ email: email.trim() });
      
      // 5. On success, show a success toast with the message from the Cloud Function.
      toast.success(result.data.message, { id: toastId });
      setEmail(''); // Clear the input field
    } catch (error: any) {
      // 6. On failure, show an error toast with the error message from the Cloud Function.
      console.error(`Failed to ${action} admin role:`, error);
      toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
    } finally {
      // 7. Always reset the loading state, whether the call succeeded or failed.
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gemini-surface-dark rounded-2xl p-6">
      <h3 className="text-lg font-medium mb-4">Manage Admin Roles</h3>
      <div className="flex items-center space-x-2">
        {/* Controlled input for the email address */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user's email to add or remove"
          className="flex-1 p-2 bg-white/5 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gemini-blue"
          disabled={isLoading}
        />
        {/* "Add Admin" button */}
        <button 
          onClick={() => handleAction('add')} 
          disabled={isLoading} 
          className="p-2 bg-green-500 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Add Admin Role"
        >
          <FiUserPlus/>
        </button>
        {/* "Remove Admin" button */}
        <button 
          onClick={() => handleAction('remove')} 
          disabled={isLoading} 
          className="p-2 bg-red-500 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove Admin Role"
        >
          <FiUserMinus/>
        </button>
      </div>
      <p className="text-xs text-gemini-text-secondary-dark mt-2">
        Note: The user must already have an account. This change will take effect on their next login.
      </p>
    </div>
  );
};

export default AdminManager;
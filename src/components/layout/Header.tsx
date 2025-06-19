import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { FiMenu } from 'react-icons/fi';
import AppControls from '../../features/settings/AppControls'; // <-- IMPORT

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { theme } = useTheme(); // We only need the theme value here, not the toggle function

  return (
    <header className="p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* Hamburger menu button for mobile/tablet */}
        <div className="md:hidden">
          <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
            <FiMenu size={24} />
          </button>
        </div>
        {/* App Controls for Desktop */}
        <div className="hidden md:flex items-center space-x-4">
            <AppControls />
        </div>
      </div>
      
      {/* Right side user avatar */}
      <div className="flex items-center space-x-4">
        <img
          src={user?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.displayName || 'G'}`}
          alt="User Avatar"
          className="h-9 w-9 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { FiEdit, FiUser, FiCheckCircle, FiLoader, FiCamera, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getUserQuizStats } from '../../services/firestoreService';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, uploadAndUpdateProfilePicture, updateDisplayName } = useAuth();

  // State for UI management
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  
  // State for user data
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL);
  const [quizScore, setQuizScore] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch the user's quiz score when the component mounts or the user changes
  useEffect(() => {
      if (user) {
          getUserQuizStats(user.uid).then(stats => {
              setQuizScore(stats.score);
          });
      }
  }, [user]);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newUrl = await uploadAndUpdateProfilePicture(file);
      setAvatarUrl(newUrl);
      toast.success(t('profile_pic_updated'));
    } catch (error: any) {
      toast.error(error.message || t('image_upload_failed'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveName = async () => {
      if (!displayName.trim()) {
          toast.error(t('name_cannot_be_empty'));
          return;
      }
      setIsSavingName(true);
      try {
          await updateDisplayName(displayName);
          toast.success(t('name_updated'));
          setIsEditing(false);
      } catch (error: any) {
          toast.error(error.message || t('name_update_failed'));
      } finally {
          setIsSavingName(false);
      }
  };

  const finalAvatarUrl = avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.displayName || 'G'}`;

  return (
    <div className="text-center">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg" />

      <div className="relative inline-block mb-4">
        <img src={finalAvatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full ring-2 ring-gemini-blue p-1 object-cover" />
        <button onClick={handleEditClick} disabled={isUploading} className="absolute bottom-0 right-0 bg-gemini-surface-light dark:bg-gemini-surface-dark p-2 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-neutral-600 disabled:cursor-not-allowed">
          {isUploading ? <FiLoader className="animate-spin" /> : <FiCamera size={16} />}
        </button>
      </div>

      {!isEditing ? (
        <div className="flex items-center justify-center gap-2">
            <h3 className="text-xl font-medium text-gemini-text-light dark:text-gemini-text-dark">{user?.displayName || t('guest')}</h3>
            <button onClick={() => setIsEditing(true)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700">
                <FiEdit size={14} />
            </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 max-w-xs mx-auto">
            <input 
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-grow p-2 bg-gemini-bg-light dark:bg-gemini-bg-dark rounded-lg focus:outline-none focus:ring-2 focus:ring-gemini-blue"
            />
            <button onClick={handleSaveName} disabled={isSavingName} className="p-2 bg-green-500 text-white rounded-full">
                {isSavingName ? <FiLoader className="animate-spin"/> : <FiSave size={16}/>}
            </button>
             <button onClick={() => setIsEditing(false)} className="p-2 bg-red-500 text-white rounded-full">
                <FiX size={16}/>
            </button>
        </div>
      )}
      <p className="text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark mt-1">{user?.email}</p>

      <div className="mt-6 text-left space-y-4">
        <div className="flex items-center text-sm">
          <FiUser className="mr-3 text-gemini-blue" />
          <span>{t('membership')}: <span className="font-medium">{t('pro_user')}</span></span>
        </div>
        <div className="flex items-center text-sm">
          <FiCheckCircle className="mr-3 text-gemini-blue" />
          <span>{t('quizzes_completed')}: <span className="font-medium">{quizScore}</span></span>
        </div>
      </div>
      
       <button onClick={logout} className="mt-6 w-full text-sm text-gemini-text-secondary-light dark:text-gemini-text-secondary-dark hover:text-red-500 transition-colors">
        {t('logout')}
      </button>
    </div>
  );
};

export default Profile;
import Profile from "../../features/profile/Profile";
import Quiz from "../../features/profile/Quiz";

const RightSidebar: React.FC = () => {
  return (
    <div className="flex flex-col space-y-6 p-1">
        
        <div className="bg-surface rounded-2xl p-4">
            <Profile />
        </div>
        <div className="bg-surface rounded-2xl p-4">
            <Quiz />
        </div>
    </div>
  );
};

export default RightSidebar;
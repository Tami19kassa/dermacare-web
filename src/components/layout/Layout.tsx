import React, { useState } from 'react';

import LeftSidebar from './LeftSidebar';
import Header from './Header';
import MobileDrawer from './MobileDrawer';
import MainContent from '../../features/main/MainContent';

import ArticleModal from '../../features/info/ArticleModal';
import RightSidebar from './RightSidebar';





const Layout: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <div className="relative flex flex-col h-screen bg-gemini-bg-light dark:bg-gemini-bg-dark">
            <Header onMenuClick={() => setIsDrawerOpen(true)} />
            
            <div className="flex-1 overflow-hidden">
                {/* Large Screen Layout */}
                <div className="hidden xl:grid grid-cols-12 gap-6 h-full p-4">
                    <aside className="col-span-3 h-full flex flex-col">
                        <div className="overflow-y-auto flex-1 min-h-0">
                            <LeftSidebar />
                        </div>
                    </aside>
                    <main className="col-span-6 h-full flex flex-col min-h-0">
                        <MainContent />
                    </main>
                    <aside className="col-span-3 h-full flex flex-col">
                        <div className="overflow-y-auto flex-1 min-h-0">
                            <RightSidebar />
                        </div>
                    </aside>
                </div>

                {/* Medium Screen Layout */}
                <div className="hidden md:grid xl:hidden grid-cols-12 gap-6 h-full p-4">
                    <aside className="col-span-4 h-full flex flex-col">
                        <div className="overflow-y-auto flex-1 min-h-0 space-y-6">
                            <RightSidebar />
                            <LeftSidebar />
                        </div>
                    </aside>
                    <main className="col-span-8 h-full flex flex-col min-h-0">
                        <MainContent />
                    </main>
                </div>

                {/* Small Screen Layout */}
                <div className="block md:hidden h-full">
                    <MainContent />
                </div>
            </div>
            
            <MobileDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
            <ArticleModal />
        </div>
    );
};

export default Layout;
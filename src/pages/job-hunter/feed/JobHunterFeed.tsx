import { FC } from "react";
import { useMenu } from "hooks";
import { 
  PageMeta,
  ScrollArea 
} from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterContext } from 'components';
import { JobHunterMenu, JobHunterHeader, Footer } from "layouts";
import { Outlet } from "react-router-dom";

const JobHunterFeed: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = true; 

  return (
    <JobHunterContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <PageMeta title="Job Hunter Dashboard" />
        <JobHunterMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={jobHunterDesktopMenu}
          mobileMenuItems={jobHunterMobileMenu}
          isFreeTrial={isFreeTrial}
        />
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            <main className="flex-1 flex flex-col bg-[#242625] w-full">
              <JobHunterHeader />
              <Outlet />
            </main>

            <Footer />
          </div>
        </ScrollArea>
      </div>
    </JobHunterContext.Provider>
  );
};

export { JobHunterFeed };
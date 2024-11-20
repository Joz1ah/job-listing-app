import { FC } from "react";
import { useMenu } from "hooks";
import { 
  FooterDesktop, 
  JobHunterSectionDesktop, 
  JobHunterMenuHeader, 
  PageMeta 
} from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterHeader } from "components/layout-desktop/JobHunterHeader";
import { JobHunterContext } from 'pages';

const JobHunterDesktop: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = true; 

  return (
    <JobHunterContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <PageMeta title="Job Hunter Dashboard" />
        <JobHunterMenuHeader
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={jobHunterDesktopMenu}
          mobileMenuItems={jobHunterMobileMenu}
          isFreeTrial={isFreeTrial}
        />
        
        <main className="flex-1 flex flex-col bg-[#242625] w-full">
          <JobHunterHeader />
          <JobHunterSectionDesktop isFreeTrial={isFreeTrial} />
        </main>

        <FooterDesktop />
      </div>
    </JobHunterContext.Provider>
  );
};

export { JobHunterDesktop };
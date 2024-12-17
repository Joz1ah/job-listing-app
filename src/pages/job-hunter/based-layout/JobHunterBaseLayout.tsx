import { FC, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { ScrollArea } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterContext, TrialProviders } from "components";
import { JobHunterMenu, Footer } from "layouts";
import { useJobHunterTrialStatus } from "components";

const JobHunterBaseLayoutContent: FC = () => {
    const { menuOpen, toggleMenu } = useMenu();
    const { isFreeTrial } = useJobHunterTrialStatus();
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    return (
      <JobHunterContext.Provider value={{ isFreeTrial }}>
        <div className={`flex flex-col h-screen bg-[#212529] ${mounted ? 'min-h-screen' : ''}`}>
          <JobHunterMenu
            isMenuOpen={menuOpen}
            onToggleMenu={toggleMenu}
            desktopMenuItems={jobHunterDesktopMenu}
            mobileMenuItems={jobHunterMobileMenu}
            isFreeTrial={isFreeTrial}
          />
          
          <ScrollArea className="flex-1">
            <div className="flex flex-col min-h-full">
              <div className="flex-1">
                <Outlet />
              </div>
              <Footer />
            </div>
          </ScrollArea>
        </div>
      </JobHunterContext.Provider>
    );
};

const JobHunterBaseLayout: FC = () => {
  return (
    <TrialProviders
      jobHunterInitialStatus={false}
    >
      <JobHunterBaseLayoutContent />
    </TrialProviders>
  );
};

export { JobHunterBaseLayout };
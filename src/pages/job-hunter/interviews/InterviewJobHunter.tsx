import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterContext } from "components";
import { JobHunterMenu, Footer } from "layouts";
import { InterviewSidebar } from "features";

const InterviewJobHunter: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = true;

  return (
    <JobHunterContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529]">
        <PageMeta title="Interviews" />
        <JobHunterMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={jobHunterDesktopMenu}
          mobileMenuItems={jobHunterMobileMenu}
          isFreeTrial={isFreeTrial}
        />

        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 px-2 xl:px-10 bg-[#212529]">
              <InterviewSidebar
                userName="John Doe"
                subscriptionType="Free Trial"
                userType="job-hunter"
                isFreeTrial={isFreeTrial}
              />
              <div className="flex-1 pt-10 flex items-start justify-center">
                  <Outlet />
              </div>
            </main>
            <Footer />
          </div>
        </ScrollArea>
      </div>
    </JobHunterContext.Provider>
  );
};

export { InterviewJobHunter };

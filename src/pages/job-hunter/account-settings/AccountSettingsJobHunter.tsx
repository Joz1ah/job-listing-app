import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { jobHunterDesktopMenu, jobHunterMobileMenu } from "mockData/nav-menus";
import { JobHunterContext } from "components";
import { JobHunterMenu, Footer } from "layouts";
import { SettingsSidebar } from "features";

const AccountSettingsJobHunter: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = true;

  return (
    <JobHunterContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529]">
        <PageMeta title="Account Settings" />
        <JobHunterMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={jobHunterDesktopMenu}
          mobileMenuItems={jobHunterMobileMenu}
          isFreeTrial={isFreeTrial}
        />

        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 bg-[#212529]">
              <div className="flex justify-center w-full max-w-screen-xl mx-auto">
                <div className="flex flex-col lg:flex-row w-full pt-8">
                  <SettingsSidebar
                    userName="John Doe"
                    subscriptionType="Free Trial"
                    userType="job-hunter"
                    isFreeTrial={isFreeTrial}
                    className="w-[395px]"
                  />
                  <div className="w-auto lg:w-full max-w-[855px] min-h-[750px] bg-[#2D3A41] rounded-lg px-5 py-8 m-4">
                    <Outlet />
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </ScrollArea>
      </div>
    </JobHunterContext.Provider>
  );
};

export { AccountSettingsJobHunter };

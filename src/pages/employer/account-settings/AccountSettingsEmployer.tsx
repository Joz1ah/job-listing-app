import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { employerDesktopMenu, employerMobileMenu} from "mockData/nav-menus";
import { EmployerContext} from "components";
import { EmployerMenu, Footer } from "layouts";
import { SettingsSidebar } from "features";
import { useEmployerTrialStatus } from "components";

const AccountSettingsEmployer: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529]">
        <PageMeta title="Account Settings" />
        <EmployerMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={employerDesktopMenu}
          mobileMenuItems={employerMobileMenu}
          isFreeTrial={isFreeTrial}
        />

        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
          <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 bg-[#212529]">
              <div className="flex justify-center w-full max-w-screen-xl mx-auto">
                <div className="flex flex-col lg:flex-row w-full pt-8">
                  <SettingsSidebar
                    userName="ABC Incorporated"
                    subscriptionType="Monthly Subscriber"
                    userType="employer"
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
    </EmployerContext.Provider>
  );
};

export { AccountSettingsEmployer };

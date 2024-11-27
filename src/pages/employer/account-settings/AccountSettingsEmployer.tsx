import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { employerDesktopMenu, employerMobileMenu} from "mockData/nav-menus";
import { EmployerContext} from "components";
import { EmployerMenu, Footer } from "layouts";
import { SettingsSidebar } from "features";

const AccountSettingsEmployer: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = false;

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
            <main className="flex-1 flex flex-col w-full lg:flex-row md:py-16 py-6 px-2 xl:px-10 bg-[#212529]">
              {/* Single Sidebar Component that handles both mobile and desktop */}
              <SettingsSidebar
                userName="ABC Incorporated"
                subscriptionType="Monthly Subscriber"
                userType="employer"
                isFreeTrial={isFreeTrial}
              />

              {/* Main Content Container */}
              <div className="flex-1 pt-10 flex items-start justify-center">
                <div className="w-full max-w-[855px] min-h-[750px] bg-[#2D3A41] rounded-lg px-5 py-8">
                  <Outlet />
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

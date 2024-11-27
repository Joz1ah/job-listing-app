import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { employerDesktopMenu, employerMobileMenu} from "mockData/nav-menus";
import { EmployerContext } from "components";
import { EmployerMenu, Footer } from "layouts";
import { InterviewSidebar } from "features";

const InterviewEmployer: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = false;

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529]">
        <PageMeta title="Interviews" />
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
              <InterviewSidebar
                userName="ABC Incorporated"
                subscriptionType="Montly Subscriber"
                userType="employer"
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
    </EmployerContext.Provider>
  );
};

export { InterviewEmployer };

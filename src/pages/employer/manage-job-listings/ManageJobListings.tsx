import { FC } from "react";
import { useMenu } from "hooks";
import { Outlet } from "react-router-dom";
import { PageMeta, ScrollArea } from "components";
import { employerDesktopMenu, employerMobileMenu} from "mockData/nav-menus";
import { EmployerContext } from "components";
import { EmployerMenu, Footer } from "layouts";
import { ManageJobListingsSidebar } from "features/employer";
import { useEmployerTrialStatus } from "components";

const ManageJobListings: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529]">
        <PageMeta title="Manage Job Listings" />
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
                  <ManageJobListingsSidebar
                    userName="ABC Incorporated"
                    subscriptionType="Montly Subscriber"
                    isFreeTrial={isFreeTrial}
                    className="w-[395px]"
                  />
                  <div className="flex-1 m-4">
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

export { ManageJobListings };

import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { 
  PageMeta,
  ScrollArea 
} from "components";
import { EmployerMenu, EmployerHeader, Footer } from "layouts";
import { Sidebar } from "features/employer";
import { employerDesktopMenu, employerMobileMenu } from "mockData/nav-menus";
import { EmployerContext } from 'components';
import { useEmployerTrialStatus } from "components";

const EmployerFeed: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-gray-900 text-white">
        <PageMeta title="Employer Dashboard" />
        <EmployerMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={employerDesktopMenu}
          mobileMenuItems={employerMobileMenu}
          isFreeTrial={isFreeTrial}
        />
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            <main className="flex-1 flex flex-col bg-[#242625] w-full px-6 xl:px-12 md:py-16">
              <EmployerHeader isFreeTrial={isFreeTrial}/>
              <div className="flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="flex-shrink-0">
                  <Sidebar />
                </div>
                {/* Main Content */}
                <div className="flex-1 flex justify-center">
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
}

export { EmployerFeed };
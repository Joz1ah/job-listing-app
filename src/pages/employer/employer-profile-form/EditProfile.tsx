import { FC } from "react";
import { useMenu } from "hooks";
import { 
  PageMeta,
  ScrollArea 
} from "components";
import { EmployerMenu, Footer } from "layouts";
import { EditEmployerProfile } from "features/employer";
import { employerDesktopMenu, employerMobileMenu } from "mockData/nav-menus";
import { EmployerContext } from 'components';
import { useEmployerTrialStatus } from "components";

const EditProfile: FC = () => {
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
            <main className="flex-1 flex flex-col bg-[#242625] w-full xl:px-12 md:py-16">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 flex justify-center">
                  <EditEmployerProfile/>
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

export { EditProfile };
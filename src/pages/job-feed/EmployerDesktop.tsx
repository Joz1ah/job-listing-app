import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { PageMeta } from "components";
import { EmployerMenu, EmployerHeader, Footer } from "layouts";
import { Sidebar } from "features";
import { employerDesktopMenu, employerMobileMenu } from "mockData/nav-menus";
import { EmployerContext } from 'components';

const EmployerDesktop: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const isFreeTrial = true;

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col min-h-screen bg-gray-900 text-white">
        <PageMeta title="Employer Dashboard" />

        <EmployerMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={employerDesktopMenu}
          mobileMenuItems={employerMobileMenu}
          isFreeTrial={isFreeTrial}
        />
        
        <main className="flex-grow flex flex-col md:flex-row bg-[#242625] md:mt-16 w-full">
          <div className="flex flex-col md:mt-10 md:ml-16 mb-8">
            <EmployerHeader isFreeTrial={isFreeTrial}/>
            <Sidebar />
          </div>

          <div className="flex-1 flex justify-center">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </EmployerContext.Provider>
  );
}

export { EmployerDesktop };
import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { EmployerMenuHeader, FooterDesktop, PageMeta } from "components";
import { Sidebar, EmployerHeader } from "components";
import { employerDesktopMenu, employerMobileMenu } from "mockData/nav-menus";

const EmployerDesktop: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();


  return (
    
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <PageMeta title="Employer Dashboard" />

      {/* Header */}
      <EmployerMenuHeader
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      desktopMenuItems={employerDesktopMenu}
      mobileMenuItems={employerMobileMenu}
    />
      
      {/* Main content */}
      <main className="flex-grow flex flex-col md:flex-row bg-[#242625] md:mt-16 w-full">

        <div className="flex flex-col md:mt-10 md:ml-16 mb-8">
          <EmployerHeader />
          <Sidebar />
        </div>

        <div className="flex-1 flex justify-center">
          <Outlet />
        </div>

      </main>

      {/* Footer */}
      <FooterDesktop />
    </div>
  );
}

export { EmployerDesktop }
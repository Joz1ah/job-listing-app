import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { EmployerMenu, HeaderDesktop, FooterDesktop, PageMeta } from "components";
import { Sidebar, PageTitle } from "components";

const EmployerDesktop: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <PageMeta title="Employer Dashboard" />
      {/* Full-screen Menu */}
      <EmployerMenu isOpen={menuOpen} />

      {/* Header */}
      <HeaderDesktop onToggleMenu={toggleMenu} />
      
      {/* Main content */}
      <main className="flex-grow flex flex-col md:flex-row bg-[#242625] mt-16">

        <div className="flex flex-col mt-8 md:mt-10 md:ml-16 mb-8">
          <PageTitle />
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
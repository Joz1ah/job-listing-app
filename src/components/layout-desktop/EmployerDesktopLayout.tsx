import { FC } from "react";
import { useMenu } from "hooks";
import { EmployerMenu, HeaderDesktop, FooterDesktop } from "components";


interface EmployerLayout {
  children: React.ReactNode;
}

const EmployerDesktopLayout: FC<EmployerLayout> = ({children}) => {

  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Full-screen Menu */}
      <EmployerMenu isOpen={menuOpen} />

      {/* Header */}
      <HeaderDesktop onToggleMenu={toggleMenu} />
      
      {/* Main content */}
      <main className="flex-grow flex flex-col md:flex-row bg-[#242625] mt-16">
        {children}
      </main>

      {/* Footer */}
      <FooterDesktop />
    </div>
  );
};

export { EmployerDesktopLayout };

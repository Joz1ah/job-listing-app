import { FC } from "react";
import { useMenu } from "hooks";
import { EmployerMenu, FooterDesktop, JobHunterSectionDesktop } from "components";
import { NavLink } from "react-router-dom";
import { ChevronDown, BadgeCheck, Bell } from "lucide-react";
import companyLogo from "images/company-logo.png";

const JobHunterDesktop: FC = () => {

  const { menuOpen, toggleMenu } = useMenu();

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Full-screen Menu */}
      <EmployerMenu isOpen={menuOpen} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-[#2D3A41] h-[72px] pr-4 flex flex-row justify-between items-center flex-nowrap z-50">
        <div className="flex flex-row items-center space-x-8 flex-shrink-0">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-[161px] h-[50px]"
          />
          <nav className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-[50px]">
            <ul className="space-y-4 md:space-y-0 md:space-x-[50px] text-white text-[16px] font-light flex flex-col md:flex-row items-center">
              <li className="hover:text-orange-500">
                <NavLink to="#">About us</NavLink>
              </li>
              <li className="hover:text-orange-500">
                <NavLink to="#">Contact us</NavLink>
              </li>
              <li className="hover:text-orange-500">
                <NavLink to="#">Subscription plans</NavLink>
              </li>
              <li className="hover:text-orange-500">
                <NavLink to="#">FAQ</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Bell className="w-[22px] h-[25px] text-orange-500" />
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium text-[18px]">
              Michael V
            </span>
            <BadgeCheck className="w-4 h-4 text-[#2D3A41] fill-orange-500" />
            <ChevronDown onClick={toggleMenu} className="w-4 h-4 text-white" />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex flex-col bg-[#242625] mt-12">
        <JobHunterSectionDesktop />
      </main>

      {/* Footer */}
      <FooterDesktop />
    </div>
  );
};

export { JobHunterDesktop }
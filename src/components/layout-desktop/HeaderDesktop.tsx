import { FC } from "react";
import { NavLink } from "react-router-dom";
import companyLogo from "images/company-logo.png";
import { Button } from "components/ui/buttons";
import { BadgeCheck, ChevronDown, Bell } from "lucide-react";

interface HeaderProps {
    onToggleMenu: () => void;
  }

const HeaderDesktop : FC<HeaderProps> = ({onToggleMenu}) => {

    return(
        <header className="fixed top-0 left-0 right-0 bg-[#2D3A41] h-[72px] pr-4 flex flex-row justify-between items-center flex-nowrap z-50">
        <div className="flex flex-row items-center space-x-8 flex-shrink-0">
        <NavLink to="/job-feed-employer">
          <img
            src={companyLogo}
            alt="Company Logo"
            className="w-[161px] h-[50px] cursor-pointer"
          />
        </NavLink>
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
            <NavLink to="/job-feed-employer/job-creation">
              <Button className="bg-orange-500 w-full md:w-[172px] h-[44px] font-light mt-4 md:mt-0 md:ml-[50px]">
                Create Job listing
              </Button>
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Bell className="w-[22px] h-[25px] text-orange-500 [transform:rotate(35deg)] cursor-pointer" />
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium text-[18px]">
              ABC Incorporated
            </span>
            <BadgeCheck className="w-4 h-4 text-[#2D3A41] fill-orange-500" />
            <ChevronDown onClick={onToggleMenu} className="w-4 h-4 text-white cursor-pointer" />
          </div>
        </div>
      </header>
    )
}

export { HeaderDesktop }
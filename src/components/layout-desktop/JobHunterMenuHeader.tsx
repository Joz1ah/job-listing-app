import { FC, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Add useLocation
import { Button } from "components/ui/buttons";
import { BadgeCheck, ChevronDown, Bell } from "lucide-react";
import companyLogo from "images/company-logo.png";
import akazaLogoWhite from "images/akaza-logo-white.png";
import menuButton from "images/menu-button.png";

interface NavItem {
  name: string;
  path: string;
  isSpecial?: boolean;
}

interface HeaderProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  desktopMenuItems: NavItem[];
  mobileMenuItems: NavItem[];
}

const JobHunterMenuHeader: FC<HeaderProps> = ({ 
  isMenuOpen, 
  onToggleMenu, 
  desktopMenuItems,
  mobileMenuItems 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation(); // Add this hook

  // Close menu when route changes
  useEffect(() => {
    if (isMenuOpen) {
      onToggleMenu();
    }
  }, [location.pathname]); // Add this effect

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      } else if (isMenuOpen) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  }, [isMenuOpen, isMobile]);

  const currentMenuItems = isMobile ? mobileMenuItems : desktopMenuItems;

  // Handler for NavLink clicks
  const handleNavLinkClick = () => {
    if (isMenuOpen) {
      onToggleMenu();
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 bg-[#2D3A41] h-[72px] pr-4 justify-between items-center flex-nowrap z-50">
        <div className="flex items-center space-x-8 flex-shrink-0">
          <NavLink to="/job-feed-employer" onClick={handleNavLinkClick}>
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-[161px] h-[50px] cursor-pointer"
            />
          </NavLink>
          <nav>
            <ul className="flex space-x-[50px] text-white text-[16px] font-light">
              <li className="hover:text-orange-500">
                <NavLink to="#" onClick={handleNavLinkClick}>About us</NavLink>
              </li>
              <li className="hover:text-orange-500">
                <NavLink to="#" onClick={handleNavLinkClick}>Contact us</NavLink>
              </li>
              <li className="hover:text-orange-500">
                <NavLink to="#" onClick={handleNavLinkClick}>Subscription plans</NavLink>
              </li>
              <li className="hover:text-orange-500">
                <NavLink to="#" onClick={handleNavLinkClick}>FAQ</NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4 flex-shrink-0">
          <Bell className="w-[22px] h-[25px] text-orange-500 [transform:rotate(35deg)] cursor-pointer" />
          <div className="flex items-center space-x-2">
            <NavLink to="/job-feed-employer" onClick={handleNavLinkClick}>
              <span className="text-white font-medium text-[18px]">
                Michael V
              </span>
            </NavLink>
            <BadgeCheck className="w-4 h-4 text-[#2D3A41] fill-orange-500" />
            <ChevronDown
              onClick={onToggleMenu}
              className="w-4 h-4 text-white cursor-pointer"
            />
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-black py-4 px-2 flex justify-between items-center">
        <img src={akazaLogoWhite} alt="Akaza Logo" className="h-8" />
        <div className="flex items-center">
          <Bell
            strokeWidth={2.5}
            className="w-[24px] h-[30px] text-[#F5722E] mr-2 [transform:rotate(35deg)]"
          />
          <Button
            variant="custom"
            className="text-[#F5722E] bg-black"
            size="icon"
            onClick={onToggleMenu}
            aria-label="Toggle menu"
          >
            <img src={menuButton} className="h-12 w-12" />
          </Button>
        </div>
      </header>

      {/* Side Menu */}
      <div className="relative">
        {/* Overlay */}
        <div 
          className={`fixed top-[72px] left-0 w-full h-full bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 z-[998]" : "opacity-0 pointer-events-none -z-10"
          }`}
          onClick={onToggleMenu} // Add click handler to close menu when clicking overlay
        />
        
        {/* Menu */}
        <div
          className={`fixed top-0 right-0 h-screen w-full md:w-[440px] bg-black text-white shadow-xl transition-transform duration-500 ease-in-out z-[999] ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ marginTop: isMobile ? "64px" : "73px" }}
        >
          <div className="h-full overflow-y-auto">
            <nav className="flex flex-col text-white w-full pt-6">
              {currentMenuItems.map((item, index) => (
                <div key={item.path + index}>
                  <div className="w-full text-end px-2 sm:pr-4 sm:pl-0">
                    <NavLink
                      to={item.path}
                      onClick={handleNavLinkClick}
                      className={`${
                        item.isSpecial ? 'text-orange-500 hover:text-orange-600' : 'hover:text-[#F5722E]'
                      } py-3 sm:py-2 inline-block text-sm`}
                    >
                      {item.name}
                    </NavLink>
                  </div>
                  {index < currentMenuItems.length - 1 && (
                    <div className="flex justify-center w-full">
                      <hr className="border-t border-white w-full my-0" />
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export { JobHunterMenuHeader }
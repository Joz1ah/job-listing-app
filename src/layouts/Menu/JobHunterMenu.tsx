import { FC, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "components/ui/shadcn/buttons";
import { ChevronDown, Info, ChevronUp } from "lucide-react";
import companyLogo from "images/company-logo.png";
import akazaLogoWhite from "images/akaza-logo-white.png";
import menuButton from "images/menu-button.png";
import { NotificationFeed } from "components/ui/custom/notification-feed";
import verifiedIcon from 'images/verified.svg?url'

interface NavItem {
  name: string;
  path: string;
  isSpecial?: boolean;
}

interface MenuProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  desktopMenuItems: NavItem[];
  mobileMenuItems: NavItem[];
  subscriptionPlan: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
}

const JobHunterMenu: FC<MenuProps> = ({
  isMenuOpen,
  onToggleMenu,
  desktopMenuItems,
  mobileMenuItems,
  subscriptionPlan,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    if (isMenuOpen) {
      onToggleMenu();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      } else if (isMenuOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [isMenuOpen, isMobile]);

  const currentMenuItems = isMobile ? mobileMenuItems : desktopMenuItems;

  const handleNavLinkClick = () => {
    if (isMenuOpen) {
      onToggleMenu();
    }
  };

  const renderStatusIcon = () => {
    if (subscriptionPlan === 'freeTrial') {
      return <Info className="w-4 h-4 text-[#2D3A41] fill-white" />;
    }
    return <img src={verifiedIcon} className="w-4 h-4" />;
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 bg-[#2D3A41] h-[72px] px-4 justify-between items-center flex-nowrap z-50">
        <div className="flex items-center gap-4 flex-grow">
          <NavLink
            to="/job-hunter/feed"
            onClick={handleNavLinkClick}
            className="flex-shrink-0"
          >
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-[100px] lg:w-[161px] h-auto"
            />
          </NavLink>
          <nav className="flex-shrink">
            <ul className="flex gap-4 lg:gap-8 text-white text-[14px] lg:text-[16px] font-light whitespace-nowrap">
              <li className="hover:text-[#F5722E]">
                <NavLink to="#" onClick={handleNavLinkClick}>
                  About us
                </NavLink>
              </li>
              <li className="hover:text-[#F5722E]">
                <NavLink to="#" onClick={handleNavLinkClick}>
                  Contact us
                </NavLink>
              </li>
              <li className="hover:text-[#F5722E]">
                <NavLink to="#" onClick={handleNavLinkClick}>
                  Subscription plans
                </NavLink>
              </li>
              <li className="hover:text-[#F5722E]">
                <NavLink to="#" onClick={handleNavLinkClick}>
                  FAQ
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <NotificationFeed subscriptionPlan={subscriptionPlan} />
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <NavLink to="/employer/feed" onClick={handleNavLinkClick}>
              <span className="text-white font-medium text-[14px] lg:text-[18px] truncate block max-w-[100px] lg:max-w-[200px]">
                Michael V
              </span>
            </NavLink>
            {renderStatusIcon()}
            <div className="relative w-6 h-6">
              <div
                className={`absolute inset-0 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-0"
                    : "opacity-100 rotate-0 scale-100"
                } hover:scale-90`}
              >
                <ChevronDown
                  onClick={onToggleMenu}
                  className="w-6 h-6 text-white cursor-pointer transition-transform flex-shrink-0"
                />
              </div>
              <div
                className={`absolute inset-0 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-0"
                } hover:scale-90`}
              >
                <ChevronUp
                  onClick={onToggleMenu}
                  className="w-6 h-6 text-white cursor-pointer transition-transform flex-shrink-0"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-black py-4 px-2 flex justify-between items-center">
        <img src={akazaLogoWhite} alt="Akaza Logo" className="h-8" />
        <div className="flex items-center">
          <NotificationFeed subscriptionPlan={subscriptionPlan} />
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

      {/* Sliding Menu */}
      <div className="relative">
        <div
          className={`fixed top-[72px] left-0 w-full h-full bg-black/50 transition-opacity duration-300 ${
            isMenuOpen
              ? "opacity-100 z-[998]"
              : "opacity-0 pointer-events-none -z-10"
          }`}
          onClick={onToggleMenu}
        />

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
                        item.isSpecial
                          ? "text-[#F5722E] hover:text-orange-600"
                          : "hover:text-[#F5722E]"
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

export { JobHunterMenu };

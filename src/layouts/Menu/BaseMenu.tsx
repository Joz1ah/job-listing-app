import { FC, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Button } from "components/ui/shadcn/buttons";
import { ChevronDown, Info, Plus, ChevronUp } from "lucide-react";
import companyLogo from "images/company-logo.png";
import akazaLogoWhite from "images/akaza-logo-white.png";
import menuButton from "images/menu-button.png";
import { NotificationFeed } from "components";
import verifiedIcon from "images/verified.svg?url";

interface NavItem {
  name: string;
  path: string;
  isSpecial?: boolean;
  isAction?: boolean;
  action?: () => void;
}

interface MenuProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  desktopMenuItems: NavItem[];
  mobileMenuItems: NavItem[];
  subscriptionPlan: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
  userType: 'employer' | 'job-hunter';
  userName: string;
  feedPath: string;
  onSignOut: () => void;
}

const BaseMenu: FC<MenuProps> = ({
  isMenuOpen,
  onToggleMenu,
  desktopMenuItems,
  mobileMenuItems,
  subscriptionPlan,
  userType,
  userName,
  feedPath,
  onSignOut,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);
  const location = useLocation();
  const isEmployer = userType === 'employer';
  const safeUserType = userType || 'job-hunter';

  const handleItemClick = (item: NavItem) => {
    if (item.isAction && item.name === 'SIGN OUT') {
      onSignOut();
    } else if (item.isAction && item.action) {
      item.action();
    }
    if (isMenuOpen) {
      onToggleMenu();
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      onToggleMenu();
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      const smallScreen = window.innerWidth <= 1100;
      setIsMobile(mobile);
      setIsSmallScreen(smallScreen);

      if (!mobile) {
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      } else if (isMenuOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${window.innerWidth - document.documentElement.clientWidth}px`;
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call initially to set correct state

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);

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
    return <img src={verifiedIcon} className="w-4 h-4" alt="Verified" />;
  };

  const handleNotificationClick = () => {
    if (isMenuOpen) {
      onToggleMenu();
    }
  };

  const renderMenuItem = (item: NavItem) => {
    const baseClassName = `${
      item.isSpecial
        ? "text-[#F5722E] hover:text-orange-600"
        : "hover:text-[#F5722E]"
    } py-3 sm:py-2 inline-block text-sm`;

    if (item.isAction) {
      return (
        <button
          onClick={() => handleItemClick(item)}
          className={`${baseClassName} w-full text-right px-2 sm:pr-4 sm:pl-0`}
        >
          {item.name}
        </button>
      );
    }

    return (
      <NavLink
        to={item.path}
        onClick={() => handleItemClick(item)}
        className={baseClassName}
      >
        {item.name}
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 bg-[#2D3A41] h-[72px] px-4 justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <NavLink
            to={feedPath}
            onClick={handleNavLinkClick}
            className="flex-shrink-0"
          >
            <img
              src={companyLogo}
              alt="Company Logo"
              className="w-[100px] lg:w-[161px] h-auto"
            />
          </NavLink>
          <div className="flex items-center gap-4 lg:gap-8">
            <nav className="flex-shrink">
              <ul className="flex gap-4 lg:gap-8 text-white text-[14px] lg:text-[16px] font-light whitespace-nowrap items-center">
                <li className="hover:text-[#F5722E]">
                  <NavLink to={`/${safeUserType}/about-us`} onClick={handleNavLinkClick}>
                    About us
                  </NavLink>
                </li>
                <li className="hover:text-[#F5722E]">
                  <NavLink to={`/${safeUserType}/contact-us`} onClick={handleNavLinkClick}>
                    Contact us
                  </NavLink>
                </li>
                <li className="hover:text-[#F5722E]">
                  <NavLink to={`/${safeUserType}/subscription-plan`} onClick={handleNavLinkClick}>
                    Subscription plans
                  </NavLink>
                </li>
                <li className="hover:text-[#F5722E]">
                  <NavLink to={`/${safeUserType}/faq`} onClick={handleNavLinkClick}>
                    FAQ
                  </NavLink>
                </li>
                {isEmployer && (
                  <li>
                    <NavLink
                      to="/employer/job-listing"
                      onClick={handleNavLinkClick}
                      className="flex-shrink-0"
                    >
                      <Button
                        className={`bg-[#F5722E] hover:bg-[#F5722E]/90 rounded-sm flex items-center justify-center p-0
                        ${isSmallScreen ? "w-10 h-10" : "w-[172px] h-[44px]"}
                      `}
                      >
                        {isSmallScreen ? (
                          <Plus className="text-white" size={16} />
                        ) : (
                          <span className="text-white font-light">
                            Create Job listing
                          </span>
                        )}
                      </Button>
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <div onClick={handleNotificationClick}>
            <NotificationFeed subscriptionPlan={subscriptionPlan} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <span className="text-white font-medium text-[14px] lg:text-[18px] truncate block max-w-[100px] lg:max-w-[200px]">
              {userName}
            </span>
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
      <header className="md:hidden bg-black py-4 px-2 flex justify-between items-center z-50">
        <img src={akazaLogoWhite} alt="Akaza Logo" className="h-8" />
        <div className="flex items-center space-x-2">
          <div onClick={handleNotificationClick}>
            <NotificationFeed subscriptionPlan={subscriptionPlan} />
          </div>
          <Button
            variant="custom"
            className="text-[#F5722E] bg-black"
            size="icon"
            onClick={onToggleMenu}
            aria-label="Toggle menu"
          >
            <img src={menuButton} className="h-12 w-12" alt="Menu" />
          </Button>
        </div>
      </header>

      {/* Sliding Menu */}
      <div className="relative">
        <div
          className={`fixed top-[72px] left-0 w-full h-full bg-black/80 transition-opacity duration-300 ${
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
                <div key={`${item.path}-${index}`}>
                  <div className="w-full text-end px-2 sm:pr-4 sm:pl-0">
                    {index === 0 && isMobile && isEmployer ? (
                      <NavLink to="/employer/job-listing">
                        <Button
                          onClick={() => handleItemClick(item)}
                          className="w-[160px] h-[36px] bg-[#F5722E] hover:bg-[#F5722E]/90 text-white p-0 text-xs font-normal mb-2"
                        >
                          {item.name}
                        </Button>
                      </NavLink>
                    ) : (
                      renderMenuItem(item)
                    )}
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

export { BaseMenu };
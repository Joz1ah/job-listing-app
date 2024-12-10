import { FC } from "react";
import { useMenu } from "hooks";
import { PageMeta } from "components";
import { EmployerMenu } from "layouts";
import { employerDesktopMenu, employerMobileMenu } from "mockData/nav-menus";
import { EmployerContext } from "components";
import { useEmployerTrialStatus } from "components";
import { Link } from "react-router-dom";

const EmployerNotFound: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { isFreeTrial } = useEmployerTrialStatus();

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className="flex flex-col h-screen bg-[#212529] text-white">
        <PageMeta title="Not Found" />
        <EmployerMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={employerDesktopMenu}
          mobileMenuItems={employerMobileMenu}
          isFreeTrial={isFreeTrial}
        />

        <div className="flex flex-col items-center justify-center w-full mx-auto my-auto text-center px-4 py-8 md:py-16">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-normal mb-4 text-white">
            Whoops!
          </h1>

          <p className="text-xl sm:text-2xl md:text-[40px] text-gray-400 mb-8 md:mb-12">
            Sorry, this page is not available or broken!
          </p>

          <div className="relative mb-8 md:mb-12">
            <div className="text-[100px] sm:text-[140px] md:text-[180px] font-bold relative">
              {/* Create glitch effect with overlapping numbers */}
              <span className="absolute inset-0 text-red-500 translate-x-0.5">
                404
              </span>
              <span className="absolute inset-0 text-cyan-400 -translate-x-0.5">
                404
              </span>
              <span className="relative text-black">404</span>
            </div>
          </div>

          <Link
            to="/"
            className="px-6 sm:px-8 py-2 sm:py-3 text-lg sm:text-2xl md:text-[32px] bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </EmployerContext.Provider>
  );
};

export { EmployerNotFound };

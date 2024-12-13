import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { ScrollArea } from "components";
import { employerDesktopMenu, employerMobileMenu } from "mockData/nav-menus";
import { EmployerContext } from "components";
import { EmployerMenu, Footer } from "layouts";
import { useEmployerTrialStatus } from "components";

const EmployerBaseLayout: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const { isFreeTrial } = useEmployerTrialStatus();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <EmployerContext.Provider value={{ isFreeTrial }}>
      <div className={`flex flex-col h-screen bg-[#212529] ${mounted ? 'min-h-screen' : ''}`}>
        <EmployerMenu
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          desktopMenuItems={employerDesktopMenu}
          mobileMenuItems={employerMobileMenu}
          isFreeTrial={isFreeTrial}
        />
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col min-h-full">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </ScrollArea>
      </div>
    </EmployerContext.Provider>
  );
};

export { EmployerBaseLayout };
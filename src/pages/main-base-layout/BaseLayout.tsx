import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
import { ScrollArea } from "components";
import { 
  employerDesktopMenu, 
  employerMobileMenu,
  jobHunterDesktopMenu, 
  jobHunterMobileMenu 
} from "mockData/nav-menus";
import { 
  EmployerContext, 
  JobHunterContext, 
  TrialProviders 
} from "components";
import { BaseMenu, Footer } from "layouts";
import { 
  useEmployerTrialStatus, 
  useJobHunterTrialStatus 
} from "components";
import { Landing } from "pages/landing/Landing";

type UserType = 'employer' | 'job-hunter' | 'guest';

interface LayoutContentProps {
  children: React.ReactNode;
  mounted: boolean;
  menu?: React.ReactNode;
}

const LayoutContent: FC<LayoutContentProps> = ({ children, mounted, menu }) => (
  <div className={`flex flex-col h-screen bg-[#212529] ${mounted ? 'min-h-screen' : ''}`}>
    {menu}
    <ScrollArea className="flex-1">
      <div className="flex flex-col min-h-full">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </ScrollArea>
  </div>
);

interface BaseLayoutContentProps {
  userType: UserType;
}

const BaseLayoutContent: FC<BaseLayoutContentProps> = ({ userType }) => {
  const { menuOpen, toggleMenu } = useMenu();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEmployer = userType === 'employer';
  const isGuest = userType === 'guest';

  if (isGuest) {
    return (
      <LayoutContent mounted={mounted}>
        <Landing />
      </LayoutContent>
    );
  }

  const { isFreeTrial: employerTrialStatus } = useEmployerTrialStatus();
  const { isFreeTrial: jobHunterTrialStatus } = useJobHunterTrialStatus();

  const isFreeTrial = isEmployer ? employerTrialStatus : jobHunterTrialStatus;
  const Context = isEmployer ? EmployerContext : JobHunterContext;
  const desktopMenuItems = isEmployer ? employerDesktopMenu : jobHunterDesktopMenu;
  const mobileMenuItems = isEmployer ? employerMobileMenu : jobHunterMobileMenu;
  const userName = isEmployer ? "ABC Incorporated" : "Michael V";

  const menu = (
    <BaseMenu
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      desktopMenuItems={desktopMenuItems}
      mobileMenuItems={mobileMenuItems}
      isFreeTrial={isFreeTrial}
      userType={userType}
      userName={userName}
      feedPath={`/${isEmployer ? 'employer' : 'job-hunter'}/feed`}
      profilePath={`/${isEmployer ? 'job-hunter' : 'employer'}/feed`}
    />
  );

  return (
    <Context.Provider value={{ isFreeTrial }}>
      <LayoutContent mounted={mounted} menu={menu}>
        <Outlet />
      </LayoutContent>
    </Context.Provider>
  );
};

interface BaseLayoutProps {
  userType: UserType;
}

const BaseLayout: FC<BaseLayoutProps> = ({ userType }) => {
  const isEmployer = userType === 'employer';
  const isGuest = userType === 'guest';

  if (isGuest) {
    return <BaseLayoutContent userType={userType} />;
  }

  return (
    <TrialProviders
      employerInitialStatus={isEmployer ? false : undefined}
      jobHunterInitialStatus={!isEmployer ? true : undefined}
    >
      <BaseLayoutContent userType={userType} />
    </TrialProviders>
  );
};

export { BaseLayout };
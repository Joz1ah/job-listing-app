import { FC } from "react";
import { Outlet } from "react-router-dom";
import { useMenu } from "hooks";
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
  menu?: React.ReactNode;
}

const LayoutContent: FC<LayoutContentProps> = ({ children, menu }) => (
  <div className="flex flex-col min-h-screen bg-[#212529] relative overflow-hidden h-full">
    {menu}
    <div className="flex flex-col flex-1">
      <main className="flex-1 pb-8">
        {children}
      </main>
      <Footer />
    </div>
  </div>
);

interface BaseLayoutContentProps {
  userType: UserType;
}

const BaseLayoutContent: FC<BaseLayoutContentProps> = ({ userType }) => {
  const { menuOpen, toggleMenu } = useMenu();

  const isEmployer = userType === 'employer';
  const isGuest = userType === 'guest';

  if (isGuest) {
    return (
      <LayoutContent>
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
    />
  );

  return (
    <Context.Provider value={{ isFreeTrial }}>
      <LayoutContent menu={menu}>
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
      jobHunterInitialStatus={!isEmployer ? false : undefined}
    >
      <BaseLayoutContent userType={userType} />
    </TrialProviders>
  );
};

export { BaseLayout };
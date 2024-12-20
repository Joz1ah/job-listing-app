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
  EmployerProvider,
  JobHunterProvider,
  useEmployerContext,
  useJobHunterContext
} from "components";
import { BaseMenu, Footer } from "layouts";
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

const AuthenticatedLayoutContent: FC<{ userType: 'employer' | 'job-hunter' }> = ({ userType }) => {
  const { menuOpen, toggleMenu } = useMenu();
  const isEmployer = userType === 'employer';
  
  // Get context based on user type
  const { subscriptionTier } = isEmployer 
    ? useEmployerContext() 
    : useJobHunterContext();

  const desktopMenuItems = isEmployer ? employerDesktopMenu : jobHunterDesktopMenu;
  const mobileMenuItems = isEmployer ? employerMobileMenu : jobHunterMobileMenu;
  const userName = isEmployer ? "ABC Incorporated" : "Michael V";

  const menu = (
    <BaseMenu
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      desktopMenuItems={desktopMenuItems}
      mobileMenuItems={mobileMenuItems}
      subscriptionTier={subscriptionTier}
      userType={userType}
      userName={userName}
      feedPath={`/${isEmployer ? 'employer' : 'job-hunter'}/`}
    />
  );

  return (
    <LayoutContent menu={menu}>
      <Outlet />
    </LayoutContent>
  );
};

const GuestLayoutContent: FC = () => {
  return (
    <LayoutContent>
      <Landing />
    </LayoutContent>
  );
};

const BaseLayoutContent: FC<BaseLayoutContentProps> = ({ userType }) => {
  if (userType === 'guest') {
    return <GuestLayoutContent />;
  }
  return <AuthenticatedLayoutContent userType={userType} />;
};

interface BaseLayoutProps {
  userType: UserType;
}

const BaseLayout: FC<BaseLayoutProps> = ({ userType }) => {
  if (userType === 'guest') {
    return <BaseLayoutContent userType={userType} />;
  }

  return (
    <EmployerProvider initialTier='monthlyPlan'>
      <JobHunterProvider initialTier='monthlyPlan'>
        <BaseLayoutContent userType={userType} />
      </JobHunterProvider>
    </EmployerProvider>
  );
};

export { BaseLayout };
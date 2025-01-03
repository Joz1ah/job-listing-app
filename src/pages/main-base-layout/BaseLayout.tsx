import { FC, useState, useEffect } from "react";
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
import { SignOutModal } from "components";
import { ScrollArea } from "components";
import { SubscriptionPlan } from "components/context/types";

type UserType = 'employer' | 'job-hunter' | 'guest';

interface LayoutContentProps {
  children: React.ReactNode;
  menu?: React.ReactNode;
}

const LayoutContent: FC<LayoutContentProps> = ({ children, menu }) => (
  <div className="flex flex-col min-h-screen bg-[#212529] overflow-hidden h-full">
    {menu}
    <ScrollArea>
    <div className="flex flex-col flex-1 h-screen">
      <main className="flex-1 pb-8">
        {children}
      </main>
      <Footer />
    </div>
    </ScrollArea>
  </div>
);

interface BaseLayoutContentProps {
  userType: UserType;
}

const AuthenticatedLayoutContent: FC<{ userType: 'employer' | 'job-hunter' }> = ({ userType }) => {
  const { menuOpen, toggleMenu } = useMenu();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);
  const isEmployer = userType === 'employer';
  
  const { subscriptionPlan, isLoading, error } = isEmployer 
    ? useEmployerContext() 
    : useJobHunterContext();

  const desktopMenuItems = isEmployer ? employerDesktopMenu : jobHunterDesktopMenu;
  const mobileMenuItems = isEmployer ? employerMobileMenu : jobHunterMobileMenu;
  const userName = isEmployer ? "ABC Incorporated" : "Michael V";

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showSignOutModal) {
      timeoutId = setTimeout(() => {
        setShouldRenderModal(true);
      }, 200);
    } else {
      setShouldRenderModal(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showSignOutModal]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const menu = (
    <>
      <BaseMenu
        isAuthenticated={true}
        isMenuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        desktopMenuItems={desktopMenuItems}
        mobileMenuItems={mobileMenuItems}
        subscriptionPlan={subscriptionPlan}
        userType={userType}
        userName={userName}
        onSignOut={() => setShowSignOutModal(true)}
      />
      
      {shouldRenderModal && (
        <SignOutModal
          isOpen={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
        />
      )}
    </>
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
      <Outlet />
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

  const storedTier = localStorage.getItem('subscriptionTier') as SubscriptionPlan || 'freeTrial';

  if (userType === 'guest') {
    return <BaseLayoutContent userType={userType} />;
  }

  if (userType === 'employer') {
    return (
      <EmployerProvider initialTier={storedTier}>
        <BaseLayoutContent userType={userType} />
      </EmployerProvider>
    );
  }

  return (
    <JobHunterProvider initialTier={storedTier}>
      <BaseLayoutContent userType={userType} />
    </JobHunterProvider>
  );
};

export { BaseLayout };
import { FC, useState, useEffect, useMemo } from "react";
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
import { SubscriptionPlan } from "contexts/types";
import { useAuth } from "contexts/AuthContext/AuthContext";

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

const AuthenticatedLayoutContent: FC = () => {
  const { menuOpen, toggleMenu } = useMenu();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [shouldRenderModal, setShouldRenderModal] = useState(false);
  const { user } = useAuth();
  const userType = user?.data?.user?.type;
  const isEmployer = userType === 'employer';
  
  const { subscriptionPlan, isLoading, error } = isEmployer 
    ? useEmployerContext() 
    : useJobHunterContext();

  const desktopMenuItems = isEmployer ? employerDesktopMenu : jobHunterDesktopMenu;
  const mobileMenuItems = isEmployer ? employerMobileMenu : jobHunterMobileMenu;
  
  const displayName = useMemo(() => {
    if (!user) return isEmployer ? "Company Name" : "User Name";
    
    if (isEmployer) {
      return user?.data?.user?.relatedDetails?.businessName || "Company Name";
    } else {
      return user?.data?.user?.relatedDetails?.firstName && user?.data?.user?.relatedDetails?.lastName
        ? `${user?.data?.user?.relatedDetails?.firstName} ${user?.data?.user?.relatedDetails?.lastName}`
        : "User Name";
    }
  }, [user, isEmployer]);

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
        userName={displayName}
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

const BaseLayout: FC = () => {
  const { user } = useAuth();
  const userType = user?.data?.user?.type;
  
  // Get subscription plan from user info
  const getSubscriptionPlan = (): SubscriptionPlan => {
    const activeSubscription = user?.data?.user?.subscriptions?.[0];
    
    // If there's an active subscription, return its plan (Monthly or Yearly)
    if (activeSubscription?.status === 'active') {
      if (activeSubscription.plan === 'Monthly') return 'monthlyPlan';
      if (activeSubscription.plan === 'Yearly') return 'yearlyPlan';
    }
    
    // Default to freeTrial
    return 'freeTrial';
  };

  const subscriptionPlan = getSubscriptionPlan();

  // Render the appropriate provider based on user type
  if (userType === 'employer') {
    return (
      <EmployerProvider initialTier={subscriptionPlan}>
        <AuthenticatedLayoutContent />
      </EmployerProvider>
    );
  }

  if (userType === 'job_hunter') {
    return (
      <JobHunterProvider initialTier={subscriptionPlan}>
        <AuthenticatedLayoutContent />
      </JobHunterProvider>
    );
  }

  // Handle loading or error state
  return <div>Loading...</div>;
};

export { BaseLayout };
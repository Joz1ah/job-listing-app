import React, { useEffect, ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";
import styles from "./defaultLayout.module.scss";
import { BaseMenu } from "layouts";
import { useMenu } from "hooks";
import { Footer } from "layouts/Footer/Engagement/Footer";
import cn from "classnames";
import ButtonNav from "../../components/button/ButtonNav";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useDispatch } from "react-redux";
import { resetModal } from "store/modal/modal.slice";
import {
  employerDesktopMenu,
  employerMobileMenu,
  jobHunterDesktopMenu,
  jobHunterMobileMenu,
} from "mockData/nav-menus";
import { SignOutModal } from "components";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../../pages/landing/useLanding";
import ModalWrapper from "../../pages/landing/parts/ModalWrapper";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";

interface DefaultLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
  className?: string;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  backgroundColor,
  className,
}) => {
  const { handleSetModalState, createExternalCookiePolicy } = useLanding();
  const location = useLocation();
  const { menuOpen, toggleMenu } = useMenu();
  const { user, isAuthenticated } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = React.useState(false);
  const [shouldRenderModal, setShouldRenderModal] = React.useState(false);
  const dispatch = useDispatch();

  const userType = user?.data?.user?.type;
  const isEmployer = userType === "employer";

  const { toggleModal, handleSetSelectedModalHeader } = useModal();

  // Get subscription plan from user info
  const getSubscriptionPlan = () => {
    // If no user data, return freeTrial
    if (!user?.data?.user) return "freeTrial";

    // Check the subscription array first (same as BaseLayout)
    const activeSubscription = user.data.user.subscriptions?.[0];

    // If there's an active subscription in the array, return its plan (Monthly or Yearly)
    if (activeSubscription?.status === "active") {
      if (activeSubscription.plan === "Monthly") return "monthlyPlan";
      if (activeSubscription.plan === "Yearly") return "yearlyPlan";
    }

    // Fallback: check for a direct subscription property
    const directSubscription = user.data.user.subscription;
    if (directSubscription) {
      const plan = directSubscription.plan || directSubscription.type;
      if (plan === "Monthly" || plan === "monthly") return "monthlyPlan";
      if (plan === "Yearly" || plan === "yearly") return "yearlyPlan";
    }

    // Default to freeTrial
    return "freeTrial";
  };

  // Optional debugging
  // useEffect(() => {
  //   console.log(
  //     "DefaultLayout - User subscription data:",
  //     user?.data?.user?.subscriptions,
  //   );
  //   console.log(
  //     "DefaultLayout - Direct subscription property:",
  //     user?.data?.user?.subscription,
  //   );
  //   console.log(
  //     "DefaultLayout - Calculated subscription plan:",
  //     getSubscriptionPlan(),
  //   );
  // }, [user]);

  useEffect(() => {
    createExternalCookiePolicy();
  }, []);

  useEffect(() => {
    // Close modal on location change unless we specifically want it open
    if (!location.state?.openModal) {
      dispatch(resetModal());
    }
    if (location.state?.resetPasswordtoken) {
      handleSetModalState(MODAL_STATES.FORGOT_PASSWORD_NEW_PASSWORD);
      toggleModal(true);
    }
    if (location.state?.login) {
      handleSetModalState(MODAL_STATES.LOGIN);
      toggleModal(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Check if we have state from navigation indicating we should open the modal
    if (location.state?.openModal) {
      handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
      toggleModal(true);

      // Clear the navigation state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Compute display name based on user type and profile data
  const displayName = useMemo(() => {
    if (!user) return isEmployer ? "Company Name" : "User Name";

    if (isEmployer) {
      return user?.data?.user?.relatedDetails?.businessName || "Company Name";
    } else {
      return user?.data?.user?.relatedDetails?.firstName &&
        user?.data?.user?.relatedDetails?.lastName
        ? `${user?.data?.user?.relatedDetails?.firstName} ${user?.data?.user?.relatedDetails?.lastName}`
        : "User Name";
    }
  }, [user, isEmployer]);

  const desktopMenuItems = isEmployer
    ? employerDesktopMenu
    : jobHunterDesktopMenu;
  const mobileMenuItems = isEmployer ? employerMobileMenu : jobHunterMobileMenu;

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

  return (
    <div className={styles["layout-container"]}>
      <BaseMenu
        isAuthenticated={isAuthenticated}
        isMenuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        ButtonLoginNav={
          !isAuthenticated
            ? () => (
                <ButtonNav
                  handleSetState={() => handleSetModalState(MODAL_STATES.LOGIN)}
                  onClick={() => (menuOpen ? toggleMenu() : null)}
                  btnFor="login"
                />
              )
            : undefined
        }
        ButtonSignUpNav={
          !isAuthenticated
            ? () => (
                <ButtonNav
                  handleSetState={() =>
                    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE)
                  }
                  onClick={() => (menuOpen ? toggleMenu() : null)}
                  btnFor="signup"
                />
              )
            : undefined
        }
        desktopMenuItems={isAuthenticated ? desktopMenuItems : undefined}
        mobileMenuItems={isAuthenticated ? mobileMenuItems : undefined}
        userType={userType}
        userName={displayName}
        onSignOut={
          isAuthenticated ? () => setShowSignOutModal(true) : undefined
        }
        subscriptionPlan={getSubscriptionPlan()}
      />

      {shouldRenderModal && (
        <SignOutModal
          isOpen={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
        />
      )}

      <main
        className={cn(styles["layout-main"], className)}
        style={{ "--main-bg-color": backgroundColor } as React.CSSProperties}
      >
        {children}
      </main>
      <Footer />
      <ModalWrapper />
    </div>
  );
};

import React, { useEffect, useRef, ReactNode, useMemo } from "react";
import styles from "./defaultLayout.module.scss";
import { BaseMenu } from "layouts";
import { useMenu } from "hooks";
import { Footer } from "layouts/Footer/Engagement/Footer";
import { useAuth } from "contexts/AuthContext/AuthContext";
import {
  employerDesktopMenu,
  employerMobileMenu,
  jobHunterDesktopMenu,
  jobHunterMobileMenu,
} from "mockData/nav-menus";
import { SignOutModal } from "components";

interface DefaultLayoutProps {
  children: ReactNode;
  backgroundColor?: string;
}

export const DefaultLayout: React.FC<DefaultLayoutProps> = ({
  children,
  backgroundColor,
}) => {
  const { menuOpen, toggleMenu } = useMenu();
  const { user } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = React.useState(false);
  const [shouldRenderModal, setShouldRenderModal] = React.useState(false);

  const userType = user?.data?.user?.type;
  const isAuthenticated = !!user;
  const isEmployer = userType === "employer";

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

  const ButtonLoginNav = () => {
    const elementRef = useRef<HTMLButtonElement>(null);
    const toggleLogin = () => {
      if (elementRef.current) {
        elementRef.current.onclick = () => {
          //setSelectedModalHeader(1)
          //setMaskHidden((prev) => prev ? 0 : 1);
          //setModalState(modalStates.LOGIN);
          //setCloseModalActive(1);
        };
      }
    };

    useEffect(toggleLogin, []);
    return (
      <button ref={elementRef} className={styles.button}>
        Login
      </button>
    );
  };

  const ButtonSignUpNav = () => {
    const elementRef = useRef<HTMLButtonElement>(null);
    const toggleSignUp = () => {
      if (elementRef.current) {
        elementRef.current.onclick = () => {
          //setSelectedModalHeader(1)
          //setMaskHidden((prev) => prev ? 0 : 1);
          //setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
          //setCloseModalActive(1);
        };
      }
    };

    useEffect(toggleSignUp, []);
    return (
      <button
        ref={elementRef}
        className={`${styles.button} ${styles["button-signup"]}`}
      >
        Sign up
      </button>
    );
  };

  return (
    <div className={styles["layout-container"]}>
      <BaseMenu
        isAuthenticated={isAuthenticated}
        isMenuOpen={menuOpen}
        onToggleMenu={toggleMenu}
        ButtonLoginNav={!isAuthenticated ? ButtonLoginNav : undefined}
        ButtonSignUpNav={!isAuthenticated ? ButtonSignUpNav : undefined}
        desktopMenuItems={isAuthenticated ? desktopMenuItems : undefined}
        mobileMenuItems={isAuthenticated ? mobileMenuItems : undefined}
        userType={userType}
        userName={displayName}
        onSignOut={
          isAuthenticated ? () => setShowSignOutModal(true) : undefined
        }
      />

      {shouldRenderModal && (
        <SignOutModal
          isOpen={showSignOutModal}
          onClose={() => setShowSignOutModal(false)}
        />
      )}

      <main
        className={styles["layout-main"]}
        style={{ "--main-bg-color": backgroundColor } as React.CSSProperties}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

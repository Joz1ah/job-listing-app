import { FC, useEffect, ReactElement } from "react";
import { FooterEngagement as Footer } from "layouts";
import { PageMeta } from "components";
import { LandingContext } from "components";

import { useLocation } from "react-router-dom";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { Outlet, useMatch } from "react-router-dom";
import { Navigate } from "react-router-dom";

import _5dollarspermonth from "assets/5dollarspermonth.svg?url";

import styles from "./landing.module.scss";
import { useModal } from "components/modal/useModal";
import { useLanding } from "./useLanding";
import NavigationHeader from "./parts/NavigationHeader";
import ModalWrapper from "./parts/ModalWrapper";
import HeroContainer from "./parts/HeroContainer";
import PricingContainer from "./parts/PricingContainer";
import InfoGraphics from "./parts/InfoGraphics";

const Landing: FC = (): ReactElement => {
  const { modalStates, setModalState } = useLanding();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  // Simple redirect if authenticated
  if (isAuthenticated && user?.type) {
    return <Navigate to={`/${user.type}`} replace />;
  }
  const { toggleModal, handleSetSelectedModalHeader } = useModal();

  useEffect(() => {
    // Check if we have state from navigation indicating we should open the modal
    if (location.state?.openModal) {
      handleSetSelectedModalHeader(1);
      setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
      toggleModal();

      // Clear the navigation state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const isFreeTrial = false;
  const isIndexRoute = useMatch("/");

  return (
    <LandingContext.Provider value={{ isFreeTrial }}>
      <PageMeta title="Akaza" />
      <div className={styles.main}>
        <NavigationHeader />
        {isIndexRoute && (
          <>
            <HeroContainer />
            <PricingContainer />
            <InfoGraphics />
          </>
        )}
        <Outlet />
        <Footer />
        <ModalWrapper />
      </div>
    </LandingContext.Provider>
  );
};

export { Landing };

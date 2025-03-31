import { FC, ReactElement } from "react";
import { PageMeta } from "components";
import { LandingContext } from "components";
import { DefaultLayout } from "layouts";

import { useAuth } from "contexts/AuthContext/AuthContext";
import { Outlet, useMatch } from "react-router-dom";
import { Navigate } from "react-router-dom";

//import {CookieConsentBanner, CookieConsentSnackBar} from "components/cookies";
import _5dollarspermonth from "assets/5dollarspermonth.svg?url";

import styles from "./landing.module.scss";
import HeroContainer from "./parts/HeroContainer";
import PricingContainer from "./parts/PricingContainer";
import InfoGraphics from "./parts/InfoGraphics";

const Landing: FC = (): ReactElement => {
  const { isAuthenticated, user } = useAuth();
  // Simple redirect if authenticated
  if (isAuthenticated && user?.type) {
    return <Navigate to={`/${user.type}`} replace />;
  }
  const isFreeTrial = false;
  const isIndexRoute = useMatch("/");

  return (
    <LandingContext.Provider value={{ isFreeTrial }}>
      <PageMeta 
        title="Akaza" 
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
      <DefaultLayout className={styles["landing-container"]}>
        <div className={`${styles.main} flex flex-col gap-0`}>
          {isIndexRoute && (
            <>
              <HeroContainer />
              <PricingContainer />
              <InfoGraphics />
            </>
          )}
          <Outlet />
        </div>
      </DefaultLayout>
      {/* <CookieConsentBanner/>
      <CookieConsentSnackBar/> */}
    </LandingContext.Provider>
  );
};

export { Landing };

import React, { useEffect, useState  } from "react";
import { useCookieContext } from "contexts/cookieContext";
import Cookies from "js-cookie";
import styles from "./cookieConsentBanner.module.scss";
import cookiesIcon from "assets/cookies.svg?url";

const CookieConsentBanner: React.FC = () => {
  const { consentGiven, setConsent, clearConsent } = useCookieContext();
  const [, forceUpdate] = useState(0);

  const handleClick = () => {
    forceUpdate(prev => prev + 1);
  };
  
  useEffect(() => {
    if ( !!Cookies.get('cookie-consent') || !consentGiven ) {
      document.body.classList.add(styles.noScroll);
    } else {
      document.body.classList.remove(styles.noScroll);
    }
  }, [consentGiven,setConsent]);

  if (!!Cookies.get('cookie-consent') || consentGiven) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles["modal-icon"]}>
          <img src={cookiesIcon} alt="Cookies" />
        </div>
        <div className={styles["modal-title"]}>Cookies</div>
        <div className={styles["modal-content"]}>
          <p>
            We use cookies to enhance your experience. By continuing, you agree to our{" "}
            <div className={styles.highlight}>cookie policy.</div>
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            onClick={() => setConsent(true)}  
            className={styles.acceptButton}
          >
            Accept
          </button>
          <button
            onClick={() => {
              setConsent(false);  
              clearConsent();
              handleClick();     
            }}
            className={styles.declineButton}
          >
            Decline Cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

import React, {useState} from "react";
import { useCookieContext } from "contexts/cookieContext";
import styles from "./cookieConsentBanner.module.scss";
import cookiesIcon from "assets/cookies.svg?url";

const CookieConsentBanner: React.FC = () => {
  const { setConsent, isVisible, setIsVisible } = useCookieContext();
    const [isFadingOut, setIsFadingOut] = useState(false);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsFadingOut(false);
    }, 200); 
  };

  return (
    <div className={`${styles.contentWrapper} ${isFadingOut ? styles["fade-out"] : ""}`}>
      <div className={`${styles.modal}`}>
        <div className={styles["modal-icon"]}>
          <img src={cookiesIcon} alt="Cookies" />
        </div>
        <h2 id="cookie-banner-title" className={styles["modal-title"]}>
          Cookies
        </h2>
        <div className={styles["modal-content"]}>
          <p>
            We use cookies to enhance your experience. By continuing, you agree to our{" "}
            <a href="/cookie-policy" className={styles.highlight}>cookie policy</a>.
          </p>
        </div>

        <div className={styles.buttonContainer}>
          <button
            onClick={() => {
              setConsent(true);
              handleClose();
            }}  
            className={styles.acceptButton}
            autoFocus
          >
            Accept
          </button>
          <button
            onClick={() => {
              setConsent(false);
              handleClose();
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

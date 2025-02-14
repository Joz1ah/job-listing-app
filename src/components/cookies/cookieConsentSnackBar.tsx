import React, {useState} from "react";
import { useCookieContext } from "contexts/cookieContext";
import styles from "./cookieConsentBanner.module.scss";
import cookiesIcon from "assets/cookies.svg?url";

const CookieConsentSnackBar: React.FC = () => {
  const { isSnackBarVisible, setIsSnackBarVisible, setIsVisible } = useCookieContext();
  const [isFadingOut, setIsFadingOut] = useState(false);

  if (!isSnackBarVisible) {
    return null;
  }

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsSnackBarVisible(false)
      setIsVisible(true)
      setIsFadingOut(false);
    }, 200); 
  };

  return (
      <div className={`${styles.contentWrapper} ${isFadingOut ? styles["fade-out"] : ""}`}>
        <div className={`${styles.snackBar}`}>
          <div className={styles.icon}><img src={cookiesIcon}/></div>
          <div>
            This website uses cookies.
            <div 
            className={styles.highlight}
            onClick={()=>{
              handleClose()
            }}
            >Learn More</div></div>
        </div>
      </div>

  );
};

export default CookieConsentSnackBar;

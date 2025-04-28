import styles from "./../landing.module.scss";
import { Link } from "react-router-dom";
import metana_akaza from 'assets/metanaXakaza.jpg';
import metana_akaza_tablet from 'assets/metana-tablet.png';
import { useEffect, useState } from 'react';

const PricingContainer = () => {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    // Function to check if the screen width is in the tablet range (between 768px and 1050px)
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsTablet(width <= 1250 && width > 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <div className={`${styles["pricing-container"]}`}>
      {/* First section with responsive image */}
      <div className={`${styles["metana-section"]}`}>
        <a
          href="https://metana.io/landing/full-stack-bootcamp/?utm_source=akaza-io"
          target="_blank"
          rel="noopener noreferrer"
          className={styles["metana-link"]}
        >
          <img
            src={isTablet ? metana_akaza_tablet : metana_akaza}
            alt="Metana x Akaza Partnership"
            className={styles["metana-akaza-image"]}
            style={{ borderRadius: '8px' }} // Added inline style for rounded corners
          />
        </a>
      </div>
      
      {/* Second section unchanged */}
      <div className={`${styles["desc2-wrapper"]}`}>
        <div className={`${styles.desc2}`}>
          <div className={`${styles["sub-desc"]}`}>
            <div className={`${styles.orange}`}>Maximum</div>
            <div className={`${styles.white}`}>Efficiency</div>
            <div className={`${styles.orange}`}>&</div>
            <div className={`${styles.white}`}>Accountability</div>
            {["is", "what", "we", "strive", "for!"].map((label) => (
              <div key={label} className={`${styles.orange}`}>{label}</div>
            ))}
          </div>
          <div className={`${styles["sub-desc"]}`}>
            We are committed to be the best at what we do. Our CEO is eager to
            connect with you personally to discuss how we can enhance your
            experience!
          </div>
        </div>
        <div className={`${styles["button-wrapper"]}`}>
          <button className={`${styles["button-regular"]}`}>
            <Link
              to={"https://calendly.com/ceo-akaza/intro-to-akaza"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Schedule a call
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingContainer;
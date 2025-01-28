import styles from "./../landing.module.scss";
import { Link } from "react-router-dom";

import flame_vector from "assets/flame-vector.svg?url";
import orange_check from "assets/orange-check.svg?url";
import corner_rectangle_orange from "assets/corner-rectangle-orange.png";
import corner_bottom_stripes from "assets/corner-bottom-stripes.png";
import _5dollarspermonth from "assets/5dollarspermonth.svg?url";

const PricingContainer = () => {
  return (
    <div className={`${styles["pricing-container"]}`}>
      <div className={`${styles["desc1-wrapper"]}`}>
        <div className={`${styles.desc1}`}>
          {[
            "Perfect Match automation",
            "Ratings & Feedback",
            " Access to diverse private sector industries",
            "Basic analytic page",
            "Access to exclusive informative content",
            "Live chat support",
          ].map((label: string) => (
            <div className={`${styles["sub-desc"]}`}>
              <div>
                <img src={orange_check}></img>
              </div>
              <div>{label}</div>
            </div>
          ))}
        </div>
        <div className={`${styles["desc1-2"]}`}>
          <div className={`${styles["corner-recatangle"]}`}>
            <div className={`${styles["image-wrapper"]}`}>
              <div>
                <img src={corner_rectangle_orange}></img>
              </div>
              <div>
                <img src={_5dollarspermonth}></img>
              </div>
              <div>Get this for only</div>
            </div>
          </div>
        </div>
        <div className={`${styles["desc1-3"]}`}>
          <div className={`${styles["corner-bottom-stripes"]}`}>
            <img src={corner_bottom_stripes}></img>
          </div>
          <div className={`${styles["corner-flame"]}`}>
            <img src={flame_vector}></img>
          </div>
        </div>
      </div>
      <div className={`${styles["desc2-wrapper"]}`}>
        <div className={`${styles.desc2}`}>
          <div className={`${styles["sub-desc"]}`}>
            <div className={`${styles.orange}`}>Maximum</div>
            <div className={`${styles.white}`}>Efficiency</div>
            <div className={`${styles.orange}`}>&</div>
            <div className={`${styles.white}`}>Accountability</div>
            {["is", "what", "we", "strive", "for!"].map((label: string) => (
              <div className={`${styles.orange}`}>{label}</div>
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
            <Link to={"https://calendly.com/ceo-akaza/intro-to-akaza"}>
              Schedule a call
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingContainer;

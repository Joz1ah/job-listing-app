import { useLanding } from "../useLanding";
import styles from "./../landing.module.scss";

import sparkle_icon from "assets/sparkle-icon.svg?url";
import akaza_loading from "assets/akaza-loading.png";
import akaza_icon from "assets/akaza-icon.png";
import { MODAL_STATES } from "store/modal/modal.types";

const LoadingModal = () => {
  const { modalState } = useLanding();
  return (
    <div
      id="step6_signup"
      className={`${styles["modal-content"]}`}
      hidden={modalState !== MODAL_STATES.LOADING}
    >
      <div className={`${styles["modal-loading-container"]}`}>
        <div className={`${styles["loading-description"]}`}>
          <div>You're a few seconds away</div>
          <div>from seeing your</div>
          <div>
            <img src={sparkle_icon}></img>
            <label>Perfect Match</label>
          </div>
        </div>

        <div className={`${styles["modal-loading-wrapper"]}`}>
          <div className={`${styles["modal-akaza-loading-container"]}`}>
            <div>
              <img
                className={`${styles["modal-loader"]}`}
                src={akaza_loading}
              ></img>
            </div>
            <div>
              <img src={akaza_icon}></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;

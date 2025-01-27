import { useState, useEffect } from "react";
import styles from "./../landing.module.scss";
import Video from "./Video";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";

import video4 from "assets/mp4/girl-laughing-at-monitor.mp4";

import akaza_icon from "assets/akaza-icon.png";
import akaza_loading from "assets/akaza-loading.png";
import sparkle_icon from "assets/sparkle-icon.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";

const HeroLoading = () => {
  const { handleSetSelectedModalHeader, isModalOpen, toggleModal } = useModal();
  const { heroState, heroStates, handleSetModalState } = useLanding();
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    if (heroState === heroStates.LOADING && !hasShownModal && !isModalOpen) {
      const timer = setTimeout(() => {
        setHasShownModal(true);
        handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
        handleSetModalState(MODAL_STATES.PERFECT_MATCH_RESULTS);
        toggleModal();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [heroState, isModalOpen, hasShownModal]);

  // Reset modal shown state when leaving loading state
  useEffect(() => {
    if (heroState !== heroStates.LOADING) {
      setHasShownModal(false);
    }
  }, [heroState]);

  return (
    <div
      id="loading_step"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== heroStates.LOADING}
    >
      <Video src={video4} className={styles["hero-video"]} />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className={`${styles["hero-container-content-wrapper"]}`}>
          <div
            className={`${styles["title"]} ${styles["orange"]} ${styles["text-left"]}`}
          >
            <div>You're a few seconds away from</div>
            <div className={`${styles["sparkle-desc"]}`}>
              <div>seeing your perfect match</div>
              <div className={`${styles["perfect-match-wrapper"]}`}>
                <img src={sparkle_icon} alt="sparkle"></img>
              </div>
            </div>
          </div>
          <div className={`${styles["loading-wrapper"]}`}>
            <div className={`${styles["akaza-loading-container"]}`}>
              <div>
                <img
                  className={`${styles.loader}`}
                  src={akaza_loading}
                  alt="loading"
                ></img>
              </div>
              <div>
                <img src={akaza_icon} alt="akaza"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLoading;

import { useRef, useEffect } from "react";
import styles from "./../landing.module.scss";
import Video from "./Video";
import { useLanding } from "../useLanding";

import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import video4 from "assets/mp4/girl-laughing-at-monitor.mp4";
import sparkle_icon from "assets/sparkle-icon.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

const HeroPerfectMatchResults = () => {
  const { handleSetHeroState, heroState } = useLanding();
  const heroBackButton = useRef<HTMLDivElement>(null);

  const heroScreenActions = () => {
    if (heroBackButton.current) {
      heroBackButton.current.onclick = () => {
        handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);
      };
    }
  };

  useEffect(heroScreenActions, []);

  return (
    <div
      id="perfect_match_results"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.PERFECT_MATCH_RESULTS}
    >
      <Video src={video4} className={styles["hero-video"]} />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className={`${styles["hero-container-content-wrapper"]}`}>
          <div
            className={`${styles["title"]} ${styles["orange"]} ${styles["text-left"]}`}
          >
            <div>Here are your</div>
            <div className={`${styles["sparkle-desc"]}`}>
              <div>Perfect Matches!</div>
              <div className={`${styles["perfect-match-wrapper"]}`}>
                <img src={sparkle_icon} alt="sparkle"></img>
              </div>
            </div>
          </div>

          <div className={`${styles["perfect-match-results-wrapper"]}`}>
            {/* Add your perfect match results content here */}
            <div className={`${styles["match-results-container"]}`}>
              {/* You can add match cards or other content here */}
            </div>
          </div>

          <div className={`${styles["hero-button-container2"]}`}>
            <div
              ref={heroBackButton}
              className={`${styles["button-custom-transparent"]} ${styles["noselect"]}`}
            >
              <img
                className={`${styles["caret-left"]}`}
                src={arrow_left_icon}
                alt="back"
              ></img>
              <div>Back to Start</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPerfectMatchResults;

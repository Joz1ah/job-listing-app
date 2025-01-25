import { useRef, useEffect } from "react";
import Video from "./Video";
import { useLanding } from "../useLanding";
import styles from "./../landing.module.scss";

import video1 from "assets/mp4/Landing-Page-hero-1.mp4";

const HeroPerfectMatchAlgo = () => {
  const { setHeroState, heroStates, setDataStates, heroState } = useLanding();
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroJobHunterButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = () => {
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
        setDataStates((state) => ({ ...state, selectedUserType: "employer" }));
      };
    }
    if (heroJobHunterButton.current) {
      heroJobHunterButton.current.onclick = () => {
        setHeroState(heroStates.SKILLSETS_JOBHUNTER);
        setDataStates((state) => ({
          ...state,
          selectedUserType: "job_hunter",
        }));
      };
    }
  };

  useEffect(heroScreenActions, []);
  return (
    <div
      id="step1"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== heroStates.PERFECT_MATCH_ALGO}
    >
      <Video src={video1} className={styles["hero-video"]} />
      <div className={`${styles["hero-container-overlay"]} ${styles["sepia"]}`}>
        <div className={`${styles["title"]} ${styles["text-center"]}`}>
          Let our Perfect Match Algo do the work
        </div>
        <div className={`${styles.desc}`}>What best describes you?</div>
        <div
          className={`${styles["hero-button-container"]} ${styles["center"]}`}
        >
          <div
            ref={heroJobHunterButton}
            className={`${styles["button-custom"]} ${styles["noselect"]}`}
          >
            Job Hunter
          </div>
          <div
            ref={heroEmployerButton}
            className={`${styles["button-custom"]} ${styles["noselect"]}`}
          >
            Employer
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroPerfectMatchAlgo;

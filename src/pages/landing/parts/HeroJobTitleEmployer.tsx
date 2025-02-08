import { useRef, useState, useEffect } from "react";
import styles from "./../landing.module.scss";
import Video from "./Video";
import * as Yup from "yup";
import { useLanding } from "../useLanding";

import video2 from "assets/mp4/video-conference-call-1.mp4";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

const HeroJobTitleEmployer = () => {
  const { heroState, handleSetHeroState, handleSetSkills } = useLanding();
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [rememberedJobTitle, setRememberedJobTitle] = useState("");
  const [jobTitle, setJobTitle] = useState(rememberedJobTitle);
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required("This field is required"),
  });

  const validateJobTitle = async () => {
    try {
      await validationSchema.validate({ jobTitle }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateJobTitle();
        if (isValid) {
          setError("");
          setRememberedJobTitle(jobTitle);
          handleSetHeroState(HERO_STATES.SKILLSETS_EMPLOYER);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        handleSetSkills([]);
        setRememberedJobTitle("");
        setError("");
        handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);
      };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    if (error) setError("");
  };

  useEffect(heroScreenActions, [jobTitle]);

  return (
    <div
      id="step1_employer"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.JOB_TITLE_EMPLOYER}
    >
      <Video src={video2} className={styles["hero-video"]} />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div
          className={`mt-12 flex flex-col gap-8 ${styles["hero-container-content-wrapper"]}`}
        >
          <div>
            <div className="font-[600] text-[36px] text-[#F5722E]">
              Ready to create your first
            </div>
            <div className="font-[600] text-[36px] text-[#F5722E]">
              job listing? Let's begin!
            </div>
          </div>
          <div>
            <div className={`${styles["search-wrapper"]}`}>
              <input
                className={`${styles["search-input"]}`}
                placeholder="Please type a Job Title"
                type="text"
                value={jobTitle}
                onChange={handleInputChange}
              />
            </div>
            {error && (
              <div
                className={`${styles["validation-message"]} ${styles["variant-1"]}`}
              >
                {error}
              </div>
            )}
            <div className={`${styles["hero-button-container2"]}`}>
              <div
                ref={heroNextButton}
                className={`${styles["button-custom-orange"]} ${styles["noselect"]}`}
              >
                Next
              </div>
              <div
                ref={heroPreviousButton}
                className={`${styles["button-custom-transparent"]} ${styles["noselect"]}`}
              >
                <img
                  className={`${styles["caret-left"]}`}
                  src={arrow_left_icon}
                ></img>
                <div>Previous</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroJobTitleEmployer;

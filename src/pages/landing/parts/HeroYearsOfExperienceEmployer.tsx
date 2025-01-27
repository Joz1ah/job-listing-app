import { useRef, useState, useEffect } from "react";
import styles from "./../landing.module.scss";
import * as Yup from "yup";
import { useLanding } from "../useLanding";

import man_woman_looking_at_list from "assets/man-woman-looking-at-list.jpg";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

const HeroYearsOfExperienceEmployer = () => {
  const { heroState, handleSetHeroState } = useLanding();
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [selectedExperience, setSelectedExperience] = useState("");
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    experience: Yup.string().required("This field is required"),
  });

  const validateExperience = async () => {
    try {
      await validationSchema.validate(
        { experience: selectedExperience },
        { abortEarly: false },
      );
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    if (error) setError("");
  };

  const experienceOptions = [
    "no experience",
    "under a year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years",
  ];

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateExperience();
        if (isValid) {
          setError("");
          handleSetHeroState(HERO_STATES.LOADING);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError("");
        handleSetHeroState(HERO_STATES.SKILLSETS_EMPLOYER);
      };
    }
  };

  useEffect(heroScreenActions, [selectedExperience]);

  return (
    <div
      id="step3_employer"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.YEARS_OF_EXPERIENCE_EMPLOYER}
    >
      <img src={man_woman_looking_at_list} />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className={`${styles["hero-container-content-wrapper"]}`}>
          <div
            className={`${styles["title"]} ${styles["orange"]} ${styles["text-left"]}`}
          >
            <div>How many years of experience</div>
            <div>required for your first job listing?</div>
          </div>
          <div className={`${styles["button-selection-wrapper"]}`}>
            {experienceOptions.map((experience) => (
              <button
                key={experience}
                className={`${styles["button-custom-orange-flex"]} ${
                  selectedExperience === experience ? styles["selected"] : ""
                }`}
                onClick={() => handleExperienceSelect(experience)}
              >
                {experience}
              </button>
            ))}
          </div>
          {error && (
            <div
              className={`${styles["validation-message"]} ${styles["variant-3"]}`}
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
  );
};

export default HeroYearsOfExperienceEmployer;

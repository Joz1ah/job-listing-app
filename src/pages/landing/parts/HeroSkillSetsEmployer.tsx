import { CoreSkillsTagInput } from "components";
import { useRef, useState, useEffect } from "react";
import { useLanding } from "../useLanding";
import * as Yup from "yup";
import styles from "./../landing.module.scss";

import group_people_laptop from "assets/group-people-laptop.jpg";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";

const HeroSkillSetsEmployer = () => {
  const {
    rememberedSelectedSkills,
    setRememberedSelectedSkills,
    setHeroState,
    heroStates,
    heroState,
  } = useLanding();
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    rememberedSelectedSkills,
  );
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    skills: Yup.array()
      .min(3, "Please select at least 3 skills")
      .max(5, "Maximum of 5 skills allowed")
      .required("Skills are required"),
  });

  const validateSkills = async () => {
    try {
      await validationSchema.validate(
        { skills: selectedSkills },
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

  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = async () => {
        const isValid = await validateSkills();
        if (isValid) {
          setRememberedSelectedSkills(selectedSkills);
          setError("");
          setHeroState(heroStates.YEARS_OF_EXPERIENCE_EMPLOYER);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError("");
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
      };
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    setSelectedSkills(skills);
    if (error) setError("");
  };

  useEffect(heroScreenActions, [selectedSkills]);
  return (
    <div
      id="step2_employer"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== heroStates.SKILLSETS_EMPLOYER}
    >
      <img src={group_people_laptop} />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className={`${styles["hero-container-content-wrapper"]}`}>
          <div
            className={`${styles["title"]} ${styles["orange"]} ${styles["text-left"]}`}
          >
            <div>What skills are you</div>
            <div>looking for?</div>
          </div>
          <div className={`${styles["search-wrapper"]}`}>
            <CoreSkillsTagInput
              value={selectedSkills}
              onChange={handleSkillsChange}
              placeholder="Type and select your skill set"
              className={`bg-transparent border-none text-white min-h-9 ${error ? styles["input-error"] : ""}`}
              alternateColors={{
                firstColor: "#168AAD",
                secondColor: "#184E77",
              }}
            />
            {/* <img src={icon_search}></img> */}
          </div>
          {error && (
            <div
              className={`${styles["validation-message"]} ${styles["variant-2"]}`}
            >
              {error}
            </div>
          )}
          <div className={`${styles["hero-button-container2"]}`}>
            <div
              ref={heroEmployerButton}
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

export default HeroSkillSetsEmployer;

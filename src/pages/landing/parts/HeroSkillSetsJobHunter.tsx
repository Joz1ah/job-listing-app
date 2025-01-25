import { CoreSkillsTagInput } from "components";
import { useRef, useState, useEffect } from "react";
import styles from "./../landing.module.scss";
import Video from "./Video";
import { useLanding } from "../useLanding";
import * as Yup from "yup";

import video3 from "assets/mp4/glasses-girl-in-meeting.mp4";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";

const HeroSkillSetsJobHunter = () => {
  const {
    rememberedSelectedSkills,
    setRememberedSelectedSkills,
    setHeroState,
    heroStates,
    heroState,
  } = useLanding();
  const heroNextButton = useRef<HTMLDivElement>(null);
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

  const handleSkillsChange = (skills: string[]) => {
    if (skills.length <= 5) {
      setSelectedSkills(skills);
      if (error) setError("");
    }
  };

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateSkills();
        if (isValid) {
          setRememberedSelectedSkills(selectedSkills);
          setError("");
          setHeroState(heroStates.YEARS_OF_EXPERIENCE_JOBHUNTER);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setRememberedSelectedSkills([]);
        setError("");
        setHeroState(heroStates.PERFECT_MATCH_ALGO);
      };
    }
  };

  useEffect(heroScreenActions, [selectedSkills]);

  return (
    <div
      id="step1_job_hunter"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== heroStates.SKILLSETS_JOBHUNTER}
    >
      <div className={"absolute inset-0 overflow-hidden"}>
        <Video
          src={video3}
          className={`absolute inset-0 object-cover w-full h-full object-right md:object-center`}
        />
      </div>
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className={`${styles["hero-container-content-wrapper"]}`}>
          <div
            className={`${styles["title"]} ${styles["orange"]} ${styles["text-left"]}`}
          >
            <div>Select up to 5 skill sets</div>
          </div>
          <div className={`${styles["search-wrapper"]}`}>
            <CoreSkillsTagInput
              value={selectedSkills}
              onChange={handleSkillsChange}
              placeholder="Type and select your skill set"
              className={`bg-transparent border-none text-white min-h-[36px] ${error ? styles["input-error"] : ""}`}
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

export default HeroSkillSetsJobHunter;

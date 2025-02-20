import { CoreSkillsTagInput } from "components";
import { useState } from "react";
import { useLanding } from "../useLanding";
import * as Yup from "yup";
import styles from "./../landing.module.scss";

import group_people_laptop from "assets/group-people-laptop.jpg";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

const HeroSkillSetsEmployer = () => {
  const { selectedSkills, handleSetSkills, handleSetHeroState, heroState } =
    useLanding();
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

  const handleClickNext = async () => {
    const isValid = await validateSkills();
    if (isValid) {
      setError("");
      handleSetHeroState(HERO_STATES.YEARS_OF_EXPERIENCE_EMPLOYER);
    }
  };

  const handleClickPrevious = () => {
    setError("");
    handleSetHeroState(HERO_STATES.JOB_TITLE_EMPLOYER);
  };

  const handleSkillsChange = (skills: string[]) => {
    handleSetSkills(skills);
    if (error) setError("");
  };

  return (
    <div
      id="step2_employer"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.SKILLSETS_EMPLOYER}
    >
      <img src={group_people_laptop} className="w-full h-full object-cover" />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div className="w-full max-w-[380px] mt-12 flex flex-col gap-8">
          <div className="w-full font-[600] text-[26px] sm:text-[36px] text-[#F5722E]">
            What skills are you looking for? Select up to 5 skill set
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between rounded-[4px] border-[2px] border-[#AEADAD] pr-2">
              <CoreSkillsTagInput
                value={selectedSkills ?? []}
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
              <div className="text-[#e53835] italic text-[14px]">{error}</div>
            )}
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <button
                onClick={handleClickNext}
                className="w-full h-[35px] border border-transparent rounded-[4px] bg-[#F5722E] text-[16px] font-[500] text-[#F5F5F7] text-center"
              >
                Next
              </button>
              <button
                onClick={handleClickPrevious}
                className="w-full h-[25px] flex items-center justify-center gap-4"
              >
                <img
                  className="absolute mr-[100px]"
                  src={arrow_left_icon}
                ></img>
                <span className="font-medium text-[10px] text-[#AEADAD]">
                  Previous
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSkillSetsEmployer;

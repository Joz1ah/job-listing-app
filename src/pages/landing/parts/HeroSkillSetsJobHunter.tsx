import { CoreSkillsTagInput } from "components";
import { useState } from "react";
import styles from "./../landing.module.scss";
import Video from "./Video";
import { useLanding } from "../useLanding";
import * as Yup from "yup";

import video3 from "assets/mp4/glasses-girl-in-meeting.mp4";
import icon_search from "assets/search.svg?url";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

const HeroSkillSetsJobHunter = () => {
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

  const handleSkillsChange = (skills: string[]) => {
    if (skills.length <= 5) {
      handleSetSkills(skills);
      if (error) setError("");
    }
  };

  const handleClickNext = async () => {
    const isValid = await validateSkills();
    if (isValid) {
      setError("");
      handleSetHeroState(HERO_STATES.YEARS_OF_EXPERIENCE_JOBHUNTER);
    }
  };

  const handleClickPrevious = () => {
    handleSetSkills([]);
    setError("");
    handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);
  };

  return (
    <div
      id="step1_job_hunter"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.SKILLSETS_JOBHUNTER}
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
        <div className={`w-full max-w-[380px] mt-12 flex flex-col gap-8`}>
          <div className="text-[#F5722E] font-[600] text-[26px] text-left">
            Select up to 5 skill sets
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="flex justify-between rounded-[4px] border-[2px] border-[#AEADAD] pr-2">
              <CoreSkillsTagInput
                value={selectedSkills ?? []}
                onChange={handleSkillsChange}
                placeholder="Type and select your skill set"
                className={`bg-transparent border-none text-white min-h-[36px] ${error ? styles["input-error"] : ""}`}
                alternateColors={{
                  firstColor: "#168AAD",
                  secondColor: "#184E77",
                }}
              />
              <img src={icon_search}></img>
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

export default HeroSkillSetsJobHunter;

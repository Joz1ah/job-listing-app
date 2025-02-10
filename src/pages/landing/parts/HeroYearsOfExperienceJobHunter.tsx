import { useState, useCallback } from "react";
import styles from "./../landing.module.scss";
import * as Yup from "yup";
import { useLanding } from "../useLanding";

import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import girl_with_dog_smiling_at_laptop from "assets/girl-with-dog-smiling-at-laptop.jpg";
import { HERO_STATES } from "store/hero/hero.types";

const HeroYearsOfExperienceJobHunter = () => {
  const { heroState, handleSetHeroState } = useLanding();
  const [selectedExperience, setSelectedExperience] = useState("");
  const [error, setError] = useState("");

  const validationSchema = Yup.object().shape({
    experience: Yup.string().required("This field is required"),
  });

  const validateExperience = useCallback(async () => {
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
  }, [selectedExperience]);

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

  const handleClickNext = useCallback(async () => {
    const isValid = await validateExperience();
    if (isValid) {
      setError("");
      handleSetHeroState(HERO_STATES.LOADING);
    }
  }, [validateExperience]);

  const handleClickPrevious = () => {
    setError("");
    handleSetHeroState(HERO_STATES.SKILLSETS_JOBHUNTER);
  };

  return (
    <div
      id="step2_job_hunter"
      className={`${styles["hero-content"]}`}
      hidden={heroState !== HERO_STATES.YEARS_OF_EXPERIENCE_JOBHUNTER}
    >
      <img
        src={girl_with_dog_smiling_at_laptop}
        className="w-full h-full object-cover"
      />
      <div
        className={`${styles["hero-container-overlay"]} ${styles["gradient-left-dark"]}`}
      >
        <div
          className={`mt-12 flex flex-col gap-8 ${styles["hero-container-content-wrapper"]}`}
        >
          <div>
            <div className="text-[#F5722E] font-[600] text-[26px] text-left">
              How many years of experience
            </div>
            <div className="text-[#F5722E] font-[600] text-[26px] text-left">
              do you have?
            </div>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2 max-w-[345px]" id="btns">
              {experienceOptions.map((experience: string) => (
                <button
                  key={experience}
                  className={`w-full px-4 py-2 rounded-[4px] ${selectedExperience === experience ? "bg-[#F5722E] text-white" : "bg-white text-[#F5722E]"}`}
                  onClick={() => handleExperienceSelect(experience)}
                  type="button"
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
            <div className="flex flex-col justify-center items-center gap-[3px] mt-[20px] w-full max-w-[345px]">
              <button
                onClick={handleClickNext}
                className={`h-[35px] rounded-[4px] bg-[#F5722E] text-[#F5F5F7] text-[16px] font-[500] ${styles["noselect"]} z-50 w-full`}
              >
                Next
              </button>
              <button
                onClick={handleClickPrevious}
                className={`${styles["button-custom-transparent"]} ${styles["noselect"]} z-50`}
              >
                <img
                  className={`${styles["caret-left"]}`}
                  src={arrow_left_icon}
                ></img>
                <div>Previous</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroYearsOfExperienceJobHunter;

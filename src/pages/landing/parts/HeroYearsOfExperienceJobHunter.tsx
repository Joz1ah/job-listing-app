import { useState, useCallback, useEffect } from "react";
import styles from "./../landing.module.scss";
import * as Yup from "yup";
import { useLanding } from "../useLanding";
import { useModal } from "components/modal/useModal";

import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import girl_with_dog_smiling_at_laptop from "assets/girl-with-dog-smiling-at-laptop.jpg";
import { HERO_STATES } from "store/hero/hero.types";
import { MODAL_STATES } from "store/modal/modal.types";

const HeroYearsOfExperienceJobHunter = () => {
  const {
    heroState,
    handleSetHeroState,
    selectedExperience,
    handleSetExperience,
    handleSetModalState,
  } = useLanding();

  const { toggleModal } = useModal();

  // Initialize with the value from Redux if available
  const [selectedExperienceLocal, setSelectedExperienceLocal] = useState(
    selectedExperience || "",
  );
  const [error, setError] = useState("");

  // Update local state if Redux state changes
  useEffect(() => {
    if (selectedExperience) {
      setSelectedExperienceLocal(selectedExperience);
    }
  }, [selectedExperience]);

  const validationSchema = Yup.object().shape({
    experience: Yup.string().required("This field is required"),
  });

  const validateExperience = useCallback(async () => {
    try {
      await validationSchema.validate(
        { experience: selectedExperienceLocal },
        { abortEarly: false },
      );
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  }, [selectedExperienceLocal]);

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperienceLocal(experience);
    handleSetExperience(experience);
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
      // Show the perfect match results modal directly
      handleSetModalState(MODAL_STATES.PERFECT_MATCH_RESULTS);
      toggleModal(true);
    }
  }, [validateExperience, handleSetModalState, toggleModal]);

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
        <div className="w-full max-w-[380px] mt-12 flex flex-col gap-8">
          <div className="w-full font-[600] text-[26px] sm:text-[36px] text-[#F5722E]">
            How many years of experience do you have?
          </div>
          <div>
            <div className="grid grid-cols-2 gap-2 w-full" id="btns">
              {experienceOptions.map((experience: string) => (
                <button
                  key={experience}
                  className={`w-full px-4 py-2 rounded-[4px] ${selectedExperienceLocal === experience ? "bg-[#F5722E] text-white" : "bg-white text-[#F5722E]"}`}
                  onClick={() => handleExperienceSelect(experience)}
                  type="button"
                >
                  {experience}
                </button>
              ))}
            </div>
            {error && (
              <div className="text-[#e53835] italic text-[14px]">{error}</div>
            )}
            <div className="flex flex-col justify-center items-center gap-[3px] mt-[20px] w-full">
              <button
                onClick={handleClickNext}
                className="w-full h-[35px] border border-transparent rounded-[4px] bg-[#F5722E] text-[16px] font-[500] text-[#F5F5F7] text-center z-50"
              >
                Next
              </button>
              <button
                onClick={handleClickPrevious}
                className="w-full h-[25px] flex items-center justify-center gap-4 z-50"
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

export default HeroYearsOfExperienceJobHunter;

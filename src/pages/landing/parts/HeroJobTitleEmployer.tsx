import { useState } from "react";
import styles from "./../landing.module.scss";
import Video from "./Video";
import * as Yup from "yup";
import { useLanding } from "../useLanding";

import video2 from "assets/mp4/video-conference-call-1.mp4";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import { HERO_STATES } from "store/hero/hero.types";

const HeroJobTitleEmployer = () => {
  const { heroState, handleSetHeroState, handleSetSkills } = useLanding();
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

  const handleClickNext = async () => {
    const isValid = await validateJobTitle();
    if (isValid) {
      setError("");
      setRememberedJobTitle(jobTitle);
      handleSetHeroState(HERO_STATES.SKILLSETS_EMPLOYER);
    }
  };

  const handleClickPrevious = () => {
    handleSetSkills([]);
    setRememberedJobTitle("");
    setError("");
    handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    if (error) setError("");
  };

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
        <div className="w-full max-w-[380px] mt-12 flex flex-col gap-8">
          <div className="w-full font-[600] text-[26px] sm:text-[36px] text-[#F5722E]">
            Ready to create your first job listing? Let's begin!
          </div>
          <div className="w-full flex flex-col gap-4">
            <input
              className="w-full h-[36px] rounded-[4px] border-[2px] border-[#AEADAD] text-[14px] font-normal text-[#F5F5F7] bg-transparent px-4"
              placeholder="Please type a Job Title"
              type="text"
              value={jobTitle}
              onChange={handleInputChange}
            />
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

export default HeroJobTitleEmployer;

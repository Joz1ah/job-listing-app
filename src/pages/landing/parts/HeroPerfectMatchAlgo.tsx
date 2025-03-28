import { useCallback, useEffect, useState } from "react";
import Video from "./Video";
import { useLanding } from "../useLanding";
import video1 from "assets/mp4/Landing-Page-hero-1.mp4";
import { HERO_STATES } from "store/hero/hero.types";
import { UserType } from "store/user/user.types";

const HeroPerfectMatchAlgo = () => {
  const { handleSetHeroState, handleSetCredentials, heroState, dataStates } =
    useLanding();
  const [fadeIn, setFadeIn] = useState(false);

  // Handle fade-in effect when component is visible
  useEffect(() => {
    if (heroState === HERO_STATES.PERFECT_MATCH_ALGO) {
      // Small delay to ensure the transition happens after component is rendered
      const timer = setTimeout(() => {
        setFadeIn(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setFadeIn(false);
    }
  }, [heroState]);

  const handleClick = useCallback(
    (type: UserType) => {
      // Start fade out before changing state
      setFadeIn(false);

      // Delay the state change to allow the fade-out animation to complete
      setTimeout(() => {
        const state =
          type === UserType.EMPLOYER
            ? HERO_STATES.JOB_TITLE_EMPLOYER
            : HERO_STATES.SKILLSETS_JOBHUNTER;

        handleSetHeroState(state);
        handleSetCredentials({
          ...dataStates,
          selectedUserType: type,
        });
      }, 300); // Match this with the CSS transition duration
    },
    [dataStates, handleSetHeroState, handleSetCredentials],
  );

  if (heroState !== HERO_STATES.PERFECT_MATCH_ALGO) {
    return null;
  }

  return (
    <div
      id="step1"
      className={`relative w-full h-screen overflow-hidden transition-opacity duration-500 ease-in-out ${
        fadeIn ? "opacity-100" : "opacity-0"
      }`}
    >
      <Video
        src={video1}
        className={`absolute top-0 left-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out ${
          fadeIn ? "scale-100" : "scale-105"
        }`}
      />
      <div className="absolute top-0 left-0 w-full h-full p-4 bg-[rgba(220,138,96,0.49)] transition-all duration-500">
        <div
          className={`text-center text-4xl font-semibold text-white mt-36 transition-all duration-700 delay-100 ${
            fadeIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          Let our Perfect Match Algo do the work
        </div>
        <div
          className={`text-center text-xl text-gray-700 mt-8 transition-all duration-700 delay-200 ${
            fadeIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          What best describes you?
        </div>
        <div
          className={`flex justify-center mt-14 gap-8 transition-all duration-700 delay-300 ${
            fadeIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <button
            onClick={() => handleClick(UserType.JOB_HUNTER)}
            className="bg-[#F5F5F7] w-[258px] h-[70px] border-[3px] rounded-[4px] px-[6px] py-[8px] border-[#F5722E] text-[#F5722E] text-[16px] md:text-[20px] font-[600] z-10 transition-all duration-300 hover:bg-[#F5722E] hover:text-white"
          >
            Job Hunter
          </button>
          <button
            onClick={() => handleClick(UserType.EMPLOYER)}
            className="bg-[#F5F5F7] w-[258px] h-[70px] border-[3px] rounded-[4px] px-[6px] py-[8px] border-[#F5722E] text-[#F5722E] text-[16px] md:text-[20px] font-[600] z-10 transition-all duration-300 hover:bg-[#F5722E] hover:text-white"
          >
            Employer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroPerfectMatchAlgo;

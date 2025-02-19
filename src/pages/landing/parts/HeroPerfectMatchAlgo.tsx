import { useCallback } from "react";
import Video from "./Video";
import { useLanding } from "../useLanding";
import video1 from "assets/mp4/Landing-Page-hero-1.mp4";
import { HERO_STATES } from "store/hero/hero.types";
import { UserType } from "store/user/user.types";

const HeroPerfectMatchAlgo = () => {
  const { handleSetHeroState, handleSetCredentials, heroState, dataStates } =
    useLanding();

  const handleClick = useCallback(
    (type: UserType) => {
      const state =
        type === UserType.EMPLOYER
          ? HERO_STATES.JOB_TITLE_EMPLOYER
          : HERO_STATES.SKILLSETS_JOBHUNTER;

      handleSetHeroState(state);
      handleSetCredentials({
        ...dataStates,
        selectedUserType: type,
      });
    },
    [dataStates],
  );

  return (
    <div
      id="step1"
      className={`relative w-full h-screen overflow-hidden ${heroState !== HERO_STATES.PERFECT_MATCH_ALGO ? "hidden" : ""}`}
    >
      <Video
        src={video1}
        // className="absolute top-1/2 left-1/2 w-full h-auto min-h-full min-w-full transform -translate-x-1/2 -translate-y-1/2 scale-125 object-cover"
        className="absolute top-0 left-0 w-full h-full object-cover object-top"
      />
      <div className="absolute top-0 left-0 w-full h-full p-4 bg-[rgba(220,138,96,0.49)]">
        <div className="text-center text-4xl font-semibold text-white mt-36">
          Let our Perfect Match Algo do the work
        </div>
        <div className="text-center text-xl text-gray-700 mt-8">
          What best describes you?
        </div>
        <div className="flex justify-center mt-14 gap-8">
          <button
            onClick={() => handleClick(UserType.JOB_HUNTER)}
            className="bg-[#F5F5F7] w-[258px] h-[70px] border-[3px] rounded-[4px] px-[6px] py-[8px] border-[#F5722E] text-[#F5722E] text-[20px] font-[600] z-10"
          >
            Job Hunter
          </button>
          <button
            onClick={() => handleClick(UserType.EMPLOYER)}
            className="bg-[#F5F5F7] w-[258px] h-[70px]  border-[3px] rounded-[4px] px-[6px] py-[8px] border-[#F5722E] text-[#F5722E] text-[20px] font-[600] z-10"
          >
            Employer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroPerfectMatchAlgo;

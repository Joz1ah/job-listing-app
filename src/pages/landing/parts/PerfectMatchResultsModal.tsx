import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import {
  employerMatches,
  jobMatches,
} from "mockData/hero-carousel-perfectmatch-data";
import { MockAppCard } from "features/employer";
import { MockJobCard } from "features/job-hunter";
import { Carousel, CarouselContent, CarouselItem, Button } from "components";
import type {
  EmployerMatch,
  JobMatch,
} from "mockData/hero-carousel-perfectmatch-data";
import EmptyState from "./EmptyState";

import sparkle_icon from "assets/sparkle-icon.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { HERO_STATES } from "store/hero/hero.types";

const PerfectMatchResultsModal = () => {
  const { handleSetSelectedModalHeader, toggleModal } = useModal();
  const { dataStates, handleSetModalState, handleSetHeroState, modalState } =
    useLanding();
  const selectedUserType = dataStates.selectedUserType;
  const matchData =
    selectedUserType === "employer" ? employerMatches : jobMatches;
  const hasMatches = matchData && matchData.length > 0;

  const handleSignup = () => {
    // First, update the modal state to show signup step 2
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
    handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
    handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);

    // Then open the modal with the updated state
    toggleModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      hidden={modalState !== MODAL_STATES.PERFECT_MATCH_RESULTS}
    >
      <div className="relative bg-[#F5F5F7] rounded-lg w-[800px] h-[550px] max-w-[90vw] px-4 py-8">
        <div className="flex flex-col items-center gap-12 pt-4">
          <h2 className="text-[#F5722E] text-2xl font-medium flex flex-row">
            Here's Your
            <img
              src={sparkle_icon}
              className="w-5 h-5 ml-2 mt-1"
              alt="sparkle"
            />
            Perfect Match
          </h2>

          {hasMatches ? (
            <Carousel
              opts={{
                align: "center",
                loop: false,
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {matchData.map((match, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-[55%] basis-[100%] transition-opacity"
                  >
                    {selectedUserType === "employer" ? (
                      <MockAppCard match={match as EmployerMatch} />
                    ) : (
                      <MockJobCard match={match as JobMatch} />
                    )}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          ) : (
            <EmptyState />
          )}

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-2 w-full max-w-[300px]">
            <Button
              className="w-full bg-[#F5722E] h-8 text-white py-3 rounded hover:bg-[#F5722E]/90 transition-colors"
              onClick={handleSignup}
            >
              Sign up now
            </Button>
            <button
              onClick={handleSignup}
              className="text-center text-[10px] text-[#AEADAD] hover:text-gray-500 transition-colors cursor-pointer"
            >
              or continue with free trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectMatchResultsModal;

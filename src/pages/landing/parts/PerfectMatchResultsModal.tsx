import { useEffect, useState } from "react";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import { HeroAppCard } from "features/employer";
import { HeroJobCard } from "features/job-hunter";
import { Carousel, CarouselContent, CarouselItem, Button } from "components";
import EmptyState from "./EmptyState";
import {
  useGetHeroEmployerMatchMutation,
  useGetHeroJobHunterMatchMutation,
} from "api/akaza/akazaAPI";

import {
  EmployerMatch,
  JobMatch,
} from "mockData/hero-carousel-perfectmatch-data";

import sparkle_icon from "assets/sparkle-icon.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { HERO_STATES } from "store/hero/hero.types";

// Define typing for the API response items
interface EmployerMatchApiItem {
  jobHunterId: number;
  firstName: string;
  lastName: string;
  country: string;
  experience: string;
  salaryRange: string;
  location: string;
  language: string;
  education: string;
  birthday: string;
  employmentType: string;
  createdAt: string;
  matchingKeywords: Array<{
    keywordId: number;
    keyword: string;
    type: string;
  }>;
  matchScore: number;
  matchCount: number;
}

interface JobMatchApiItem {
  jobId: number;
  jobTitle: string;
  employer: string;
  country: string;
  yearsOfExperience: string;
  employmentType: string;
  salaryRange: string;
  createdAt: string;
  matchingKeywords: Array<{
    keywordId: number;
    keyword: string;
    type: string;
  }>;
  matchScore: number;
  matchCount: number;
}

const PerfectMatchResultsModal = () => {
  const { handleSetSelectedModalHeader, toggleModal } = useModal();
  const {
    dataStates,
    handleSetModalState,
    handleSetHeroState,
    modalState,
    selectedSkillIds,
    selectedExperience,
  } = useLanding();

  const [matchData, setMatchData] = useState<
    Array<EmployerMatchApiItem | JobMatchApiItem>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedUserType = dataStates.selectedUserType;
  const hasMatches = matchData && matchData.length > 0;

  // Get experience from URL search params if it's not in Redux state
  const getExperienceParam = () => {
    // Default to empty string if not available
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("experience") || "";
    }
    return "";
  };

  // Get the appropriate mutation hook based on the user type
  const [getHeroEmployerMatch] = useGetHeroEmployerMatchMutation();
  const [getHeroJobHunterMatch] = useGetHeroJobHunterMatchMutation();

  useEffect(() => {
    // Only fetch when modal is visible
    if (modalState !== MODAL_STATES.PERFECT_MATCH_RESULTS) return;

    const fetchMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get experience from Redux or URL params as fallback
        const experienceValue = selectedExperience || getExperienceParam();

        // Ensure we have skill IDs to send
        if (!selectedSkillIds || selectedSkillIds.length === 0) {
          console.warn("No skill IDs available for matching");
          setError("Please select skills before finding matches.");
          setLoading(false);
          return;
        }

        // Log the API call data for debugging
        console.log("Making API call with:", {
          skillIds: selectedSkillIds,
          experience: experienceValue,
        });

        // Prepare payload with skill IDs from Redux
        const payload = {
          keywords: selectedSkillIds,
          yearsOfExperience: experienceValue,
        };

        let response;
        if (selectedUserType === "employer") {
          response = await getHeroEmployerMatch(payload).unwrap();
        } else {
          response = await getHeroJobHunterMatch(payload).unwrap();
        }

        // Check if response has data
        if (response && response.data) {
          setMatchData(response.data);
        } else {
          setMatchData([]);
        }
      } catch (err) {
        console.error("Error fetching matches:", err);
        setError("Failed to load matches. Please try again.");
        setMatchData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [
    modalState,
    selectedUserType,
    getHeroEmployerMatch,
    getHeroJobHunterMatch,
    selectedSkillIds,
    selectedExperience,
  ]);

  const handleSignup = () => {
    // First, update the modal state to show signup step 2
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
    handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
    handleSetHeroState(HERO_STATES.PERFECT_MATCH_ALGO);

    // Then open the modal with the updated state
    toggleModal(true);
  };

  // Define a utility function to map employment types
  const mapEmploymentType = (
    type: string,
  ): ("Full Time" | "Part Time" | "Contract only")[] => {
    const parts = type.split(",").map((t) => t.trim().toLowerCase());
    const result: ("Full Time" | "Part Time" | "Contract only")[] = [];

    if (parts.includes("full-time")) result.push("Full Time");
    if (parts.includes("part-time")) result.push("Part Time");
    if (parts.includes("contract")) result.push("Contract only");

    // Default if none match
    if (result.length === 0) result.push("Full Time");

    return result;
  };

  // Create proper employer match objects from API data
  const transformedEmployerMatches = matchData.map((item) => {
    const apiItem = item as EmployerMatchApiItem; // Type assertion

    // Create a proper EmployerMatch object that matches the expected type
    const match: EmployerMatch = {
      id: apiItem.jobHunterId,
      firstName: apiItem.firstName || "Candidate",
      lastName: apiItem.lastName || "",
      country: apiItem.country || "Unknown",
      coreSkills: apiItem.matchingKeywords?.map((kw) => kw.keyword) || [],
      experience: apiItem.experience || "Not specified",
      lookingFor: mapEmploymentType(apiItem.employmentType || ""),
      salaryExpectation: apiItem.salaryRange || "Not specified",
      language: apiItem.language?.split(",") || ["Not specified"],
      isNew:
        new Date(apiItem.createdAt) >
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      posted: apiItem.createdAt || "",
    };

    return match;
  });

  // Create proper job match objects from API data
  const transformedJobMatches = matchData.map((item, index) => {
    const apiItem = item as JobMatchApiItem; // Type assertion

    // Create a proper JobMatch object that matches the expected type
    const match: JobMatch = {
      employerId: apiItem.jobId || index + 1,
      position: apiItem.jobTitle || "Job Position",
      company: apiItem.employer || "Company",
      country: apiItem.country || "Unknown",
      coreSkills: apiItem.matchingKeywords?.map((kw) => kw.keyword) || [],
      experience: apiItem.yearsOfExperience || "Not specified",
      lookingFor: mapEmploymentType(apiItem.employmentType || ""),
      salaryExpectation: apiItem.salaryRange || "Not specified",
      isNew:
        new Date(apiItem.createdAt) >
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      posted: apiItem.createdAt || "",
    };

    return match;
  });

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      hidden={modalState !== MODAL_STATES.PERFECT_MATCH_RESULTS}
    >
      <div className="relative bg-[#F5F5F7] rounded-lg w-[800px] h-auto md:h-[550px] max-w-[90vw] px-4 py-8">
        <div className="flex flex-col items-center gap-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              {/* Use a div with spinner styling instead of the Spinner component */}
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5722E]"></div>
              <p className="mt-4 text-gray-600">
                Finding your perfect matches...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-[300px]">
              <p className="text-red-500">{error}</p>
              <Button
                className="mt-4 bg-[#F5722E] text-white py-2 px-4 rounded hover:bg-[#F5722E]/90 transition-colors"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {hasMatches ? (
                <h2 className="text-[#F5722E] text-2xl font-medium flex flex-row flex-wrap items-center justify-center gap-1 text-center px-2">
                  <span>Here's Your</span>
                  <div className="flex items-center">
                    <img
                      src={sparkle_icon}
                      className="w-5 h-5 mr-1"
                      alt="sparkle"
                    />
                    <span>Perfect Match</span>
                  </div>
                </h2>
              ) : (
                <div className="h-[32px]" />
              )}

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
                    {selectedUserType === "employer"
                      ? transformedEmployerMatches.map((match, index) => (
                          <CarouselItem
                            key={index}
                            className="md:basis-[55%] basis-[100%] transition-opacity"
                          >
                            <HeroAppCard match={match} />
                          </CarouselItem>
                        ))
                      : transformedJobMatches.map((match, index) => (
                          <CarouselItem
                            key={index}
                            className="md:basis-[55%] basis-[100%] transition-opacity"
                          >
                            <HeroJobCard match={match} />
                          </CarouselItem>
                        ))}
                  </CarouselContent>
                </Carousel>
              ) : (
                <EmptyState />
              )}
            </>
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
              or continue with FREEMIUM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfectMatchResultsModal;

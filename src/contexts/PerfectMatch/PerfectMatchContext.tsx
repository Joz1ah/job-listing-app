import React, { createContext, useContext, useState, useEffect } from "react";
import { useEmployerPaidQuery, useJobHunterPaidQuery } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import {
  Match,
  MatchJH,
  PerfectMatchState,
  PerfectMatchContextType,
  PerfectMatchProviderProps,
} from "./types";
import { isNew, timeAgo } from "utils/dateTimeUtils";
const PerfectMatchContext = createContext<PerfectMatchContextType | undefined>(
  undefined,
);

const mapPerfectMatchData = (apiResponse: any): Match[] => {
  if (!apiResponse || !apiResponse.data) return [];
  return apiResponse.data.map((item: any) => ({
    id: item?.jobHunter?.jobHunterId ?? 0, // Fix itemId -> jobHunterId, default to 0 if undefined
    jobId: item?.jobId ?? 0, // Fix itemId -> jobHunterId, default to 0 if undefined
    firstName: item?.jobHunter?.firstName ?? "Unknown", // Ensure first name exists
    lastName: item?.jobHunter?.lastName ?? "Unknown", // Ensure last name exists
    phoneNumber: null, // No phone number in API response
    birthday: item?.jobHunter?.birthday ?? "", // Default to empty string if undefined
    location: item?.jobHunter?.location ?? "Unknown", // Ensure location exists
    country: item.jobHunter?.country ?? "Unknown",
    position: item?.jobTitle, // No position in API response
    education: item?.jobHunter?.education ?? "", // Default to empty string if undefined
    coreSkills: item?.jobHunter?.matchingKeywords
      ? item.jobHunter.matchingKeywords
          .filter((keyword: any) => keyword.type === "core")
          .map((keyword: any) => keyword.keyword)
      : [], // Default to empty array if undefined
    posted: timeAgo(new Date(item?.jobHunter?.createdAt)) ?? '',
    experience: item?.jobHunter?.experience ?? "", // Default to empty string if undefined
    lookingFor: item?.jobHunter?.employmentType
      ? item.jobHunter.employmentType.split(",")
      : [], // Default to empty array if undefined
    salaryExpectation: item?.jobHunter?.salaryRange ?? "", // Default to empty string if undefined
    language: item?.jobHunter?.language
      ? item.jobHunter.language.split(",")
      : [], // Default to empty array if undefined
    interpersonalSkills: item?.jobHunter?.matchingKeywords
      ? item.jobHunter.matchingKeywords
          .filter((keyword: any) => keyword.type === "interpersonal")
          .map((keyword: any) => keyword.keyword)
      : [], // Default to empty array if undefined
    certificates: [], // No certificates in API response
    isNew: isNew(item?.jobDetails?.createdAt) ?? false, // Assuming all are new
    // Add score for debugging
    score: item?.score || 0,
  }));
};

const mapPerfectMatchDataJH = (apiResponse: any): MatchJH[] => {
  if (!apiResponse || !apiResponse.data) return [];
  console.log(apiResponse)
  return apiResponse.data.map((item: any) => ({
    employerId: item?.jobHunterId ?? 0,
    position: item?.jobDetails?.jobTitle ?? '',
    company: item?.jobDetails?.employerName ?? '',
    location: item?.jobDetails?.location ?? '',
    coreSkills: item?.jobDetails?.jobKeywords
    ? item.jobDetails.jobKeywords
        .filter((keyword: any) => keyword.type === "core")
        .map((keyword: any) => keyword.keyword)
    : [], // Default to empty array if undefined,
    posted: timeAgo(new Date(item?.jobDetails?.createdAt)) ?? '',
    experience: item?.jobDetails?.yearsOfExperience ?? '',
    description: item?.jobDetails?.description ?? '',
    lookingFor: item?.jobDetails?.employmentType
    ? item.jobDetails.employmentType.split(",")
    : [], // Default to empty array if undefined,
    salaryExpectation: item?.jobDetails?.salaryRange ?? "",
    language: item?.jobDetails?.language
    ? item.jobDetails.language.split(",")
    : [], // Default to empty array if undefined,
    interpersonalSkills: item?.jobDetails?.jobKeywords
    ? item.jobDetails.jobKeywords
        .filter((keyword: any) => keyword.type === "interpersonal")
        .map((keyword: any) => keyword.keyword)
    : [], // Default to empty array if undefined,,
    certificates: [],
    isNew: isNew(item?.jobDetails?.createdAt) ?? false, // Assuming all are new
  }));

};
const PerfectMatchProvider: React.FC<PerfectMatchProviderProps> = ({
  children,
}) => {
  const {user} = useAuth();
  const userType = user?.data?.user?.type;
  const [jobList, setJobList] = useState<any>({});
  const [matchState, setMatchState] = useState<PerfectMatchState>({
    selectedJobId: null,
    scoreFilter: null,
    page: 1,
    hasMore: true,
  });

  // Store perfect matches and other applications separately
  const [perfectMatches, setPerfectMatches] = useState<Match[]>([]);
  const [otherApplications, setOtherApplications] = useState<Match[]>([]);
  const [perfectMatchesJH, setPerfectMatchesJH] = useState<MatchJH[]>([]);
  const [otherMatchesJH, setOtherMatchesJH] = useState<MatchJH[]>([]);

  // Added state to track when job selection is changing and we're waiting for matches
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);

  // Keep track of the active tab to fetch the correct data
  const [activeTab, setActiveTab] = useState<"above60" | "below60">("above60");

  const updateMatchState = (updates: Partial<PerfectMatchState>) => {
    // If selectedJobId is changing, we're loading new matches
    if (
      "selectedJobId" in updates &&
      updates.selectedJobId !== matchState.selectedJobId
    ) {
      setIsLoadingMatches(true);
    }

    // Update the active tab if scoreFilter changes
    if (updates.scoreFilter) {
      setActiveTab(updates.scoreFilter as "above60" | "below60");
    }

    setMatchState((prev) => ({ ...prev, ...updates }));
  };

  // Fetch data based on current matchState
  const userQueryFX = userType === 'employer' ? useEmployerPaidQuery : useJobHunterPaidQuery;
  const { data, isLoading, error } = userQueryFX({
    page: matchState.page,
    pageSize: 100,
    matchesByScore: true,
    scoreFilter: matchState.scoreFilter,
    jobId: matchState.selectedJobId,
  });

  // Process the data when it arrives
  useEffect(() => {
    if (!isLoading && !error && data) {
      if(userType === 'employer'){
        const mappedData = mapPerfectMatchData(data);
        // Store data in the appropriate state based on the active tab
        if (matchState.scoreFilter === "above60") {
          setPerfectMatches(mappedData);
        } else if (matchState.scoreFilter === "below60") {
          setOtherApplications(mappedData);
        }
      }else{
        const mappedData = mapPerfectMatchDataJH(data);
        // Store data in the appropriate state based on the active tab
        if (matchState.scoreFilter === "above60") {
          setPerfectMatchesJH(mappedData);
        } else if (matchState.scoreFilter === "below60") {
          setOtherMatchesJH(mappedData);
        }
      }
      // If we were loading matches due to job change, we can stop now
      setIsLoadingMatches(false);
    }
  }, [data, isLoading, error, matchState.scoreFilter]);

  // Update hasMore flag
  useEffect(() => {
    updateMatchState({ hasMore: !!data && data.data && data.data.length > 0 });
  }, [data]);

  const nextPage = () => {
    if (matchState.hasMore) {
      updateMatchState({ page: matchState.page + 1 });
    }
  };

  const prevPage = () => {
    if (matchState.page > 1) {
      updateMatchState({ page: matchState.page - 1 });
    }
  };

  // Get the correct data based on the active tab
  const perfectMatch =
  matchState.scoreFilter === "above60" ? perfectMatches : otherApplications;
  const perfectMatchJH =
    matchState.scoreFilter === "above60" ? perfectMatchesJH : otherMatchesJH;

  return (
    <PerfectMatchContext.Provider
      value={{
        jobList,
        setJobList,
        perfectMatch,
        perfectMatches,
        otherApplications,
        perfectMatchJH,
        perfectMatchesJH,
        otherMatchesJH,
        activeTab,
        data,
        matchState,
        updateMatchState,
        nextPage,
        prevPage,
        isLoadingMatches: isLoading || isLoadingMatches,
      }}
    >
      {children}
    </PerfectMatchContext.Provider>
  );
};

const usePerfectMatchContext = () => {
  const context = useContext(PerfectMatchContext);
  if (!context) {
    throw new Error(
      "usePerfectMatchContext must be used within a PerfectMatchProvider",
    );
  }
  return context;
};

export { PerfectMatchProvider, usePerfectMatchContext, mapPerfectMatchData };

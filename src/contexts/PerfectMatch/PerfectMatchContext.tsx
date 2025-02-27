import React, { createContext, useContext, useState, useEffect } from "react";
import { useEmployerPaidQuery } from "api/akaza/akazaAPI";
import { Match, PerfectMatchState, PerfectMatchContextType, PerfectMatchProviderProps } from "./types";

const PerfectMatchContext = createContext<PerfectMatchContextType | undefined>(undefined);

const mapPerfectMatchData = (apiResponse: any): Match[] => {
  return apiResponse.data.map((item: any) => ({
    id: item?.jobHunter?.jobHunterId ?? 0, // Fix itemId -> jobHunterId, default to 0 if undefined
    firstName: item?.jobHunter?.firstName ?? "Unknown", // Ensure first name exists
    lastName: item?.jobHunter?.lastName ?? "Unknown", // Ensure last name exists
    phoneNumber: null, // No phone number in API response
    birthday: item?.jobHunter?.birthday ?? "", // Default to empty string if undefined
    location: item?.jobHunter?.location ?? "Unknown", // Ensure location exists
    country: item.jobHunter?.country?? "Unknown",
    position: null, // No position in API response
    education: item?.jobHunter?.education ?? "", // Default to empty string if undefined
    coreSkills: item?.jobHunter?.matchingKeywords
      ? item.jobHunter.matchingKeywords
          .filter((keyword: any) => keyword.type === "core")
          .map((keyword: any) => keyword.keyword)
      : [], // Default to empty array if undefined
    posted: item?.posted ? String(item.posted) : "N/A", // Ensure posted is a string
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
    isNew: true, // Assuming all are new
  }));
};


const PerfectMatchProvider: React.FC<PerfectMatchProviderProps> = ({ children }) => {
  const [jobList, setJobList] = useState<any>({});
  const [matchState, setMatchState] = useState<PerfectMatchState>({
    selectedJobId: null,
    scoreFilter: null,
    page: 1,
    hasMore: true,
  });

  const [perfectMatch, setPerfectMatch] = useState<Match[]>([]);

  const updateMatchState = (updates: Partial<PerfectMatchState>) => {
    setMatchState((prev) => ({ ...prev, ...updates }));
  };

  const { data, isLoading, error } = useEmployerPaidQuery({
    page: matchState.page,
    pageSize: 100,
    matchesByScore: true,
    scoreFilter: matchState.scoreFilter,
    jobId: matchState.selectedJobId,
  });

  useEffect(() => {
    if (!isLoading && !error && data) {
      setPerfectMatch(mapPerfectMatchData(data));
    }
  }, [data]);

  useEffect(() => {
    updateMatchState({ hasMore: !!data && data.length > 0 });
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

  return (
    <PerfectMatchContext.Provider value={{ jobList, setJobList, perfectMatch, data, matchState, updateMatchState, nextPage, prevPage }}>
      {children}
    </PerfectMatchContext.Provider>
  );
};

const usePerfectMatchContext = () => {
  const context = useContext(PerfectMatchContext);
  if (!context) {
    throw new Error("usePerfectMatchContext must be used within a PerfectMatchProvider");
  }
  return context;
};

export { PerfectMatchProvider, usePerfectMatchContext, mapPerfectMatchData };

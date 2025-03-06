// Modified PerfectMatchContext.tsx

import React, { createContext, useContext, useState, useEffect } from "react";
import { useEmployerPaidQuery } from "api/akaza/akazaAPI";
import {
  Match,
  PerfectMatchState,
  PerfectMatchContextType,
  PerfectMatchProviderProps,
} from "./types";

const PerfectMatchContext = createContext<PerfectMatchContextType | undefined>(
  undefined,
);

const mapPerfectMatchData = (apiResponse: any): Match[] => {
  if (!apiResponse || !apiResponse.data) return [];

  return apiResponse.data.map((item: any) => ({
    id: item?.jobHunter?.jobHunterId ?? 0,
    firstName: item?.jobHunter?.firstName ?? "Unknown",
    lastName: item?.jobHunter?.lastName ?? "Unknown",
    phoneNumber: null,
    birthday: item?.jobHunter?.birthday ?? "",
    location: item?.jobHunter?.location ?? "Unknown",
    country: item.jobHunter?.country ?? "Unknown",
    position: null,
    education: item?.jobHunter?.education ?? "",
    coreSkills: item?.jobHunter?.matchingKeywords
      ? item.jobHunter.matchingKeywords
          .filter((keyword: any) => keyword.type === "core")
          .map((keyword: any) => keyword.keyword)
      : [],
    posted: item?.jobHunter?.createdAt ?? "N/A",
    experience: item?.jobHunter?.experience ?? "",
    lookingFor: item?.jobHunter?.employmentType
      ? item.jobHunter.employmentType.split(",")
      : [],
    salaryExpectation: item?.jobHunter?.salaryRange ?? "",
    language: item?.jobHunter?.language
      ? item.jobHunter.language.split(",")
      : [],
    interpersonalSkills: item?.jobHunter?.matchingKeywords
      ? item.jobHunter.matchingKeywords
          .filter((keyword: any) => keyword.type === "interpersonal")
          .map((keyword: any) => keyword.keyword)
      : [],
    certificates: [],
    isNew: true,
    // Add score for debugging
    score: item?.score || 0,
  }));
};

const PerfectMatchProvider: React.FC<PerfectMatchProviderProps> = ({
  children,
}) => {
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
  const [isLoadingMatches, setIsLoadingMatches] = useState<boolean>(false);

  // Keep track of the active tab to fetch the correct data
  const [activeTab, setActiveTab] = useState<"above60" | "below60">("above60");

  const updateMatchState = (updates: Partial<PerfectMatchState>) => {
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
  const { data, isLoading, error } = useEmployerPaidQuery({
    page: matchState.page,
    pageSize: 100,
    matchesByScore: true,
    scoreFilter: matchState.scoreFilter,
    jobId: matchState.selectedJobId,
  });

  // Process the data when it arrives
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mappedData = mapPerfectMatchData(data);

      // Store data in the appropriate state based on the active tab
      if (matchState.scoreFilter === "above60") {
        setPerfectMatches(mappedData);
      } else if (matchState.scoreFilter === "below60") {
        setOtherApplications(mappedData);
      }

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

  return (
    <PerfectMatchContext.Provider
      value={{
        jobList,
        setJobList,
        perfectMatch,
        perfectMatches,
        otherApplications,
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

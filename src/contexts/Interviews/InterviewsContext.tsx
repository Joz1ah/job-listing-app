import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useGetInterviewListQuery } from "api/akaza/akazaAPI";
import {
  Interview,
  interviewsListState,
  InterviewsContextType,
  InterviewsProviderProps,
} from "./types";
import { isNew, timeAgo, getDateInTimezone, getTimezoneAbbreviation } from "utils/dateTimeUtils";

const InterviewsContext = createContext<InterviewsContextType | undefined>(
  undefined,
);

interface InterviewListData{
  InterviewsGroup: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'RESCHEDULE' | 'COMPLETED';
  timeZone: string;
  UserType: 'employer' | 'job_hunter';
  UserTypeId: number;
}

const mapInterviewListData = (apiResponse: any, timeZone: InterviewListData['timeZone'], selectedInterviewsGroup: InterviewListData['InterviewsGroup'], UserType: InterviewListData['UserType'], UserTypeId: InterviewListData['UserTypeId'] ): Interview[] => {
  if (!apiResponse || !apiResponse.data) return [];
  if (UserType) 
    return apiResponse?.data?.groupedByStatus?.[selectedInterviewsGroup]?.map((item: any) => ({
      id:item?.id ?? 0,
      position: item?.jobTitle ?? 'N/A',
      candidate: (item?.jobHunter?.firstName && item?.jobHunter?.lastName) 
      ? `${item.jobHunter.firstName} ${item.jobHunter.lastName}` 
      : 'Unknown User',
      company: item?.employer?.businessName ?? 'Unknown Company',
      date: timeZone=='UTC' ? item?.scheduledStartDate : getDateInTimezone(timeZone, item?.scheduledStartDate,undefined,true).format('MMMM DD YYYY') ?? 'N/A',
      time: timeZone === 'UTC'
      ? `${item?.scheduledStartTime} UTC`
      : `${getDateInTimezone(timeZone, item?.scheduledStartDate, item?.scheduledStartTime, true).format('h:mm A')} ${getTimezoneAbbreviation(timeZone) ?? 'N/A'}`,
      location: item?.jobHunter?.location ?? 'N/A',
      country: UserType=='employer' ? item?.jobHunter?.country ?? 'N/A' : item?.employer?.country ?? 'N/A',
      meetingLink: item?.meetingLink ?? 'via Google Meet',
      receivedTime: timeAgo(new Date(item?.createdAt)) ?? 'N/A',
      sentTime: item?.scheduledStartTime ?? 'N/A',
      isNew: isNew(item?.createdAt ?? "") || false,
      rating: 0,
      rated: false,
      feedback: 'N/A',
      reason: item?.declineReason ?? 'N/A',
      status: item?.status ?? 'Unknown',
      requestor: item?.requestor ?? 'N/A',
      isRequesterMe: UserTypeId === item?.requestorId ? true : false,
      hasRescheduled: false,
      bookmarked: false,
      description: item?.jobDescription ?? 'N/A',
      coreSkills: item?.jobHunter?.JobHunterSkill
      ? item.jobHunter.JobHunterSkill
          .filter((skill: any) => skill.keyword.type === "core")
          .map((skill: any) => skill.keyword.keyword)
      : [],
      experience: item?.jobHunter?.yearsOfExperience ?? 'N/A',
      employmentPreference: item?.jobHunter?.employmentType
      ? item.jobHunter.employmentType.split(",")
      : [], // Default to empty array if undefined,
      salaryExpectation: item?.jobHunter?.salaryRange,
      languages: item?.jobHunter?.language
      ? item.jobHunter.language.split(",")
      : [],
      education: item?.jobHunter?.education ?? "N/A", // Default to empty string if undefined
      certificate: item?.jobHunter?.certificates ?? "N/A", // Default to empty string if undefined
      interpersonalSkills: item?.jobHunter?.JobHunterSkill
      ? item.jobHunter.JobHunterSkill
          .filter((skill: any) => skill.keyword.type === "interpersonal")
          .map((skill: any) => skill.keyword.keyword)
      : [],
    })) ?? [];
  else
    return []

  /*
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
    posted: item?.jobHunter?.createdAt ?? "N/A",
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
    // Add score for debugging
    score: item?.score || 0,
  }));*/
};

const InterviewsProvider: React.FC<InterviewsProviderProps> = ({
  children,
}) => {
  const [selectedInterviewsGroup, setSelectedInterviewsGroup] = useState<'PENDING' | 'ACCEPTED' | 'DECLINED' | 'RESCHEDULE' | 'COMPLETED'>('PENDING')
  const [interviewsList, setInterviewsList] = useState<Interview[]>([]);
  const [interviewsListState, setInterviewsListState] = useState<interviewsListState>({
    page: 1,
    hasMore: true,
  });
  const {user,userSettings} = useAuth();
  const { data, isLoading, error } = useGetInterviewListQuery({
    page: interviewsListState.page,
    limit: 100,
  });

  // Process the data when it arrives
  useEffect(() => {
    if (!isLoading && !error && data) {
      const mappedData = mapInterviewListData(
        data,
        userSettings?.data.timeZone,
        selectedInterviewsGroup,
        user?.data?.user?.type,
        user?.data?.user?.relatedDetails?.id
      );
      setInterviewsList(mappedData);
      //setIsLoadingInterviewList(false);
    }
  }, [data, isLoading, error, selectedInterviewsGroup]);

  const nextPage = () => {
    if (interviewsListState.hasMore) {
      setInterviewsListState({ ...interviewsListState, page: interviewsListState.page + 1 });
    }
  };

  const prevPage = () => {
    if (interviewsListState.page > 1) {
      setInterviewsListState({ ...interviewsListState,  page: interviewsListState.page - 1 });
    }
  };

  return (
    <InterviewsContext.Provider
      value={{
        data,
        selectedInterviewsGroup,
        interviewsList,
        interviewsListState,
        isLoadingInterviews: isLoading,
        setInterviewsListState,
        setSelectedInterviewsGroup,
        nextPage,
        prevPage
      }}
    >
      {children}
    </InterviewsContext.Provider>
  );
};

const useInterviewsContext = () => {
  const context = useContext(InterviewsContext);
  if (!context) {
    throw new Error(
      "useInterviewsContext must be used within a InterviewsProvider",
    );
  }
  return context;
};

export { InterviewsProvider, useInterviewsContext, mapInterviewListData };

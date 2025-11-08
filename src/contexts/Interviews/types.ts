export interface FormerEmployer {
  id?: number;
  name: string;
  jobTitle: string;
  duration?: string;
}

export interface Interview {
    id?:string;
    position: string;
    candidate?: string;
    company?: string;
    date: string;
    time: string;
    location: string;
    country?:string;
    meetingLink?: string;
    receivedTime: string;
    sentTime?:string;
    isNew?: boolean;
    rating?: number;
    rated?: boolean;
    feedback?: string;
    reason?: string;
    status?: 'Accepted' | 'Pending' | 'Declined';
    requestor?: string;
    isRequesterMe?: boolean;
    isRescheduleRequesterMe?: boolean;
    hasRescheduled?: boolean;
    bookmarked?: boolean;
    description?: string;
    coreSkills?: string[];
    experience?: string;
    employmentPreference?: string[];
    salaryExpectation?: string;
    languages?: string[];
    education?: string;
    certificate?: string;
    interpersonalSkills?: string[];
    linkedIn?: string;
    formerEmployers?: FormerEmployer[];
    freeTrial?: boolean;
  }
  
  export interface interviewsListState {
    page: number;
    hasMore: boolean;
  }
  
  export interface InterviewsContextType {
    interviewsList: any;
    data: any;
    interviewsListState: interviewsListState;
    selectedInterviewsGroup: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'RESCHEDULE' | 'COMPLETED';
    setSelectedInterviewsGroup: React.Dispatch<React.SetStateAction<any>>;
    setInterviewsListState: React.Dispatch<React.SetStateAction<any>>;
    nextPage: () => void;
    prevPage: () => void;
    isLoadingInterviews: boolean;
    refetchInterviews: () => void;
  }
  
  export interface InterviewsProviderProps {
    children: React.ReactNode;
  }
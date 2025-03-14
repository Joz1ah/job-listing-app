export interface Interview {
    id?:string;
    position: string;
    candidate?: string;
    company?: string;
    date: string;
    time: string;
    location: string;
    meetingLink?: string;
    receivedTime: string;
    sentTime?:string;
    isNew?: boolean;
    rating?: number;
    rated?: boolean;
    feedback?: string;
    reason?: string;
    status?: 'Accepted' | 'Pending' | 'Declined';
    isRequesterMe?: boolean;
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
  }
  
  export interface InterviewsProviderProps {
    children: React.ReactNode;
  }
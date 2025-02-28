export interface Match {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber?: number;
    birthday: string;
    location?: string;
    country?: string;
    position: string;
    education: string;
    coreSkills: string[];
    posted?: string;
    experience: string;
    lookingFor: string[];
    salaryExpectation: string;
    language: string[];
    interpersonalSkills: string[];
    certificates?: string[];
    isNew?: boolean;
  }
  
  export interface PerfectMatchState {
    selectedJobId: number | null;
    scoreFilter: "above60" | "below60" | null;
    page: number;
    hasMore: boolean;
  }
  
  export interface PerfectMatchContextType {
    data: any,
    jobList: any, 
    setJobList: React.Dispatch<React.SetStateAction<any[]>>
    perfectMatch: Match[];
    matchState: PerfectMatchState;
    updateMatchState: (updates: Partial<PerfectMatchState>) => void;
    nextPage: () => void;
    prevPage: () => void;
  }
  
  export interface PerfectMatchProviderProps {
    children: React.ReactNode;
  }
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
  score?: number;
}

export interface PerfectMatchState {
  selectedJobId: number | null;
  scoreFilter: "above60" | "below60" | null;
  page: number;
  hasMore: boolean;
}

export interface PerfectMatchContextType {
  jobList: any;
  setJobList: React.Dispatch<React.SetStateAction<any>>;
  perfectMatch: Match[];
  perfectMatches: Match[]; // Added to store high-score matches separately
  otherApplications: Match[]; // Added to store low-score matches separately
  activeTab: 'above60' | 'below60'; // Added to track active tab
  data: any;
  matchState: PerfectMatchState;
  updateMatchState: (updates: Partial<PerfectMatchState>) => void;
  nextPage: () => void;
  prevPage: () => void;
  isLoadingMatches: boolean;
}

export interface PerfectMatchProviderProps {
  children: React.ReactNode;
}

export interface Interview {
  id?:string;
  position: string;
  company: string;
  date: string;
  time: string;
  location: string;
  meetingLink?: string;
  receivedTime: string;
  sentTime?:string;
  isNew?: boolean;
  rating?: number;
  reason?: string;
  status?: 'pending';
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

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  interview: Interview;
}

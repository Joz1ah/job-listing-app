export interface ExistingMeeting {
  position: string;
  companyName: string;
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
  };
}

export interface Interview {
    id?:string;
    position: string;
    candidate: string;
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
    existingMeetings?: ExistingMeeting[];
  }
  
  export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    interview: Interview;
  }
  
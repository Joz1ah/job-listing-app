
export interface Interview {
    id?:string;
    position: string;
    name: string;
    date: string;
    time: string;
    location: string;
    meetingLink: string;
    receivedTime: string;
    isNew?: boolean;
    bookmarked?: boolean;
    description?: string;
  }
  
  export interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    interview: Interview;
  }
  
  export interface AcceptData {
    confirmed: boolean;
    interviewId?: string;
  }
  
  export interface DeclineData {
    reason: string;
    message: string;
    interviewId?: string;
  }
  
  export interface RescheduleData {
    date: string;
    time: string;
    interviewId?: string;
  }
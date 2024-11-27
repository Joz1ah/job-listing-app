import { FC } from "react";
import { AcceptedCard } from "features";

interface Interview {
  position: string;
  company: string;
  date: string;
  time: string;
  location: string;
  meetingLink: string;
  receivedTime: string;
  isNew?: boolean;
}

// Mock Data - 3 specific examples
const mockInterviews: Interview[] = [
  {
    position: "Senior Frontend Engineer",
    company: "Google",
    location: "Mountain View, CA",
    date: "December 22, 2024",
    time: "10:00 AM PST",
    meetingLink: "meet.google.com/abc-defg-hij",
    receivedTime: "2 hours ago",
    isNew: true
  },
  {
    position: "Full Stack Developer",
    company: "Meta",
    location: "Remote",
    date: "December 25, 2024",
    time: "1:00 PM PST",
    meetingLink: "meet.google.com/uvw-xyzq-rst",
    receivedTime: "yesterday",
    isNew: false
  },
  {
    position: "Software Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    date: "December 28, 2024",
    time: "11:30 AM PST",
    meetingLink: "meet.google.com/jkl-mnop-qrs",
    receivedTime: "3 days ago",
    isNew: false
  }
];

const AcceptedInterviews: FC = () => {
  const handleJoinInterview = (interview: Interview) => {
    window.open(interview.meetingLink, '_blank');
  };

  const handlePreviewJob = (interview: Interview) => {
    console.log('Preview job details for:', interview.position);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {mockInterviews.map((interview, index) => (
          <AcceptedCard
            key={index}
            interview={interview}
            onJoinInterview={() => handleJoinInterview(interview)}
            onPreviewJob={() => handlePreviewJob(interview)}
          />
        ))}
      </div>
    </div>
  );
};

export { AcceptedInterviews };
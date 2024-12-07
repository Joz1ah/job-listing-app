import { FC, useState, useEffect, useRef } from "react";
import { PendingCard } from "features/employer";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "../types";

interface AcceptData {
  confirmed: boolean;
  interviewId?: string;
}

interface DeclineData {
  reason: string;
  message: string;
  interviewId?: string;
}

interface RescheduleData {
  date: string;
  time: string;
  interviewId?: string;
}

// Mock Data
const mockInterviews: Interview[] = [
  {
    position: "Frontend Engineer",
    name: "Olivia Martinez",
    location: "Mountain View, CA",
    date: "December 22, 2024",
    time: "10:00 AM PST",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    receivedTime: "yesterday",
    isNew: true,
    coreSkills: ["React", "TypeScript", "Next.js", "CSS3", "GraphQL"],
    experience: "3-5 years",
    employmentPreference: ["Full Time"],
    salaryExpectation: "$120,000-$150,000",
    languages: ["English", "Spanish"],
    education: "Master's in Computer Science",
    certificate: "AWS Certified Developer",
    interpersonalSkills: [
      "Leadership",
      "Communication",
      "Problem Solving",
      "Team Collaboration",
      "Agile Methodologies",
    ],
  },
  {
    position: "Backend Developer",
    name: "Benjamin Wilson",
    location: "Menlo Park, CA",
    date: "December 25, 2024",
    time: "1:00 PM PST",
    meetingLink: "https://meet.google.com/uvw-xyzq-rst",
    receivedTime: "two days ago",
    isNew: false,
    coreSkills: [
      "Java",
      "Spring Boot",
      "PostgreSQL",
      "Microservices",
      "Docker",
    ],
    experience: "5-7 years",
    employmentPreference: ["Full Time", "Remote"],
    salaryExpectation: "$140,000-$170,000",
    languages: ["English"],
    education: "Bachelor's in Software Engineering",
    certificate: "Oracle Certified Professional Java Developer",
    interpersonalSkills: [
      "System Design",
      "Technical Leadership",
      "Mentoring",
      "Problem Solving",
      "Documentation",
    ],
  },
  {
    position: "Full Stack Developer",
    name: "Isabella Garcia",
    location: "Remote",
    date: "January 5, 2025",
    time: "3:00 PM EST",
    meetingLink: "https://meet.google.com/jkl-mnop-qrs",
    receivedTime: "today",
    isNew: true,
    coreSkills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
    experience: "4-6 years",
    employmentPreference: ["Full Time", "Remote"],
    salaryExpectation: "$130,000-$160,000",
    languages: ["English", "Portuguese"],
    education: "Master's in Web Technologies",
    certificate: "MERN Stack Developer Certification",
    interpersonalSkills: [
      "Full-cycle Development",
      "Project Management",
      "Cross-functional Collaboration",
      "Code Review",
      "Mentoring",
    ],
  },
  {
    position: "UX/UI Designer",
    name: "Ethan Harris",
    location: "San Jose, CA",
    date: "January 10, 2025",
    time: "9:00 AM PST",
    meetingLink: "https://meet.google.com/stu-vwxy-zab",
    receivedTime: "last week",
    isNew: false,
    coreSkills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    experience: "3-5 years",
    employmentPreference: ["Full Time", "Hybrid"],
    salaryExpectation: "$110,000-$140,000",
    languages: ["English", "Mandarin"],
    education: "Bachelor's in Interaction Design",
    certificate: "Google UX Design Professional Certificate",
    interpersonalSkills: [
      "User-Centered Design",
      "Design Thinking",
      "Stakeholder Management",
      "Visual Communication",
      "Design Systems",
    ],
  },
  {
    position: "Data Scientist",
    name: "Ava White",
    location: "Seattle, WA",
    date: "January 15, 2025",
    time: "11:00 AM PST",
    meetingLink: "https://meet.google.com/ghi-klmn-opq",
    receivedTime: "two hours ago",
    isNew: true,
    coreSkills: [
      "Python",
      "Machine Learning",
      "TensorFlow",
      "SQL",
      "Data Visualization",
    ],
    experience: "4-6 years",
    employmentPreference: ["Full Time"],
    salaryExpectation: "$150,000-$180,000",
    languages: ["English", "French"],
    education: "Ph.D. in Data Science",
    certificate: "TensorFlow Developer Certificate",
    interpersonalSkills: [
      "Statistical Analysis",
      "Research",
      "Data Storytelling",
      "Cross-functional Communication",
      "Problem Solving",
    ],
  },
  {
    position: "DevOps Engineer",
    name: "Alexander Walker",
    location: "Redmond, WA",
    date: "January 20, 2025",
    time: "2:00 PM PST",
    meetingLink: "https://meet.google.com/qrs-tuvw-xyz",
    receivedTime: "yesterday",
    isNew: true,
    coreSkills: ["Kubernetes", "AWS", "CI/CD", "Terraform", "Python"],
    experience: "5-7 years",
    employmentPreference: ["Full Time", "Remote"],
    salaryExpectation: "$140,000-$170,000",
    languages: ["English", "German"],
    education: "Bachelor's in Computer Engineering",
    certificate: "Certified Kubernetes Administrator (CKA)",
    interpersonalSkills: [
      "Infrastructure Planning",
      "Security Best Practices",
      "System Architecture",
      "Team Collaboration",
      "Incident Response",
    ],
  },
];

const PendingInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [declineReason, setDeclineReason] = useState<string>("");

  const handleAccept = async (interview: Interview, data: AcceptData) => {
    try {
      console.log("Accept:", interview, data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDisplayedItems((prev) => prev.filter((item) => item !== interview));
    } catch (error) {
      console.error("Error accepting interview:", error);
    }
  };

  const handleDecline = async (interview: Interview, data: DeclineData) => {
    try {
      console.log("Decline:", interview, data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDisplayedItems((prev) => prev.filter((item) => item !== interview));
    } catch (error) {
      console.error("Error declining interview:", error);
    }
  };

  const handleReschedule = async (
    interview: Interview,
    data: RescheduleData,
  ) => {
    try {
      console.log("Reschedule:", interview, data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDisplayedItems((prev) => prev.filter((item) => item !== interview));
    } catch (error) {
      console.error("Error rescheduling interview:", error);
    }
  };

  const handleBookmark = (interview: Interview) => {
    setDisplayedItems((prev) =>
      prev.map((item) =>
        item === interview ? { ...item, bookmarked: !item.bookmarked } : item,
      ),
    );
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentCount = displayedItems.length;
    const remainingItems = mockInterviews.length - currentCount;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(2, remainingItems);
    const newItems = mockInterviews.slice(
      currentCount,
      currentCount + itemsToLoad,
    );
    setDisplayedItems((prev) => [...prev, ...newItems]);

    if (currentCount + itemsToLoad >= mockInterviews.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadInitialItems = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const initialItems = mockInterviews.slice(0, 6);
      setDisplayedItems(initialItems);
      setHasMore(mockInterviews.length > 6);
      setLoading(false);
      setInitialLoad(false);
    };

    loadInitialItems();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore && !initialLoad) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, initialLoad]);

  const showLoadingCards = loading;
  const loadingCardsCount = Math.min(6, mockInterviews.length);

  // Show empty state if there are no pending interviews and we're not loading
  if (!loading && displayedItems.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyInterview} alt="Empty Pending List" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-orange-500">
            No Pending Interviews
          </h2>

          <p className="text-white mb-6">
            You don't have any pending interview requests. Explore your
            <br />
            <span className="text-orange-500 font-medium mx-1">
              PERFECT MATCHES
            </span>
            to connect & fill your job listing seamlessly
            <br />
          </p>

          <NavLink
            to="/employer/feed"
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Go to Feed
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {!initialLoad &&
          displayedItems.map((interview, index) => (
            <PendingCard
              key={`${interview.position}-${interview.name}-${index}`}
              interview={interview}
              onAccept={(data) => handleAccept(interview, data)}
              onDecline={(data) => handleDecline(interview, data)}
              onReschedule={(data) => handleReschedule(interview, data)}
              onBookmark={() => handleBookmark(interview)}
              value={declineReason}
              onValueChange={setDeclineReason}
            />
          ))}

        {showLoadingCards && (
          <>
            {Array.from({ length: loadingCardsCount }).map((_, index) => (
              <InterviewCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

export { PendingInterviews };

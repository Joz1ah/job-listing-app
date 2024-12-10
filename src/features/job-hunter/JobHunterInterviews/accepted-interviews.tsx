import { FC, useState, useEffect, useRef } from "react";
import { AcceptedCard } from "features/job-hunter";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "../types";

const mockInterviews: Interview[] = [
  {
    position: "Senior Frontend Engineer",
    company: "Google",
    location: "Mountain View, CA",
    date: "December 22, 2024",
    time: "10:00 AM PST",
    meetingLink: "meet.google.com/abc-defg-hij",
    receivedTime: "2 hours ago",
    isNew: true,
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
    description: "We are seeking a talented Front-end developer to join our developing team. You will be responsible for translating UI/UX designs into real world applications, maintaining high quality code standards, and collaborating with multi-disciplinary teams to define, design, and ship new features."
  },
  {
    position: "Full Stack Developer",
    company: "Meta",
    location: "Remote",
    date: "December 25, 2024",
    time: "1:00 PM PST",
    meetingLink: "meet.google.com/uvw-xyzq-rst",
    receivedTime: "yesterday",
    isNew: false,
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
    description: "Join our dynamic team as a Full Stack Developer where you'll work on cutting-edge projects combining front-end and back-end development. You'll be involved in the complete software development lifecycle, from concept and design to testing and deployment."
  },
  {
    position: "Software Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    date: "December 28, 2024",
    time: "11:30 AM PST",
    meetingLink: "meet.google.com/jkl-mnop-qrs",
    receivedTime: "3 days ago",
    isNew: false,
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
    description: "We are looking for a Software Engineer to join our infrastructure team. In this role, you'll be responsible for designing and implementing scalable cloud solutions, maintaining our CI/CD pipelines, and ensuring the reliability and security of our systems."
  },
];

const AcceptedInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleJoinInterview = (interview: Interview) => {
    window.open(interview.meetingLink, "_blank");
  };

  const handlePreviewJob = (interview: Interview) => {
    console.log("Preview job details for:", interview.position);
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

  // Show empty state if there are no interviews and we're not loading
  if (!loading && displayedItems.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyInterview} alt="Empty Calendar" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-orange-500">
            No Accepted Interviews
          </h2>

          <p className="text-white mb-6">
            You haven't accepted any interviews yet. Explore your
            <br />
            <span className="text-orange-500 font-medium mx-1">
              PENDING INTERVIEWS
            </span>
            to find and confirm your next interview opportunity.
            <br />
          </p>

          <NavLink
            to="/job-hunter/interviews/pending"
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            View Pending Interviews
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
            <AcceptedCard
              key={index}
              interview={interview}
              onJoinInterview={() => handleJoinInterview(interview)}
              onPreviewJob={() => handlePreviewJob(interview)}
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

export { AcceptedInterviews };

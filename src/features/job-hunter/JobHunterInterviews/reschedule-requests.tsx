import { FC, useState, useEffect, useRef } from "react";
import { RescheduleCard } from "features/job-hunter";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "../types";

// Mock Data
const mockInterviews: Interview[] = [
  {
    position: "Sr. Mobile and Web Developer",
    company: "MAC Technofirm",
    location: "USA",
    date: "December 29, 2024",
    time: "8:00 AM EST",
    receivedTime: "today",
    sentTime: "Today",
    isNew: true,
    status: "pending",
    isRequesterMe: true,
    hasRescheduled: false,
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
    position: "Full Stack Developer",
    company: "Neutic Labs",
    location: "USA",
    date: "January 3, 2025",
    time: "2:00 PM PST",
    receivedTime: "yesterday",
    sentTime: "yesterday",
    isNew: false,
    status: "pending",
    isRequesterMe: true,
    hasRescheduled: true,
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
    position: "Junior Front End Developer",
    company: "TechSphere Solutions",
    location: "India",
    date: "February 1, 2025",
    time: "4:00 PM IST",
    receivedTime: "2 days ago",
    sentTime: "",
    isNew: true,
    status: "pending",
    isRequesterMe: false,
    hasRescheduled: false,
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
    position: "Jr. Web Developer",
    company: "CloudCred Innovations",
    location: "India",
    date: "February 1, 2025",
    time: "2:00 PM IST",
    receivedTime: "2 days ago",
    sentTime: "",
    isNew: false,
    status: "pending",
    isRequesterMe: false,
    hasRescheduled: false,
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
];

const RescheduleRequests: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleAccept = async (interview: Interview) => {
    console.log("Accepted interview:", interview.position);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Remove the accepted interview from the list
    setDisplayedItems((prev) => prev.filter((item) => item !== interview));
  };

  const handleDecline = async (interview: Interview) => {
    console.log("Declined interview:", interview.position);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    // Remove the declined interview from the list
    setDisplayedItems((prev) => prev.filter((item) => item !== interview));
  };

  const handleReschedule = (interview: Interview) => {
    console.log("Reschedule requested for:", interview.position);
    // Update the interview's hasRescheduled status
    setDisplayedItems((prev) =>
      prev.map((item) =>
        item === interview ? { ...item, hasRescheduled: true } : item,
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

  // Show empty state if there are no reschedule requests and we're not loading
  if (!loading && displayedItems.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyInterview} alt="Empty Reschedule List" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-orange-500">
            No Reschedule Requests
          </h2>

          <p className="text-white mb-6">
            You don't have any pending reschedule requests. View your
            <br />
            <span className="text-orange-500 font-medium mx-1">
              PENDING INTERVIEWS
            </span>
            to manage your upcoming appointments.
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
            <RescheduleCard
              key={index}
              interview={interview}
              onAccept={() => handleAccept(interview)}
              onDecline={() => handleDecline(interview)}
              onReschedule={() => handleReschedule(interview)}
            />
          ))}

        {loading && (
          <>
            {Array.from({ length: Math.min(6, mockInterviews.length) }).map(
              (_, index) => (
                <InterviewCardSkeleton key={`skeleton-${index}`} />
              ),
            )}
          </>
        )}
        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

export { RescheduleRequests };

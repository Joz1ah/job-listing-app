import { FC, useState, useEffect, useRef } from "react";
import { DeclinedCard } from "features/job-hunter";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "../types";

const mockInterviews: Interview[] = [
  {
    position: "Sr Mobile and Web Developer",
    company: "Google",
    location: "USA",
    date: "December 20, 2024",
    time: "8:00 AM EST",
    sentTime: "today",
    receivedTime: "today",
    reason: "Not Actively Seeking",
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
  {
    position: "Full Stack Developer",
    company: "Accenture",
    location: "UAE",
    date: "December 23, 2024",
    time: "1:00 PM EST",
    sentTime: "yesterday",
    receivedTime: "yesterday",
    reason: "Schedule Conflict",
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
  },
  {
    position: "Frontend Engineer",
    company: "Goodyear",
    location: "Canada",
    date: "December 26, 2024",
    time: "11:30 AM EST",
    sentTime: "2 days ago",
    receivedTime: "2 days ago",
    reason: "Accepted Another Offer",
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
];

const DeclinedInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

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

  // Show empty state if there are no declined interviews and we're not loading
  if (!loading && displayedItems.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyInterview} alt="Empty Declined List" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-[#F5722E]">
            No Declined Interviews
          </h2>

          <p className="text-white mb-6">
            You don't have any declined interviews. Keep exploring
            <br />
            <span className="text-[#F5722E] font-medium mx-1">
              PERFECT MATCHES
            </span>
            to find your next perfect match.
            <br />
          </p>

          <NavLink
            to="/job-hunter/feed"
            className="bg-[#F5722E] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
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
            <DeclinedCard key={index} interview={interview} />
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

export { DeclinedInterviews };

import { FC, useState, useEffect, useRef } from "react";
import { BookmarkCard } from "features/employer";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyBookmark from "images/bookmark-empty.svg?url";
//import { Match } from "mockData/job-hunter-data";
import { Match } from "contexts/PerfectMatch/types";
import { BookmarkProvider } from "contexts/BookmarkContext";
import { useEmployerContext } from "components";

// You can replace this with your actual mock data
const mockBookmarks: Match[] = [
  /* {
    id: 1,
    firstName: "Olivia",
    lastName: "Davis",
    phoneNumber: 639275454434,
    birthday: "March 15",
    location: "United Kingdom",
    position: "Junior Front End Developer",
    education: "Bachelor's Degree",
    coreSkills: ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
    posted: "1 day",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time", "Contract only"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English"],
    interpersonalSkills: [
      "Team Collaboration",
      "Adaptability",
      "Problem Solving",
    ],
    certificates: ["Certified JavaScript Developer"],
    isNew: true,
  },
  {
    id: 2,
    firstName: "Mason",
    lastName: "Green",
    phoneNumber: 639275454435,
    birthday: "April 22",
    location: "Canada",
    position: "Frontend Engineer",
    education: "Master's Degree",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
    posted: "1 day",
    experience: "3 - 5 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English", "French"],
    interpersonalSkills: [
      "Communication",
      "Time Management",
      "Critical Thinking",
    ],
    certificates: ["AWS Certified Developer", "TypeScript Mastery"],
    isNew: true,
  },
  {
    id: 3,
    firstName: "Ava",
    lastName: "Martinez",
    phoneNumber: 639275454436,
    birthday: "July 8",
    location: "Germany",
    position: "Junior JavaScript Developer",
    education: "Bachelor's Degree",
    coreSkills: ["JavaScript", "React", "Vue.js", "CSS", "HTML"],
    posted: "2 days",
    experience: "1 - 3 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English", "Spanish"],
    interpersonalSkills: ["Creativity", "Empathy", "Conflict Resolution"],
    certificates: ["Certified Vue.js Developer"],
    isNew: false,
  }, */
];

const BookmarkedJobsContent: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { subscriptionPlan } = useEmployerContext();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentCount = displayedItems.length;
    const remainingItems = mockBookmarks.length - currentCount;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(2, remainingItems);
    const newItems = mockBookmarks.slice(
      currentCount,
      currentCount + itemsToLoad,
    );
    setDisplayedItems((prev) => [...prev, ...newItems]);

    if (currentCount + itemsToLoad >= mockBookmarks.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadInitialItems = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialItems = mockBookmarks.slice(0, 6);
      setDisplayedItems(initialItems);
      setHasMore(mockBookmarks.length > 6);
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
  const loadingCardsCount = Math.min(6, mockBookmarks.length);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center p-4 sm:p-8">
        <div className="flex flex-col items-center justify-center text-center max-w-full">
          {/* Skeleton for image - responsive width */}
          <div className="mb-6 w-48 h-48 sm:w-[249px] sm:h-[249px] bg-gray-700 rounded animate-pulse" />

          {/* Skeleton for title - responsive width */}
          <div className="h-8 w-44 sm:w-56 bg-gray-700 rounded mb-4 animate-pulse" />

          {/* Skeleton for description - responsive width */}
          <div className="h-5 w-64 sm:w-80 bg-gray-700 rounded mb-6 animate-pulse" />

          {/* Skeleton for button - responsive width */}
          <div className="h-10 w-32 sm:w-36 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Show empty state if there are no bookmarked jobs and we're not loading
  if (
    (!loading && displayedItems.length === 0) ||
    subscriptionPlan === "freeTrial"
  ) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyBookmark} alt="No Bookmarks" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-[#F5722E]">
            No Bookmarked Jobs
          </h2>

          <p className="text-white mb-6 text-[15px]">
            Start bookmarking your favorite cards for quick access!
          </p>

          <NavLink
            to="/dashboard/feed"
            className="bg-[#F5722E] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Go To Job Feed
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {!initialLoad &&
          displayedItems.map((bookmark, index) => (
            <BookmarkCard
              key={index}
              app={bookmark}
              subscriptionPlan={subscriptionPlan}
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

// Wrap the content with BookmarkProvider
const YourBookmarkedJobs: FC = () => {
  const { subscriptionPlan } = useEmployerContext();

  return (
    <BookmarkProvider subscriptionPlan={subscriptionPlan}>
      <BookmarkedJobsContent />
    </BookmarkProvider>
  );
};

export { YourBookmarkedJobs };

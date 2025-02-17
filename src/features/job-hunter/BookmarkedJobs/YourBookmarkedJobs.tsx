import { FC, useState, useEffect, useRef } from "react";
import { BookmarkCard } from "features/job-hunter";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyBookmark from "images/bookmark-empty.svg?url";
import { Match } from "mockData/jobs-data";
import { BookmarkProvider } from "contexts/BookmarkContext";
import { useJobHunterContext } from "components";

// You can replace this with your actual mock data
const mockBookmarks: Match[] = [
  /* {
    employerId: 1,
    position: "Software Engineer",
    company: "Fintech Solutions Ltd",
    location: "United Kingdom",
    description:
      "Looking for a passionate engineer to help build our next-generation financial platform using modern web technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    posted: "1 day",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$51,000-$70,000",
    interpersonalSkills: ["Communication", "Team Collaboration", "Problem-solving"],
    certificates: ["None required"],
    isNew: true
  },
  {
    employerId: 2,
    position: "Senior Frontend Engineer",
    company: "TechStack Inc",
    location: "Canada",
    description:
      "Join our rapidly growing team to build scalable web applications and mentor junior developers.",
    coreSkills: ["Quality Assurance", "JavaScript", "Machine Learning", "Product Management", "TypeScript"],
    posted: "1 week",
    experience: "3 - 5 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    interpersonalSkills: ["Leadership", "Mentoring", "Communication", "Team Management"],
    certificates: ["None required"],
    isNew: false
  },
  {
    employerId: 3,
    position: "Frontend Developer",
    company: "Digital Innovation GmbH",
    location: "Germany",
    description:
      "Help shape the future of our digital products with modern JavaScript frameworks and cutting-edge technologies.",
    coreSkills: ["JavaScript", "React", "Vue.js", "CSS", "HTML"],
    posted: "1 day",
    experience: "1 - 3 years",
    lookingFor: ["Full Time", "Part Time", "Contract only"],
    salaryExpectation: "$51,000-$70,000",
    interpersonalSkills: ["Communication", "Adaptability", "Problem-solving"],
    certificates: ["None required"],
    isNew: false
  }, */
  // Add more mock bookmarks as needed
];

const BookmarkedJobsContent: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { subscriptionPlan } = useJobHunterContext();

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
            <BookmarkCard key={index} match={bookmark} />
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
  const { subscriptionPlan } = useJobHunterContext();

  return (
    <BookmarkProvider subscriptionPlan={subscriptionPlan}>
      <BookmarkedJobsContent />
    </BookmarkProvider>
  );
};

export { YourBookmarkedJobs };

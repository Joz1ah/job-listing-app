import { FC, useState, useEffect, useRef } from "react";
import { BookmarkCard } from "features/job-hunter";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyBookmark from "images/bookmark-empty.svg?url";
import { Match } from "mockData/job-hunter-data";
import { BookmarkProvider } from "components/context/BookmarkContext";

// You can replace this with your actual mock data
const mockBookmarks: Match[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    position: "Senior Frontend Engineer",
    location: "Mountain View, CA",
    appliedAgo: "2 hours ago",
    coreSkills: ["React", "TypeScript", "NextJS", "TailwindCSS", "GraphQL"],
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "USD 110,000-140,000",
    language: ["English", "Mandarin"],
    certificates: ["AWS Certified Developer"],
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Doe",
    position: "Senior Frontend Engineer",
    location: "Mountain View, CA",
    appliedAgo: "2 hours ago",
    coreSkills: ["React", "TypeScript", "NextJS", "TailwindCSS", "GraphQL"],
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "USD 110,000-140,000",
    language: ["English", "Mandarin"],
    certificates: ["AWS Certified Developer"],
  },
  // Add more mock bookmarks as needed
];

const BookmarkedJobsContent: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

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

  // Show empty state if there are no bookmarked jobs and we're not loading
  if (!loading && displayedItems.length === 0) {
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
            to="/job-hunter/feed"
            className="bg-[#F5722E] text-[13px] h-6 text-white px-6 rounded-md hover:bg-orange-600 transition-colors flex items-center"
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
  return (
    <BookmarkProvider>
      <BookmarkedJobsContent />
    </BookmarkProvider>
  );
};

export { YourBookmarkedJobs };
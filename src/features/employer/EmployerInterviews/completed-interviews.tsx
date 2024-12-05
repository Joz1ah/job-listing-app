import { FC, useState, useEffect, useRef } from "react";
import { CompletedCard } from "features/employer";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";

interface Interview {
  position: string;
  name: string;
  date: string;
  time: string;
  location: string;
  receivedTime: string;
  isNew?: boolean;
  rating?: number;
  interviewed?: string;
}

const mockInterviews: Interview[] = [
  {
    position: "Senior Frontend Engineer",
    name: "Daniel Roberts",
    location: "Mountain View, CA",
    date: "December 22, 2024",
    time: "10:00 AM PST",
    receivedTime: "2 hours ago",
    isNew: true,
    interviewed: "today"
  },
  {
    position: "Full Stack Developer",
    name: "Emily Bennett",
    location: "Remote",
    date: "December 25, 2024",
    time: "1:00 PM PST",
    receivedTime: "yesterday",
    rating: 4.5,
    interviewed: "3 days ago"
  },
  {
    position: "Software Engineer",
    name: "James Anderson",
    location: "Cupertino, CA",
    date: "December 28, 2024",
    time: "11:30 AM PST",
    receivedTime: "3 days ago",
    rating: 4.0,
    interviewed: "5 days ago"
  }
];


const CompletedInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const currentCount = displayedItems.length;
    const remainingItems = mockInterviews.length - currentCount;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(2, remainingItems);
    const newItems = mockInterviews.slice(currentCount, currentCount + itemsToLoad);
    setDisplayedItems(prev => [...prev, ...newItems]);

    if (currentCount + itemsToLoad >= mockInterviews.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadInitialItems = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      }
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

  // Show empty state if there are no completed interviews and we're not loading
  if (!loading && displayedItems.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyInterview} alt="Empty History" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-orange-500">
            No Completed Interviews
          </h2>

          <p className="text-white mb-6">
            You haven't completed any interviews yet. Check your
            <br />
            <span className="text-orange-500 font-medium mx-1">
              UPCOMING INTERVIEWS
            </span>
            to see what's next on your schedule.
            <br />
          </p>

          <NavLink
            to="/employer/interviews/accepted"
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            View Upcoming Interviews
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {!initialLoad && displayedItems.map((interview, index) => (
          <CompletedCard
            key={index}
            interview={interview}
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

export { CompletedInterviews }
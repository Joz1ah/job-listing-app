import { FC, useState, useEffect, useRef } from "react";
import { DeclinedCard } from "components";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "contexts/Interviews/types";
import { useInterviewsContext } from "contexts/Interviews/InterviewsContext";
import { useEmployerContext } from "components";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

const DeclinedInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { subscriptionPlan } = useEmployerContext();
  const { interviewsList, setSelectedInterviewsGroup, isLoadingInterviews } =
    useInterviewsContext();

  //Preload the image
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = emptyInterview;

    img.onload = () => {
      setIsImageLoaded(true);
    };

    img.onerror = () => {
      console.error("Image failed to load:", emptyInterview);
    };
  }, []);

  useEffect(() => {
    setSelectedInterviewsGroup("DECLINED");
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentCount = displayedItems.length;
    const remainingItems = interviewsList.length - currentCount;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(2, remainingItems);
    const newItems = interviewsList.slice(
      currentCount,
      currentCount + itemsToLoad,
    );
    setDisplayedItems((prev) => [...prev, ...newItems]);

    if (currentCount + itemsToLoad >= interviewsList.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!interviewsList || interviewsList.length === 0){
      const timeout = setTimeout(() => {
        setLoading(false)
      }, 1000);
      return() => clearTimeout(timeout);
    }
  
    const timeout = setTimeout(() => {
      const initialItems = interviewsList.slice(0, 6);
      setDisplayedItems(initialItems);
      setHasMore(interviewsList.length > 6);
      setInitialLoad(false);
      setLoading(false);
    }, 1000);
  
    return () => clearTimeout(timeout);
  }, [interviewsList]);

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

  // Show page skeleton (empty state skeleton) when loading and we have no data
  if ((loading || isLoadingInterviews) && interviewsList.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-4 sm:p-8 text-center">
          {/* Skeleton for calendar image */}
          <div className="mb-6 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] bg-gray-700 rounded animate-pulse" />

          {/* Skeleton for "No Pending Interviews" title */}
          <div className="h-8 w-44 sm:w-56 bg-gray-700 rounded mb-4 animate-pulse" />

          {/* Skeleton for description - using container to control max width */}
          <div className="mb-6 w-full max-w-[455px] px-4 sm:px-0">
            <div className="h-5 w-full sm:w-[460px] bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-5 w-full sm:w-[460px] bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Skeleton for "Go to Feed" button */}
          <div className="h-10 w-24 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  // Show card skeletons when there is data but it's still loading
  if ((loading || isLoadingInterviews) && interviewsList.length > 0) {
    return (
      <div className="flex flex-col items-center w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
          {Array.from({ length: Math.min(6, interviewsList.length) }).map(
            (_, index) => (
              <InterviewCardSkeleton key={`skeleton-${index}`} />
            ),
          )}
        </div>
      </div>
    );
  }

  // Show empty state if there are no declined interviews and we're not loading
  if (
    (!isLoadingInterviews && !loading && interviewsList.length === 0 && isImageLoaded) ||
    subscriptionPlan === "freeTrial"
  ) {
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
            to={ROUTE_CONSTANTS.DASHBOARD}
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
            <DeclinedCard
              key={index}
              interview={interview}
              variant="employer"
            />
          ))}

        {/* Show skeleton cards for "load more" functionality when scrolling */}
        {!loading &&
          !isLoadingInterviews &&
          displayedItems.length > 0 &&
          hasMore && (
            <>
              {Array.from({
                length: Math.min(
                  2,
                  interviewsList.length - displayedItems.length,
                ),
              }).map((_, index) => (
                <InterviewCardSkeleton key={`loading-more-${index}`} />
              ))}
            </>
          )}
        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

export { DeclinedInterviews };

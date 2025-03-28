import { FC, useState, useEffect, useRef } from "react";
import { CustomError } from "types/errors";
import { RescheduleCard } from "components";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "contexts/Interviews/types";
import { useInterviewsContext } from "contexts/Interviews/InterviewsContext";
import { useJobHunterContext } from "components";

const handleError = (errorComponent:any, error:CustomError, title:string, message:string) => {
  const showError = errorComponent;
  console.log('trying to handle error')
  console.log(error,title,message)
  const errorMessage = (error as CustomError).data?.message || message;
  showError(title, errorMessage);
}
const RescheduleRequests: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { subscriptionPlan } = useJobHunterContext();
  const {interviewsList, setSelectedInterviewsGroup} = useInterviewsContext();

  setSelectedInterviewsGroup('RESCHEDULED')
  handleError

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
    const loadInitialItems = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialItems = interviewsList.slice(0, 6);
      setDisplayedItems(initialItems);
      setHasMore(interviewsList.length > 6);
      setLoading(false);
      setInitialLoad(false);
    };

    loadInitialItems();
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

  if (loading) {
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

  // Show empty state if there are no reschedule requests and we're not loading
  if (
    (!loading && displayedItems.length === 0) ||
    subscriptionPlan === "freeTrial"
  ) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6">
            <img src={emptyInterview} alt="Empty Reschedule List" />
          </div>

          <h2 className="text-2xl font-normal mb-4 text-[#F5722E]">
            No Reschedule Requests
          </h2>

          <p className="text-white mb-6">
            You don't have any pending reschedule requests. View your
            <br />
            <span className="text-[#F5722E] font-medium mx-1">
              PENDING INTERVIEWS
            </span>
            to manage your upcoming appointments.
            <br />
          </p>

          <NavLink
            to="/dashboard/interviews/pending"
            className="bg-[#F5722E] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors"
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
              variant="job-hunter"
            />
          ))}

        {loading && (
          <>
            {Array.from({
              length: Math.min(6, interviewsList.length),
            }).map((_, index) => (
              <InterviewCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

export { RescheduleRequests };

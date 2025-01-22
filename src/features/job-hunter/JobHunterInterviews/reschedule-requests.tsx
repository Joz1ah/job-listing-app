import { FC, useState, useEffect, useRef } from "react";
import { RescheduleCard } from "components";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { rescheduleInterviewsData, Interview } from "mockData/job-hunter-interviews-data";
import { useJobHunterContext } from "components";

const RescheduleRequests: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const { subscriptionPlan } = useJobHunterContext();

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
    const remainingItems = rescheduleInterviewsData.length - currentCount;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(2, remainingItems);
    const newItems = rescheduleInterviewsData.slice(
      currentCount,
      currentCount + itemsToLoad,
    );
    setDisplayedItems((prev) => [...prev, ...newItems]);

    if (currentCount + itemsToLoad >= rescheduleInterviewsData.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    const loadInitialItems = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialItems = rescheduleInterviewsData.slice(0, 6);
      setDisplayedItems(initialItems);
      setHasMore(rescheduleInterviewsData.length > 6);
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
  if (!loading && displayedItems.length === 0 || subscriptionPlan === 'freeTrial') {
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
            {Array.from({ length: Math.min(6, rescheduleInterviewsData.length) }).map(
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

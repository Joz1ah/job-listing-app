import { FC, useState, useEffect, useRef } from "react";
import { CustomError } from "types/errors";
import { RescheduleCard } from "components";
import { InterviewCardSkeleton } from "components";
import { NavLink } from "react-router-dom";
import emptyInterview from "images/calendar-empty.svg?url";
import { Interview } from "contexts/Interviews/types";
import { useEmployerContext } from "components";
import { useInterviewsContext } from "contexts/Interviews/InterviewsContext";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useAcceptInterviewMutation, useRejectInterviewMutation, useRescheduleInterviewMutation } from "api/akaza/akazaAPI";
import { combineDateAndTime } from "utils";
import { useAuth } from "contexts/AuthContext/AuthContext";

// interface AcceptData {
//   confirmed: boolean;
//   interviewId?: string;
// }

// interface DeclineData {
//   reason: string;
//   message: string;
//   interviewId?: string;
// }

interface RescheduleData {
  date: string;
  time: string;
  interviewId?: string;
  reason: string;
}

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
  const { subscriptionPlan } = useEmployerContext();
  const {interviewsList, setSelectedInterviewsGroup, isLoadingInterviews} = useInterviewsContext();
  const [acceptInterview] = useAcceptInterviewMutation();
  const [rejectInterview] = useRejectInterviewMutation();
  const [rescheduleInterview] = useRescheduleInterviewMutation();
  const { showError } = useErrorModal();
  const { userSettings } = useAuth();

  setSelectedInterviewsGroup('RESCHEDULED')

  const handleAccept = async (interview: Interview) => {
    try {
      console.log("Accept:", interview);
      await acceptInterview(interview.id).unwrap();
      setDisplayedItems((prev) => prev.filter((item) => item !== interview));
    } catch (error) {
      console.log('handling error')
      handleError( showError, error as CustomError, 
        "Accept Interview Failed",
        "Unable to accept the interview. Please try again or contact support.")
      console.error("Error accepting interview:", error);
    }
  };

  const handleDecline = async (interview: Interview) => {
    try {
      console.log("Decline:", interview);
      console.log(interview.id)
      await rejectInterview({
        interviewId: interview.id,
        reason: 'Reschedule Declined'
      }).unwrap();
      setDisplayedItems((prev) => prev.filter((item) => item !== interview));
    } catch (error) {
      handleError( showError, error as CustomError, 
        "Decline Interview Failed",
        "Unable to decline the interview. Please try again or contact support.",
      );
      console.error("Error declining interview:", error);
    }
  };

  const handleReschedule = async (
    interview: Interview,
    data: RescheduleData,
  ) => {
    try {
      console.log("Reschedule:", interview, data);
        const scheduleStart = combineDateAndTime(
          new Date(data.date),
          data.time as string,
        );
        const scheduledEnd = scheduleStart.add(30, "minutes");
        const payload = {
          interviewId: data.interviewId,
          requestorTimezone: userSettings.data?.timeZone,
          newStart: scheduleStart.format("YYYY-MM-DDTHH:mm"),
          newEnd: scheduledEnd.format("YYYY-MM-DDTHH:mm"),
          reason: data.reason
        };
        console.log(payload)
      await rescheduleInterview(payload).unwrap().then(()=>{
        //console.log("Form submitted with values:", payload);
      });
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setDisplayedItems((prev) => prev.filter((item) => item !== interview));
    } catch (error) {
      handleError( showError, error as CustomError, 
        "Reschedule Interview Failed",
        "Unable to reschedule the interview. Please try again or contact support.",
      );
      console.error("Error rescheduling interview:", error);
    }
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

  if (loading || isLoadingInterviews) {
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
    (!isLoadingInterviews && !loading && displayedItems.length === 0) ||
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
              onReschedule={(data) => handleReschedule(interview,data)}
              variant="employer"
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

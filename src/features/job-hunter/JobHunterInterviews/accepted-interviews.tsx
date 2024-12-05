import { FC, useState, useEffect, useRef } from "react";
import { AcceptedCard } from "features/job-hunter";
import { InterviewCardSkeleton } from "components";

interface Interview {
  position: string;
  company: string;
  date: string;
  time: string;
  location: string;
  meetingLink: string;
  receivedTime: string;
  isNew?: boolean;
}

// Mock Data - 3 specific examples
const mockInterviews: Interview[] = [
  {
    position: "Senior Frontend Engineer",
    company: "Google",
    location: "Mountain View, CA",
    date: "December 22, 2024",
    time: "10:00 AM PST",
    meetingLink: "meet.google.com/abc-defg-hij",
    receivedTime: "2 hours ago",
    isNew: true
  },
  {
    position: "Full Stack Developer",
    company: "Meta",
    location: "Remote",
    date: "December 25, 2024",
    time: "1:00 PM PST",
    meetingLink: "meet.google.com/uvw-xyzq-rst",
    receivedTime: "yesterday",
    isNew: false
  },
  {
    position: "Software Engineer",
    company: "Apple",
    location: "Cupertino, CA",
    date: "December 28, 2024",
    time: "11:30 AM PST",
    meetingLink: "meet.google.com/jkl-mnop-qrs",
    receivedTime: "3 days ago",
    isNew: false
  }
];

const AcceptedInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleJoinInterview = (interview: Interview) => {
    window.open(interview.meetingLink, '_blank');
  };

  const handlePreviewJob = (interview: Interview) => {
    console.log('Preview job details for:', interview.position);
  };

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

  // Initial load with skeleton
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

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {!initialLoad && displayedItems.map((interview, index) => (
          <AcceptedCard
            key={index}
            interview={interview}
            onJoinInterview={() => handleJoinInterview(interview)}
            onPreviewJob={() => handlePreviewJob(interview)}
          />
        ))}

        {showLoadingCards && (
          <>
            {Array.from({ length: loadingCardsCount }).map((_, index) => (
              <InterviewCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {!hasMore && displayedItems.length > 0 && !loading && (
          <div className="bg-transparent border-none w-full h-[275px] flex items-center justify-center text-center">
            <div className="p-10">
              <p className="text-xl font-semibold text-white">
                You've reached the end of your accepted interviews!
              </p>
            </div>
          </div>
        )}
        
        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

export { AcceptedInterviews };
import { FC, useState, useEffect, useRef } from "react";
import { PendingCard } from "features";
import { PendingCardSkeleton } from "components";

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

// Mock Data
const mockInterviews: Interview[] = [
    {
        position: "Frontend Engineer",
        company: "Google",
        location: "Mountain View, CA",
        date: "December 22, 2024",
        time: "10:00 AM PST",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        receivedTime: "yesterday",
        isNew: true
      },
      {
        position: "Backend Developer",
        company: "Meta",
        location: "Menlo Park, CA",
        date: "December 25, 2024",
        time: "1:00 PM PST",
        meetingLink: "https://meet.google.com/uvw-xyzq-rst",
        receivedTime: "two days ago",
        isNew: false
      },
      {
        position: "Full Stack Developer",
        company: "Shopify",
        location: "Remote",
        date: "January 5, 2025",
        time: "3:00 PM EST",
        meetingLink: "https://meet.google.com/jkl-mnop-qrs",
        receivedTime: "today",
        isNew: true
      },
      {
        position: "UX/UI Designer",
        company: "Adobe",
        location: "San Jose, CA",
        date: "January 10, 2025",
        time: "9:00 AM PST",
        meetingLink: "https://meet.google.com/stu-vwxy-zab",
        receivedTime: "last week",
        isNew: false
      },
      {
        position: "Data Scientist",
        company: "Amazon",
        location: "Seattle, WA",
        date: "January 15, 2025",
        time: "11:00 AM PST",
        meetingLink: "https://meet.google.com/ghi-klmn-opq",
        receivedTime: "two hours ago",
        isNew: true
      },
      {
        position: "DevOps Engineer",
        company: "Microsoft",
        location: "Redmond, WA",
        date: "January 20, 2025",
        time: "2:00 PM PST",
        meetingLink: "https://meet.google.com/qrs-tuvw-xyz",
        receivedTime: "yesterday",
        isNew: true
      }
];

const PendingInterviews: FC = () => {
  const [displayedItems, setDisplayedItems] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [initialLoad, setInitialLoad] = useState(true); // Add initialLoad state

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
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
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
  const loadingCardsCount = Math.min(6, mockInterviews.length); // Show up to 6 loading cards initially

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-y-6 gap-x-14 justify-items-center w-full">
        {!initialLoad && displayedItems.map((interview, index) => (
          <PendingCard 
            key={index}
            interview={interview}
            onAccept={() => console.log('Accept:', interview)}
            onReschedule={() => console.log('Reschedule:', interview)}
            onDecline={() => console.log('Decline:', interview)}
          />
        ))}

        {showLoadingCards && (
          <>
            {Array.from({ length: loadingCardsCount }).map((_, index) => (
              <PendingCardSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}

        {!hasMore && displayedItems.length > 0 && !loading && (
          <div className="bg-transparent border-none w-full h-[275px] flex items-center justify-center text-center">
            <div className="p-10">
              <p className="text-xl font-semibold text-white">
                You've reached the end of your pending interviews!
              </p>
            </div>
          </div>
        )}
        
        <div ref={loaderRef} className="h-px w-px" />
      </div>
    </div>
  );
};

export { PendingInterviews };
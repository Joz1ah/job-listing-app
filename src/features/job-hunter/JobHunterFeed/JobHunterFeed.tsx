import { FC, useState, useEffect, useRef } from "react";
import sparkeIcon from "images/sparkle-icon.png";
import { perfectMatch, others } from "mockData/jobs-data";
import jobHunterAds from "images/job-hunter-ads.svg?url";
import jobHunterPopAds from "images/popup-hunter.svg?url";
import {
  PerfectMatchEmptyState,
  OtherOpportunitiesEmptyState,
} from "features/job-hunter";
import { AdDialogWrapper } from "components";

import { Button } from "components";
import { JobCardSkeleton } from "components";
import { BookmarkLimitHandler } from "components";

import { JobCard } from "features/job-hunter";

import { useJobHunterContext } from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
  subscriptionTier: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
}

interface Match {
  employerId: number;
  position: string;
  company: string;
  location: string;
  coreSkills: string[];
  posted: string;
  experience: string;
  description: string;
  lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
  salaryExpectation: string;
  language?: string[];
}

interface AdItem {
  isAd: true;
  image: string;
}

type CardItem = Match | AdItem;

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab, subscriptionTier }) => {
  const [displayedItems, setDisplayedItems] = useState<CardItem[]>(() => {
    // Check if we have any items first
    if (perfectMatch.length === 0) {
      return [];
    }

    // Initial load of 5 items
    const initialItems = perfectMatch.slice(0, 5);
    if (subscriptionTier === 'freeTrial' && initialItems.length >= 3) {
      // Only insert ad if we have at least 3 real items
      return [
        ...initialItems.slice(0, 3),
        { isAd: true, image: jobHunterAds },
        ...initialItems.slice(3),
      ];
    }
    return initialItems;
  });

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(perfectMatch.length > 6);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentItemCount = subscriptionTier === 'freeTrial'
      ? displayedItems.filter((item): item is Match => !("isAd" in item)).length
      : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = perfectMatch.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (subscriptionTier === 'freeTrial') {
      // Calculate if we need an ad in the next 2 positions
      const realItemsCount = displayedItems.filter(
        (item) => !("isAd" in item),
      ).length;
      const nextPositionNeedsAd = (realItemsCount + 1 - 3) % 5 === 0;
      const secondPositionNeedsAd = (realItemsCount + 2 - 3) % 5 === 0;

      if (nextPositionNeedsAd) {
        // Load 1 real item + ad
        const newItems = perfectMatch.slice(startIndex, startIndex + 1);
        setDisplayedItems((prev) => [
          ...prev,
          ...newItems,
          { isAd: true, image: jobHunterAds },
        ]);
      } else if (secondPositionNeedsAd) {
        // Load 2 real items + ad
        const newItems = perfectMatch.slice(startIndex, startIndex + 2);
        setDisplayedItems((prev) => [
          ...prev,
          newItems[0],
          { isAd: true, image: jobHunterAds },
        ]);
      } else {
        // Load 2 regular items
        const itemsToLoad = Math.min(2, remainingItems);
        const newItems = perfectMatch.slice(
          startIndex,
          startIndex + itemsToLoad,
        );
        setDisplayedItems((prev) => [...prev, ...newItems]);
      }
    } else {
      // Non-free trial users always get 2 regular items
      const itemsToLoad = Math.min(2, remainingItems);
      const newItems = perfectMatch.slice(startIndex, startIndex + itemsToLoad);
      setDisplayedItems((prev) => [...prev, ...newItems]);
    }

    if (startIndex + 2 >= perfectMatch.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Reset when switching tabs
  useEffect(() => {
    if (perfectMatch.length === 0) {
      setDisplayedItems([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const initialItems = perfectMatch.slice(0, subscriptionTier === 'freeTrial' ? 5 : 6);
    if (subscriptionTier === 'freeTrial' && initialItems.length >= 3) {
      setDisplayedItems([
        ...initialItems.slice(0, 3),
        { isAd: true, image: jobHunterAds },
        ...initialItems.slice(3),
      ]);
    } else {
      setDisplayedItems(initialItems);
    }
    setHasMore(perfectMatch.length > 6);
    setLoading(false);
  }, [setSelectedTab, subscriptionTier, perfectMatch, jobHunterAds]);

  // Calculate loading cards
  const remainingItems = subscriptionTier === 'freeTrial'
    ? perfectMatch.length -
      displayedItems.filter((item) => !("isAd" in item)).length
    : perfectMatch.length - displayedItems.length;

  const showLoadingCards = loading && remainingItems > 0;
  const loadingCardsCount = Math.min(2, remainingItems);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
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
  }, [loading, hasMore]);

  const handleClick = () => {
    setSelectedTab("otherApplications");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const showEmptyState = !loading && displayedItems.length === 0;
  if (showEmptyState) {
    return (
      <PerfectMatchEmptyState
        onExploreClick={() => {
          setSelectedTab("otherApplications");
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center w-full max-w-[436px] md:max-w-[900px] mx-auto px-0">
      {displayedItems.map((item, index) =>
        "isAd" in item ? (
          <AdDialogWrapper
            key={`ad-${index}`}
            adImage={item.image}
            popupImage={jobHunterPopAds}
          />
        ) : (
          <JobCard key={index} match={item} />
        ),
      )}
      {showLoadingCards && (
        <>
          <JobCardSkeleton />
          {loadingCardsCount > 1 && <JobCardSkeleton />}
        </>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center">
          <div className="p-10">
            <p className="text-xl font-semibold text-white">
              You've reached the end of your perfect matches for now!
            </p>
            <span className="text-white text-[20px] font-semibold ml-4">
              Explore
            </span>
            <Button
              variant="link"
              className="text-[20px] text-[#F5722E] font-semibold pl-2 underline pt-0"
              onClick={handleClick}
            >
              other application cards
            </Button>
          </div>
        </div>
      )}

      <div ref={loaderRef} className="h-px w-px" />
    </div>
  );
};

const OtherApplications: FC<selectedProps> = ({
  setSelectedTab,
  subscriptionTier,
}) => {
  const [displayedItems, setDisplayedItems] = useState<CardItem[]>(() => {
    // Check if we have any items first
    if (others.length === 0) {
      return [];
    }

    // Initial load of 5 items
    const initialItems = others.slice(0, 5);
    if (subscriptionTier === 'freeTrial' && initialItems.length >= 3) {
      // Only insert ad if we have at least 3 real items
      return [
        ...initialItems.slice(0, 3),
        { isAd: true, image: jobHunterAds },
        ...initialItems.slice(3),
      ];
    }
    return initialItems;
  });

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(others.length > 6);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const currentItemCount = subscriptionTier === 'freeTrial'
      ? displayedItems.filter((item): item is Match => !("isAd" in item)).length
      : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = others.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (subscriptionTier === 'freeTrial') {
      // Calculate if we need an ad in the next 2 positions
      const realItemsCount = displayedItems.filter(
        (item) => !("isAd" in item),
      ).length;
      const nextPositionNeedsAd = (realItemsCount + 1 - 3) % 5 === 0;
      const secondPositionNeedsAd = (realItemsCount + 2 - 3) % 5 === 0;

      if (nextPositionNeedsAd) {
        // Load 1 real item + ad
        const newItems = others.slice(startIndex, startIndex + 1);
        setDisplayedItems((prev) => [
          ...prev,
          ...newItems,
          { isAd: true, image: jobHunterAds },
        ]);
      } else if (secondPositionNeedsAd) {
        // Load 2 real items + ad
        const newItems = others.slice(startIndex, startIndex + 2);
        setDisplayedItems((prev) => [
          ...prev,
          newItems[0],
          { isAd: true, image: jobHunterAds },
        ]);
      } else {
        // Load 2 regular items
        const itemsToLoad = Math.min(2, remainingItems);
        const newItems = others.slice(startIndex, startIndex + itemsToLoad);
        setDisplayedItems((prev) => [...prev, ...newItems]);
      }
    } else {
      // Non-free trial users always get 2 regular items
      const itemsToLoad = Math.min(2, remainingItems);
      const newItems = others.slice(startIndex, startIndex + itemsToLoad);
      setDisplayedItems((prev) => [...prev, ...newItems]);
    }

    if (startIndex + 2 >= others.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Reset when switching tabs
  useEffect(() => {
    if (others.length === 0) {
      setDisplayedItems([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const initialItems = others.slice(0, subscriptionTier === 'freeTrial' ? 5 : 6);
    if (subscriptionTier === 'freeTrial' && initialItems.length >= 3) {
      setDisplayedItems([
        ...initialItems.slice(0, 3),
        { isAd: true, image: jobHunterAds },
        ...initialItems.slice(3),
      ]);
    } else {
      setDisplayedItems(initialItems);
    }
    setHasMore(others.length > 6);
    setLoading(false);
  }, [setSelectedTab, subscriptionTier, others, jobHunterAds]);

  // Calculate loading cards
  const remainingItems = subscriptionTier === 'freeTrial'
    ? others.length - displayedItems.filter((item) => !("isAd" in item)).length
    : others.length - displayedItems.length;

  const showLoadingCards = loading && remainingItems > 0;
  const loadingCardsCount = Math.min(2, remainingItems);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
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
  }, [loading, hasMore]);

  const handleClick = () => {
    setSelectedTab("perfectMatch");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const showEmptyState = !loading && displayedItems.length === 0;
  if (showEmptyState) {
    return <OtherOpportunitiesEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center w-full max-w-[436px] md:max-w-[900px] mx-auto px-0">
      {displayedItems.map((item, index) =>
        "isAd" in item ? (
          <AdDialogWrapper
            key={`ad-${index}`}
            adImage={item.image}
            popupImage={jobHunterPopAds}
          />
        ) : (
          <JobCard key={index} match={item} />
        ),
      )}

      {/* Dynamic Loading Cards */}
      {showLoadingCards && (
        <>
          <JobCardSkeleton />
          {loadingCardsCount > 1 && <JobCardSkeleton />}
        </>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center">
          <div className="p-10">
            <p className="text-xl font-semibold text-white">
              You've reached the end of your other application cards for now!
            </p>
            <span className="text-white text-[20px] font-semibold ml-4">
              Explore your
            </span>
            <Button
              variant="link"
              className="text-[20px] text-[#F5722E]  font-semibold pl-2 underline pt-0"
              onClick={handleClick}
            >
              perfect matches
            </Button>
          </div>
        </div>
      )}

      <div ref={loaderRef} className="h-px w-px" />
    </div>
  );
};

interface JobHunterSectionProps {
  subscriptionTier: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
}

const JobHunterFeed: FC<JobHunterSectionProps> = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");
  const [isLoading, setIsLoading] = useState(true);
  const { subscriptionTier } = useJobHunterContext();

  const handleUpgradeClick = () => {
    console.log("Upgrade clicked");
    // Implement your upgrade logic here
  };

  const handleTabChange = (tab: string) => {
    const scrollViewport = document.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollViewport) {
      scrollViewport.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    setSelectedTab(tab);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const LoadingGrid = () => {
    // Calculate number of skeleton cards based on actual data
    const dataLength =
      selectedTab === "perfectMatch"
        ? Math.min(perfectMatch.length, subscriptionTier === 'freeTrial' ? 5 : 6)
        : Math.min(others.length, subscriptionTier === 'freeTrial' ? 5 : 6);

    // If there's no data, don't show loading state
    if (dataLength === 0) {
      return selectedTab === "perfectMatch" ? (
        <PerfectMatchEmptyState
          onExploreClick={() => handleTabChange("otherApplications")}
        />
      ) : (
        <OtherOpportunitiesEmptyState />
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center w-full max-w-[436px] md:max-w-[900px] mx-auto px-4 md:px-0">
        {Array.from({ length: dataLength }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  };

  return (
    <BookmarkLimitHandler
      subscriptionTier={subscriptionTier}
      maxBookmarks={3}
      onUpgradeClick={handleUpgradeClick}
      limitPopupImage={jobHunterPopAds}
      limitPopupTitle="Bookmark Limit Reached"
      limitPopupDescription="Upgrade to bookmark more matches!"
    >
      <div className="w-full mt-4 md:mt-8 md:my-2">
        <div className="flex flex-col items-center">
          <div className="flex justify-center mb-8 w-full">
            <button
              className={`font-semibold mr-6 pb-2 text-[17px] inline-flex items-center gap-2 transition-all duration-200 relative group ${
                selectedTab === "perfectMatch"
                  ? "text-[#F5722E]"
                  : "text-[#AEADAD] hover:text-[#F5722E]"
              }`}
              onClick={() => handleTabChange("perfectMatch")}
              disabled={isLoading}
            >
              <div
                className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5722E] transform origin-left transition-transform duration-200 ease-out"
                style={{
                  transform:
                    selectedTab === "perfectMatch" ? "scaleX(1)" : "scaleX(0)",
                }}
              />
              <img
                src={sparkeIcon}
                alt="Sparkle Icon"
                className={`w-5 h-5 transition-all duration-200 ${
                  selectedTab === "perfectMatch"
                    ? "filter grayscale-0"
                    : "filter grayscale group-hover:grayscale-0"
                }`}
              />
              PERFECT MATCH
            </button>

            <button
              className={`font-semibold pb-2 text-[17px] transition-all duration-200 relative ${
                selectedTab === "otherApplications"
                  ? "text-[#F5722E]"
                  : "text-[#AEADAD] hover:text-[#F5722E]"
              }`}
              onClick={() => handleTabChange("otherApplications")}
              disabled={isLoading}
            >
              <div
                className="absolute bottom-0 right-0 w-full h-0.5 bg-[#F5722E] transform origin-right transition-transform duration-200 ease-out"
                style={{
                  transform:
                    selectedTab === "otherApplications"
                      ? "scaleX(1)"
                      : "scaleX(0)",
                }}
              />
              OTHER OPPORTUNITIES
            </button>
          </div>

          <div className="w-full max-w-[932px] mx-auto px-4">
            {isLoading ? (
              <LoadingGrid />
            ) : (
              <div className="w-full">
                {selectedTab === "perfectMatch" ? (
                  <PerfectMatch
                    setSelectedTab={handleTabChange}
                    subscriptionTier={subscriptionTier}
                  />
                ) : (
                  <OtherApplications
                    setSelectedTab={handleTabChange}
                    subscriptionTier={subscriptionTier}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </BookmarkLimitHandler>
  );
};

export { JobHunterFeed };

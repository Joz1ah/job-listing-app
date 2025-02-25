import { FC, useState, useEffect, useRef } from "react";
import sparkeIcon from "images/sparkle-icon.png";
//import { /*perfectMatch,*/ others } from "mockData/job-hunter-data";
import { Button } from "components";
import { AppCardSkeleton, BookmarkLimitHandler } from "components";
import { AppCard } from "features/employer";
import employerAds from "images/employer-feed-card-ads.svg?url";
import employerPopAds from "images/popup-employer.svg?url";
import {
  PerfectMatchEmptyState,
  OtherApplicationEmptyState,
} from "features/employer";
import { usePerfectMatchContext } from "contexts/PerfectMatch/PerfectMatchContext";
import { Match } from "contexts/PerfectMatch/types";
import { AdDialogWrapper } from "components";
import { useEmployerContext } from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
  subscriptionPlan: 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';
}

interface AdItem {
  isAd: true;
  image: string;
}

type CardItem = Match | AdItem;

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab, subscriptionPlan }) => {
  const { perfectMatch, updateMatchState } = usePerfectMatchContext();
  
  useEffect(()=>{
    updateMatchState({
        ...(perfectMatch.length > 0 && { selectedJobId: perfectMatch[0].id }),
        scoreFilter: 'above60'
    });
  },[])
  
  const [displayedItems, setDisplayedItems] = useState<CardItem[]>(() => {
    if (!perfectMatch || perfectMatch.length === 0) {
      return [];
    }

    // Initial load of 5 items
    const initialItems = perfectMatch.slice(0, 5);
    if (subscriptionPlan === 'freeTrial' && initialItems.length >= 3) {
      // Only insert ad if we have at least 3 real items
      return [
        ...initialItems.slice(0, 3),
        { isAd: true, image: employerAds },
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

    const currentItemCount = subscriptionPlan === 'freeTrial'
      ? displayedItems.filter((item): item is Match => !("isAd" in item)).length
      : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = perfectMatch.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (subscriptionPlan === 'freeTrial') {
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
          { isAd: true, image: employerAds },
        ]);
      } else if (secondPositionNeedsAd) {
        // Load 2 real items + ad
        const newItems = perfectMatch.slice(startIndex, startIndex + 2);
        setDisplayedItems((prev) => [
          ...prev,
          newItems[0],
          { isAd: true, image: employerAds },
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

  useEffect(() => {
    if (perfectMatch.length === 0) {
      setDisplayedItems([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const initialItems = perfectMatch.slice(0, subscriptionPlan === 'freeTrial' ? 5 : 6);
    if (subscriptionPlan === 'freeTrial' && initialItems.length >= 3) {
      setDisplayedItems([
        ...initialItems.slice(0, 3),
        { isAd: true, image: employerAds },
        ...initialItems.slice(3),
      ]);
    } else {
      setDisplayedItems(initialItems);
    }
    setHasMore(perfectMatch.length > 6);
    setLoading(false);
  }, [setSelectedTab, subscriptionPlan, perfectMatch, employerAds]);

  // Calculate loading cards
  const remainingItems = subscriptionPlan === 'freeTrial'
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
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-5 justify-items-center w-full md:min-w-[436px] xl:w-[900px] mx-auto px-0">
      {displayedItems.map((item, index) =>
        "isAd" in item ? (
          <AdDialogWrapper
            key={`ad-${index}`}
            adImage={item.image}
            popupImage={employerPopAds}
          />
        ) : (
          <AppCard key={index} match={item}  popupImage={employerPopAds} />
        ),
      )}

      {showLoadingCards && (
        <>
          <AppCardSkeleton />
          {loadingCardsCount > 1 && <AppCardSkeleton />}
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
  subscriptionPlan,
}) => {
  const { perfectMatch: others, updateMatchState, matchState } = usePerfectMatchContext();
  
  useEffect(()=>{
    updateMatchState({
        ...(others.length > 0 && { selectedJobId: others[0].id }),
        scoreFilter: 'below60'
    });
  },[])
  useEffect(()=>{
    console.log(others)
  },[matchState])
  const [displayedItems, setDisplayedItems] = useState<CardItem[]>(() => {
    if (others.length === 0) {
      return [];
    }

    // Initial load of 5 items
    const initialItems = others.slice(0, 5);
    if (subscriptionPlan === 'freeTrial' && initialItems.length >= 3) {
      // Only insert ad if we have at least 3 real items
      return [
        ...initialItems.slice(0, 3),
        { isAd: true, image: employerAds },
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

    const currentItemCount = subscriptionPlan === 'freeTrial'
      ? displayedItems.filter((item): item is Match => !("isAd" in item)).length
      : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = others.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (subscriptionPlan === 'freeTrial') {
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
          { isAd: true, image: employerAds },
        ]);
      } else if (secondPositionNeedsAd) {
        // Load 2 real items + ad
        const newItems = others.slice(startIndex, startIndex + 2);
        setDisplayedItems((prev) => [
          ...prev,
          newItems[0],
          { isAd: true, image: employerAds },
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

    const initialItems = others.slice(0, subscriptionPlan === 'freeTrial' ? 5 : 6);
    if (subscriptionPlan === 'freeTrial' && initialItems.length >= 3) {
      setDisplayedItems([
        ...initialItems.slice(0, 3),
        { isAd: true, image: employerAds },
        ...initialItems.slice(3),
      ]);
    } else {
      setDisplayedItems(initialItems);
    }
    setHasMore(others.length > 6);
    setLoading(false);
  }, [setSelectedTab, subscriptionPlan, others, employerAds]);

  // Calculate loading cards
  const remainingItems = subscriptionPlan === 'freeTrial'
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
    return <OtherApplicationEmptyState />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-5 justify-items-center w-full md:min-w-[436px] xl:w-[900px] mx-auto px-0">
      {displayedItems.map((item, index) =>
        "isAd" in item ? (
          <AdDialogWrapper
            key={`ad-${index}`}
            adImage={item.image}
            popupImage={employerPopAds}
          />
        ) : (
          <AppCard key={index} match={item}  popupImage={employerPopAds}/>
        ),
      )}
      {/* Dynamic Loading Cards */}
      {showLoadingCards && (
        <>
          <AppCardSkeleton />
          {loadingCardsCount > 1 && <AppCardSkeleton />}
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

const EmployerFeed: FC = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");
  const [isLoading, setIsLoading] = useState(true);
  const { subscriptionPlan } = useEmployerContext();
  const { perfectMatch, matchState } = usePerfectMatchContext();
  const others = perfectMatch
  useEffect(()=>{
    //console.log(perfectMatch)
  },[matchState])
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
        ? Math.min(perfectMatch.length, subscriptionPlan === 'freeTrial' ? 5 : 6)
        : Math.min(others.length, subscriptionPlan === 'freeTrial' ? 5 : 6);

    // If there's no data, don't show loading state
    if (dataLength === 0) {
      return selectedTab === "perfectMatch" ? (
        <PerfectMatchEmptyState
          onExploreClick={() => handleTabChange("otherApplications")}
        />
      ) : (
        <OtherApplicationEmptyState />
      );
    }

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-5 justify-items-center w-full md:min-w-[436px] xl:w-[900px] mx-auto px-0">
        {Array.from({ length: dataLength }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    );
  };

  return (
    <BookmarkLimitHandler
      subscriptionPlan={subscriptionPlan}
      maxBookmarks={3}
      onUpgradeClick={handleUpgradeClick}
      limitPopupImage={employerPopAds}
      limitPopupTitle="Bookmark Limit Reached"
      limitPopupDescription="Upgrade to bookmark more matches!"
    >
      <div>
        <div className="flex flex-col items-center my-8 pt-8 w-full">
          {/* Tab Buttons */}
          <div className="flex justify-center mb-8 md:mb-12">
            <button
              className={`font-semibold mr-6 pb-2 text-[17px] inline-flex items-center gap-2 transition-all duration-200 relative group
              ${selectedTab === "perfectMatch" ? "text-[#F5722E]" : "text-[#AEADAD] hover:text-[#F5722E]"}`}
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
              className={`font-semibold pb-2 text-[17px] transition-all duration-200 relative
              ${selectedTab === "otherApplications" ? "text-[#F5722E]" : "text-[#AEADAD] hover:text-[#F5722E]"}`}
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
              OTHER APPLICATION CARDS
            </button>
          </div>

          {/* Content Section */}
          <div className="w-full">
            {isLoading ? (
              <LoadingGrid />
            ) : (
              <div className="w-full">
                {selectedTab === "perfectMatch" ? (
                  <PerfectMatch
                    setSelectedTab={handleTabChange}
                    subscriptionPlan={subscriptionPlan}
                  />
                ) : (
                  <OtherApplications
                    setSelectedTab={handleTabChange}
                    subscriptionPlan={subscriptionPlan}
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

export { EmployerFeed };

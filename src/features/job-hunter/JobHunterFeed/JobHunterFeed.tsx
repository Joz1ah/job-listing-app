import { FC, useState, useEffect, useRef } from "react";
import sparkeIcon from "images/sparkle-icon.png";
import { usePerfectMatchContext } from "contexts/PerfectMatch/PerfectMatchContext";
import jobHunterAds from "images/jobhunter-dashboard-ads.svg?url";
import jobHunterPopAds from "images/jobhunter-dashboard-popup-ads.svg?url";
import {
  PerfectMatchEmptyState,
  OtherOpportunitiesEmptyState,
} from "features/job-hunter";
import { AdDialogWrapper } from "components";
import { MatchJH as Match } from "contexts/PerfectMatch/types";
import { Button } from "components";
import { JobCardSkeleton } from "components";
import { BookmarkLimitHandler } from "components";
import { JobCard } from "features/job-hunter";
import { useJobHunterContext } from "components";
import { FramerJobHunterCarousel } from "components/swipeable/FramerJobHunterCarousel";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
}

interface AdItem {
  isAd: true;
  image: string;
}

type CardItem = Match | AdItem;

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab }) => {
  const { perfectMatchesJH, matchState, updateMatchState, isLoadingMatches } =
    usePerfectMatchContext();
  const { subscriptionPlan } = useJobHunterContext();
  const [perfectMatch, setPerfectMatch] = useState(perfectMatchesJH);

  // Add a flag to prevent premature display of data during initial loading
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Hook to detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    // Only update on mount and avoid unnecessary updates
    if (!matchState.selectedJobId && perfectMatchesJH.length > 0) {
      updateMatchState({
        selectedJobId: null,
        scoreFilter: "above60",
      });
    }
  }, [perfectMatchesJH]);

  useEffect(() => {
    setPerfectMatch(perfectMatchesJH);

    // Mark initial data as loaded once we have our first set of matches
    if (!initialDataLoaded && perfectMatchesJH.length > 0) {
      setInitialDataLoaded(true);
    }
  }, [perfectMatchesJH]);

  const [displayedItems, setDisplayedItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300)); // Reduced from 1000ms to 300ms for better responsiveness

    const currentItemCount =
      subscriptionPlan === "freeTrial"
        ? displayedItems.filter((item): item is Match => !("isAd" in item))
            .length
        : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = perfectMatch.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (subscriptionPlan === "freeTrial") {
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

  // Update displayed items when perfectMatch changes
  useEffect(() => {
    // Don't update displayed items if we're still loading matches from API
    if (isLoadingMatches) {
      // Clear displayed items when loading to prevent flicker
      setDisplayedItems([]);
      return;
    }

    // Reset loading state when data changes
    setLoading(true);

    if (perfectMatch.length === 0) {
      setDisplayedItems([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const initialItems = perfectMatch.slice(
      0,
      subscriptionPlan === "freeTrial" ? 5 : 6,
    );
    if (subscriptionPlan === "freeTrial" && initialItems.length >= 3) {
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
  }, [subscriptionPlan, perfectMatch, jobHunterAds, isLoadingMatches]);

  const handleClick = () => {
    setSelectedTab("otherApplications");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Only show empty state when we're sure there's no data and we're not loading
  const showEmptyState =
    !isLoadingMatches && !loading && perfectMatch.length === 0;

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

  // Mobile carousel view
  if (isMobileView) {
    return (
      <FramerJobHunterCarousel
        items={displayedItems}
        subscriptionPlan={subscriptionPlan}
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
        title="PERFECT MATCH"
        showTitle={false} // Title is handled by parent component
        onNavigateToOtherTab={() => setSelectedTab("otherApplications")}
      />
    );
  }

  // Desktop grid view (original)
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
          <JobCard
            key={index}
            jobId={item.jobId}
            match={item}
            popupImage={jobHunterPopAds}
          />
        ),
      )}

      {loading && (
        <>
          <JobCardSkeleton />
          <JobCardSkeleton />
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
    </div>
  );
};

const OtherApplications: FC<selectedProps> = ({ setSelectedTab }) => {
  const { otherMatchesJH, matchState, updateMatchState, isLoadingMatches } =
    usePerfectMatchContext();
  const { subscriptionPlan } = useJobHunterContext();

  // Add a flag to prevent premature display of data during initial loading
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Hook to detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    // Only update on mount and avoid unnecessary updates
    if (!matchState.selectedJobId && otherMatchesJH.length > 0) {
      updateMatchState({
        selectedJobId: null,
        scoreFilter: "below60",
      });
    }
  }, [otherMatchesJH]);

  const others = otherMatchesJH;

  const [displayedItems, setDisplayedItems] = useState<CardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 300)); // Reduced from 1000ms to 300ms for better responsiveness

    const currentItemCount =
      subscriptionPlan === "freeTrial"
        ? displayedItems.filter((item): item is Match => !("isAd" in item))
            .length
        : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = others.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (subscriptionPlan === "freeTrial") {
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

  // Update displayed items when others changes
  useEffect(() => {
    // Don't update displayed items if we're still loading matches from API
    if (isLoadingMatches) {
      // Clear displayed items when loading to prevent flicker
      setDisplayedItems([]);
      return;
    }

    // Mark initial data as loaded once we have our first set of matches
    if (!initialDataLoaded && others.length > 0) {
      setInitialDataLoaded(true);
    }

    // Reset loading state when data changes
    setLoading(true);

    if (others.length === 0) {
      setDisplayedItems([]);
      setHasMore(false);
      setLoading(false);
      return;
    }

    const initialItems = others.slice(
      0,
      subscriptionPlan === "freeTrial" ? 5 : 6,
    );
    if (subscriptionPlan === "freeTrial" && initialItems.length >= 3) {
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
  }, [subscriptionPlan, others, jobHunterAds, isLoadingMatches]);

  const handleClick = () => {
    setSelectedTab("perfectMatch");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Only show empty state when we're sure there's no data and we're not loading
  const showEmptyState = !isLoadingMatches && !loading && others.length === 0;

  if (showEmptyState) {
    return <OtherOpportunitiesEmptyState />;
  }

  // Mobile carousel view
  if (isMobileView) {
    return (
      <FramerJobHunterCarousel
        items={displayedItems}
        subscriptionPlan={subscriptionPlan}
        onLoadMore={loadMore}
        hasMore={hasMore}
        loading={loading}
        title="OTHER OPPORTUNITIES"
        showTitle={false} // Title is handled by parent component
        onNavigateToOtherTab={() => setSelectedTab("perfectMatch")}
      />
    );
  }

  // Desktop grid view (original)
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
          <JobCard
            key={index}
            jobId={item.jobId}
            match={item}
            popupImage={jobHunterPopAds}
          />
        ),
      )}

      {/* Dynamic Loading Cards */}
      {loading && (
        <>
          <JobCardSkeleton />
          <JobCardSkeleton />
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
              className="text-[20px] text-[#F5722E] font-semibold pl-2 underline pt-0"
              onClick={handleClick}
            >
              perfect matches
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const JobHunterFeed: FC = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");
  const { subscriptionPlan } = useJobHunterContext();
  const {
    perfectMatchesJH,
    otherMatchesJH,
    updateMatchState,
    isLoadingMatches,
  } = usePerfectMatchContext();

  // State to track if other application cards have been viewed
  const [hasViewedOtherCards, setHasViewedOtherCards] = useState(false);

  // Forced loading state for other application cards
  const [forcedOtherCardsLoading, setForcedOtherCardsLoading] = useState(false);

  // Reference to loading timeout
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile detection
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Set initial scoreFilter on component mount
  useEffect(() => {
    updateMatchState({ scoreFilter: "above60" });
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  const handleUpgradeClick = () => {
    console.log("Upgrade clicked");
    // Implement your upgrade logic here
  };

  // Handle tab changes with FORCED skeleton for first switch to other apps
  const handleTabChange = (tab: string) => {
    // Only proceed if we're actually changing tabs
    if (selectedTab !== tab) {
      // Scroll to top if needed (only for desktop)
      if (!isMobileView) {
        const scrollViewport = document.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollViewport) {
          scrollViewport.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }

      // Set the selected tab first
      setSelectedTab(tab);

      // If switching to other applications for the first time, force loading state
      if (tab === "otherApplications" && !hasViewedOtherCards) {
        // Force the loading state
        setForcedOtherCardsLoading(true);

        // Clear any existing timeout
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
        }

        // Set up a timeout to turn off forced loading after a delay
        // This ensures skeleton is shown regardless of how fast data loads
        loadingTimeoutRef.current = setTimeout(() => {
          setForcedOtherCardsLoading(false);
          setHasViewedOtherCards(true);
        }, 1500);
      }

      // Update context for data loading
      if (tab === "perfectMatch") {
        updateMatchState({ scoreFilter: "above60" });
      } else {
        updateMatchState({ scoreFilter: "below60" });
      }
    }
  };

  // Determine current data based on selected tab
  const currentData =
    selectedTab === "perfectMatch" ? perfectMatchesJH : otherMatchesJH;

  const showSkeleton =
    isLoadingMatches ||
    (selectedTab === "otherApplications" && forcedOtherCardsLoading);

  // TRUE when we have no data
  const hasNoData = !showSkeleton && currentData.length === 0;

  return (
    <BookmarkLimitHandler
      subscriptionPlan={subscriptionPlan}
      maxBookmarks={3}
      onUpgradeClick={handleUpgradeClick}
      limitPopupImage={jobHunterPopAds}
      limitPopupTitle="Bookmark Limit Reached"
      limitPopupDescription="Upgrade to bookmark more matches!"
    >
      <div className="w-full mt-4 md:mt-8 md:my-2">
        <div className="flex flex-col items-center">
          {/* Tab Section - Desktop Buttons / Mobile Radio Buttons */}
          <div className="flex justify-center mb-8 w-full">
            {isMobileView ? (
              /* Mobile Radio Buttons */
              <div className="flex flex-col space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="tab-selection"
                      value="perfectMatch"
                      checked={selectedTab === "perfectMatch"}
                      onChange={() => handleTabChange("perfectMatch")}
                      className="sr-only"
                      disabled={
                        isLoadingMatches ||
                        (selectedTab === "otherApplications" &&
                          forcedOtherCardsLoading)
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedTab === "perfectMatch"
                          ? "border-[#F5722E] bg-transparent"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {selectedTab === "perfectMatch" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F5722E]"></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <img
                      src={sparkeIcon}
                      alt="Sparkle Icon"
                      className={`w-5 h-5 transition-all duration-200 ${
                        selectedTab === "perfectMatch"
                          ? "filter grayscale-0"
                          : "filter grayscale opacity-60"
                      }`}
                    />
                    <span
                      className={`text-[16px] font-semibold transition-colors duration-200 ${
                        selectedTab === "perfectMatch"
                          ? "text-[#F5722E]"
                          : "text-gray-400"
                      }`}
                    >
                      PERFECT MATCH
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="radio"
                      name="tab-selection"
                      value="otherApplications"
                      checked={selectedTab === "otherApplications"}
                      onChange={() => handleTabChange("otherApplications")}
                      className="sr-only"
                      disabled={
                        isLoadingMatches ||
                        (selectedTab === "otherApplications" &&
                          forcedOtherCardsLoading)
                      }
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedTab === "otherApplications"
                          ? "border-[#F5722E] bg-transparent"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {selectedTab === "otherApplications" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#F5722E]"></div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[16px] font-semibold transition-colors duration-200 ${
                      selectedTab === "otherApplications"
                        ? "text-[#F5722E]"
                        : "text-gray-400"
                    }`}
                  >
                    OTHER OPPORTUNITIES
                  </span>
                </label>
              </div>
            ) : (
              /* Desktop Tab Buttons */
              <>
                <button
                  className={`font-semibold mr-6 pb-2 text-[17px] inline-flex items-center gap-2 transition-all duration-200 relative group ${
                    selectedTab === "perfectMatch"
                      ? "text-[#F5722E]"
                      : "text-[#AEADAD] hover:text-[#F5722E]"
                  }`}
                  onClick={() => handleTabChange("perfectMatch")}
                  disabled={
                    isLoadingMatches ||
                    (selectedTab === "otherApplications" &&
                      forcedOtherCardsLoading)
                  }
                >
                  <div
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5722E] transform origin-left transition-transform duration-200 ease-out"
                    style={{
                      transform:
                        selectedTab === "perfectMatch"
                          ? "scaleX(1)"
                          : "scaleX(0)",
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
                  disabled={
                    isLoadingMatches ||
                    (selectedTab === "otherApplications" &&
                      forcedOtherCardsLoading)
                  }
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
              </>
            )}
          </div>

          {/* Content Section */}
          <div className="w-full max-w-[932px] mx-auto">
            {showSkeleton ? (
              // Show skeleton state during loading
              isMobileView ? (
                // Mobile skeleton - show carousel skeleton
                <FramerJobHunterCarousel
                  items={[]}
                  subscriptionPlan={subscriptionPlan}
                  onLoadMore={() => {}}
                  hasMore={false}
                  loading={true}
                  title={
                    selectedTab === "perfectMatch"
                      ? "PERFECT MATCH"
                      : "OTHER OPPORTUNITIES"
                  }
                  showTitle={false}
                  onNavigateToOtherTab={
                    selectedTab === "perfectMatch"
                      ? () => handleTabChange("otherApplications")
                      : () => handleTabChange("perfectMatch")
                  }
                />
              ) : (
                // Desktop skeleton - show grid skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center w-full max-w-[436px] md:max-w-[900px] mx-auto px-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              )
            ) : hasNoData ? (
              // Show empty state if we have no data
              <div className="w-full">
                {selectedTab === "perfectMatch" ? (
                  <PerfectMatchEmptyState
                    onExploreClick={() => handleTabChange("otherApplications")}
                  />
                ) : (
                  <OtherOpportunitiesEmptyState />
                )}
              </div>
            ) : (
              // Show the actual content
              <div className="w-full">
                {selectedTab === "perfectMatch" ? (
                  <PerfectMatch setSelectedTab={handleTabChange} />
                ) : (
                  <OtherApplications setSelectedTab={handleTabChange} />
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

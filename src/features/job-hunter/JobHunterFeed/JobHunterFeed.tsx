import { FC, useState, useEffect, useRef } from "react";
import sparkeIcon from "images/sparkle-icon.png";
import { perfectMatch, others } from "mockData/jobs-data";
import jobHunterAds from "images/job-hunter-ads.svg?url";
import jobHunterMobileAds from "images/job-hunter-mobile-ads.svg?url";
import bulb from "images/bulb.svg?url";
import jobHunterPopAds from "images/popup-hunter.svg?url";

import { Button } from "components";
import { JobCardSkeleton } from "components";
import { BookmarkLimitHandler } from "components";

import { JobCardDesktop, JobCardMobile } from "features";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "components";


import { useJobHunterContext } from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
  isFreeTrial?: boolean;
}

interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  position: string;
  company: string;
  location: string;
  description: string;
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
}

interface AdItem {
  isAd: true;
  image: string;
}

type CardItem = Match | AdItem;

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab, isFreeTrial }) => {
  const [displayedItems, setDisplayedItems] = useState<CardItem[]>(() => {
    // Initial load of 5 items
    const initialItems = perfectMatch.slice(0, 5);
    if (isFreeTrial) {
      // Insert first ad at position 3
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

    const currentItemCount = isFreeTrial
      ? displayedItems.filter((item): item is Match => !("isAd" in item)).length
      : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = perfectMatch.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (isFreeTrial) {
      // Calculate if we need an ad in the next 2 positions
      const realItemsCount = displayedItems.filter(item => !("isAd" in item)).length;
      const nextPositionNeedsAd = (realItemsCount + 1 - 3) % 5 === 0;
      const secondPositionNeedsAd = (realItemsCount + 2 - 3) % 5 === 0;

      if (nextPositionNeedsAd) {
        // Load 1 real item + ad
        const newItems = perfectMatch.slice(startIndex, startIndex + 1);
        setDisplayedItems((prev) => [
          ...prev,
          ...newItems,
          { isAd: true, image: jobHunterAds }
        ]);
      } else if (secondPositionNeedsAd) {
        // Load 2 real items + ad
        const newItems = perfectMatch.slice(startIndex, startIndex + 2);
        setDisplayedItems((prev) => [
          ...prev,
          newItems[0],
          { isAd: true, image: jobHunterAds }
        ]);
      } else {
        // Load 2 regular items
        const itemsToLoad = Math.min(2, remainingItems);
        const newItems = perfectMatch.slice(startIndex, startIndex + itemsToLoad);
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
    const initialItems = perfectMatch.slice(0, isFreeTrial ? 5 : 6);
    if (isFreeTrial) {
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
  }, [setSelectedTab, isFreeTrial, perfectMatch, jobHunterAds]);

  // Calculate loading cards
  const remainingItems = isFreeTrial
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-[1400px]:gap-8 2xl:gap-12 justify-items-center w-full max-w-[932px]">
      <BookmarkLimitHandler
        isFreeTrial={isFreeTrial}
        maxBookmarks={3}
        onUpgradeClick={() => {
          console.log("Upgrade clicked");
        }}
        limitPopupImage={jobHunterPopAds}
        limitPopupTitle="Job Hunter Bookmark Limit"
        limitPopupDescription="Upgrade to bookmark more job matches!"
      >
        {displayedItems.map((item, index) =>
          "isAd" in item ? (
            <div
              key={`ad-${index}`}
              className="w-[436px] h-[275px] rounded-lg overflow-hidden"
            >
              <img
                src={item.image}
                alt="Job Hunter Ad"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <JobCardDesktop
              key={index}
              match={item}
              isFreeTrial={isFreeTrial}
            />
          )
        )}
      </BookmarkLimitHandler>

      {showLoadingCards && (
        <>
          <JobCardSkeleton />
          {loadingCardsCount > 1 && <JobCardSkeleton />}
        </>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="bg-transparent border-none w-full h-[275px] flex items-center justify-center text-center">
          <div className="p-10">
            <p className="text-xl font-semibold text-white">
              You've reached the end of your perfect matches for now!
            </p>
            <span className="text-white text-[20px] font-semibold ml-4">
              Explore
            </span>
            <Button
              variant="link"
              className="text-[20px] text-orange-500 font-semibold pl-2 underline pt-0"
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
  isFreeTrial,
}) => {
  const [displayedItems, setDisplayedItems] = useState<CardItem[]>(() => {
    // Initial load of 5 items
    const initialItems = others.slice(0, isFreeTrial ? 5 : 6);
    if (isFreeTrial) {
      // Insert first ad at position 3
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

    const currentItemCount = isFreeTrial
      ? displayedItems.filter((item): item is Match => !("isAd" in item)).length
      : displayedItems.length;
    const startIndex = currentItemCount;
    const remainingItems = others.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    if (isFreeTrial) {
      // Calculate if we need an ad in the next 2 positions
      const realItemsCount = displayedItems.filter(item => !("isAd" in item)).length;
      const nextPositionNeedsAd = (realItemsCount + 1 - 3) % 5 === 0;
      const secondPositionNeedsAd = (realItemsCount + 2 - 3) % 5 === 0;

      if (nextPositionNeedsAd) {
        // Load 1 real item + ad
        const newItems = others.slice(startIndex, startIndex + 1);
        setDisplayedItems((prev) => [
          ...prev,
          ...newItems,
          { isAd: true, image: jobHunterAds }
        ]);
      } else if (secondPositionNeedsAd) {
        // Load 2 real items + ad
        const newItems = others.slice(startIndex, startIndex + 2);
        setDisplayedItems((prev) => [
          ...prev,
          newItems[0],
          { isAd: true, image: jobHunterAds }
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
    const initialItems = others.slice(0, isFreeTrial ? 5 : 6);
    if (isFreeTrial) {
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
  }, [setSelectedTab, isFreeTrial, others, jobHunterAds]);

  // Calculate loading cards
  const remainingItems = isFreeTrial
    ? others.length -
      displayedItems.filter((item) => !("isAd" in item)).length
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-[1400px]:gap-8 2xl:gap-12 justify-items-center w-full max-w-[932px]">
      <BookmarkLimitHandler
        isFreeTrial={isFreeTrial}
        maxBookmarks={3}
        onUpgradeClick={() => {
          console.log("Upgrade clicked");
        }}
        limitPopupImage={jobHunterPopAds}
        limitPopupTitle="Job Hunter Bookmark Limit"
        limitPopupDescription="Upgrade to bookmark more job matches!"
      >
        {displayedItems.map((item, index) =>
          "isAd" in item ? (
            <div
              key={`ad-${index}`}
              className="w-[436px] h-[275px] rounded-lg overflow-hidden"
            >
              <img
                src={item.image}
                alt="Job Hunter Ad"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <JobCardDesktop
              key={index}
              match={item}
              isFreeTrial={isFreeTrial}
            />
          )
        )}
      </BookmarkLimitHandler>

      {/* Dynamic Loading Cards */}
      {showLoadingCards && (
        <>
          <JobCardSkeleton />
          {loadingCardsCount > 1 && <JobCardSkeleton />}
        </>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
          <div className="p-10">
            <p className="text-xl font-semibold text-white">
              You've reached the end of your other application cards for now!
            </p>
            <span className="text-white text-[20px] font-semibold ml-4">
              Explore your
            </span>
            <Button
              variant="link"
              className="text-[20px] text-orange-500  font-semibold pl-2 underline pt-0"
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

interface EndCardProps {
  type: "perfectMatch" | "otherOpportunities";
}

const EndCard: React.FC<EndCardProps> = ({ type }) => {
  const cardContent = {
    perfectMatch: {
      mainText: "perfect matches",
      exploreText: "Explore more options below",
    },
    otherOpportunities: {
      mainText: "other opportunities",
      exploreText: "Explore your perfect matches",
    },
  };

  const content = cardContent[type];

  return (
    <div className="flex flex-col items-center w-[308px] h-[420px] bg-transparent rounded-lg text-center">
      <div className="px-10 pt-[55px] flex flex-col items-center w-full">
        <div className="text-xl font-semibold text-white">
          <div>You've reached the</div>
          <div>
            end of your{" "}
            <span className="text-[#F5722E] font-semibold">
              {type === "perfectMatch" ? "perfect" : content.mainText}
            </span>
          </div>
          {type === "perfectMatch" && (
            <div>
              <span className="text-[#F5722E] font-semibold">matches</span>{" "}
              for now!
            </div>
          )}
          {type === "otherOpportunities" && <div>for now!</div>}
        </div>
        <div className="text-xl font-semibold text-white mt-0.5">
          <div>{content.exploreText}</div>
        </div>
        <div className="flex justify-center w-full mt-6">
          <img
            src={bulb}
            alt="Bulb"
            className="w-[55px] h-[75px] fill-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

interface JobHunterSectionProps {
  isFreeTrial?: boolean;
}

const JobHunterFeed: FC<JobHunterSectionProps> = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");

  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());
  const { isFreeTrial } = useJobHunterContext();

  const toggleBookmark = (section: string, index: number) => {
    const combinedId = `${section}-${index}`;
    setBookmarkedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(combinedId)) {
        newSet.delete(combinedId);
      } else {
        newSet.add(combinedId);
      }
      return newSet;
    });
  };

  const handleTabChange = (tab: string) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-[1400px]:gap-8 2xl:gap-12 justify-items-center w-full max-w-[932px]">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    );
  };

  // Helper function to inject ads for mobile view
  const getItemsWithAds = (items: Match[]): CardItem[] => {
    if (!isFreeTrial) return items;

    const result: CardItem[] = [];
    let itemCount = 0;

    // Process each item and add ads at position 3 and every 5 items after
    items.forEach((item) => {
      if (itemCount === 3 || (itemCount > 3 && (itemCount - 3) % 5 === 0)) {
        result.push({ isAd: true, image: jobHunterMobileAds });
      }
      result.push(item);
      itemCount++;
    });

    return result;
  };

  return (
    <div className="w-full mt-4 md:mt-8 md:my-2">
      {/* Application Cards Section - Desktop View */}
      <div className="hidden md:flex flex-col items-center">
        <div className="flex justify-center mb-8 w-full">
        <button
            className={`font-semibold mr-6 pb-2 text-[17px] inline-flex items-center gap-2 transition-colors ${
              selectedTab === "perfectMatch"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD] hover:text-orange-400"
            }`}
            onClick={() => handleTabChange("perfectMatch")}
            disabled={isLoading}
          >
            <img
              src={sparkeIcon}
              alt="Sparkle Icon"
              className={`w-5 h-5 ${
                selectedTab === "perfectMatch"
                  ? "filter grayscale-0"
                  : "filter grayscale"
              }`}
            />
            PERFECT MATCH
          </button>
          {/* Other Applications Tab */}
          <button
            className={`font-semibold pb-2 text-[17px] transition-colors ${
              selectedTab === "otherApplications"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD] hover:text-orange-400"
            }`}
            onClick={() => handleTabChange("otherApplications")}
            disabled={isLoading}
          >
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
                  isFreeTrial={isFreeTrial}
                />
              ) : (
                <OtherApplications
                  setSelectedTab={handleTabChange}
                  isFreeTrial={isFreeTrial}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Carousel View */}
      <div className="block md:hidden w-full p-6 flex-grow overflow-x-hidden">
        <div id="perfect-match-mobile">
          <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#F5722E] text-center font-semibold pb-2">
            <img
              src={sparkeIcon}
              alt="Sparkle Icon"
              className="w-[22px] h-[24px]"
            />
            PERFECT MATCH
          </h3>

          <Carousel className="w-full max-w-[320px] mx-auto">
            <CarouselContent>
              {getItemsWithAds(perfectMatch).map((item, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  {"isAd" in item ? (
                    <img
                      src={item.image}
                      alt="Job Hunter Ad"
                      className="w-[308px]"
                    />
                  ) : (
                    <div className="relative w-full max-w-[320px]">
                      <JobCardMobile
                        match={item}
                        isFreeTrial={isFreeTrial}
                        bookmarked={bookmarkedCards.has(`perfectMatch-${index}`)}
                        onBookmark={() => toggleBookmark("perfectMatch", index)}
                      />
                    </div>
                  )}
                </CarouselItem>
              ))}
              <CarouselItem className="flex justify-center">
                <EndCard type="perfectMatch" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>
        </div>

        <div id="other-applications-mobile" className="pt-12 pb-6">
          <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#AEADAD] text-center font-semibold pb-2">
            OTHER OPPORTUNITIES
          </h3>

          <Carousel className="w-full max-w-[320px] mx-auto">
            <CarouselContent>
              {getItemsWithAds(others).map((item, index) => (
                <CarouselItem key={index} className="flex justify-center">
                  {"isAd" in item ? (
                    <img
                      src={item.image}
                      alt="Job Hunter Ad"
                      className="w-[308px]"
                    />
                  ) : (
                    <div className="relative w-full max-w-[320px]">
                      <JobCardMobile
                        match={item}
                        isFreeTrial={isFreeTrial}
                        bookmarked={bookmarkedCards.has(`others-${index}`)}
                        onBookmark={() => toggleBookmark("others", index)}
                      />
                    </div>
                  )}
                </CarouselItem>
              ))}
              <CarouselItem className="flex justify-center">
                <EndCard type="otherOpportunities" />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden" />
            <CarouselNext className="hidden" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export { JobHunterFeed };

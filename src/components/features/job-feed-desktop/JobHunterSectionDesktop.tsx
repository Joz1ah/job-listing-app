import { FC, useState, useEffect, useRef } from "react";
import sparkeIcon from "images/sparkle-icon.png";
import { perfectMatch, others } from "mockData/job-hunter-data";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import { CircularPagination } from "components";

import { Button } from "components";
import { JobHunterCardLoading } from "components";
import {
  JobHunterCardDesktop,
  JobHunterCardMobile,
  BookmarkLimitHandler,
} from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
  isFreeTrial?: boolean;
}

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab }) => {
  const [displayedItems, setDisplayedItems] = useState<typeof perfectMatch>(
    perfectMatch.slice(0, 6),
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(perfectMatch.length > 6);
  const loaderRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 2;

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const startIndex = displayedItems.length;
    const remainingItems = perfectMatch.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(ITEMS_PER_PAGE, remainingItems);
    const newItems = perfectMatch.slice(startIndex, startIndex + itemsToLoad);

    if (newItems.length > 0) {
      setDisplayedItems((prev) => [...prev, ...newItems]);
    }

    if (startIndex + itemsToLoad >= perfectMatch.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Reset when switching tabs
  useEffect(() => {
    setDisplayedItems(perfectMatch.slice(0, 6));
    setHasMore(perfectMatch.length > 6);
    setLoading(false);
  }, [setSelectedTab]);

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

  // Calculate remaining items and loading cards needed
  const remainingItems = perfectMatch.length - displayedItems.length;
  const showLoadingCards = loading && remainingItems > 0;
  const loadingCardsCount = Math.min(2, remainingItems);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* BookmarkLimitHandler no longer needs className prop */}
      <BookmarkLimitHandler
        isFreeTrial={false}
        maxBookmarks={3}
        onUpgradeClick={() => {
          console.log("Upgrade clicked");
        }}
      >
        {displayedItems.map((match, index) => (
          <JobHunterCardDesktop key={index} match={match} />
        ))}
      </BookmarkLimitHandler>

      {showLoadingCards && (
        <>
          <JobHunterCardLoading />
          {loadingCardsCount > 1 && <JobHunterCardLoading />}
        </>
      )}

      {!hasMore && displayedItems.length > 0 && (
        <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
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

const OtherApplications: FC<selectedProps> = ({ setSelectedTab }) => {
  const [displayedItems, setDisplayedItems] = useState<typeof others>(
    others.slice(0, 6),
  );
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(others.length > 6);
  const loaderRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 2;

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const startIndex = displayedItems.length;
    const remainingItems = others.length - startIndex;

    if (remainingItems <= 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    const itemsToLoad = Math.min(ITEMS_PER_PAGE, remainingItems);
    const newItems = others.slice(startIndex, startIndex + itemsToLoad);

    if (newItems.length > 0) {
      setDisplayedItems((prev) => [...prev, ...newItems]);
    }

    if (startIndex + itemsToLoad >= others.length) {
      setHasMore(false);
    }

    setLoading(false);
  };

  // Reset when switching tabs
  useEffect(() => {
    setDisplayedItems(others.slice(0, 6));
    setHasMore(others.length > 6);
    setLoading(false);
  }, [setSelectedTab]);

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

  // Calculate remaining items and loading cards needed
  const remainingItems = others.length - displayedItems.length;
  const showLoadingCards = loading && remainingItems > 0;
  const loadingCardsCount = Math.min(2, remainingItems);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      <BookmarkLimitHandler
        isFreeTrial={false}
        maxBookmarks={3}
        onUpgradeClick={() => {
          console.log("Upgrade clicked");
        }}
      >
        {displayedItems.map((match, index) => (
          <JobHunterCardDesktop key={index} match={match} />
        ))}
      </BookmarkLimitHandler>

      {/* Dynamic Loading Cards */}
      {showLoadingCards && (
        <>
          <JobHunterCardLoading />
          {loadingCardsCount > 1 && <JobHunterCardLoading />}
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

const JobHunterSectionDesktop: FC = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");
  const [perfectMatchApi, setPerfectMatchApi] = useState<
    SwiperType | undefined
  >(undefined);
  const [othersApi, setOthersApi] = useState<SwiperType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

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

  // Current definition from your code
  const LoadingGrid = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {[1, 2, 3, 4].map((i) => (
          <JobHunterCardLoading key={i} />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-8 md:my-2">
      {/* Application Cards Section - Desktop View */}
      <div className="hidden md:block max-w-5xl mx-auto pt-8 md:pt-2 mt-8 md:mt-2 px-4 md:px-6 pb-4">
        <div className="flex justify-center mb-8 md:mb-6">
          {/* Perfect Match Tab */}
          <button
            className={`font-semibold mr-6 pb-2 text-[17px] inline-flex items-center gap-2 ${
              selectedTab === "perfectMatch"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD]"
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
            className={`font-semibold pb-2 text-[17px] ${
              selectedTab === "otherApplications"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD]"
            }`}
            onClick={() => handleTabChange("otherApplications")}
            disabled={isLoading}
          >
            OTHER OPPORTUNITIES
          </button>
        </div>

        <div className="min-h-[600px]">
          {isLoading ? (
            <LoadingGrid />
          ) : (
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

      

      {/* Mobile Carousel View */}
      <div className="block md:hidden w-full p-6 flex-grow overflow-x-hidden">
        <div>
          <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#F5722E] text-center font-semibold pb-2">
            <img
              src={sparkeIcon}
              alt="Sparkle Icon"
              className="w-[22px] h-[24px]"
            />
            PERFECT MATCH
          </h3>

          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={1}
            modules={[]} // Remove unnecessary modules
            onSwiper={setPerfectMatchApi}
            className="!pt-5 !pb-12 custom-swiper"
          >
            {perfectMatch.map((match, index) => (
              <SwiperSlide
                key={index}
                className="!w-[320px] flex justify-center items-center custom-slide"
              >
                <div className="relative w-full max-w-[320px]">
                  <JobHunterCardMobile
                    match={match}
                    isFreeTrial={false}
                    bookmarked={bookmarkedCards.has(`perfectMatch-${index}`)}
                    onBookmark={() => toggleBookmark("perfectMatch", index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <CircularPagination api={perfectMatchApi} color="#F5722E" />
        </div>

        <div className="pt-12 pb-6">
          <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#AEADAD] text-center font-semibold pb-2">
            OTHER APPLICATION CARDS
          </h3>

          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            initialSlide={1}
            modules={[]} // Remove unnecessary modules
            onSwiper={setOthersApi}
            className="!pt-5 !pb-12 custom-swiper"
          >
            {others.map((other, index) => (
              <SwiperSlide
                key={index}
                className="!w-[320px] flex justify-center items-center custom-slide"
              >
                <div className="relative w-full max-w-[320px]">
                  <JobHunterCardMobile match={other} 
                  isFreeTrial={false} 
                  bookmarked={bookmarkedCards.has(`others-${index}`)}
                  onBookmark={() => toggleBookmark("others", index)}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <CircularPagination api={othersApi} color="#F5722E" />
        </div>
      </div>
    </div>
  );
};

export { JobHunterSectionDesktop };

import { FC, useState, useEffect } from "react";
import sparkeIcon from "images/sparkle-icon.png";
import { perfectMatch, others } from "mockData/job-hunter-data";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "components";
import { CircularPagination } from "components";

import { Button } from "components";
import { JobHunterCardLoading } from "components";
import { JobHunterCardDesktop, JobHunterCardMobile } from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
}


const PerfectMatch: FC<selectedProps> = ({ setSelectedTab }) => {
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarkedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleClick = () => {
    setSelectedTab("otherApplications");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
      {perfectMatch.map((match, index) => (
        <JobHunterCardDesktop
          key={index}
          match={match}
          bookmarked={bookmarkedCards.has(index)}
          onBookmark={() => toggleBookmark(index)}
        />
      ))}
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
            className="text-[20px] text-orange-500  font-semibold pl-2 underline pt-0"
            onClick={handleClick}
          >
            other application cards
          </Button>
        </div>
      </div>
    </div>
  );
};

const OtherApplications: FC<selectedProps> = ({ setSelectedTab }) => {
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarkedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleClick = () => {
    setSelectedTab("perfectMatch");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
      {others.map((match, index) => (
        <JobHunterCardDesktop
          key={index}
          match={match}
          bookmarked={bookmarkedCards.has(index)}
          onBookmark={() => toggleBookmark(index)}
        />
      ))}
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
    </div>
  );
};

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <JobHunterCardLoading key={i} />
      ))}
    </div>
  );
};

const JobHunterSectionDesktop: FC = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

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

  const [perfectMatchApi, setPerfectMatchApi] = useState<CarouselApi | null>(
    null,
  );
  const [othersApi, setOthersApi] = useState<CarouselApi | null>(null);

  return (
    <>
      <div className="mt-8 md:my-2 md:ml-16">

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

        {/* Application Cards Section - Mobile View */}
        <div className="block md:hidden w-full p-6 flex-grow overflow-x-hidden">
          <Carousel
            opts={{
              align: "center",
              loop: false,
            }}
            className="w-full"
            setApi={setPerfectMatchApi}
          >
            <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#F5722E] text-center font-semibold pb-2">
              <img
                src={sparkeIcon}
                alt="Sparkle Icon"
                className="w-[22px] h-[24px]"
              />
              PERFECT MATCH
            </h3>

            <CarouselContent>
              {perfectMatch.map((job, index) => (
                <CarouselItem key={index} className="pl-4 basis-[320px]">
                  <div className="relative">
                    <JobHunterCardMobile match={job} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CircularPagination api={perfectMatchApi} />
          </Carousel>

          <div className="pt-12 pb-6">
            <Carousel
              opts={{
                align: "center",
                loop: false,
              }}
              className="w-full"
              setApi={setOthersApi}
            >
              <h3 className="text-[17px] md:text-[17px] text-gray-400 text-center font-semibold mb-4">
                OTHER OPPORTUNITIES
              </h3>

              <CarouselContent>
                {others.map((job, index) => (
                  <CarouselItem key={index} className="pl-4 basis-[320px]">
                    <div className="relative">
                      <JobHunterCardMobile match={job} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CircularPagination api={othersApi} />
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
};

export { JobHunterSectionDesktop };

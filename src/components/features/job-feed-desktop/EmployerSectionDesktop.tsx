import { FC, useState, useRef, useEffect } from "react";
import sparkeIcon from "images/sparkle-icon.png";
import { perfectMatch, others } from "matchData/employer-data";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "components";
import { Bookmark, MapPin, MoreVertical } from "lucide-react";
import { Button, Skeleton } from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
}

interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  name: string;
  location: string;
  job: string;
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
  language: string[];
}

const skillColors = {
  matched: "#184E77",
  unmatched: "#168AAD",
};

interface SkillsWithEllipsisProps {
  skills: Skill[];
}

const SkillsWithEllipsis: FC<SkillsWithEllipsisProps> = ({ skills }) => {
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const [showEllipsis, setShowEllipsis] = useState(false);

  useEffect(() => {
    const container = skillsContainerRef.current;
    if (container && container.scrollHeight > container.clientHeight) {
      setShowEllipsis(true);
    }
  }, []);

  return (
    <div className="h-[60px]">
      <span className="text-[13px] font-light">Primary Skills:</span>
      <div ref={skillsContainerRef} className="flex flex-wrap gap-1 max-h-[43px] overflow-hidden relative">
        {skills.map((skill, skillIndex) => (
          <span
            key={skillIndex}
            className="text-white text-xs font-semibold px-1 pt-0.5 rounded-[2px]"
            style={{ backgroundColor: skill.isMatch ? skillColors.matched : skillColors.unmatched }}
          >
            {skill.name}
          </span>
        ))}
        {showEllipsis && <span className="absolute bottom-0 right-0 bg-transparent px-1">...</span>}
      </div>
    </div>
  );
};

interface MatchCardProps {
  match: Match;
  bookmarked: boolean;
  onBookmark: () => void;
}

const MatchCard: FC<MatchCardProps> = ({ match, bookmarked, onBookmark }) => {
  return (
    <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <span className="text-[13px] text-orange-500 font-semibold">☆ NEW</span>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-light text-gray-400 -mr-2">
              Posted {match.appliedAgo}
            </span>
            <Bookmark
              className={`absolute mt-5 -mr-2 cursor-pointer ${
                bookmarked ? 'fill-orange-500' : ''
              } text-orange-500`}
              size={26}
              onClick={onBookmark}
            />
          </div>
        </div>
        <div>
          <CardTitle className="text-sm font-semibold">{match.name}</CardTitle>
          <div className="flex flex-row items-center">
            <MapPin size={14} className="text-orange-500" />
            <p className="text-[13px] font-light mt-0">{match.location}</p>
          </div>
          <p className="text-sm font-light">
            expressed interest as your{" "}
            <span className="text-orange-500 underline">{match.job}</span>
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <SkillsWithEllipsis skills={match.skills} />
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Experience:</span>
            <span className="text-[13px] font-light">{match.experience}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Looking for:</span>
            {match.lookingFor.map((type, index) => (
              <span key={index} className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                {type}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Salary Expectation:</span>
            <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
              {match.salaryExpectation}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Language:</span>
            {match.language.map((lang, index) => (
              <span key={index} className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                {lang}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end -mt-9 -mr-4 space-x-1">
        <Button className="bg-orange-500 text-white text-[12px] font-semibold px-0 w-[133px] h-[27px]">
          Schedule Interview
        </Button>
        <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
      </CardFooter>
    </Card>
  );
};

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab }) => {
  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarkedCards(prev => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {perfectMatch.map((match, index) => (
        <MatchCard
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
          <span className="text-white text-[20px] font-semibold ml-4">Explore</span>
          <Button
            variant="link"
            className="text-[20px] text-orange-500 font-semibold pl-2 underline pt-0"
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
    setBookmarkedCards(prev => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {others.map((other, index) => (
        <MatchCard
          key={index}
          match={other}
          bookmarked={bookmarkedCards.has(index)}
          onBookmark={() => toggleBookmark(index)}
        />
      ))}
      <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
        <div className="p-10">
          <p className="text-xl font-semibold text-white">
            You've reached the end of your other application cards for now!
          </p>
          <span className="text-white text-[20px] font-semibold ml-4">Explore your</span>
          <Button
            variant="link"
            className="text-[20px] text-orange-500 font-semibold pl-2 underline pt-0"
            onClick={handleClick}
          >
            perfect matches
          </Button>
        </div>
      </div>
    </div>
  );
};

const JobCardSkeleton = () => {
  return (
    <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <Skeleton className="h-[15px] w-10 bg-gray-300" />
          <div className="flex flex-col items-end">
            <div className="flex flex-col items-end -mr-2">
              <Skeleton className="h-[17px] w-24 bg-gray-300" />
            </div>
            <div className="absolute mt-5 -mr-2">
              <Skeleton className="h-[26px] w-[20px] bg-gray-300" />
            </div>
          </div>
        </div>
        <div>
          <CardTitle className="text-sm font-semibold">
            <Skeleton className="h-[20px] w-24 bg-gray-300"/>
          </CardTitle>
          <div className="flex flex-row items-center gap-1 mt-1">
            <Skeleton className="h-[14px] w-[14px] bg-gray-300" />
            <Skeleton className="h-[19px] w-32 bg-gray-300" />
          </div>
          <div className="mt-1">
            <Skeleton className="h-[19px] w-80 bg-gray-300" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[60px] mt-1">
          <Skeleton className="h-[19px] w-28 mb-1 bg-gray-300" />
          <div className="flex flex-wrap gap-1 max-h-[43px] overflow-hidden relative">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-[22px] w-16 bg-gray-300" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex gap-2">
            <Skeleton className="h-[19px] w-20 bg-gray-300" />
            <Skeleton className="h-[18px] w-24 bg-gray-300" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[19px] w-24 bg-gray-300" />
            <div className="flex gap-1">
              <Skeleton className="h-[18px] w-16 bg-gray-300" />
              <Skeleton className="h-[18px] w-16 bg-gray-300" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[19px] w-16 bg-gray-300" />
            <Skeleton className="h-[18px] w-24 bg-gray-300" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-[19px] w-16 bg-gray-300" />
            <div className="flex gap-1">
              <Skeleton className="h-[18px] w-16 bg-gray-300" />
              <Skeleton className="h-[18px] w-16 bg-gray-300" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-row justify-end -mt-9 -mr-4 space-x-1">
        <Skeleton className="h-[27px] w-[133px] bg-gray-300" />
        <Skeleton className="h-[12px] w-[12px] bg-gray-300" />
      </CardFooter>
    </Card>
  );
};

const LoadingGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {[1, 2, 3, 4].map((i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
};

const EmployerSectionDesktop: FC = () => {
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

  return (
    <>
      <div className="flex flex-col items-center pt-8 md:pt-24 mt-8 md:mt-12 px-4 md:pr-24 pb-4 ml-0 pl-0 mb-8">
        <div className="flex mb-8 md:mb-12">
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
          <button
            className={`font-semibold pb-2 text-[17px] ${
              selectedTab === "otherApplications"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD]"
            }`}
            onClick={() => handleTabChange("otherApplications")}
            disabled={isLoading}
          >
            OTHER APPLICATION CARDS
          </button>
        </div>

        <div className="w-full">
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
    </>
  );
};

export { EmployerSectionDesktop };
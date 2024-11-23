import { FC } from "react";
import { SkillsWithEllipsis } from "components";
import { Bookmark, MoreVertical, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";
import { Button } from "components";

interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  name: string;
  location: string;
  job: string
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
  language: string[];
}

interface MatchCardProps {
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
  isFreeTrial?: boolean;
}

const SecureNameDisplay: FC<{ isFreeTrial: boolean; realName: string }> = ({
  isFreeTrial,
  realName,
}) => {
  if (isFreeTrial) {
    return (
      <div className="relative">
        <div className="select-none pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(realName.length).fill("X").join("")}
            </div>
          </div>
        </div>
        <div className="h-6" />
      </div>
    );
  }

  return <CardTitle className="text-sm font-semibold">{realName}</CardTitle>;
};

const getAvailabilityStyle = (type: string) => {
  if (type.toLowerCase() === 'part time') {
    return 'bg-[#BF532C]'; // Darker orange for Part Time
  }
  return 'bg-[#F5722E]'; // Default orange for other options
};

// Common bookmark button component to ensure consistent behavior
const BookmarkButton: FC<{ 
  bookmarked: boolean; 
  onBookmark: () => void; 
  className?: string;
}> = ({ bookmarked, onBookmark, className = "" }) => (
  <Bookmark
    className={`cursor-pointer ${
      bookmarked ? "fill-orange-500" : ""
    } text-orange-500 ${className}`}
    size={26}
    onClick={(e) => {
      e.stopPropagation(); // Prevent event bubbling
      onBookmark();
    }}
  />
);

const LanguageTag: FC<{ language: string }> = ({ language }) => (
  <span className="text-[#F5722E] text-[10px] rounded-[4px] px-1.5 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
    {language}
  </span>
);

const AppCardDesktop: FC<MatchCardProps> = ({
  match,
  bookmarked = false,
  onBookmark = () => {},
  isFreeTrial = false,
}) => {
  return (
    <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full relative">
          <span className="text-[13px] text-orange-500 font-semibold">
            ☆ NEW
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-light text-gray-400 -mr-2">
              Posted {match.appliedAgo}
            </span>
          </div>
        </div>
        <div className="w-full relative">
          <SecureNameDisplay isFreeTrial={isFreeTrial} realName={match.name} />
          <BookmarkButton 
            bookmarked={bookmarked} 
            onBookmark={onBookmark}
            className="absolute top-0 right-[-8px]" 
          />
          <div className="flex flex-row items-center">
            <MapPin size={14} className="text-orange-500" />
            <p className="text-[13px] font-light mt-0">Based in {match.location}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[55px]">
          <SkillsWithEllipsis skills={match.skills} />
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Experience:</span>
            <span className="text-[12px] text-orange-500 font-light border border-orange-500 rounded-[4px] px-1.5">
              {match.experience}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Looking for:</span>
            {match.lookingFor.map((type, index) => (
              <span
                key={index}
                className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
              >
                {type}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Salary Expectation:</span>
            <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
              {match.salaryExpectation}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-[13px] font-light">Language:</span>
            {match.language.map((lang, index) => (
              <LanguageTag key={index} language={lang} />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end -mt-4 -mr-4 space-x-1">
        <Button
          className= "text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-orange-500"
        >
          Schedule Interview
        </Button>
        <MoreVertical 
          size={12} 
          className="text-gray-700 cursor-pointer"
          onClick={(e) => e.stopPropagation()} 
        />
      </CardFooter>
    </Card>
  );
};

const AppCardMobile: FC<MatchCardProps> = ({
  match,
  bookmarked = false,
  onBookmark = () => {},
  isFreeTrial = false,
}) => (
  <Card className="bg-[#F5F5F7] w-[308px] h-[395px] p-4 transition-all duration-300 hover:shadow-lg relative flex flex-col">
    <CardHeader className="flex-1 overflow-y-auto p-0">
      <div className="w-full">
        <div className="flex flex-col items-end justify-end">
          <div className="flex-1">
            <span className="text-[11px] text-gray-600 font-light">
              Applied {match.appliedAgo}
            </span>
          </div>
          <div className="absolute top-10">
            <BookmarkButton 
              bookmarked={bookmarked} 
              onBookmark={onBookmark}
            />
          </div>
        </div>

        <div className="pt-2 pl-2">
          <SecureNameDisplay isFreeTrial={isFreeTrial} realName={match.name} />
          <p className="text-[10px] text-[#F5722E] flex items-center mb-2">
            <MapPin size={9} className="mr-1 text-[#F5722E]" />
            {match.location}
          </p>

          <div className="flex flex-col gap-2">
            <div className="h-[60px]">
              <SkillsWithEllipsis skills={match.skills} />
            </div>

            <div className="flex gap-2">
              <span className="text-[10px] font-light">Experience:</span>
              <span className="text-[10px] font-light">{match.experience}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-light">Looking for:</span>
              {match.lookingFor.map((type, index) => (
                <span
                  key={index}
                  className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center`}
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="text-[10px] font-light">
                Salary Expectation:
              </span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-light">Language:</span>
              {match.language.map((lang, index) => (
                <LanguageTag key={index} language={lang} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0 mt-auto flex flex-col items-center">
      <Button
        variant="default"
        className= "text-[12px] font-semibold bg-orange-500"
      >
        Schedule Interview
      </Button>
      <MoreVertical
        size={12}
        className="text-gray-700 cursor-pointer absolute bottom-2 right-2"
        onClick={(e) => e.stopPropagation()}
      />
    </CardContent>
  </Card>
);

export { AppCardDesktop, AppCardMobile };
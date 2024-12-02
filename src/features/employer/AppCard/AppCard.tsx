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
import { useBookmarks } from "components/context/BookmarkContext";

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

interface AppCardProps {
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
  return type.toLowerCase() === 'part time' ? 'bg-[#BF532C]' : 'bg-[#F5722E]';
};

const generateCardId = (match: Match): string => {
  return `${match.name}-${match.job}-${match.location}`.toLowerCase().replace(/\s+/g, '-');
};

const BookmarkButton: FC<{ 
  cardId: string;
  className?: string;
}> = ({ cardId, className = "" }) => {
  const { isBookmarked, handleBookmarkToggle } = useBookmarks();
  const bookmarked = isBookmarked(cardId);

  return (
    <Bookmark
      className={`cursor-pointer ${
        bookmarked ? "fill-orange-500" : ""
      } text-orange-500 ${className}`}
      size={26}
      onClick={(e) => {
        e.stopPropagation();
        handleBookmarkToggle(cardId);
      }}
    />
  );
};

const LanguageTag: FC<{ language: string }> = ({ language }) => (
  <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-sm px-1">
    {language}
  </span>
);

const AppCard: FC<AppCardProps> = ({
  match,
  isFreeTrial = false,
}) => {
  const cardId = generateCardId(match);

  return (
    <Card className="bg-[#FFFFFF] border-none w-full max-w-[436px] h-[275px] relative">
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
            cardId={cardId}
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
            <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
              {match.experience}
            </span>
          </div>
          <div className="flex gap-2 gap-y-0 flex-wrap">
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
            <span className="text-[13px] font-light">Salary:</span>
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

      <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
        <Button
          className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-orange-500"
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

export { AppCard }
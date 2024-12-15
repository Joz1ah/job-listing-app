import { FC } from "react";
import { SkillsWithEllipsis } from "components";
import { Bookmark, MoreVertical, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "components";
import { Button } from "components";
import { useBookmarks } from "components/context/BookmarkContext";
import { Match } from "mockData/job-hunter-data";

interface BookmarkCardProps {
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
}

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const generateCardId = (match: Match): string => {
  return `${match.firstName}-${match.lastName}-${match.position}-${match.location}`
    .toLowerCase()
    .replace(/\s+/g, "-");
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
        bookmarked ? "fill-[#F5722E]" : ""
      } text-[#F5722E] ${className}`}
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

const BookmarkCard: FC<BookmarkCardProps> = ({ match }) => {
  const cardId = generateCardId(match);

  const handleCardClick = () => {
    // Handle card click - to be implemented
  };

  return (
    <Card
      className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-[275px] relative"
      onClick={handleCardClick}
    >
      <div className="flex flex-col h-full">
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <div className="h-[20px]">
              <span className="absolute text-[13px] text-[#F5722E] font-bold italic">
                ☆ NEW
              </span>
            </div>
            <div className="flex flex-col items-end relative">
              <span className="text-[12px] font-light text-[#717171] -mr-2">
                Posted {match.appliedAgo}
              </span>
              <div className="absolute top-6 -right-2">
                <BookmarkButton cardId={cardId} className="" />
              </div>
            </div>
          </div>
          <div className="w-full relative mt-2">
            <h3 className="text-[14px] font-semibold text-[#263238]">
              {match.position}
            </h3>
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 ml-2 text-[#263238]">
                Based in {match.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1 flex-1">
          <div className="h-[50px]">
            <SkillsWithEllipsis skills={match.coreSkills} />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2 items-center">
              <span className="text-[13px] font-light text-[#263238]">Experience:</span>
              <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">Looking for:</span>
              {match.lookingFor.map((type, index) => (
                <span
                  key={index}
                  className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[13px] font-light text-[#263238]">Salary:</span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">Language:</span>
              {match.language.map((lang, index) => (
                <LanguageTag key={index} language={lang} />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
          <Button
            variant="outline"
            className="text-[10px] md:text-[12px] font-normal w-[60px] h-[24px] bg-[#168AAD] hover:bg-[#168AAD]/90 text-white hover:text-white rounded-sm"
          >
            Button
          </Button>
          <Button
            variant="outline"
            className="text-[10px] md:text-[12px] font-normal w-[60px] h-[24px] bg-[#168AAD] hover:bg-[#168AAD]/90 text-white hover:text-white rounded-sm"
          >
            Button
          </Button>
          <Button
            variant="outline"
            className="text-[10px] md:text-[12px] font-normal w-[60px] h-[24px] bg-[#168AAD] hover:bg-[#168AAD]/90 text-white hover:text-white rounded-sm"
          >
            Button
          </Button>
          <MoreVertical
            size={12}
            className="text-gray-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              // Handle more options
            }}
          />
        </CardFooter>
      </div>
    </Card>
  );
};

export { BookmarkCard };
import { FC, useState, useEffect } from "react";
import { SkillsWithEllipsis } from "components";
import { MoreVertical, MapPin, Bookmark } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";
import { Button } from "components";
import { EmployerMatch } from "mockData/hero-carousel-perfectmatch-data";
import { useEmployerContext } from "components";
import { Tooltip } from "components";

// Format time ago function similar to the one in AppCard
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Convert to minutes, hours, days
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return "just now";
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  }
};

// Function to check if a post is new (less than 24 hours old)
const isNewPost = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours < 24;
};

interface HeroAppCardProps {
  match: EmployerMatch;
  bookmarked?: boolean;
  onBookmark?: () => void;
  popupImage?: string;
}

interface SecureNameDisplayProps {
  realName: string;
}

const SecureNameDisplay: FC<SecureNameDisplayProps> = ({ realName }) => {
  const { subscriptionPlan } = useEmployerContext();

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="relative">
        <div className="select-none pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(realName.length).fill("X").join("")}
            </div>
          </div>
        </div>
        <div className="h-4" />
      </div>
    );
  }

  return (
    <CardTitle className="text-sm font-semibold text-[#263238]">
      {realName}
    </CardTitle>
  );
};

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

// Match the language tag styling with AppCard
const LanguageTag: FC<{ language: string }> = ({ language }) => (
  <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-sm px-1">
    {language}
  </span>
);

const HeroAppCard: FC<HeroAppCardProps> = ({ match }) => {
  const { subscriptionPlan } = useEmployerContext();
  const [formattedPostDate, setFormattedPostDate] = useState("N/A");
  const [shouldShowNew, setShouldShowNew] = useState(false);

  useEffect(() => {
    if (match.posted) {
      setFormattedPostDate(formatTimeAgo(match.posted));
      setShouldShowNew(match.isNew || isNewPost(match.posted));
    }
  }, [match.posted, match.isNew]);

  return (
    <>
      <Card
        className={`bg-[#FFFFFF] border-none w-full max-w-[436px] h-[350px] sm:h-[275px] relative transition-shadow duration-200 ${
          subscriptionPlan === "freeTrial"
            ? "cursor-default"
            : "cursor-pointer hover:shadow-lg"
        }`}
      >
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full relative">
            <div className="h-5">
              {shouldShowNew && (
                <span className="text-[13px] text-[#F5722E] font-bold italic">
                  ☆ NEW
                </span>
              )}
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-light text-[#717171] -mr-2">
                Posted {formattedPostDate}
              </span>
            </div>
          </div>
          <div className="w-full relative">
            <SecureNameDisplay
              realName={`${match.firstName} ${match.lastName}`}
            />
            <Bookmark
              className="absolute top-0 right-[-8px] text-[#F5722E]"
              size={26}
            />
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-[#F5722E]" />
              <p className="text-[13px] font-light mt-0 text-[#263238]">
                Based in {match.country}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="h-auto md:h-[60px]">
            <SkillsWithEllipsis skills={match.coreSkills} />
          </div>

          <div className="flex flex-col gap-1 mt-2">
            <div className="flex gap-2">
              <span className="text-[13px] font-light text-[#263238]">
                Experience:
              </span>
              <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-2 gap-y-0 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Looking for:
              </span>
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
              <span className="text-[13px] font-light text-[#263238]">
                Salary:
              </span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Language:
              </span>
              {match.language.map((lang, index) => (
                <LanguageTag key={index} language={lang} />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
          {subscriptionPlan === "freeTrial" ? (
            <Tooltip content="Sign up to schedule an interview">
              <Button className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-[#F5722E] hover:bg-[#F5722E] cursor-pointer">
                Schedule Interview
              </Button>
            </Tooltip>
          ) : (
            <Button className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-[#F5722E] hover:bg-[#F5722E] cursor-pointer">
              Schedule Interview
            </Button>
          )}
          <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
        </CardFooter>
      </Card>
    </>
  );
};

export { HeroAppCard };
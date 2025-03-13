import { FC } from "react";
import { MoreVertical, MapPin, Bookmark } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";
import { Button } from "components";
import { SkillsWithEllipsis } from "components";
import { JobMatch } from "mockData/hero-carousel-perfectmatch-data";
import { useJobHunterContext } from "components";

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

interface HeroJobCardProps {
  match: JobMatch;
  popupImage?: string;
}

interface SecureCompanyDisplayProps {
  company: string;
}

const SecureCompanyDisplay: FC<SecureCompanyDisplayProps> = ({ company }) => {
  const { subscriptionPlan } = useJobHunterContext();

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="relative">
        <div className="select-none pointer-events-none">
          <div className="relative">
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(company.length).fill("X").join("")}
            </div>
          </div>
        </div>
        <div className="h-4" />
      </div>
    );
  }

  return (
    <p className="text-[13px] text-[#263238] font-light mt-0 underline">
      {company}
    </p>
  );
};

const getAvailabilityStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const HeroJobCard: FC<HeroJobCardProps> = ({ match }) => {
  const { subscriptionPlan } = useJobHunterContext();

  // Use the formatTimeAgo function to format the post date
  const formattedPostDate = formatTimeAgo(match.posted);

  // Determine if the post is new
  const shouldShowNew = match.isNew || isNewPost(match.posted);

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
          <div className="flex flex-row -mt-4 justify-between w-full">
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
            <CardTitle className="text-sm font-semibold text-[#263238]">
              {match.position}
            </CardTitle>
            <Bookmark
              className="absolute top-0 right-[-8px] text-[#F5722E]"
              size={26}
            />
            <SecureCompanyDisplay company={match.company} />
            <div className="flex flex-row items-center gap-1">
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
            <div className="flex gap-2 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Experience:
              </span>
              <span className="text-[12px] text-[#F5722E] font-light rounded-[4px] px-1.5 border border-[#F5722E]">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-x-2 gap-y-0 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Available for:
              </span>
              {match.lookingFor.map((type, idx) => (
                <span
                  key={idx}
                  className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Salary:
              </span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="absolute bottom-0 right-0 flex flex-row justify-end items-center space-x-1 p-2">
          <Button className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-[#F5722E] hover:bg-[#F5722E] cursor-default">
            Schedule Interview
          </Button>
          <MoreVertical size={12} className="text-[#717171]" />
        </CardFooter>
      </Card>
    </>
  );
};

export { HeroJobCard };

import { FC } from "react";

import { SkillsWithEllipsis } from "components";

import { Bookmark, MoreVertical, MapPin } from "lucide-react";
import { Button } from "components";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";

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

interface MatchCardProps {
  match: Match;
  bookmarked?: boolean;
  onBookmark?: () => void;
  isFreeTrial?: boolean;
}

const SecureCompanyDisplay: FC<{ isFreeTrial: boolean; company: string }> = ({
  isFreeTrial,
  company,
}) => {
  if (isFreeTrial) {
    return (
      <div className="relative">
        {/* Create a blurred background with placeholder text */}
        <div className="select-none pointer-events-none">
          {/* Blurred layer */}
          <div className="relative">
            {/* Random characters to create blur effect */}
            <div className="absolute inset-0 blur-[8px] text-sm font-semibold bg-clip-text">
              {Array(company.length).fill("X").join("")}
            </div>
          </div>
        </div>

        {/* Spacer to maintain layout */}
        <div className="h-6" />
      </div>
    );
  }

  return (
    <p className="text-[13px] font-light mt-0 underline">{company}</p>
  );
};

const getAvailabilityStyle = (type: string) => {
  if (type.toLowerCase() === "part time") {
    return "bg-[#BF532C]"; // Darker orange for Part Time
  }
  return "bg-[#F5722E]"; // Default orange for other options
};

const JobCardDesktop: FC<MatchCardProps> = ({
  match,
  bookmarked = false,
  onBookmark = () => {},
  isFreeTrial = false,
}) => {
  return (
    <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <span className="text-[13px] text-orange-500 font-semibold">
            ☆ NEW
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-light text-gray-400 -mr-2">
              Applied {match.appliedAgo}
            </span>
          </div>
        </div>
        <div className="w-full relative">
          <CardTitle className="text-sm font-semibold">{match.position}</CardTitle>
          <Bookmark
            className={`absolute top-0 right-[-8px] cursor-pointer ${
              bookmarked ? "fill-orange-500" : ""
            } text-orange-500`}
            size={26}
            onClick={onBookmark}
          />
          <SecureCompanyDisplay
            isFreeTrial={isFreeTrial}
            company={match.company}
          />
          <div className="flex flex-row items-center gap-1">
            <MapPin size={14} className="text-orange-500" />
            <p className="text-[13px] font-light mt-0">
              Based in {match.location}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[55px]">
          <SkillsWithEllipsis skills={match.skills} />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Experience:</span>
            <span className="text-[12px] text-orange-500 font-light rounded-[4px] px-1.5 border border-orange-500">
              {match.experience}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Available for:</span>
            {match.lookingFor.map((type, idx) => (
              <span
                key={idx}
                className={`${getAvailabilityStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
              >
                {type}
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="text-[13px] font-light">Salary:</span>
            <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 flex justify-center items-center">
              {match.salaryExpectation}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end -mt-5 -mr-4 space-x-1">
        <Button className="text-[12px] font-semibold px-0 w-[133px] h-[27px] bg-orange-500">
          I'm Interested
        </Button>
        <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
      </CardFooter>
    </Card>
  );
};

const JobCardMobile: FC<MatchCardProps> = ({
  match,
  bookmarked = false,
  onBookmark = () => {},
  isFreeTrial = false,
}) => (
  <Card className="bg-[#F5F5F7] w-[308px] h-[395px] p-2 relative flex flex-col">
    <CardHeader className="flex-1 overflow-y-auto p-0">
      <div className="w-full">
        <div className="flex flex-col items-end justify-end">
          <div className="flex-1">
            <span className="text-[11px] text-gray-600 font-light">
              Posted {match.appliedAgo}
            </span>
          </div>
          <Bookmark
            className={`absolute top-7 ${
              bookmarked ? "fill-orange-500" : ""
            } text-orange-500`}
            size={26}
            onClick={onBookmark}
          />
        </div>

        <div className="pt-2 pl-2">
          <div className="-space-y-1">
            <CardTitle className="text-sm font-semibold">{match.position}</CardTitle>
            <SecureCompanyDisplay
              isFreeTrial={isFreeTrial}
              company={match.company}
            />
          </div>

          <p className="text-[13px] text-[#263238] flex items-center mb-2 font-light">
            <MapPin size={14} className="mr-1 text-[#F5722E]" />
            Based in {match.location}
          </p>

          <div className="h-[50px]">
            <SkillsWithEllipsis skills={match.skills} />
          </div>

          <div className="mt-6 flex flex-col gap-1">
            <div className="flex gap-2">
              <span className="text-[13px] font-light">Experience:</span>
              <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
                {match.experience}
              </span>
            </div>

            <div className="flex gap-y-0.5 gap-x-1 flex-wrap">
              <span className="text-[13px] font-light pr-1">Available for:</span>
              {match.lookingFor.map((type, index) => (
                <span
                  key={index}
                  className={`${getAvailabilityStyle(type)} text-white rounded-[2px] text-[12px] px-1 h-[18px] flex justify-center items-center`}
                >
                  {type}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <span className="text-[13px] font-light">Salary:</span>
              <span className="bg-[#F5722E] text-white rounded-[2px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
          </div>

          <div className="text-[11px] mb-3 mt-3 line-clamp-3">{match.description}</div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-0 mt-auto flex flex-col items-center">
      <Button
        variant="default"
        className="text-[12px] font-semibold bg-orange-500"
      >
        I'm Interested
      </Button>
      <MoreVertical
        size={12}
        className="text-gray-700 cursor-pointer absolute bottom-3 right-2"
      />
    </CardContent>
  </Card>
);

export { JobCardDesktop, JobCardMobile };
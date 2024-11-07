import { FC } from "react";

import { SkillsWithEllipsis } from "components";

import {
  Bookmark,
  MoreVertical,
  MapPin,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
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
    bookmarked: boolean;
    onBookmark: () => void;
  }
  
  const JobHunterCardDesktop: FC<MatchCardProps> = ({
    match,
  bookmarked = false,
  onBookmark = () => {},
  }) => {
    return (
      <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <span className="text-[13px] text-orange-500 font-semibold">
              ☆ NEW
            </span>
            <div className="flex flex-col items-end">
              <div className="flex flex-col items-end -mr-2">
                <span className="text-[11px] font-light text-gray-400">
                  Applied {match.appliedAgo}
                </span>
              </div>
              <Bookmark
                className={`absolute mt-5 -mr-2 cursor-pointer ${
                  bookmarked ? "fill-orange-500" : ""
                } text-orange-500`}
                size={26}
                onClick={onBookmark}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-sm font-semibold">
                  {match.position}
                </CardTitle>
                <p className="text-[13px] font-light mt-0 underline">
                  {match.company}
                </p>
                <div className="flex flex-row items-center gap-1">
                  <MapPin size={14} className="text-orange-500" />
                  <p className="text-[13px] font-light mt-0">{match.location}</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <SkillsWithEllipsis skills={match.skills} />
  
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex gap-2">
              <span className="text-[13px] font-light">Experience:</span>
              <span className="text-[12px] text-orange-500 font-light outline outline-1 outline-orange-500 rounded-[2px] px-1">
                {match.experience}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-[13px] font-light">Available for:</span>
              {match.lookingFor.map((type, idx) => (
                <span
                  key={idx}
                  className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center"
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-[13px] font-light">Salary:</span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 flex justify-center items-center">
                {match.salaryExpectation}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-end -mt-2 -mr-4 space-x-1">
          <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
        </CardFooter>
      </Card>
    );
  };
  
  const JobHunterCardMobile: FC<{ match: Match }> = ({ match }) => (
    <Card className="bg-[#F5F5F7] w-[308px] h-[395px] p-2 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex items-start p-0 relative">
        <div className="w-full">
          <div className="flex flex-col items-end justify-end">
            <div className="flex-1">
              <span className="text-[11px] text-gray-600 font-light">
                Posted {match.appliedAgo}
              </span>
            </div>
            <div className="absolute top-7">
              <Bookmark className="text-[#F5722E]" size={25} />
            </div>
          </div>
  
          <div className="pt-2 pl-2">
            <div className="-space-y-1">
              <CardTitle className="text-[14px] mb-0">{match.position}</CardTitle>
              <CardDescription className="text-[13px] text-[#263238] underline mt-0">
                {match.company}
              </CardDescription>
            </div>
  
            <p className="text-[13px] text-[#263238] flex items-center mb-2">
              <MapPin size={14} className="mr-1 text-[#F5722E]" />
              {match.location}
            </p>
  
            <SkillsWithEllipsis skills={match.skills} />
  
            <div className="mt-6 space-y-1">
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Experience:</span>
                <span className="text-[12px] text-[#F5722E] font-light outline outline-1 outline-[#F5722E] rounded-[2px] px-1">
                  {match.experience}
                </span>
              </div>
  
              <div className="flex gap-2 flex-wrap">
                <span className="text-[13px] font-light">Looking for:</span>
                {match.lookingFor.map((type, index) => (
                  <span
                    key={index}
                    className="bg-[#F5722E] text-white rounded-[2px] text-[12px] px-1 h-[18px] flex justify-center items-center"
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
  
            <div className="text-[11px] mb-4 mt-4">{match.description}</div>
          </div>
        </div>
      </CardHeader>
      <MoreVertical
        size={12}
        className="text-gray-700 cursor-pointer absolute bottom-2 right-1"
      />
    </Card>
  );

  export { JobHunterCardDesktop, JobHunterCardMobile }


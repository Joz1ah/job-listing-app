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
  job: string;
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: string[];
  salaryExpectation: string;
  language: string[];
}

interface MatchCardProps {
  match: Match;
  bookmarked: boolean;
  onBookmark: () => void;
}

const EmployerCardDesktop: FC<MatchCardProps> = ({
  match,
  bookmarked,
  onBookmark,
}) => {
  return (
    <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]">
      <CardHeader className="flex flex-col justify-between items-start pb-0">
        <div className="flex flex-row -mt-4 justify-between w-full">
          <span className="text-[13px] text-orange-500 font-semibold">
            ☆ NEW
          </span>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-light text-gray-400 -mr-2">
              Posted {match.appliedAgo}
            </span>
            <Bookmark
              className={`absolute mt-5 -mr-2 cursor-pointer ${
                bookmarked ? "fill-orange-500" : ""
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
          {/* <p className="text-sm font-light">
              expressed interest as your{" "}
              <span className="text-orange-500 underline">{match.job}</span>
            </p> */}
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
              <span
                key={index}
                className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center"
              >
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
              <span
                key={index}
                className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row justify-end -mt-2 -mr-4 space-x-1">
        {/* <Button className="bg-orange-500 text-white text-[12px] font-semibold px-0 w-[133px] h-[27px]">
            Schedule Interview
          </Button> */}
        <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
      </CardFooter>
    </Card>
  );
};

const EmployerCardMobile: FC<{ match: Match }> = ({ match }) => (
  <Card className="bg-[#F5F5F7] w-[300px] h-[380px] p-4 transition-all duration-300 hover:shadow-lg">
    <CardHeader className="flex items-start p-0 relative">
      <div className="w-full">
        <div className="flex flex-col items-end justify-end">
          <div className="flex-1">
            <span className="text-[11px] text-gray-600 font-light">
              Applied {match.appliedAgo}
            </span>
          </div>
          <div className="absolute top-7">
            <Bookmark className="text-[#F5722E]" size={25} />
          </div>
        </div>

        <div className="pt-2 pl-2">
          <CardTitle className="text-[17px]">{match.name}</CardTitle>
          <p className="text-[10px] text-[#F5722E] flex items-center mb-2">
            <MapPin size={9} className="mr-1 text-[#F5722E]" />
            {match.location}
          </p>
          {/* <p className="text-[10px] font-light pb-2">
              expressed interest as you {match.job}
            </p> */}

          <div className="flex flex-col gap-2">
            <SkillsWithEllipsis skills={match.skills} />

            <div className="flex gap-2">
              <span className="text-[10px] font-light">Experience:</span>
              <span className="text-[10px] font-light">{match.experience}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <span className="text-[10px] font-light">Looking for:</span>
              {match.lookingFor.map((type, index) => (
                <span
                  key={index}
                  className="bg-[#F5722E] text-white rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center"
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
                <span
                  key={index}
                  className="text-[#F5722E] rounded-[4px] text-[8px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardHeader>

    <CardContent className="flex flex-col items-center mt-4">
      <Button
        variant="default"
        className="bg-[#F5722E] text-[12px] font-semibold"
      >
        Schedule Interview
      </Button>
      <MoreVertical
        size={12}
        className="text-gray-700 cursor-pointer absolute bottom-2 right-2"
      />
    </CardContent>
  </Card>
);

export { EmployerCardDesktop, EmployerCardMobile };

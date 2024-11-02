import { FC, useEffect, useState, useRef } from "react";
import { Button } from "components";
import sparkeIcon from "images/sparkle-icon.png";
import { Card, CardContent, CardHeader, CardTitle } from "components";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";
import { Carousel, CarouselContent, CarouselItem } from "components";
import {
  MapPin,
  Bookmark,
  Star,
  Building,
  BadgeCheck,
  MoreVertical,
} from "lucide-react";
import { perfectMatch, others } from "matchData/employer-data";

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
      <div
        ref={skillsContainerRef}
        className="flex flex-wrap gap-1 max-h-[43px] overflow-hidden relative"
      >
        {skills.map((skill, skillIndex) => (
          <span
            key={skillIndex}
            className="text-white text-xs font-semibold px-1 pt-0.5 rounded-[2px]"
            style={{
              backgroundColor: skill.isMatch
                ? skillColors.matched
                : skillColors.unmatched,
            }}
          >
            {skill.name}
          </span>
        ))}
        {showEllipsis && (
          <span className="absolute bottom-0 right-0 bg-transparent px-1">
            ...
          </span>
        )}
      </div>
    </div>
  );
};

const MatchCard: FC<{ match: Match }> = ({ match }) => (
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
          <p className="text-[10px] font-light pb-2">
            expressed interest as you {match.job}
          </p>

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

const EmployerSectionMobile: FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-start">
            <div className="flex items-center text-3xl md:text-3xl text-white font-normal">
              <span>ABC Incorporated</span>
              <BadgeCheck className="fill-[#F5722E] text-[#263238]" size={28} />
            </div>
          </div>
          <div className="flex flex-col items-start mt-2 space-y-2">
            <div className="flex items-center space-x-2 text-[11px] font-light text-white">
              <Building className="fill-[#D6D6D6] text-[#263238]" size={14} />
              <span className="text-[12px]">
                Germany, South Africa and China
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[11px] font-light text-white">
              <span className="flex items-center text-[13px] text-white">
                4.5
                <div className="flex ml-1">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className="text-[#F5722E] fill-[#F5722E] ml-1"
                    />
                  ))}
                  <div className="relative ml-1">
                    <Star size={16} className="text-[#F5722E]" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star
                        size={16}
                        className="text-[#F5722E] fill-[#F5722E]"
                      />
                    </div>
                  </div>
                </div>
              </span>
              <span className="text-[13px] font-normal text-white">
                Job Hunter Rating
              </span>
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-0 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Select>
            <SelectTrigger className="flex justify-between items-center w-[336px] h-[42px] bg-white text-black rounded-md border-0 shadow-md text-[17px] border-none">
              <span></span>
              <SelectValue placeholder="Filter by Job Listings" />
            </SelectTrigger>
            <SelectContent className="bg-white p-0 [&>*]:p-0 w-[336px]">
              <SelectGroup>
                <SelectItem
                  className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                  value="fulltime"
                >
                  <div className="py-3 w-full text-center">
                    All Job Listings
                  </div>
                </SelectItem>
                <SelectItem
                  className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                  value="parttime"
                >
                  <div className="py-3 w-full text-center">
                    Most Recent Job Listing
                  </div>
                </SelectItem>
                <SelectItem
                  className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                  value="contractual"
                >
                  <div className="py-3 w-full text-center">
                    Saved Job Listing
                  </div>
                </SelectItem>
                <SelectItem
                  className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                  value="saved"
                >
                  <div className="py-3 w-full text-center">
                    Sort Job Listing by Team Member
                  </div>
                </SelectItem>
                <SelectItem
                  className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
                  value="closed"
                >
                  <div className="py-3 w-full text-center">Closed Listings</div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Carousel opts={{ align: "center", loop: false }} className="w-full">
        <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#F5722E] text-center font-semibold pb-2">
          <img
            src={sparkeIcon}
            alt="Sparkle Icon"
            className="w-[22px] h-[24px]"
          />
          PERFECT MATCH
        </h3>

        <CarouselContent>
          {perfectMatch.map((match, index) => (
            <CarouselItem key={index} className="pl-4 basis-[320px]">
              <div className="relative">
                <MatchCard match={match} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="flex justify-center mt-4 space-x-2">
          {perfectMatch.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === activeIndex ? "bg-[#F5722E]" : "bg-gray-400"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </Carousel>

      <div className="pt-4">
        <Carousel opts={{ align: "center", loop: false }} className="w-full">
          <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#AEADAD] text-center font-semibold pb-2">
            OTHER APPLICATION CARDS
          </h3>

          <CarouselContent>
            {others.map((match, index) => (
              <CarouselItem key={index} className="pl-4 basis-[320px]">
                <div className="relative">
                  <MatchCard match={match} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="flex justify-center mt-4 space-x-2">
            {others.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex ? "bg-[#F5722E]" : "bg-gray-400"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export { EmployerSectionMobile };

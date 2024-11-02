import { FC, useEffect, useRef, useState } from "react";
import sparkeIcon from "images/sparkle-icon.png";

import { Card, CardDescription, CardHeader, CardTitle } from "components";

import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "components";
import {
  MapPin,
  Bookmark,
  Star,
  DollarSign,
  BriefcaseBusiness,
  MoreVertical
} from "lucide-react";

import { perfectMatch, others } from "matchData/job-hunter-data";
import { CircularPagination } from "components";

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
interface Skill {
  name: string;
  isMatch: boolean;
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
          <span className="absolute bottom-0 right-0 bg-transparent px-1">...</span>
        )}
      </div>
    </div>
  );
};

const JobMatchCard: FC<{ match: Match }> = ({ match }) => (
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
              <span className="text-[12px] text-[#F5722E] font-light outline outline-1 outline-[#F5722E] rounded-[2px] px-1">{match.experience}</span>
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
    <MoreVertical size={12} className="text-gray-700 cursor-pointer absolute bottom-2 right-1" />
  </Card>
);

const JobHunterSectionMobile: FC = () => {
  const [perfectMatchApi, setPerfectMatchApi] = useState<CarouselApi | null>(null);
  const [othersApi, setOthersApi] = useState<CarouselApi | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="md:flex md:justify-between md:items-center mb-20">
        <h1 className="text-3xl md:text-3xl text-white font-normal">
          Welcome to your dashboard, Michael!
        </h1>
        <div className="flex items-center space-x-2 mt-2">
          <MapPin className="text-[#F5722E]" size={19} />
          <span className="text-[13px] font-light text-white">
            Metro Manila
          </span>
          <span className="text-[#AEADAD]">•</span>
          <span className="text-[13px] font-normal text-white">
            Employer Rating:
          </span>
          <span className="flex items-center text-[13px] text-white">
            4.5
            <div className="flex ml-1">
              {[...Array(4)].map((_, i) => (
                <Star key={i} size={16} className="text-[#F5722E] fill-[#F5722E] ml-1" />
              ))}
              <div className="relative ml-1">
                <Star size={16} className="text-[#F5722E]" />
                <div className="absolute inset-0 overflow-hidden w-1/2">
                  <Star size={16} className="text-[#F5722E] fill-[#F5722E]" />
                </div>
              </div>
            </div>
          </span>
        </div>
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[13px] font-light text-white">
            <BriefcaseBusiness className="text-[#F5722E]" size={19} />
            <span>Employment Preference:</span>
            <span className=" text-[#F5722E] px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-[#F5722E]">
              Full Time
            </span>
            <span className=" text-[#F5722E] px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-[#F5722E]">
              Part Time
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[13px] font-light text-white">
            <DollarSign className="text-[#F5722E]" size={19} />
            <span>Expected Salary:</span>
            <span className="underline text-[#F5722E]">$95,000</span>
            <span className=" text-white px-2 py-1 rounded-[2px] text-[10px] outline outline-1 outline-white">
              per year
            </span>
          </div>
        </div>
      </div>

      <Carousel
        opts={{
          align: "center",
          loop: false,
        }}
        className="w-full"
        setApi={setPerfectMatchApi}
      >
        <h3 className="flex justify-center items-center mt-2 gap-2 text-[17px] text-[#F5722E] text-center font-semibold pb-2">
          <img
            src={sparkeIcon}
            alt="Sparkle Icon"
            className="w-[22px] h-[24px]"
          />
          PERFECT MATCH
        </h3>

        <CarouselContent>
          {perfectMatch.map((job, index) => (
            <CarouselItem key={index} className="pl-4 basis-[320px]">
              <div className="relative">
                <JobMatchCard match={job} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CircularPagination api={perfectMatchApi} />
      </Carousel>

      {/* Other Opportunities */}
      <div className="pt-10">
        <Carousel
          opts={{
            align: "center",
            loop: false,
          }}
          className="w-full"
          setApi={setOthersApi}
        >
          <h3 className="text-[17px] md:text-[17px] text-gray-400 text-center font-semibold mb-4">
            OTHER APPLICATION CARDS
          </h3>

          <CarouselContent>
            {others.map((job, index) => (
              <CarouselItem key={index} className="pl-4 basis-[320px]">
                <div className="relative">
                  <JobMatchCard match={job} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CircularPagination api={othersApi} />
        </Carousel>
      </div>
    </div>
  );
};

export { JobHunterSectionMobile };

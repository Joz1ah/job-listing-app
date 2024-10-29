import { FC, useState } from "react";

import {
  Info,
  Bookmark,
  MoreVertical,
  MapPin,
  DollarSign,
  BriefcaseBusiness
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";

const PerfectMatch = () => {
  const perfectMatch = [
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "FullStack Developer",
      location: "London, United Kingdom",
      company: "OneTime Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
  ];

  const getRandomColor = () => {
    return Math.random() < 0.5 ? "#184E77" : "#168AAD";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {perfectMatch.map((match, index) => (
        <Card
          key={index}
          className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]"
        >
          <CardHeader className="flex flex-col justify-between items-start pb-0">
            <div className="flex flex-row -mt-4 justify-between w-full">
              <span className="text-[13px] text-orange-500 font-semibold">
                ☆ NEW
              </span>
              <div className="flex flex-col items-end -mr-2">
                <span className="text-[11px] font-light text-gray-400">
                  Applied {match.appliedAgo}
                </span>
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    {match.position}
                  </CardTitle>
                  <p className="text-[13px] font-light mt-0 underline">{match.company}</p>
                  <div className="flex flex-row items-center">
                    <MapPin size={14} className="text-orange-500" />
                    <p className="text-[13px] font-light mt-0">{match.location}</p>
                  </div>
                </div>
                <Bookmark className="text-orange-500" size={26} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-[13px] font-light">Primary Skills:</span>
            <div className="flex flex-wrap gap-1 mb-4">
              {match.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="text-white text-xs text- font-semibold px-1 pt-0.5 rounded-[2px]"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="text-[13px] font-light">
                  Experience:
                </span>
                <span className="text-[12px] text-orange-500 font-light outline outline-1 outline-orange-500 rounded-[2px] px-1">
                  3-5 years
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Available for:</span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Full Time
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Part Time
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">
                  Salary:
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 flex justify-center items-center">
                  CAD $47.00
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  per hour
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end -mr-4 space-x-1">
            <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const OtherApplications = () => {
  const others = [
    {
      position: "UI/UX Designer",
      location: "Tokyo, Japan",
      company: "No Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "UI/UX Designer",
      location: "Tokyo, Japan",
      company: "No Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "UI/UX Designer",
      location: "Tokyo, Japan",
      company: "No Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "UI/UX Designer",
      location: "Tokyo, Japan",
      company: "No Pay Digital Corporation",
      skills: [
        "Data Visualization",
        "Python",
        "SQL",
        "Excel",
        "Database Analysis",
      ],
      appliedAgo: "3 days ago",
    },
  ];

  const getRandomColor = () => {
    return Math.random() < 0.5 ? "#184E77" : "#168AAD";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {others.map((match, index) => (
        <Card
          key={index}
          className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-auto md:h-[275px]"
        >
          <CardHeader className="flex flex-col justify-between items-start pb-0">
            <div className="flex flex-row -mt-4 justify-between w-full">
              <span className="text-[13px] text-orange-500 font-semibold">
                ☆ NEW
              </span>
              <div className="flex flex-col items-end -mr-2">
                <span className="text-[11px] font-light text-gray-400">
                  Applied {match.appliedAgo}
                </span>
              </div>
            </div>
            <div className="w-full">
              <div className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-sm font-semibold">
                    {match.position}
                  </CardTitle>
                  <p className="text-[13px] font-light mt-0 underline">{match.company}</p>
                  <div className="flex flex-row items-center">
                    <MapPin size={14} className="text-orange-500" />
                    <p className="text-[13px] font-light mt-0">{match.location}</p>
                  </div>
                </div>
                <Bookmark className="text-orange-500" size={26} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-[13px] font-light">Primary Skills:</span>
            <div className="flex flex-wrap gap-1 mb-4">
              {match.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="text-white text-xs text- font-semibold px-1 pt-0.5 rounded-[2px]"
                  style={{ backgroundColor: getRandomColor() }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex gap-2">
                <span className="text-[13px] font-light">
                  Experience:
                </span>
                <span className="text-[12px] text-orange-500 font-light outline outline-1 outline-orange-500 rounded-[2px] px-1">
                  3-5 years
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Available for:</span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Full Time
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Part Time
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">
                  Salary:
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 flex justify-center items-center">
                  CAD $47.00
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  per hour
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end -mr-4 space-x-1">
            <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const JobHunterSectionDesktop: FC = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");

  return (
    <div className="mt-8 md:mt-16 md:ml-16">
      {/* Header Section */}
      <div className="w-full">
        <div className="flex flex-col items-start">
          <div className="flex items-center text-2xl md:text-3xl text-white font-normal">
            <span>Welcome to your dashboard, Michael!</span>
          </div>  
        </div>
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-light text-white">
            <MapPin className="text-[#F5722E]" size={26} />
            <span className="text-[15px]">Metro Manila, Philippines</span>
          </div>
        </div>
        <div className="flex flex-col items-start mt-2">
          <div className="flex items-center space-x-1 text-[11px] font-light text-white">
            <span className="border-2 border-dotted border-orange-500 text-white text-[15px] px-2 py-1 border-opacity-70">
              Your interview from rating employers
            </span>
            <Info className="fill-[#D6D6D6] text-[#263238] size={13} mb-4" />
          </div>
        </div>
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-light text-white">
            <DollarSign className="text-orange-500" size={14} strokeWidth={4} />
            <span className="text-[15px]">Expected Salary: </span>
            <span className="outline outline-1 outline-orange-500 underline text-orange-500 px-1 font-semibold text-[15px] rounded-[2px]">$100,000</span>
            <span className="outline outline-1 outline-white px-1 ml-1 text-[15px] rounded-[2px]">per year</span>
          </div>
        </div>
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-light text-white">
            <BriefcaseBusiness className="fill-orange-500 text-[#263238]" size={14} />
            <span className="text-[15px]">Employment Preference: </span>
            <span className="outline outline-1 outline-orange-500 text-orange-500 px-1 text-[15px] rounded-[2px]">Full Time</span>
            <span className="outline outline-1 outline-orange-500 text-orange-500 px-1 text-[15px] rounded-[2px]">Part Time</span>
          </div>
        </div>
        
      </div>

      {/* Application Cards Section */}
      <div className="max-w-5xl mx-auto pt-8 md:pt-2 mt-8 md:mt-2 px-4 md:px-6 pb-4">
        <div className="flex justify-center mb-8 md:mb-6">
          <button
            className={`font-semibold mr-6 pb-2 text-[17px] ${
              selectedTab === "perfectMatch"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-white"
            }`}
            onClick={() => setSelectedTab("perfectMatch")}
          >
            PERFECT MATCH
          </button>
          <button
            className={`font-semibold pb-2 text-[17px] ${
              selectedTab === "otherApplications"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-white"
            }`}
            onClick={() => setSelectedTab("otherApplications")}
          >
            OTHER APPLICATION CARDS
          </button>
        </div>

        <div className="w-full">
          {selectedTab === "perfectMatch" ? (
            <PerfectMatch />
          ) : (
            <OtherApplications />
          )}
        </div>
      </div>
    </div>
  );
};

export { JobHunterSectionDesktop };

import { FC, useState } from "react";

import {
  BadgeCheck,
  Building,
  Info,
  Bookmark,
  MoreVertical,
  MapPin,
} from "lucide-react";

import { Button } from "components";
import { NavLink } from "react-router-dom";
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
            <div>
              <div className="flex flex-row justify-between items-start">
                <CardTitle className="text-sm font-semibold">
                  {match.name}
                </CardTitle>
                <Bookmark className="text-orange-500 -mr-7" size={26} />
              </div>
              <div className="flex flex-row items-center -mt-2">
                <MapPin size={14} className="text-orange-500" />
                <p className="text-[13px] font-light mt-0">{match.location}</p>
              </div>
              <p className="text-sm font-light">
                expressed interest as your{" "}
                <span className="text-orange-500 underline">{match.job}</span>
              </p>
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
                  Experience: 1 - 3 Years
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Looking for:</span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Full Time
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Part Time
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">
                  Salary Expectation:
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 flex justify-center items-center">
                  CAD $47.00
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  per hour
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Language:</span>
                <span className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                  English
                </span>
                <span className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                  French
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end -mt-8 -mr-4 space-x-1">
            <Button className="bg-orange-500 text-white text-[12px] font-semibold px-0 w-[133px] h-[27px]">
              Schedule Interview
            </Button>
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
      name: "Oliver John",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Oslwad Peter",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      name: "Olivia Davis",
      location: "London, United Kingdom",
      job: "Junior Front End Developer",
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
      {others.map((other, index) => (
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
                  Applied {other.appliedAgo}
                </span>
              </div>
            </div>
            <div>
              <div className="flex flex-row justify-between items-start">
                <CardTitle className="text-sm font-semibold">
                  {other.name}
                </CardTitle>
                <Bookmark className="text-orange-500 -mr-7" size={26} />
              </div>
              <div className="flex flex-row items-center -mt-2">
                <MapPin size={14} className="text-orange-500" />
                <p className="text-[13px] font-light mt-0">{other.location}</p>
              </div>
              <p className="text-sm font-light">
                expressed interest as your{" "}
                <span className="text-orange-500 underline">{other.job}</span>
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <span className="text-[13px] font-light">Primary Skills:</span>
            <div className="flex flex-wrap gap-1 mb-4">
              {other.skills.map((skill, skillIndex) => (
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
                  Experience: 1 - 3 Years
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Looking for:</span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Full Time
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  Part Time
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">
                  Salary Expectation:
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 flex justify-center items-center">
                  CAD $47.00
                </span>
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  per hour
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Language:</span>
                <span className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                  English
                </span>
                <span className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                  French
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-end -mt-8 -mr-4 space-x-1">
            <Button className="bg-orange-500 text-white text-[12px] font-semibold px-0 w-[133px] h-[27px]">
              Schedule Interview
            </Button>
            <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

const EmployerSectionDesktop: FC = () => {
  const jobListings = [
    { title: "Project Manager", path: "#" },
    { title: "DevOps Engineer", path: "#" },
    { title: "Virtual Admin Assistant", path: "#" },
    { title: "Sr. Software Engineer", path: "#" },
    { title: "Jr. Shopify Developer", path: "#" },
    { title: "Mobile App Developer", path: "#" },
    { title: "Social Media Manager", path: "#" },
    { title: "Content Creator", path: "#" },
  ];

  const [selectedTab, setSelectedTab] = useState("perfectMatch");

  return (
    <>
      <div className="mt-8 md:mt-16 md:ml-16 ">
        <div className="mb-8 md:mb-12">
          <div>
            <div className="flex flex-col items-start">
              <div className="flex items-center text-2xl md:text-3xl text-white font-normal">
                <span>ABC Incorporated</span>
                <BadgeCheck
                  className="fill-[#F5722E] text-[#263238]"
                  size={28}
                />
              </div>
            </div>
            <div className="flex flex-col items-start mt-2 space-y-2">
              <div className="flex items-center space-x-2 text-[11px] font-light text-white">
                <Building className="fill-[#D6D6D6] text-[#263238]" size={14} />
                <span className="text-[15px]">
                  Germany, South Africa and China
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start mt-2">
              <div className="flex items-center space-x-1 text-[11px] font-light text-white">
                <span className="border-2 border-dotted border-orange-500 text-white text-[15px] px-2 py-2 border-opacity-70">
                  Your Job Hunter post interview appear here
                </span>
                <Info className="fill-[#D6D6D6] text-[#263238] size={13} mb-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[311px] h-auto md:h-[652px] bg-[#2D3A41] rounded mb-8 md:mb-0">
          <h4 className="font-semibold mb-6 text-center pt-2 text-[16px] text-white">
            All Job Listings
          </h4>
          <nav className="flex flex-col text-white w-full h-full overflow-y-auto pt-12">
            {jobListings.map((item, index) => (
              <div key={item.path}>
                <div className="w-full text-center">
                  <NavLink
                    to={item.path}
                    className="hover:text-[#F5722E] py-4 inline-block text-sm"
                  >
                    {item.title}
                  </NavLink>
                </div>
                {index < jobListings.length && (
                  <div className="flex justify-center w-full">
                    <hr className="border-t border-white w-full" />
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Application cards */}
      <div className="flex flex-col items-center pt-8 md:pt-24 mt-8 md:mt-12 px-4 md:pr-24 pb-4 ml-0 pl-0">
        <div className="flex mb-8 md:mb-12">
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
    </>
  );
};

export { EmployerSectionDesktop };

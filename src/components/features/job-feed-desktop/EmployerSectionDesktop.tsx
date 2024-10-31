import { FC, useState } from "react";
import sparkeIcon from "images/sparkle-icon.png";

import { Bookmark, MoreVertical, MapPin } from "lucide-react";

import { Button } from "components";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
}

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
}

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab }) => {
  const perfectMatch: Match[] = [
    {
        name: "Olivia Davis",
        location: "London, United Kingdom",
        job: "Junior Front End Developer",
        skills: [
            { name: "React", isMatch: true },
            { name: "JavaScript", isMatch: true },
            { name: "CSS", isMatch: true },
            { name: "HTML", isMatch: true },
            { name: "Node.js", isMatch: false },
            { name: "TypeScript", isMatch: false },
            { name: "Git", isMatch: true },
            { name: "Responsive Design", isMatch: false },
        ],
        appliedAgo: "3 days ago",
    },
    {
        name: "Ethan Brown",
        location: "New York, USA",
        job: "Backend Developer",
        skills: [
            { name: "Node.js", isMatch: true },
            { name: "Express.js", isMatch: true },
            { name: "SQL", isMatch: true },
            { name: "MongoDB", isMatch: false },
            { name: "GraphQL", isMatch: false },
            { name: "AWS", isMatch: true },
            { name: "Docker", isMatch: false },
            { name: "Python", isMatch: true },
        ],
        appliedAgo: "5 days ago",
    },
    {
        name: "Sophia White",
        location: "Berlin, Germany",
        job: "Data Analyst",
        skills: [
            { name: "Python", isMatch: true },
            { name: "SQL", isMatch: true },
            { name: "Tableau", isMatch: false },
            { name: "Data Mining", isMatch: true },
            { name: "Excel", isMatch: true },
            { name: "R", isMatch: false },
            { name: "Data Visualization", isMatch: true },
            { name: "Machine Learning", isMatch: false },
        ],
        appliedAgo: "1 week ago",
    },
    {
        name: "Lucas Green",
        location: "Sydney, Australia",
        job: "Full Stack Developer",
        skills: [
            { name: "JavaScript", isMatch: true },
            { name: "React", isMatch: false },
            { name: "Angular", isMatch: true },
            { name: "Node.js", isMatch: false },
            { name: "GraphQL", isMatch: true },
            { name: "PostgreSQL", isMatch: true },
            { name: "Docker", isMatch: false },
            { name: "CI/CD", isMatch: true },
        ],
        appliedAgo: "2 days ago",
    },
    {
        name: "Isabella King",
        location: "Toronto, Canada",
        job: "UX Designer",
        skills: [
            { name: "Wireframing", isMatch: true },
            { name: "Prototyping", isMatch: false },
            { name: "User Research", isMatch: true },
            { name: "Adobe XD", isMatch: true },
            { name: "Figma", isMatch: true },
            { name: "Usability Testing", isMatch: true },
            { name: "HTML/CSS", isMatch: false },
            { name: "Accessibility", isMatch: true },
        ],
        appliedAgo: "4 days ago",
    },
    {
        name: "Mason Lee",
        location: "Tokyo, Japan",
        job: "Cloud Engineer",
        skills: [
            { name: "AWS", isMatch: true },
            { name: "Azure", isMatch: false },
            { name: "GCP", isMatch: true },
            { name: "Docker", isMatch: true },
            { name: "Kubernetes", isMatch: true },
            { name: "Terraform", isMatch: false },
            { name: "CI/CD", isMatch: true },
            { name: "Linux", isMatch: true },
        ],
        appliedAgo: "3 weeks ago",
    },
    {
        name: "Emma Chen",
        location: "Singapore",
        job: "Mobile Developer",
        skills: [
            { name: "Swift", isMatch: true },
            { name: "Kotlin", isMatch: false },
            { name: "React Native", isMatch: true },
            { name: "Flutter", isMatch: true },
            { name: "iOS", isMatch: true },
            { name: "Android", isMatch: false },
            { name: "Git", isMatch: true },
            { name: "Firebase", isMatch: true },
        ],
        appliedAgo: "2 days ago",
    },
    {
        name: "Liam Walker",
        location: "Paris, France",
        job: "DevOps Engineer",
        skills: [
            { name: "Jenkins", isMatch: true },
            { name: "Docker", isMatch: true },
            { name: "Kubernetes", isMatch: true },
            { name: "Ansible", isMatch: false },
            { name: "Terraform", isMatch: true },
            { name: "AWS", isMatch: true },
            { name: "Python", isMatch: false },
            { name: "Shell Scripting", isMatch: true },
        ],
        appliedAgo: "1 month ago",
    },
    {
        name: "Ava Patel",
        location: "Mumbai, India",
        job: "Frontend Developer",
        skills: [
            { name: "HTML", isMatch: true },
            { name: "CSS", isMatch: true },
            { name: "JavaScript", isMatch: true },
            { name: "TypeScript", isMatch: true },
            { name: "React", isMatch: false },
            { name: "Vue.js", isMatch: true },
            { name: "Webpack", isMatch: false },
            { name: "Accessibility", isMatch: true },
        ],
        appliedAgo: "1 day ago",
    }
];

  const handleClick = () => {
    setSelectedTab("otherApplications");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const skillColors = {
    matched: "#184E77",
    unmatched: "#168AAD",
  };

  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index:number) => {
    setBookmarkedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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
              <div className="flex flex-col items-end">
                <div className="flex flex-row items-center">
                  <span className="text-[11px] font-light text-gray-400 -mr-2">
                    Posted {match.appliedAgo}
                  </span>
                </div>
                <Bookmark
                  className={`absolute mt-5 -mr-2 cursor-pointer ${
                    bookmarkedCards.has(index) ? 'fill-orange-500' : ''
                  } text-orange-500`}
                  size={26}
                  onClick={() => toggleBookmark(index)}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-row justify-between items-start">
                <CardTitle className="text-sm font-semibold">
                  {match.name}
                </CardTitle>
              </div>
              <div className="flex flex-row items-center">
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
          <div className="h-[60px]">
              <span className="text-[13px] font-light">Primary Skills:</span>
              <div className="flex flex-wrap gap-1 max-h-[43px] overflow-y-hidden">
                {match.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="text-white text-xs text- font-semibold px-1 pt-0.5 rounded-[2px]"
                    style={{ backgroundColor: skill.isMatch ? skillColors.matched : skillColors.unmatched }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
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
          <CardFooter className="flex flex-row justify-end -mt-9 -mr-4 space-x-1">
            <Button className="bg-orange-500 text-white text-[12px] font-semibold px-0 w-[133px] h-[27px]">
              Schedule Interview
            </Button>
            <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
          </CardFooter>
        </Card>
      ))}
      <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
        <div className="p-10">
          <p className="text-xl font-semibold text-white">
            You've reached the end of your perfect matches for now!
          </p>
          <span className="text-white text-[20px] font-semibold ml-4">Explore</span>
          <Button
            variant="link"
            className="text-[20px] text-orange-500  font-semibold pl-2 underline pt-0"
            onClick={handleClick}
          >
            other application cards
          </Button>
        </div>
      </div>
    </div>
  );
};

const OtherApplications: FC<selectedProps> = ({ setSelectedTab }) => {
  const others: Match[] = [
    {
        name: "Lily Thompson",
        location: "Los Angeles, USA",
        job: "Full Stack Developer",
        skills: [
            { name: "JavaScript", isMatch: true },
            { name: "React", isMatch: true },
            { name: "Node.js", isMatch: false },
            { name: "GraphQL", isMatch: true },
            { name: "MongoDB", isMatch: true },
            { name: "Docker", isMatch: false },
            { name: "TypeScript", isMatch: true },
            { name: "REST API", isMatch: true },
        ],
        appliedAgo: "2 days ago",
    },
    {
        name: "Oscar Martinez",
        location: "Madrid, Spain",
        job: "Data Scientist",
        skills: [
            { name: "Python", isMatch: true },
            { name: "Machine Learning", isMatch: true },
            { name: "TensorFlow", isMatch: true },
            { name: "Data Visualization", isMatch: false },
            { name: "SQL", isMatch: true },
            { name: "R", isMatch: false },
            { name: "Big Data", isMatch: true },
            { name: "Data Analysis", isMatch: true },
        ],
        appliedAgo: "1 week ago",
    },
    {
        name: "Amelia Wong",
        location: "Hong Kong",
        job: "UX/UI Designer",
        skills: [
            { name: "User Research", isMatch: true },
            { name: "Prototyping", isMatch: true },
            { name: "Wireframing", isMatch: true },
            { name: "Figma", isMatch: true },
            { name: "Adobe XD", isMatch: false },
            { name: "Interaction Design", isMatch: true },
            { name: "Usability Testing", isMatch: true },
            { name: "Graphic Design", isMatch: false },
        ],
        appliedAgo: "5 days ago",
    },
    {
        name: "Ethan Chen",
        location: "San Francisco, USA",
        job: "Mobile App Developer",
        skills: [
            { name: "Kotlin", isMatch: true },
            { name: "Swift", isMatch: false },
            { name: "React Native", isMatch: true },
            { name: "Flutter", isMatch: false },
            { name: "iOS Development", isMatch: true },
            { name: "Android Development", isMatch: true },
            { name: "Firebase", isMatch: true },
            { name: "Java", isMatch: true },
        ],
        appliedAgo: "3 weeks ago",
    },
    {
        name: "Nina Bianchi",
        location: "Rome, Italy",
        job: "Cloud Engineer",
        skills: [
            { name: "AWS", isMatch: true },
            { name: "Azure", isMatch: false },
            { name: "GCP", isMatch: true },
            { name: "Kubernetes", isMatch: true },
            { name: "Docker", isMatch: true },
            { name: "CI/CD", isMatch: true },
            { name: "Terraform", isMatch: false },
            { name: "Networking", isMatch: true },
        ],
        appliedAgo: "4 days ago",
    }
];

  const handleClick = () => {
    setSelectedTab("perfectMatch");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const skillColors = {
    matched: "#184E77",
    unmatched: "#168AAD",
  };

  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index:number) => {
    setBookmarkedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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
              <div className="flex flex-col items-end">
                <div className="flex flex-row items-center">
                  <span className="text-[11px] font-light text-gray-400 -mr-2">
                    Posted {other.appliedAgo}
                  </span>
                </div>
                <Bookmark
                  className={`absolute mt-5 -mr-2 cursor-pointer ${
                    bookmarkedCards.has(index) ? 'fill-orange-500' : ''
                  } text-orange-500`}
                  size={26}
                  onClick={() => toggleBookmark(index)}
                />
              </div>
            </div>
            <div>
              <div className="flex flex-row justify-between items-start">
                <CardTitle className="text-sm font-semibold">
                  {other.name}
                </CardTitle>
              </div>
              <div className="flex flex-row items-center">
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
          <div className="h-[60px] p-0 m-0">
            <span className="text-[13px] font-light">Primary Skills:</span>
            <div className="flex flex-wrap gap-1 max-h-[43px] overflow-y-hidden">
              {other.skills.map((skill, skillIndex) => (
                <span
                  key={skillIndex}
                  className="text-white text-xs text- font-semibold px-1 pt-0.5 rounded-[2px]"
                  style={{ backgroundColor: skill.isMatch ? skillColors.matched : skillColors.unmatched }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
            <div className="flex flex-col gap-1 mt-2">
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
          <CardFooter className="flex flex-row justify-end -mt-9 -mr-4 space-x-1">
            <Button className="bg-orange-500 text-white text-[12px] font-semibold px-0 w-[133px] h-[27px]">
              Schedule Interview
            </Button>
            <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
          </CardFooter>
        </Card>
      ))}
      <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
        <div className="p-10">
          <p className="text-xl font-semibold text-white">
            You've reached the end of your other application cards for now!
          </p>
          <span className="text-white text-[20px] font-semibold ml-4">Explore your</span>
          <Button
            variant="link"
            className="text-[20px] text-orange-500  font-semibold pl-2 underline pt-0"
            onClick={handleClick}
          >
            perfect matches
          </Button>
        </div>
      </div>
    </div>
  );
};

const EmployerSectionDesktop: FC = () => {
  const [selectedTab, setSelectedTab] = useState("perfectMatch");

  return (
    <>
      {/* Application cards */}
      <div className="flex flex-col items-center pt-8 md:pt-24 mt-8 md:mt-12 px-4 md:pr-24 pb-4 ml-0 pl-0 mb-8">
        <div className="flex mb-8 md:mb-12">
          <button
            className={`font-semibold mr-6 pb-2 text-[17px] inline-flex items-center gap-2 ${
              selectedTab === "perfectMatch"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD]"
            }`}
            onClick={() => setSelectedTab("perfectMatch")}
          >
            <img
              src={sparkeIcon}
              alt="Sparkle Icon"
              className={`w-5 h-5 ${
                selectedTab === "perfectMatch"
                  ? "filter grayscale-0"
                  : "filter grayscale"
              }`}
            />
            PERFECT MATCH
          </button>
          <button
            className={`font-semibold pb-2 text-[17px] ${
              selectedTab === "otherApplications"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-[#AEADAD]"
            }`}
            onClick={() => setSelectedTab("otherApplications")}
          >
            OTHER APPLICATION CARDS
          </button>
        </div>

        <div className="w-full">
          {selectedTab === "perfectMatch" ? (
            <PerfectMatch setSelectedTab={setSelectedTab} />
          ) : (
            <OtherApplications setSelectedTab={setSelectedTab} />
          )}
        </div>
      </div>
    </>
  );
};

export { EmployerSectionDesktop };

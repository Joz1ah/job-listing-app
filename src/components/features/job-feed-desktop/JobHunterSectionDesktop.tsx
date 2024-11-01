import { FC, useState, useRef, useEffect } from "react";
import sparkeIcon from "images/sparkle-icon.png";

import {
  Info,
  Bookmark,
  MoreVertical,
  MapPin,
  DollarSign,
  BriefcaseBusiness,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "components";

import { Button } from "components";

interface selectedProps {
  setSelectedTab: (tab: string) => void;
}

interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  position: string;
  location: string;
  company: string;
  skills: Skill[];
  appliedAgo: string;
}

const skillColors = {
  matched: "#184E77",
  unmatched: "#168AAD",
};

const SkillsWithEllipsis: React.FC<{ skills: Skill[] }> = ({ skills }) => {
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
      <div ref={skillsContainerRef} className="flex flex-wrap gap-1 max-h-[43px] overflow-hidden relative">
        {skills.map((skill, skillIndex) => (
          <span
            key={skillIndex}
            className="text-white text-xs font-semibold px-1 pt-0.5 rounded-[2px]"
            style={{ backgroundColor: skill.isMatch ? skillColors.matched : skillColors.unmatched }}
          >
            {skill.name}
          </span>
        ))}
        {showEllipsis && (
          <span className="absolute bottom-0 right-0 bg-white px-1">...</span>
        )}
      </div>
    </div>
  );
};

const PerfectMatch: FC<selectedProps> = ({ setSelectedTab }) => {
  const perfectMatch: Match[] = [
    {
      position: "Data Analyst",
      location: "Berlin, Germany",
      company: "TechCorp",
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
      position: "Software Engineer",
      location: "San Francisco, USA",
      company: "InnovateTech",
      skills: [
        { name: "JavaScript", isMatch: true },
        { name: "React", isMatch: true },
        { name: "Node.js", isMatch: true },
        { name: "MongoDB", isMatch: false },
        { name: "TypeScript", isMatch: true },
        { name: "AWS", isMatch: false },
        { name: "Docker", isMatch: true },
        { name: "JavaScript", isMatch: true },
        { name: "React", isMatch: true },
        { name: "Node.js", isMatch: true },
        { name: "MongoDB", isMatch: false },
        { name: "TypeScript", isMatch: true },
        { name: "AWS", isMatch: false },
        { name: "Docker", isMatch: true },
      ],
      appliedAgo: "2 days ago",
    },
    {
      position: "Product Manager",
      location: "London, UK",
      company: "FinSync",
      skills: [
        { name: "Agile Methodology", isMatch: true },
        { name: "Product Roadmaps", isMatch: true },
        { name: "User Research", isMatch: true },
        { name: "Data Analysis", isMatch: false },
        { name: "Stakeholder Management", isMatch: true },
        { name: "UI/UX Knowledge", isMatch: true },
      ],
      appliedAgo: "3 weeks ago",
    },
    {
      position: "Marketing Specialist",
      location: "Toronto, Canada",
      company: "BrandWave",
      skills: [
        { name: "SEO", isMatch: true },
        { name: "Content Strategy", isMatch: true },
        { name: "Google Analytics", isMatch: true },
        { name: "Social Media Marketing", isMatch: false },
        { name: "Email Marketing", isMatch: true },
        { name: "PPC Campaigns", isMatch: false },
      ],
      appliedAgo: "5 days ago",
    },
    {
      position: "UI/UX Designer",
      location: "Amsterdam, Netherlands",
      company: "CreativeLabs",
      skills: [
        { name: "Figma", isMatch: true },
        { name: "Adobe XD", isMatch: false },
        { name: "Prototyping", isMatch: true },
        { name: "User Testing", isMatch: true },
        { name: "Wireframing", isMatch: true },
        { name: "HTML/CSS", isMatch: false },
      ],
      appliedAgo: "1 month ago",
    },
    {
      position: "DevOps Engineer",
      location: "Austin, USA",
      company: "Cloudify",
      skills: [
        { name: "Kubernetes", isMatch: true },
        { name: "Docker", isMatch: true },
        { name: "CI/CD", isMatch: true },
        { name: "Python", isMatch: false },
        { name: "Ansible", isMatch: true },
        { name: "AWS", isMatch: true },
      ],
      appliedAgo: "4 days ago",
    },
  ];

  const handleClick = () => {
    setSelectedTab("otherApplications");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarkedCards((prev) => {
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
                <div className="flex flex-col items-end -mr-2">
                  <span className="text-[11px] font-light text-gray-400">
                    Applied {match.appliedAgo}
                  </span>
                </div>
                <Bookmark
                    className={`absolute mt-5 -mr-2 cursor-pointer ${
                      bookmarkedCards.has(index) ? "fill-orange-500" : ""
                    } text-orange-500`}
                    size={26}
                    onClick={() => toggleBookmark(index)}
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
                  <div className="flex flex-row items-center">
                    <MapPin size={14} className="text-orange-500" />
                    <p className="text-[13px] font-light mt-0">
                      {match.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SkillsWithEllipsis skills={match.skills} />

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Experience:</span>
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
                <span className="text-[13px] font-light">Salary:</span>
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
      <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
        <div className="p-10">
          <p className="text-xl font-semibold text-white">
          You've reached the end of your perfect matches for now!
          </p>
          <span className="text-white text-[20px] font-semibold ml-4">
            Explore
          </span>
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
      position: "Business Analyst",
      location: "New York, USA",
      company: "DataSolutions Inc.",
      skills: [
        { name: "SQL", isMatch: true },
        { name: "Excel", isMatch: true },
        { name: "Power BI", isMatch: false },
        { name: "Requirements Gathering", isMatch: true },
        { name: "Stakeholder Management", isMatch: true },
        { name: "Data Visualization", isMatch: false },
      ],
      appliedAgo: "6 days ago",
    },
    {
      position: "Cybersecurity Specialist",
      location: "Sydney, Australia",
      company: "SecureNet",
      skills: [
        { name: "Network Security", isMatch: true },
        { name: "Penetration Testing", isMatch: true },
        { name: "Firewalls", isMatch: true },
        { name: "Ethical Hacking", isMatch: false },
        { name: "Cloud Security", isMatch: true },
        { name: "Encryption", isMatch: true },
      ],
      appliedAgo: "2 weeks ago",
    },
    {
      position: "Data Scientist",
      location: "Tokyo, Japan",
      company: "Insight AI",
      skills: [
        { name: "Python", isMatch: true },
        { name: "Machine Learning", isMatch: true },
        { name: "Deep Learning", isMatch: false },
        { name: "Data Cleaning", isMatch: true },
        { name: "R", isMatch: true },
        { name: "Natural Language Processing", isMatch: false },
      ],
      appliedAgo: "3 days ago",
    },
    {
      position: "Systems Administrator",
      location: "Dublin, Ireland",
      company: "TechOps Ltd.",
      skills: [
        { name: "Linux", isMatch: true },
        { name: "Windows Server", isMatch: true },
        { name: "Virtualization", isMatch: false },
        { name: "Network Troubleshooting", isMatch: true },
        { name: "PowerShell", isMatch: true },
        { name: "Cloud Management", isMatch: false },
      ],
      appliedAgo: "5 days ago",
    },
  ];

  const handleClick = () => {
    setSelectedTab("perfectMatch");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [bookmarkedCards, setBookmarkedCards] = useState(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarkedCards((prev) => {
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
              <div className="flex flex-col items-end">
                <div className="flex flex-col items-end -mr-2">
                  <span className="text-[11px] font-light text-gray-400">
                    Applied {match.appliedAgo}
                  </span>
                </div>
                <Bookmark
                    className={`absolute mt-5 -mr-2 cursor-pointer ${
                      bookmarkedCards.has(index) ? "fill-orange-500" : ""
                    } text-orange-500`}
                    size={26}
                    onClick={() => toggleBookmark(index)}
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
                  <div className="flex flex-row items-center">
                    <MapPin size={14} className="text-orange-500" />
                    <p className="text-[13px] font-light mt-0">
                      {match.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SkillsWithEllipsis skills={match.skills} />

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex gap-2">
                <span className="text-[13px] font-light">Experience:</span>
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
                <span className="text-[13px] font-light">Salary:</span>
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
      <div className="bg-transparent border-none w-full md:w-[436px] h-auto md:h-[275px] flex items-center justify-center text-center p-0">
        <div className="p-10">
          <p className="text-xl font-semibold text-white">
            You've reached the end of your other application cards for now!
          </p>
          <span className="text-white text-[20px] font-semibold ml-4">
            Explore your
          </span>
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
            <span className="outline outline-1 outline-orange-500 underline text-orange-500 px-1 font-semibold text-[15px] rounded-[2px]">
              $100,000
            </span>
            <span className="outline outline-1 outline-white px-1 ml-1 text-[15px] rounded-[2px]">
              per year
            </span>
          </div>
        </div>
        <div className="flex flex-col items-start mt-2 space-y-2">
          <div className="flex items-center space-x-2 text-[11px] font-light text-white">
            <BriefcaseBusiness
              className="fill-orange-500 text-[#263238]"
              size={14}
            />
            <span className="text-[15px]">Employment Preference: </span>
            <span className="outline outline-1 outline-orange-500 text-orange-500 px-1 text-[15px] rounded-[2px]">
              Full Time
            </span>
            <span className="outline outline-1 outline-orange-500 text-orange-500 px-1 text-[15px] rounded-[2px]">
              Part Time
            </span>
          </div>
        </div>
      </div>

      {/* Application Cards Section */}
      <div className="max-w-5xl mx-auto pt-8 md:pt-2 mt-8 md:mt-2 px-4 md:px-6 pb-4">
        <div className="flex justify-center mb-8 md:mb-6">
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
    </div>
  );
};

export { JobHunterSectionDesktop };

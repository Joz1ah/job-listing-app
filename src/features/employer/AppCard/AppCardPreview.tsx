import React, { useState, useEffect } from "react";
import { Bookmark, MapPin, MoreVertical } from "lucide-react";
import sparkle_icon from "assets/images/sparkle-icon.png";
import linkedin_icon from "assets/linkedin.svg?url";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  Button,
} from "components";
import { useSearchCoreQuery } from "api";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptions {
  employmentType: SelectOption[];
  salaryRange: SelectOption[];
  yearsOfExperience: SelectOption[];
  education: SelectOption[];
  country: SelectOption[];
  languages: SelectOption[];
  coreSkills: SelectOption[];
}

interface FormValues {
  firstName: string;
  lastName: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  languages: string[];
  country: string;
  linkedinProfile?: string;
  jobTitle?: string;
}

interface PreviewCardProps {
  values: FormValues;
  selectOptions: SelectOptions;
}

const AppCardPreview: React.FC<PreviewCardProps> = ({
  values,
  selectOptions,
}) => {
  const [skillsMap, setSkillsMap] = useState<Record<string, string>>({});
  const { data: searchResults } = useSearchCoreQuery({
    query: "", // Empty query to get all skills
    limit: 100, // Increase limit to get more skills
  });

  useEffect(() => {
    if (searchResults?.data) {
      const newMap = searchResults.data.reduce(
        (acc: Record<string, string>, skill: any) => {
          acc[skill.id] = skill.keyword;
          return acc;
        },
        {},
      );
      setSkillsMap(newMap);
    }
  }, [searchResults]);

  const getLabel = (
    type: keyof SelectOptions,
    value: string | string[],
  ): string | string[] => {
    if (!value) return "";

    if (Array.isArray(value)) {
      return value.map((v) => {
        if (type === "coreSkills") {
          return skillsMap[v] || v;
        }
        const option = selectOptions[type]?.find((opt) => opt.value === v);
        return option?.label || v;
      });
    }

    if (type === "coreSkills") {
      return skillsMap[value] || value;
    }
    const option = selectOptions[type]?.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Format skills using the skillsMap
  const formattedSkills =
    values.coreSkills?.map((skillId) => {
      const skill = skillsMap[skillId] || skillId;
      return skill
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }) || [];

  // LinkedIn URL validation function
  const isValidLinkedInUrl = (url: string | null | undefined): boolean => {
    if (!url) return false; // Return false for null, undefined, or empty values
    
    // Use the same validation regex from the form validation schema
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
    return linkedinRegex.test(url);
  };

  const hasName = values.firstName || values.lastName;
  const hasCountry = values.country;
  const hasSkills = values.coreSkills?.length > 0;
  const hasExperience = values.yearsOfExperience;
  const hasEmploymentType = values.employmentType?.length > 0;
  const hasSalary = values.salaryRange;
  const hasValidLinkedIn = values.linkedinProfile && isValidLinkedInUrl(values.linkedinProfile);

  // Function to open LinkedIn profile in new tab
  const openLinkedInProfile = () => {
    if (hasValidLinkedIn && values.linkedinProfile) {
      // Ensure URL has a protocol for proper redirection
      let url = values.linkedinProfile;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start md:w-[436px] pb-6">
      <div className="flex justify-start md:justify-start items-center flex-wrap text-white text-base mb-6 md:mb-2 px-6 md:px-0">
        <span>This is how your</span>
        <div className="flex items-center gap-1 mx-1">
          <img src={sparkle_icon} alt="sparkle" className="inline-block" />
          <span className="text-[#F5722E]">Perfect Match</span>
        </div>
        <span>application card will appear to your future Employers.</span>
      </div>

      <div className="w-full xl:w-auto flex xl:block justify-center">
        <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px] hidden md:block">
          <CardHeader className="flex flex-col justify-between items-start pb-3">
            <div className="flex flex-row -mt-4 justify-between w-full">
              <span className="text-[13px] text-[#F5722E] font-bold italic">
                ☆ NEW
              </span>
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-light text-[#717171] -mr-2">
                  Applied today
                </span>
              </div>
            </div>
            <div className="w-full relative">
              <CardTitle
                className={`text-sm max-w-[340px] truncate ${hasName ? "font-semibold text-[#263238]" : "font-semibold text-[#263238]"}`}
              >
                {hasName
                  ? `${values.firstName} ${values.lastName}`
                  : "Your First and Last Name"}
              </CardTitle>
              <Bookmark
                className="absolute top-0 right-[-8px] cursor-pointer text-[#F5722E]"
                size={26}
              />
              <div className="flex flex-row items-center gap-1 h-[16px]">
                <MapPin size={14} className="text-[#F5722E]" />
                <p className="text-[13px] font-light mt-0 text-[#263238]">
                  Based in{" "}
                  {hasCountry
                    ? getLabel("country", values.country)
                    : " (Country)"}
                </p>
              </div>
              {/* LinkedIn Profile Link - only shown if URL is valid */}
              {hasValidLinkedIn && (
                <div 
                  className="flex flex-row items-center gap-1 h-[16px] mt-1 cursor-pointer" 
                  onClick={openLinkedInProfile}
                >
                  <img src={linkedin_icon} alt="LinkedIn" className="w-3.5 h-3.5" />
                  <p className="text-[13px] font-light mt-0 text-[#263238] underline">
                    LinkedIn Profile
                  </p>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {hasSkills ? (
              <div className="h-[60px] mb-0">
                <p className="text-[13px] font-light text-[#263238]">
                  Core Skills:
                </p>
                <div className="flex gap-1 overflow-hidden whitespace-nowrap">
                  {formattedSkills.slice(0, 5).map((skill, i) => (
                    <span
                      key={i}
                      title={skill}
                      className={`text-white text-xs font-semibold px-1.5 py-0 rounded-[2px] inline-block max-w-[125px] truncate ${
                        i % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                      }`}
                    >
                      {skill}
                      <span className="sr-only">{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[70px] md:h-[60px] mb-1">
                <p className="text-[13px] font-light text-[#263238]">
                  Core Skills:
                </p>
                <div className="flex gap-1 overflow-hidden whitespace-nowrap">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`text-white text-xs font-semibold px-1.5 py-0 rounded-[2px] inline-block max-w-[125px] truncate ${
                        i % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                      }`}
                    >
                      Skills
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <span className="text-[13px] font-light text-[#263238]">
                  Experience:
                </span>
                <span className="text-[13px] font-light text-[#F5722E] rounded px-1 py-0.5 h-[18px] flex justify-center items-center border border-[#F5722E]">
                  {hasExperience
                    ? getLabel("yearsOfExperience", values.yearsOfExperience)
                    : "years of experience"}
                </span>
              </div>

              <div className="flex gap-1">
                <span className="text-sm font-light text-gray-800">
                  Looking for:
                </span>
                {hasEmploymentType ? (
                  values.employmentType?.map((type, index) => (
                    <span
                      key={index}
                      className={`text-white rounded px-1 h-5 flex justify-center items-center text-xs ${
                        type === "part-time" ? "bg-[#BF532C]" : "bg-[#F5722E]"
                      }`}
                    >
                      {getLabel("employmentType", type) as string}
                    </span>
                  ))
                ) : (
                  <span className="bg-[#F5722E] text-white rounded px-1 h-5 flex justify-center items-center text-xs">
                    Your job preference
                  </span>
                )}
              </div>

              <div className="flex gap-1">
                <span className="text-[13px] font-light text-[#263238]">
                  Salary Expectation:
                </span>
                {hasSalary ? (
                  <span className="bg-[#8C4227] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                    {getLabel("salaryRange", values.salaryRange)}
                  </span>
                ) : (
                  <span className="bg-[#8C4227] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                    Amount in USD
                  </span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-row justify-end -mr-4 -mt-4 space-x-1">
            <Button
              variant="default"
              className="text-[12px] font-semibold h-[27px] bg-[#F5722E]"
            >
              Schedule Interview
            </Button>
            <MoreVertical size={12} className="text-gray-700 cursor-pointer" />
          </CardFooter>
        </Card>
      </div>

      {/* Mobile View */}
      <Card className="bg-[#F5F5F7] w-[308px] h-[395px] p-2 md:hidden flex flex-col">
        <CardHeader className="flex-1 overflow-y-auto p-0">
          <div className="w-full relative">
            <div className="flex flex-col items-end justify-end">
              <div className="flex-1">
                <span className="text-[11px] text-gray-600 font-light">
                  Applied today
                </span>
              </div>
              <div>
                <Bookmark
                  className="text-[#F5722E] cursor-pointer absolute right-1"
                  size={24}
                />
              </div>
            </div>

            <div className="pt-2 pl-2">
              <CardTitle className="text-sm font-semibold max-w-[250px] truncate">
                {hasName
                  ? `${values.firstName} ${values.lastName}`
                  : "Your First and Last Name"}
              </CardTitle>
              <div className="flex items-center mb-1">
                <MapPin size={12} className="mr-1 text-[#F5722E]" />
                <p className="text-[13px] text-[#263238]">
                  Based in{" "}
                  {hasCountry ? getLabel("country", values.country) : "(Country)"}
                </p>
              </div>
              
              {/* LinkedIn Profile Link for Mobile - only shown if URL is valid */}
              {hasValidLinkedIn && (
                <div 
                  className="flex items-center mb-2 cursor-pointer" 
                  onClick={openLinkedInProfile}
                >
                  <img src={linkedin_icon} alt="LinkedIn" className="mr-1 w-3 h-3" />
                  <p className="text-[13px] text-[#263238] underline">
                    LinkedIn Profile
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <div className="h-auto">
                  <p className="text-xs font-light text-gray-800">
                    Core Skills:
                  </p>
                  <div className="flex flex-wrap gap-1 mx-1">
                    {hasSkills
                      ? formattedSkills.slice(0, 5).map((skill, i) => (
                          <span
                            key={i}
                            title={skill}
                            className={`text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block max-w-32 truncate ${
                              i % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                            }`}
                          >
                            {skill}
                          </span>
                        ))
                      : [0, 1, 2, 3, 4].map((i) => (
                          <span
                            key={i}
                            className={`text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block max-w-32 truncate ${
                              i % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                            }`}
                          >
                            Skills
                          </span>
                        ))}
                  </div>
                </div>

                <div className="flex gap-1 mt-4">
                  <span className="text-[13px] font-light">Experience:</span>
                  <span className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                    {hasExperience
                      ? getLabel("yearsOfExperience", values.yearsOfExperience)
                      : "years of experience"}
                  </span>
                </div>

                <div className="flex gap-1 flex-wrap">
                  <span className="text-[13px] font-light">Available for:</span>
                  {hasEmploymentType ? (
                    values.employmentType?.map((type, index) => (
                      <span
                        key={index}
                        className={`text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center ${
                          type === "part-time" ? "bg-[#BF532C]" : "bg-[#F5722E]"
                        }`}
                      >
                        {getLabel("employmentType", type) as string}
                      </span>
                    ))
                  ) : (
                    <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                      your job preference
                    </span>
                  )}
                </div>

                <div className="flex gap-1">
                  <span className="text-[13px] font-light">
                    Salary Expectation:
                  </span>
                  <span className="bg-[#8C4227] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                    {hasSalary
                      ? getLabel("salaryRange", values.salaryRange)
                      : "Amount in USD"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-auto flex flex-col items-center relative">
          <Button
            variant="default"
            className="text-[12px] font-semibold bg-[#F5722E]"
          >
            Schedule Interview
          </Button>
          <MoreVertical
            size={12}
            className="text-gray-700 cursor-pointer absolute right-1 mt-6"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export { AppCardPreview };
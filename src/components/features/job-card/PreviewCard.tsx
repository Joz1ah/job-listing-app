import React from "react";
import { Bookmark, MapPin, MoreVertical } from "lucide-react";
import sparkeIcon from "images/sparkle-icon.png";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  Button,
} from "components";
//import { SkillsWithEllipsis } from "components";

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

interface Skill {
  name: string;
  isMatch: boolean;
}

interface FormValues {
  firstName: string;
  lastName: string;
  birthday: string;
  emailAddress: string;
  mobileNumber: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  languages: string[];
  country: string;
  jobTitle?: string;
}

interface PreviewCardProps {
  values: FormValues;
  selectOptions: SelectOptions;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ values, selectOptions }) => {
  const getLabel = (
    type: keyof SelectOptions,
    value: string | string[],
  ): string | string[] => {
    if (!value) return "";

    if (Array.isArray(value)) {
      return value.map((v) => {
        const option = selectOptions[type]?.find((opt) => opt.value === v);
        return option?.label || v;
      });
    }

    const option = selectOptions[type]?.find((opt) => opt.value === value);
    return option?.label || value;
  };

  const formattedSkills: Skill[] =
    values.coreSkills?.map((skillValue) => ({
      name: (getLabel("coreSkills", skillValue) as string) || skillValue,
      isMatch: false,
    })) || [];

  const hasName = values.firstName || values.lastName;
  const hasCountry = values.country;
  const hasSkills = values.coreSkills?.length > 0;
  const hasExperience = values.yearsOfExperience;
  const hasEmploymentType = values.employmentType?.length > 0;
  const hasSalary = values.salaryRange;
  const hasLanguages = values.languages?.length > 0;

  return (
    <div className="mt-8">
      <div className="flex items-center flex-wrap text-white text-base mb-2">
        <span>This is how your</span>
        <div className="flex items-center mx-1">
          <img src={sparkeIcon} className="w-4 h-4 mr-1" alt="spark icon" />
          <span className="text-orange-500">Perfect Match</span>
        </div>
        <span>application card will appear to your future Employers.</span>
      </div>

      <Card className="bg-white border-none w-full md:w-[436px] h-auto md:h-[275px]">
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <span className="text-[13px] text-orange-500 font-semibold">
              ☆ NEW
            </span>
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-light text-gray-400 -mr-2">
                Applied today
              </span>
              <Bookmark
                className="absolute mt-5 -mr-2 cursor-pointer text-orange-500"
                size={26}
              />
            </div>
          </div>
          <div>
            <CardTitle
              className={`text-sm ${hasName ? "font-semibold" : "font-semibold text-black"}`}
            >
              {hasName
                ? `${values.firstName} ${values.lastName}`
                : "Your First and Last Name"}
            </CardTitle>
            <div className="flex flex-row items-center gap-1 h-[16px]">
              <MapPin size={14} className=" text-orange-500 " />
              <p className="text-[13px] font-light mt-0 text-black">
                Based in{" "}
                {hasCountry
                  ? getLabel("country", values.country)
                  : " (Country)"}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {hasSkills ? (
            <div className="h-[60px] mb-3">
              <p className="text-[13px] font-light text-black">Core Skills:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {[0, 1, 2, 3, 4].map((i) => {
                  const skill = formattedSkills[i];
                  return (
                    <span
                      key={i}
                      className={`text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block ${
                        i % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                      }`}
                    >
                      {skill ? skill.name : "Skills"}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-[60px] mb-3">
              <p className="text-[13px] font-light text-black">Core Skills:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block ${
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
            <div className="flex gap-2">
              <span className="text-[13px] font-light text-black">
                Experience:
              </span>
              <span
                className={`text-[13px] font-light ${hasExperience ? "" : "text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]"}`}
              >
                {hasExperience
                  ? getLabel("yearsOfExperience", values.yearsOfExperience)
                  : "years of experience"}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="text-[13px] font-light text-black">
                Looking for:
              </span>
              {hasEmploymentType ? (
                values.employmentType?.map((type, index) => (
                  <span
                    key={index}
                    className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center"
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

            <div className="flex gap-2">
              <span className="text-[13px] font-light text-black">
                Salary Expectation:
              </span>
              {hasSalary ? (
                <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                  {getLabel("salaryRange", values.salaryRange)}
                </span>
              ) : (
                <>
                  <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                    Amount in USD
                  </span>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <span className="text-[13px] font-light text-black">
                Language:
              </span>
              {hasLanguages ? (
                values.languages?.map((lang, index) => (
                  <span
                    key={index}
                    className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]"
                  >
                    {getLabel("languages", lang) as string}
                  </span>
                ))
              ) : (
                <span className="text-[#F5722E] rounded-[4px] text-[12px] px-1 h-[18px] flex justify-center items-center outline outline-1 outline-[#F5722E]">
                  languages spoken & written
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
  );
};

export { PreviewCard };

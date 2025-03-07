import { FC } from "react";
import { SkillsWithEllipsis } from "components";
import { Trash2, MapPin, Edit } from "lucide-react";
import { Card, CardHeader, CardContent } from "components";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isNew: boolean;
  posted: string;
  requiredSkills: string[];
  experienceLevel: string;
  employmentType: string[];
  salary: string;
  language?: string[] | string;
  description?: string;
}

interface JobListingCardProps {
  job: JobListing;
  onDelete?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
}

const getEmploymentTypeStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const JobListingCard: FC<JobListingCardProps> = ({ job, onDelete, onEdit }) => {
  // Split language string into array if it's not already
  const languages = Array.isArray(job.language)
    ? job.language
    : typeof job.language === "string"
      ? job.language.split(",").map((lang: string) => lang.trim())
      : [];

  return (
    <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-[320px] md:h-[275px] relative cursor-pointer">
      <div className="flex flex-col h-full">
        <CardHeader className="flex flex-col justify-between items-start pb-0">
          <div className="flex flex-row -mt-4 justify-between w-full">
            <div className="h-[20px]">
              {job.isNew && (
                <span className="absolute text-[13px] text-[#F5722E] font-bold italic">
                  ★ NEW
                </span>
              )}
            </div>
            <div className="flex flex-col items-end relative">
              <span className="text-[12px] font-light text-[#717171] -mr-2">
                Posted {job.posted} ago
              </span>
              <div className="absolute top-6 -right-2">
                <Trash2
                  className="w-5 h-5 text-red-500 hover:text-red-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(job.id);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="w-full relative mt-2">
            <h3
              className="text-[14px] font-semibold text-[#263238] cursor-pointer hover:text-[#F5722E] truncate"
              title={job.title}
            >
              {job.title}
            </h3>
            <p
              className="text-[13px] text-[#263238] underline truncate"
              title={job.company}
            >
              {job.company}
            </p>
            <div className="flex flex-row items-center">
              <MapPin size={14} className="text-[#F5722E] flex-shrink-0" />
              <p className="text-[13px] font-light mt-0 ml-2 text-[#263238] truncate">
                Based in {job.location}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-1 flex-1">
          <div className="h-[55px]">
            <SkillsWithEllipsis skills={job.requiredSkills} />
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <div className="flex gap-2 items-center">
              <span className="text-[13px] font-light text-[#263238]">
                Experience:
              </span>
              <span className="text-[12px] text-[#F5722E] font-light border border-[#F5722E] items-center rounded-[2px] px-1">
                {job.experienceLevel}
              </span>
            </div>
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-[13px] font-light text-[#263238]">
                Looking for:
              </span>
              {job.employmentType.map((type: string, index: number) => (
                <span
                  key={index}
                  className={`${getEmploymentTypeStyle(type)} text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center`}
                >
                  {type}
                </span>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-[13px] font-light text-[#263238]">
                Salary:
              </span>
              <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
                {job.salary}
              </span>
            </div>
            {languages.length > 0 && (
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-[13px] font-light text-[#263238]">
                  Language:
                </span>
                {languages.map((lang: string, index: number) => (
                  <span
                    key={index}
                    className="border border-[#F5722E] text-[#F5722E] rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Edit button positioned at the bottom right */}
      <button
        className="absolute bottom-3 right-3 border border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-white rounded-sm py-1 px-3 text-xs font-medium transition-colors duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(job.id);
        }}
      >
        <span className="hidden md:inline">Edit</span>
        <Edit size={14} className="md:hidden" />
      </button>
    </Card>
  );
};

export { JobListingCard };
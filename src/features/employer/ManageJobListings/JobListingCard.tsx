import { FC, useState } from "react";
import { SkillsWithEllipsis } from "components";
import { Trash2, MapPin, Edit } from "lucide-react";
import { Card, CardHeader, CardContent } from "components";
import { Tooltip } from "components";
import { ManageCardPreview } from "./preview/manage-card-preview";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isNew: boolean;
  posted: string;
  requiredSkills: string[]; // This remains for backward compatibility with the card display
  experienceLevel: string;
  employmentType: string[];
  salary: string;
  language?: string | string[];
  description?: string;
  education?: string; // Added education
  // New properties for all skill types
  coreSkills?: string[];
  interpersonalSkills?: string[];
  certifications?: string[];
  isBookmarked?: boolean;
}

interface JobListingCardProps {
  job: JobListing;
  onDelete?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
}

const getEmploymentTypeStyle = (type: string) => {
  return type.toLowerCase() === "part time" ? "bg-[#BF532C]" : "bg-[#F5722E]";
};

const JobListingCard: FC<JobListingCardProps> = ({ job, onEdit }) => {
  // State for modal open/close
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Split language string into array if it's not already
  const languages = Array.isArray(job.language)
    ? job.language
    : typeof job.language === "string"
      ? job.language.split(",").map((lang: string) => lang.trim())
      : [];

  // Convert JobListing to Match format for the modal
  const jobAsMatch = {
    id: job.id,
    position: job.title,
    company: job.company,
    location: job.location,
    coreSkills: job.coreSkills || job.requiredSkills, // Use coreSkills if available, otherwise fall back to requiredSkills
    experience: job.experienceLevel,
    lookingFor: job.employmentType,
    salaryExpectation: job.salary,
    certificates: job.certifications || [], // Pass certifications
    interpersonalSkills: job.interpersonalSkills || [], // Pass interpersonal skills
    education: job.education || "", // Pass education
    description: job.description || "No description provided."
  };

  return (
    <>
      <Card className="bg-[#FFFFFF] border-none w-full md:w-[436px] h-[320px] md:h-[275px] relative">
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
              <div className="flex flex-col items-end">
                <span className="text-[12px] font-light text-[#717171] -mr-2">
                  {job.posted === "today" ? "Posted today" : `Posted ${job.posted} ago`}
                </span>
              </div>
            </div>

            {/* Positioned the trash icon outside the title area with higher z-index */}
            <div className="absolute top-8 right-2 z-10">
              <Tooltip content="Can't delete job listing for now">
                <div className="p-1"> {/* Added padding to increase hover area */}
                  <Trash2
                    className="w-5 h-5 text-red-500 hover:text-red-700 cursor-not-allowed"
                  />
                </div>
              </Tooltip>
            </div>

            <div className="w-full relative mt-2 pr-8"> {/* Added right padding to avoid text overlap */}
              <h3
                className="text-[14px] font-semibold text-[#263238] cursor-pointer hover:text-[#F5722E] truncate"
                title={job.title}
                onClick={() => setIsPreviewModalOpen(true)}
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
      
      {/* Manage Card Preview Modal */}
      <ManageCardPreview 
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        job={jobAsMatch}
      />
    </>
  );
};

export { JobListingCard };
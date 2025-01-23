import React from "react";
import { MapPin, X } from "lucide-react";
import { Card, CardFooter } from "components";
import { Button } from "components";
import { selectOptions, FormData } from "mockData/job-listing-form-options";
import { useAuth } from "contexts/AuthContext/AuthContext";

interface JobListingPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onConfirm: () => void;
}

const JobListingPreview: React.FC<JobListingPreviewProps> = ({
  isOpen,
  formData,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  // Helper functions to get labels
  const getLabel = (
    value: string,
    optionType: keyof typeof selectOptions,
  ): string => {
    const option = selectOptions[optionType].find((opt) => opt.value === value);
    return option?.label || value;
  };

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Get multiple labels for array values
  const getLabels = (
    values: string[],
    optionType: keyof typeof selectOptions,
  ): string[] => {
    return values.map((value) => {
      const option = selectOptions[optionType].find(
        (opt) => opt.value === value,
      );
      const label = option?.label || value;
      return ["coreSkills", "certifications", "interpersonalSkills"].includes(optionType) 
        ? capitalizeFirstLetter(label)
        : label;
    });
  };

  const { user } = useAuth();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex flex-col items-center overflow-y-auto p-4 pt-8">
      <Card className="bg-white w-full max-w-[760px] min-h-[600px] md:min-h-[825px] relative mt-12">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <div className="p-4 md:p-8 space-y-3">
          {/* Title and Company */}
          <div>
            <h2 className="text-lg md:text-[17px] font-semibold">{formData.jobTitle}</h2>
            <p className="text-sm md:text-[17px] text-[#263238] underline">{user?.data?.user?.relatedDetails?.businessName}</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <MapPin size={16} className="text-[#F5722E]" />
            <span>Based in {formData.location}</span>
          </div>

          {/* Core Skills */}
          <div className="space-y-2">
            <p className="text-sm md:text-[17px] text-[#263238]">Core Skills:</p>
            <div className="flex flex-wrap gap-2">
              {getLabels(formData.coreSkills, "coreSkills").map(
                (skill, index) => (
                  <span
                    key={skill}
                    className={`${index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"} text-white text-xs md:text-[17px] font-semibold px-2 md:px-3 py-1 rounded`}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Experience Row */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Experience:</span>
            <span className="text-[#F5722E] border border-[#F5722E] rounded px-2 md:px-3 py-0.5">
              {getLabel(formData.yearsOfExperience, "yearsOfExperience")}
            </span>
          </div>

          {/* Employment Type Row */}
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Employment Preference:</span>
            <div className="flex flex-wrap gap-2">
              {getLabels(formData.employmentType, "employmentType").map((type) => (
                <span
                  key={type}
                  className="bg-[#F5722E] text-white rounded px-2 md:px-3 py-0.5"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Salary Row */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Salary:</span>
            <span className="bg-[#F5722E] text-white rounded px-2 md:px-3 py-0.5">
              {getLabel(formData.salaryRange, "salaryRange")}
            </span>
          </div>

          {/* Education Row */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Education:</span>
            <span className="text-[#F5722E] border border-[#F5722E] rounded px-2 md:px-3 py-0.5">
              {getLabel(formData.education, "education")}
            </span>
          </div>

          {/* Certification */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Certificate:</span>
            <span className="text-[#F5722E] border border-[#F5722E] rounded px-2 md:px-3 py-0.5">
              {formData.certifications.length ? getLabels(formData.certifications, "certifications").join(', ') : 'None required'}
            </span>
          </div>

          {/* Interpersonal Skills */}
          <div className="space-y-2">
            <p className="text-sm md:text-[17px] text-[#263238]">Interpersonal Skills:</p>
            <div className="flex flex-wrap gap-2">
              {getLabels(formData.interpersonalSkills, "interpersonalSkills").map(
                (skill, index) => (
                  <span
                    key={skill}
                    className={`${index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"} text-white text-xs md:text-[17px] font-semibold px-2 md:px-3 py-1 rounded`}
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Priority Indicator Note */}
          <div className="text-xs md:text-sm text-gray-500 italic">
            The Priority Indicator is for Employer's view only
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <p className="text-sm md:text-[17px] text-[#263238]">Job Description:</p>
            <div className="w-full p-3 md:p-4 text-xs md:text-sm border border-gray-200 rounded-md min-h-[120px]">
              {formData.jobDescription}
            </div>
          </div>

          <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-start p-4 md:p-8 bg-transparent">
            <Button
              onClick={onConfirm}
              className="bg-[#F5722E] text-white hover:bg-orange-600 px-6 md:px-8 py-2"
            >
              Go To Job Feed
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export { JobListingPreview };

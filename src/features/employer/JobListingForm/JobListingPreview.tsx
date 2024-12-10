import React from "react";
import { MapPin, MoreVertical, Bookmark } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "components";
import { Button } from "components";
import sparkleIcon from "images/sparkle-icon.png";
import { selectOptions, FormData } from "mockData/job-listing-form-options";

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

  // Get multiple labels for array values
  const getLabels = (
    values: string[],
    optionType: keyof typeof selectOptions,
  ): string[] => {
    return values.map((value) => {
      const option = selectOptions[optionType].find(
        (opt) => opt.value === value,
      );
      return option?.label || value;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex flex-col items-center overflow-y-auto pt-20">
      {/* Preview Card */}

      <div className="flex items-center flex-wrap text-white text-base mb-2 p-4 md:hidden">
        <span>This is how your</span>
        <div className="flex items-center mx-1">
          <img src={sparkleIcon} className="w-4 h-4 mr-1" alt="spark icon" />
          <span className="text-orange-500">Perfect Match</span>
        </div>
        <span>application card will appear to your future Employers.</span>
      </div>

      <Card className="bg-[#F5F5F7] w-[308px] min-h-[395px] p-2 relative flex flex-col mb-[74px] md:hidden">
        <CardHeader className="flex-1 overflow-y-auto p-0">
          <div className="w-full">
            <div className="flex flex-col items-end justify-end">
              <div className="flex-1">
                <span className="text-[11px] text-gray-600 font-light">
                  Posted Just Now
                </span>
              </div>
              <Bookmark className="absolute text-orange-500 top-7 " size={26} />
            </div>

            <div className="px-1">
              <div className="-space-y-1">
                <h3 className="text-sm font-semibold">{formData.jobTitle}</h3>
                <p className="text-[13px] text-[#263238] underline mt-0">
                  ABC Corporation
                </p>
              </div>

              <p className="text-[13px] text-[#263238] flex items-center mb-2">
                <MapPin size={14} className="mr-1 text-[#F5722E]" />
                Based in {formData.location}
              </p>

              <div className="space-y-1">
                <p className="text-[13px] text-[#263238]">Core Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {getLabels(formData.coreSkills, "coreSkills").map(
                    (skill, index) => (
                      <span
                        key={skill}
                        className={`${index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"} text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-2 space-y-1">
                <div className="flex gap-2">
                  <span className="text-[13px] font-light">Experience:</span>
                  <span className="text-[12px] text-[#F5722E] font-light outline outline-1 outline-[#F5722E] rounded-[2px] px-1">
                    {getLabel(formData.yearsOfExperience, "yearsOfExperience")}
                  </span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="text-[13px] font-light">Available for:</span>
                  {getLabels(formData.employmentType, "employmentType").map(
                    (type) => (
                      <span
                        key={type}
                        className="bg-[#F5722E] text-white rounded-[2px] text-[12px] px-1 h-[18px] flex justify-center items-center"
                      >
                        {type}
                      </span>
                    ),
                  )}
                </div>

                <div className="flex gap-2">
                  <span className="text-[13px] font-light">Salary:</span>
                  <span className="bg-[#F5722E] text-white rounded-[2px] text-[12px] px-1 h-[18px] flex justify-center items-center">
                    {getLabel(formData.salaryRange, "salaryRange")}
                  </span>
                </div>
              </div>

              <textarea
                value={formData.jobDescription}
                readOnly
                className="w-full h-[80px] p-2 text-[10px] resize-none bg-transparent line-clamp-5 overflow-hidden"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-auto flex flex-col items-center">
          <MoreVertical
            size={12}
            className="text-gray-700 cursor-pointer absolute bottom-3 right-2"
          />
        </CardContent>
      </Card>

      <div className="flex items-center flex-wrap text-white text-base mb-2 p-4">
        <span>This is your Complete Preview of your job listing</span>
      </div>

      <Card className="bg-[#FFFFFF] w-[400px] min-h-[700px] relative">
        <div className="p-6 space-y-2 ">
          {/* Title and Company */}
          <div>
            <h2 className="text-sm font-semibold">{formData.jobTitle}</h2>
            <p className="text-[13px] text-[#263238]">ABC Corporation</p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[13px]">
            <MapPin size={14} className="text-orange-500" />
            <span>Based in {formData.location}</span>
          </div>

          {/* Core Skills */}
          <div className="space-y-2">
            <p className="text-[13px] text-[#263238]">Core Skills:</p>
            <div className="flex flex-wrap gap-2">
              {getLabels(formData.coreSkills, "coreSkills").map(
                (skill, index) => (
                  <span
                    key={skill}
                    className={`${index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"} text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Experience Row */}
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-[#263238]">Experience:</span>
            <span className="text-[12px] text-orange-500 font-light border border-orange-500 rounded-[4px] px-1.5">
              {getLabel(formData.yearsOfExperience, "yearsOfExperience")}
            </span>
          </div>

          {/* Available For Row */}
          <div className="flex items-center gap-2 text-[13px]">
            <span className="text-[#263238]">Available for:</span>
            <div className="flex gap-1">
              {getLabels(formData.employmentType, "employmentType").map(
                (emp) => (
                  <span
                    key={emp}
                    className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center"
                  >
                    {emp}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Salary Row */}
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-[#263238]">Salary:</span>
            <span className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center">
              {getLabel(formData.salaryRange, "salaryRange")}
            </span>
          </div>

          {/* Education Row */}
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-[#263238]">Education:</span>
            <span className="text-[12px] text-orange-500 font-light border border-orange-500 rounded-[4px] px-1.5">
              {getLabel(formData.education, "education")}
            </span>
          </div>

          {/* Language Row */}
          <div className="flex items-center gap-1 text-[13px]">
            <span className="text-[#263238]">Language:</span>
            <div className="flex flex-wrap gap-1">
              {getLabels(formData.languages, "languages").map((lang) => (
                <span
                  key={lang}
                  className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Certification Row */}
          <div className="space-y-2">
            <span className="text-[13px] text-[#263238]">Certification:</span>
            {formData.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {getLabels(formData.certifications, "certifications").map(
                  (cert, index) => (
                    <span
                      className={`${index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"} text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                      key={cert}
                    >
                      {cert}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <span className="bg-[#168AAD] text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block ml-1">
                None
              </span>
            )}
          </div>

          {/* Interpersonal Skills */}
          <div className="space-y-2">
            <p className="text-[13px] text-[#263238]">Interpersonal Skills:</p>
            <div className="flex flex-wrap gap-2">
              {getLabels(
                formData.interpersonalSkills,
                "interpersonalSkills",
              ).map((skill, index) => (
                <span
                  key={skill}
                  className={`${index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"} text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Priority Indicator Note */}
          <div className="text-xs text-gray-500 italic">
            The Priority Indicator is for Employer's view only
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <p className="text-[13px] text-[#263238]">Job Description:</p>
            <textarea
              value={formData.jobDescription}
              readOnly
              className="w-full h-[135px] p-2 text-[10px] border border-gray-200 rounded-md resize-none"
            />
          </div>

          <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-between gap-4 p-4 bg-transparent">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 h-[27px] max-w-[133px]"
            >
              Keep Editing
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-orange-500 text-white hover:bg-orange-600 h-[27px] w-[133px]"
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

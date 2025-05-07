// The key change is in the Former Employer section where we add proper spacing 
// between multiple employer entries with a divider

import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { selectOptions, FormData } from "mockData/app-form-options";
import linkedin_icon from "assets/linkedin.svg?url";

interface FormerEmployer {
  name: string;
  jobTitle: string;
  duration: string;
}

interface ApplicationFormPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData & {
    formerEmployers?: FormerEmployer[];
    linkedln?: string;
  };
  onConfirm: () => void;
}

// LinkedIn Link component
const LinkedInLink: React.FC<{ linkedInUrl: string }> = ({ linkedInUrl }) => {
  const handleLinkedInClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent propagation

    // Add protocol if missing
    let url = linkedInUrl;
    if (!url.startsWith("http")) {
      url = "https://" + url;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="flex items-center gap-1 text-[13px] md:text-[17px] cursor-pointer text-[#263238] underline"
      onClick={handleLinkedInClick}
    >
      <img src={linkedin_icon} alt="LinkedIn" className="w-4 h-4" />
      <span>LinkedIn Profile</span>
    </div>
  );
};

const ApplicationFormPreview: React.FC<ApplicationFormPreviewProps> = ({
  isOpen,
  formData,
  onConfirm,
  onClose,
}) => {
  const [maxHeight, setMaxHeight] = useState("90vh");

  const getLabel = (
    value: string,
    optionType: keyof typeof selectOptions,
  ): string => {
    const option = selectOptions[optionType].find((opt) => opt.value === value);
    return option?.label || value;
  };

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

  const toTitleCase = (text: string): string => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const showFormerEmployer =
    formData.yearsOfExperience &&
    formData.yearsOfExperience !== "No experience";

  useEffect(() => {
    function updateHeight() {
      const vh = window.innerHeight;
      const calculatedHeight = Math.min(vh * 0.9, 670);
      setMaxHeight(`${calculatedHeight}px`);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] md:w-full max-w-2xl p-0 flex flex-col"
        style={{ height: maxHeight }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="px-4 sm:px-6 py-4">
              <div className="space-y-3">
                {/* Personal Information */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-lg md:text-3xl font-semibold text-[#263238]">
                    {formData.firstName} {formData.lastName}
                  </DialogTitle>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-sm md:text-[17px]">
                    Based in {getLabel(formData.country, "country")}
                  </span>
                </div>

                {/* LinkedIn - Only if not on free trial */}
                {formData.linkedln && (
                  <div className="flex items-center gap-2">
                    <LinkedInLink linkedInUrl={formData.linkedln} />
                  </div>
                )}

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="flex justify-start text-sm md:text-[17px] font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.coreSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
                      >
                        {toTitleCase(skill)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Experience:
                  </h4>
                  <span className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 rounded-sm">
                    {getLabel(formData.yearsOfExperience, "yearsOfExperience")}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Looking For:
                  </h4>
                  <div className="flex gap-2">
                    {getLabels(formData.employmentType, "employmentType").map(
                      (emp) => (
                        <span
                          key={emp}
                          className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm"
                        >
                          {emp}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Salary Expectation:
                  </h4>
                  <span className="bg-[#8C4227] text-sm md:text-[17px] text-white px-2 rounded-sm">
                    {getLabel(formData.salaryRange, "salaryRange")}
                  </span>
                </div>

                {/* Languages */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Languages:
                  </h4>
                  <div className="flex gap-2">
                    {getLabels(formData.languages, "languages").map((lang) => (
                      <span
                        key={lang}
                        className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 rounded-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Education:
                  </h4>
                  <span className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 rounded-sm">
                    {getLabel(formData.education, "education")}
                  </span>
                </div>

                {/* Certifications - Fixed to display label above certificates */}
                <div className="flex flex-col gap-2">
                  <h4 className="flex justify-start text-sm md:text-[17px] font-normal text-[#263238]">
                    Certifications:
                  </h4>
                  <div className="flex flex-wrap gap-2 text-left w-full">
                    {!formData.certifications ||
                    formData.certifications.length === 0 ? (
                      <span className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm text-left">
                        N/A
                      </span>
                    ) : (
                      formData.certifications.map((cert) => (
                        <span
                          key={cert}
                          className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm text-left"
                        >
                          {toTitleCase(cert)}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Interpersonal Skills */}
                {formData.interpersonalSkills &&
                  formData.interpersonalSkills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="flex justify-start text-sm md:text-[17px] font-normal text-[#263238]">
                        Interpersonal Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.interpersonalSkills.map((skill, index) => (
                          <span
                            key={skill}
                            className={`${
                              index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                            } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
                          >
                            {toTitleCase(skill)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Former Employers - UPDATED SECTION */}
                {showFormerEmployer && formData.formerEmployers && formData.formerEmployers.length > 0 && (
                    <div className="mt-10">
                      {formData.formerEmployers.map((employer, index) => {
                        // Skip empty entries
                        if (
                          !employer.name &&
                          !employer.jobTitle &&
                          !employer.duration
                        ) {
                          return null;
                        }
                        return (
                          <React.Fragment key={index}>
                            <div className="space-y-[10px] mb-4">
                              <p className="flex text-sm md:text-[17px] text-[#263238] flex-wrap text-left">
                                <span className="font-medium whitespace-nowrap">
                                  Former Employer Name:&nbsp;
                                </span>
                                <span className="break-words">
                                  {employer.name}
                                </span>
                              </p>
                              <p className="flex text-sm md:text-[17px] text-[#263238] flex-wrap text-left">
                                <span className="font-medium whitespace-nowrap">
                                  Former Job Title:&nbsp;
                                </span>
                                <span className="break-words">
                                  {employer.jobTitle}
                                </span>
                              </p>
                              <p className="flex text-sm md:text-[17px] text-[#263238] flex-wrap text-left">
                                <span className="font-medium whitespace-nowrap">
                                  Duration:&nbsp;
                                </span>
                                <span className="break-words">
                                  {employer.duration}
                                </span>
                              </p>
                            </div>
                            {/* Add extra space if not the last employer */}
                            {index < (formData.formerEmployers?.length ?? 0) - 1 && (
                              <div className="h-4"></div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  )}
              </div>
            </DialogHeader>
          </div>

          {/* Fixed Button Area */}
          <div className="pt-2 px-4 sm:px-6 pb-4 flex justify-start">
            <Button
              className="bg-[#F5722E] hover:bg-[#BF532C] w-[133px] h-[27px] px-0 text-white"
              onClick={onConfirm}
            >
              Go To Job Feed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ApplicationFormPreview };
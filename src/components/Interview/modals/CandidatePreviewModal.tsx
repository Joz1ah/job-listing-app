import { FC, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { BaseModalProps } from "mockData/employer-interviews-data";
import linkedin_icon from "assets/linkedin.svg?url";

// LinkedIn Link component
const LinkedInLink: FC<{ linkedInUrl: string }> = ({ linkedInUrl }) => {
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

const formatEmploymentPreference = (pref: string): string => {
  switch (pref) {
    case "full-time":
      return "Full Time";
    case "part-time":
      return "Part Time";
    case "contract":
      return "Contract Only";
    default:
      return pref; // Return original value if no match
  }
};

const CandidatePreviewModal: FC<BaseModalProps> = ({
  isOpen,
  onClose,
  interview,
}) => {
  const [maxHeight, setMaxHeight] = useState("80vh");

  useEffect(() => {
    function updateHeight() {
      const vh = window.innerHeight;
      const calculatedHeight = Math.min(vh * 0.9, 822);
      setMaxHeight(`${calculatedHeight}px`);
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[calc(100%-2rem)] md:w-full md:min-w-[760px] p-0 flex flex-col"
        style={{ height: maxHeight }}
      >
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-4 md:p-6 md:pt-10">
              <div className="space-y-4">
                {/* Name and Position - Fixed alignment */}
                <DialogTitle>
                  <div className="flex flex-col items-start">
                    <h2 className="text-lg md:text-xl font-semibold text-[#263238] mb-1">
                      {interview.candidate}
                    </h2>
                    <p className="text-[15px] md:text-lg text-[#263238] font-normal underline">
                      {interview.position}
                    </p>
                  </div>
                </DialogTitle>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-[#F5722E]" />
                  <span className="text-sm md:text-[17px] text-[#263238]">
                    Based in {interview.country}
                  </span>
                </div>

                {/* LinkedIn - Only if not on free trial */}
                {interview.linkedIn && (
                  <div className="flex items-center gap-2">
                    <LinkedInLink linkedInUrl={interview.linkedIn} />
                  </div>
                )}

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.coreSkills?.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-2 py-1 text-sm md:text-[17px] rounded font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {interview.experience && (
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Experience:
                    </h4>
                    <span className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 py-0.5 rounded-sm">
                      {interview.experience}
                    </span>
                  </div>
                )}

                {/* Employment Preference */}
                {interview.employmentPreference && (
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Employment Preference:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.employmentPreference.map((pref) => (
                        <span
                          key={pref}
                          className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 py-0.5 rounded-sm"
                        >
                          {formatEmploymentPreference(pref)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Salary Expectation */}
                {interview.salaryExpectation && (
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Salary Expectation:
                    </h4>
                    <span className="bg-[#8C4227] text-sm md:text-[17px] text-white px-2 py-0.5 rounded-sm">
                      {interview.salaryExpectation}
                    </span>
                  </div>
                )}

                {/* Language */}
                {interview.languages && (
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Language:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 py-0.5 rounded-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {interview.education && (
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Education:
                    </h4>
                    <span className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 py-0.5 rounded-sm">
                      {interview.education}
                    </span>
                  </div>
                )}

                {/* Certifications - Improved layout */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                    Certifications:
                  </h4>
                  {!interview.certificate ||
                  !Array.isArray(interview.certificate) ||
                  interview.certificate.length === 0 ? (
                    <span className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 py-0.5 rounded-sm w-fit">
                      N/A
                    </span>
                  ) : (
                    <div className="flex flex-col gap-2 w-full text-left">
                      {interview.certificate.map((cert) => (
                        <span
                          key={cert}
                          className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 py-1.5 rounded-sm w-full md:w-fit text-center md:text-left"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interpersonal Skills */}
                {interview.interpersonalSkills && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                      Interpersonal Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.interpersonalSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-2 py-1 text-sm md:text-[17px] rounded font-medium`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Former Employers */}
                {interview.formerEmployers &&
                  interview.formerEmployers.length > 0 && (
                    <div className="flex flex-col gap-2 mt-2">
                      {interview.formerEmployers.map((employer, index) => (
                        <div key={index} className="space-y-2">
                          <div>
                            <p className="text-sm md:text-[17px] text-[#263238] flex flex-wrap">
                              <span className="font-normal whitespace-nowrap">
                                Former Employer Name:&nbsp;
                              </span>
                              <span className="break-words">
                                {employer.name}
                              </span>
                            </p>
                          </div>

                          <div>
                            <p className="text-sm md:text-[17px] text-[#263238] flex flex-wrap">
                              <span className="font-normal whitespace-nowrap">
                                Former Job Title:&nbsp;
                              </span>
                              <span className="break-words">
                                {employer.jobTitle}
                              </span>
                            </p>
                          </div>

                          <div>
                            <p className="text-sm md:text-[17px] text-[#263238] flex flex-wrap">
                              <span className="font-normal whitespace-nowrap">
                                Duration:&nbsp;
                              </span>
                              <span className="break-words">
                                {employer.duration || "Not specified"}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </DialogHeader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { CandidatePreviewModal };

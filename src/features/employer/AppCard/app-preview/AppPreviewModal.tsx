import React, { FC, useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { ScheduleInterviewModal } from "features/employer";
//import { Match } from "mockData/job-hunter-data";
import { Match } from "contexts/PerfectMatch/types";
import { useAuth } from "contexts/AuthContext/AuthContext";
import linkedin_icon from "assets/linkedin.svg?url";

interface AppPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (e: React.MouseEvent) => void;
  app: Match;
}

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

// LinkedInLink component to be used in the modal
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

const AppPreviewModal: FC<AppPreviewModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  app,
}) => {
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [maxHeight, setMaxHeight] = useState("90vh");
  const { user, userSettings } = useAuth();

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
            <DialogHeader className="px-6 py-4">
              <div className="space-y-3">
                {/* Applicant Name */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-lg md:text-3xl font-semibold text-[#263238]">
                    {`${app.firstName} ${app.lastName}`}
                  </DialogTitle>
                </div>

                {/* Job Role */}
                <div className="flex justify-start text-sm md:text-[17px] text-[#263238] underline">
                  {app.position}
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-sm md:text-[17px]">
                    Based in {app.country}
                  </span>
                </div>

                {/* LinkedIn */}
                {app.linkedIn && !app.isFreeTrial && (
                  <div className="flex items-center gap-2 text-[#263238]">
                    <LinkedInLink linkedInUrl={app.linkedIn} />
                  </div>
                )}

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="flex justify-start text-sm md:text-[17px] font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.coreSkills.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Experience:
                  </h4>
                  <span className="text-[#F5722E] text-sm md:text-[17px]  border border-[#F5722E] px-2 rounded-sm">
                    {app.experience}
                  </span>
                </div>

                {/* Employment Preference */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Looking For:
                  </h4>
                  <div className="flex gap-2">
                    {app.lookingFor.map((pref) => (
                      <span
                        key={pref}
                        className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm"
                      >
                        {formatEmploymentPreference(pref)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div className="flex items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                    Salary Expectation:
                  </h4>
                  <span className="bg-[#8C4227] text-sm md:text-[17px]  text-white px-2 rounded-sm">
                    {app.salaryExpectation}
                  </span>
                </div>

                {/* Languages */}
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <h4 className="text-sm md:text-[17px] font-normal text-[#263238] flex justify-start">
                    Languages:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.language.map((lang) => (
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
                  <span className="text-[#F5722E] text-sm md:text-[17px]  border border-[#F5722E] px-2 rounded-sm">
                    {app.education}
                  </span>
                </div>

                {/* Certificates */}
                <div className="flex flex-col gap-2">
                  <h4 className="flex justify-start text-sm md:text-[17px] font-normal text-[#263238]">
                    Certifications:
                  </h4>
                  {!app.certificates || app.certificates.length === 0 ? (
                    <span className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm">
                      N/A
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-2 text-left">
                      {app.certificates.map((cert) => (
                        <span
                          key={cert}
                          className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interpersonal Skills */}
                {app.interpersonalSkills &&
                  app.interpersonalSkills.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="flex justify-start text-sm md:text-[17px] font-normal text-[#263238]">
                        Interpersonal Skills:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {app.interpersonalSkills.map((skill, index) => (
                          <span
                            key={skill}
                            className={`${
                              index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                            } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Former Employers - Updated with proper spacing and empty check */}
                {app.formerEmployers && !app.isFreeTrial && (
                  <div className="pt-3">
                    {app.formerEmployers.map((employer, index) => {
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
                          {index < (app.formerEmployers?.length ?? 0) - 1 && (
                            <div className="h-2"></div>
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
          <div className="px-6 py-4 flex justify-start">
            <Button
              className="bg-[#F5722E] hover:bg-[#BF532C] w-[133px] h-[27px] text-xs px-0 text-white"
              onClick={onSchedule}
            >
              Schedule Interview
            </Button>
          </div>
        </div>

        <ScheduleInterviewModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          jobId={app.jobId}
          jobHunterId={app.id}
          employerId={user?.data.user.id}
          timezone={userSettings?.data.timeZone}
          position={app.position}
          coreSkills={app.coreSkills}
          certificate={app.certificates}
          candidateName={`${app.firstName} ${app.lastName}`}
          country={app.country}
        />
      </DialogContent>
    </Dialog>
  );
};

export { AppPreviewModal };

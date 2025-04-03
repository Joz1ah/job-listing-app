import { FC } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { BaseModalProps } from "mockData/job-hunter-interviews-data";

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

const JobInterviewPreviewModal: FC<BaseModalProps> = ({
  isOpen,
  onClose,
  interview,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] md:w-full md:min-w-[760px] h-[640px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div className="flex flex-col items-start">
                  <DialogTitle className=" mb-1">
                    <h2 className="text-lg md:text-xl font-semibold text-[#263238]">
                      {interview.position}
                    </h2>
                    <p className="text-[15px] md:text-lg text-[#263238] font-normal underline">
                      {interview.company}
                    </p>
                  </DialogTitle>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-sm md:text-[17px] text-[#263238]">
                    Based in {interview.country}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm flex justify-start md:text-[17px] font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.coreSkills?.map((skill, index) => (
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
                {interview.experience && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Experience:
                    </h4>
                    <span className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 rounded-sm">
                      {interview.experience}
                    </span>
                  </div>
                )}

                {/* Employment Preference */}
                {interview.employmentPreference && (
                  <div className="flex items-start md:items-center gap-2 flex-wrap">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Employment Preference:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.employmentPreference.map((pref) => (
                        <span
                          key={pref}
                          className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm"
                        >
                          {formatEmploymentPreference(pref)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Salary Expectation */}
                {interview.salaryExpectation && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Salary Expectation:
                    </h4>
                    <span className="bg-[#8C4227] text-sm md:text-[17px] text-white px-2 rounded-sm">
                      {interview.salaryExpectation}
                    </span>
                  </div>
                )}

                {/* Language */}
                {interview.languages && (
                  <div className="flex items-start md:items-center gap-2 flex-wrap">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Language:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 rounded-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {interview.education && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Education:
                    </h4>
                    <span className="text-[#F5722E] text-sm md:text-[17px] border border-[#F5722E] px-2 rounded-sm">
                      {interview.education}
                    </span>
                  </div>
                )}

                {/* Certificate */}
                {interview.certificate && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm md:text-[17px] font-normal text-[#263238]">
                      Certificate:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(interview.certificate) ? (
                        interview.certificate.map((cert ) => (
                          <span
                            key={cert}
                            className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm"
                          >
                            {cert}
                          </span>
                        ))
                      ) : (
                        <span className="bg-[#F5722E] text-sm md:text-[17px] text-white px-2 rounded-sm">
                          {interview.certificate}
                        </span>
                      )}
                    </div>
                  </div>
                )}

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
                          } text-white px-2 text-sm md:text-[17px] rounded font-medium`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Job Description */}
                {interview.description && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-sm md:text-[17px] flex justify-start font-normal text-[#263238]">
                      Job Description:
                    </h4>
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-4">
                      <p className="text-sm flex justify-start text-gray-700 whitespace-pre-wrap">
                        {interview.description}
                      </p>
                    </div>
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

export { JobInterviewPreviewModal };

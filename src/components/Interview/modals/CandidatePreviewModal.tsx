import { FC } from "react";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { BaseModalProps } from "mockData/employer-interviews-data";

const CandidatePreviewModal: FC<BaseModalProps> = ({
  isOpen,
  onClose,
  interview,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full md:min-w-[760px] h-[640px] p-0 flex flex-col">
        <div className="flex flex-col h-full">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6">
              <div className="space-y-4">
                {/* Name */}
                <div className="flex flex-col items-start">
                  <DialogTitle className="text-xl text-[#263238] mb-1">
                    <h2 className="text-xl font-semibold text-[#263238]">
                      {interview.candidate}
                    </h2>
                    <p className="text-lg text-[#263238] font-normal underline">
                      {interview.position}
                    </p>
                  </DialogTitle>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-[#263238]">
                  <MapPin className="h-4 w-4 text-[#F5722E]" />
                  <span className="text-[17px] text-[#263238]">
                    Based in {interview.location}
                  </span>
                </div>

                {/* Core Skills */}
                <div className="flex flex-col gap-2">
                  <h4 className="text-[17px] font-normal text-[#263238]">
                    Core Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {interview.coreSkills?.map((skill, index) => (
                      <span
                        key={skill}
                        className={`${
                          index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                        } text-white px-2 text-[17px] rounded font-medium`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                {interview.experience && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Experience:
                    </h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                      {interview.experience}
                    </span>
                  </div>
                )}

                {/* Employment Preference */}
                {interview.employmentPreference && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Employment Preference:
                    </h4>
                    <div className="flex gap-2">
                      {interview.employmentPreference.map((pref) => (
                        <span
                          key={pref}
                          className="bg-[#F5722E] text-white px-2 rounded-sm"
                        >
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Salary Expectation */}
                {interview.salaryExpectation && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Salary Expectation:
                    </h4>
                    <span className="bg-[#8C4227] text-white px-2 rounded-sm">
                      {interview.salaryExpectation}
                    </span>
                  </div>
                )}

                {/* Language */}
                {interview.languages && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Language:
                    </h4>
                    <div className="flex gap-2">
                      {interview.languages.map((lang) => (
                        <span
                          key={lang}
                          className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {interview.education && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Education:
                    </h4>
                    <span className="text-[#F5722E] border border-[#F5722E] px-2 rounded-sm">
                      {interview.education}
                    </span>
                  </div>
                )}

                {/* Certificate */}
                {interview.certificate && (
                  <div className="flex items-center gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Certificate:
                    </h4>
                    <span className="bg-[#F5722E] text-white px-2 rounded-sm">
                      {interview.certificate}
                    </span>
                  </div>
                )}

                {/* Interpersonal Skills */}
                {interview.interpersonalSkills && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-[17px] font-normal text-[#263238]">
                      Interpersonal Skills:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.interpersonalSkills.map((skill, index) => (
                        <span
                          key={skill}
                          className={`${
                            index % 2 === 0 ? "bg-[#184E77]" : "bg-[#168AAD]"
                          } text-white px-2 text-[17px] rounded font-medium`}
                        >
                          {skill}
                        </span>
                      ))}
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

export { CandidatePreviewModal };

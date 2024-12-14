import React from "react";
import { MapPin, Mail, Phone, Calendar, X } from "lucide-react";
import { Card, CardFooter } from "components";
import { Button } from "components";
import { selectOptions, FormData } from "mockData/app-form-options";

interface ApplicationFormPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onConfirm: () => void;
}

const ApplicationFormPreview: React.FC<ApplicationFormPreviewProps> = ({
  isOpen,
  formData,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const getLabel = (
    value: string,
    optionType: keyof typeof selectOptions
  ): string => {
    const option = selectOptions[optionType].find((opt) => opt.value === value);
    return option?.label || value;
  };

  const getLabels = (
    values: string[],
    optionType: keyof typeof selectOptions
  ): string[] => {
    return values.map((value) => {
      const option = selectOptions[optionType].find((opt) => opt.value === value);
      return option?.label || value;
    });
  };

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
          {/* Personal Information */}
          <div>
            <h2 className="text-lg md:text-[17px] font-semibold text-[#263238]">
              {formData.firstName} {formData.lastName}
            </h2>
            <div className="flex items-center gap-2 text-sm md:text-[17px] mt-1">
              <Calendar size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.birthday}</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <Mail size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.emailAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <Phone size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <MapPin size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">Based in {getLabel(formData.country, "country")}</span>
            </div>
          </div>

          {/* Core Skills */}
          <div className="space-y-2">
            <p className="text-sm md:text-[17px] text-[#263238]">Core Skills:</p>
            <div className="flex flex-wrap gap-2">
              {formData.coreSkills.map((skill, index) => (
                <span
                  key={skill}
                  className={`${
                    index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                  } text-white text-xs md:text-[17px] font-semibold px-2 md:px-3 py-1 rounded`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience Row */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Experience:</span>
            <span className="text-[#F5722E] border border-[#F5722E] rounded px-2 md:px-3 py-0.5">
              {getLabel(formData.yearsOfExperience, "yearsOfExperience")}
            </span>
          </div>

          {/* Looking For Row */}
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Looking for:</span>
            <div className="flex flex-wrap gap-2">
              {getLabels(formData.employmentType, "employmentType").map((emp) => (
                <span
                  key={emp}
                  className="bg-[#F5722E] text-white rounded px-2 md:px-3 py-0.5"
                >
                  {emp}
                </span>
              ))}
            </div>
          </div>

          {/* Expected Salary Row */}
          <div className="flex items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Expected Salary:</span>
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

          {/* Language Row */}
          <div className="flex flex-wrap items-center gap-2 text-sm md:text-[17px]">
            <span className="text-[#263238]">Languages:</span>
            <div className="flex flex-wrap gap-2">
              {getLabels(formData.languages, "languages").map((lang) => (
                <span
                  key={lang}
                  className="bg-[#F5722E] text-white rounded px-2 md:px-3 py-0.5"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <span className="text-sm md:text-[17px] text-[#263238]">Certifications:</span>
            {formData.certifications.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={cert}
                    className={`${
                      index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                    } text-white text-xs md:text-[17px] font-semibold px-2 md:px-3 py-1 rounded`}
                  >
                    {cert}
                  </span>
                ))}
              </div>
            ) : (
              <span className="bg-[#168AAD] text-white text-xs md:text-[17px] font-semibold px-2 md:px-3 py-1 rounded">
                None
              </span>
            )}
          </div>

          {/* Interpersonal Skills */}
          <div className="space-y-2">
            <p className="text-sm md:text-[17px] text-[#263238]">Interpersonal Skills:</p>
            <div className="flex flex-wrap gap-2">
              {formData.interpersonalSkills.map((skill, index) => (
                <span
                  key={skill}
                  className={`${
                    index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                  } text-white text-xs md:text-[17px] font-semibold px-2 md:px-3 py-1 rounded`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-start p-4 md:p-8 bg-transparent">
            <Button
              onClick={onConfirm}
              className="bg-[#F5722E] text-white hover:bg-orange-600 px-6 md:px-8 py-2"
            >
              Submit Application
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export { ApplicationFormPreview };
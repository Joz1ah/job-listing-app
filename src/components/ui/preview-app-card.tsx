import React from "react";
import { MapPin, Mail, Phone, Calendar } from "lucide-react";
import { Card, CardFooter } from "components";
import { Button } from "components";

interface FormData {
    firstName: string;
    lastName: string;
    birthday: string;
    emailAddress: string;
    mobileNumber: string;
    employmentType: string[];
    salaryRange: string;
    yearsOfExperience: string;
    coreSkills: string[];
    interpersonalSkills: string[];
    education: string;
    languages: string[];
    country: string;
    certifications: string[];
  }
  
  interface PreviewAppCardProps {
    isOpen: boolean;
    onClose: () => void;
    formData: FormData;
    onConfirm: () => void;
  }
  
  const PreviewAppCard: React.FC<PreviewAppCardProps> = ({
    isOpen,
    formData,
    onConfirm,
    onClose,
  }) => {
    if (!isOpen) return null;
  
    // Options mapping
    const selectOptions = {
      employmentType: [
        { value: "full-time", label: "Full Time" },
        { value: "part-time", label: "Part Time" },
        { value: "contract", label: "Contract only" },
      ],
      salaryRange: [
        { value: "nego", label: "Negotiable" },
        { value: "0-30", label: "$0 - $30,000" },
        { value: "31-50", label: "$31,000 - $50,000" },
        { value: "51-70", label: "$51,000 - $70,000" },
        { value: "71-100", label: "$71,000 - $100,000" },
        { value: "100-120", label: "$100,000 - $120,000" },
        { value: "121+", label: "$121,000 or more" },
      ],
      yearsOfExperience: [
        { value: "noExp", label: "No experience" },
        { value: "-1", label: "under a year" },
        { value: "1-3", label: "1-3 years" },
        { value: "3-5", label: "3-5 years" },
        { value: "5-10", label: "5-10 years" },
        { value: "10+", label: "10+ years" },
      ],
      education: [
        { value: "bachelors", label: "Bachelor's Degree" },
        { value: "high-school", label: "High School Diploma" },
        { value: "masters", label: "Master's Degree" },
        { value: "associate", label: "Associate Degree" },
        { value: "professional", label: "Professional Certification only" },
        { value: "techvoc", label: "Vocational/Technical Training only" },
        { value: "phd", label: "Doctorate/PhD" },
        { value: "inc", label: "Incomplete College Degree" },
      ],
      country: [
        { value: "us", label: "United States" },
        { value: "ca", label: "Canada" },
        { value: "gb", label: "United Kingdom" },
        { value: "au", label: "Australia" },
        { value: "de", label: "Germany" },
        { value: "fr", label: "France" },
        { value: "jp", label: "Japan" },
        { value: "sg", label: "Singapore" },
        { value: "ae", label: "United Arab Emirates" },
        { value: "in", label: "India" },
        { value: "ph", label: "Philippines" },
        { value: "cn", label: "China" },
      ],
      languages: [
        { value: "en", label: "English" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Spanish", value: "es" },
        { label: "Portuguese", value: "pt" },
        { label: "Russian", value: "ru" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Chinese", value: "zh" },
      ],
    };
  
    // Helper functions to get labels
    const getLabel = (
      value: string,
      optionType: keyof typeof selectOptions
    ): string => {
      const option = selectOptions[optionType].find((opt) => opt.value === value);
      return option?.label || value;
    };
  
    // Get multiple labels for array values
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex flex-col items-center overflow-y-auto pt-20">
        <div className="flex items-center flex-wrap text-white text-base mb-2 p-4">
          <span>Preview of your job application</span>
        </div>
  
        <Card className="bg-white w-[400px] min-h-[700px] relative">
          <div className="p-6 space-y-2">
            {/* Personal Information */}
            <div>
              <h2 className="text-sm font-semibold">
                {formData.firstName} {formData.lastName}
              </h2>
              <div className="flex items-center gap-2 text-[13px] mt-1">
                <Calendar size={14} className="text-orange-500" />
                <span>{formData.birthday}</span>
              </div>
            </div>
  
            {/* Contact Information */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[13px]">
                <Mail size={14} className="text-orange-500" />
                <span>{formData.emailAddress}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <Phone size={14} className="text-orange-500" />
                <span>{formData.mobileNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <MapPin size={14} className="text-orange-500" />
                <span>Based in {getLabel(formData.country, "country")}</span>
              </div>
            </div>
  
            {/* Core Skills */}
            <div className="space-y-2">
              <p className="text-[13px] text-[#263238]">Core Skills:</p>
              <div className="flex flex-wrap gap-2">
                {formData.coreSkills.map((skill, index) => (
                  <span
                    key={skill}
                    className={`${
                      index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                    } text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
  
            {/* Experience Row */}
            <div className="flex items-center gap-1 text-[13px]">
              <span className="text-[#263238]">Experience:</span>
              <span className="text-[12px] text-orange-500 font-light border border-orange-500 rounded-[4px] px-1.5">
                {getLabel(formData.yearsOfExperience, "yearsOfExperience")}
              </span>
            </div>
  
            {/* Looking For Row */}
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-[#263238]">Looking for:</span>
              <div className="flex gap-1">
                {getLabels(formData.employmentType, "employmentType").map((emp) => (
                  <span
                    key={emp}
                    className="bg-[#F5722E] text-white rounded-[4px] text-[12px] px-1.5 h-[18px] flex justify-center items-center"
                  >
                    {emp}
                  </span>
                ))}
              </div>
            </div>
  
            {/* Expected Salary Row */}
            <div className="flex items-center gap-1 text-[13px]">
              <span className="text-[#263238]">Expected Salary:</span>
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
              <span className="text-[#263238]">Languages:</span>
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
  
            {/* Certifications */}
            <div className="space-y-2">
              <span className="text-[13px] text-[#263238]">Certifications:</span>
              {formData.certifications.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.certifications.map((cert, index) => (
                    <span
                      key={cert}
                      className={`${
                        index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                      } text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                    >
                      {cert}
                    </span>
                  ))}
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
                {formData.interpersonalSkills.map((skill, index) => (
                  <span
                    key={skill}
                    className={`${
                      index % 2 === 0 ? "bg-[#168AAD]" : "bg-[#184E77]"
                    } text-white text-xs font-semibold px-1.5 py-0.5 rounded-[2px] inline-block`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
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
                Submit Application
              </Button>
            </CardFooter>
          </div>
        </Card>
      </div>
    );
  };
  
  export { PreviewAppCard };
import React from "react";
import { ChevronLeft } from "lucide-react";
import { Input, TagInput, Button, Textarea, Label } from "components";
import { NavLink } from "react-router-dom";
import sparkeIcon from "images/sparkle-icon.png";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";

import { cn } from "lib/utils";

interface FormData {
  jobTitle: string;
  employmentType: string;
  salaryRange: string;
  yearsOfExperience: string;
  jobDescription: string;
  coreSkills: string;
  interpersonalSkills: string;
  education: string;
  location: string;
  languages: string;
}

{/*Floating Label*/}
const FormField = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    children: React.ReactNode;
    className?: string;
  }
>(({ label, children, className }, ref) => {
  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute -top-3 left-5 z-50 bg-[#2D3A41] px-2">
        <Label className="text-[16px] font-normal text-white">{label}</Label>
      </div>
      {children}
    </div>
  );
});

FormField.displayName = "FormField";

const MatchCreation = () => {
  const [formData, setFormData] = React.useState<FormData>({
    jobTitle: "",
    employmentType: "",
    salaryRange: "",
    yearsOfExperience: "",
    jobDescription: "",
    coreSkills: "",
    interpersonalSkills: "",
    education: "",
    location: "",
    languages: "",
  });

  const handleInputChange = (name: keyof FormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const selectOptions = {
    employmentType: [
      { value: "full-time", label: "Full-time" },
      { value: "part-time", label: "Part-time" },
      { value: "contract", label: "Contract" },
    ],
    salaryRange: [
      { value: "10-20k", label: "$10,000 - $20,000" },
      { value: "20-30k", label: "$20,000 - $30,000" },
      { value: "30-40k", label: "$30,000 - $40,000" },
      { value: "40-50k", label: "$40,000 - $50,000" },
      { value: "50k+", label: "$50,000+" },
      { value: "nego", label: "Negotiable" }
    ],
    yearsOfExperience: [
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
      { value: "inc", label: "Incomplete College Degree" }
    ],
  };
  
  return (
    <div className="flex-1 flex justify-center items-start px-4 mr-16">
      <div className="w-[927px] h-[825px] bg-[#2D3A41] text-white pt-4 pb-12 mt-10 ml-1">
      <div className="flex items-center relative w-full mb-8">
        <NavLink to="/job-feed-employer" className="absolute left-0">
          <ChevronLeft strokeWidth={4} className="h-6 w-6 ml-4" />
        </NavLink>

        <h1 className="flex-1 text-center text-[26px] font-semibold text-orange-500">
          <span className="inline-flex items-center gap-2 justify-center">
            <img src={sparkeIcon} alt="Sparkle icon" className="w-6 h-6" />
            PERFECT MATCH CREATION
          </span>
        </h1>
      </div>

        <form className="max-w-[831px] mx-[48px] grid grid-cols-1 md:grid-cols-2 gap-[115px]">
          {/* Left Column */}
          <div className="space-y-[26px]">
            <FormField label="Job Title" className="bg-transparent">
              <Input
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle")(e.target.value)}
                className="bg-transparent border-gray-300 h-[56px]"
              />
            </FormField>

            <FormField label="Employment Type">
              <Select
                value={formData.employmentType}
                onValueChange={handleInputChange("employmentType")}
              >
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7]">
                  {selectOptions.employmentType.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Salary Range">
              <Select
                value={formData.salaryRange}
                onValueChange={handleInputChange("salaryRange")}
              >
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select Salary Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7]">
                  {selectOptions.salaryRange.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Years of Experience">
              <Select
                value={formData.yearsOfExperience}
                onValueChange={handleInputChange("yearsOfExperience")}
              >
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select Years of Experience" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7]">
                  {selectOptions.yearsOfExperience.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Job Description">
              <Textarea
                value={formData.jobDescription}
                onChange={(e) =>
                  handleInputChange("jobDescription")(e.target.value)
                }
                className="bg-transparent border-gray-300 min-h-[179px] pt-4 resize-none"
              />
            </FormField>
          </div>

          {/* Right Column */}
          <div className="flex flex-col">
            <div className="mb-11">
              <FormField label="Core Skills">
                <TagInput
                  value={formData.coreSkills}
                  onChange={handleInputChange("coreSkills")}
                  className="bg-transparent border-gray-300 h-[99px] pt-1 px-4"
                />
              </FormField>
            </div>

            <div className="mb-11">
              {/* More space after Interpersonal Skills */}
              <FormField label="Interpersonal Skills">
                <TagInput
                  value={formData.interpersonalSkills}
                  onChange={handleInputChange("interpersonalSkills")}
                  className="bg-transparent border-gray-300 h-[99px] pt-1 px-4"
                />
              </FormField>
            </div>

            <div className="space-y-[26px]">
              {/* Regular spacing for remaining fields */}
              <FormField label="Education">
              <Select
                value={formData.education}
                onValueChange={handleInputChange("education")}
              >
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select your Education Level" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7] items-center">
                  {selectOptions.education.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
              <FormField label="Location">
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location")(e.target.value)
                  }
                  className="bg-transparent border-gray-300 h-[56px]"
                />
              </FormField>
              <FormField label="Languages">
                <TagInput
                  value={formData.languages}
                  onChange={handleInputChange("languages")}
                  className="bg-transparent border-gray-300 h-[56px] pt-1 px-4"
                  tagClassName="bg-orange-500"
                />
              </FormField>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="col-span-full flex justify-end gap-4 mt-12">
            <Button
              type="button"
              variant="outline"
              className="border-orange-500 text-orange-500 bg-[#2D3A41] hover:bg-orange-500 hover:text-white"
            >
              Save Changes
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              Add Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { MatchCreation };

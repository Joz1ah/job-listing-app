import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft
} from "lucide-react";
import { Input, Button, Textarea } from "components";
import { NavLink } from "react-router-dom";
import sparkeIcon from "images/sparkle-icon.png";
import saveChanges from "images/save-changes.svg?url";
import { selectOptions } from "mockData/job-listing-form-options";

import {
  MultiSelect,
} from "components";

import { JobListingPreview } from "./JobListingPreview";

import {
  CoreSkillsTagInput,
  InterpersonalSkillsTagInput,
  LanguageTagInput,
  CertificationTagInput,
} from "components";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";

import { cn } from "lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

import { InputField } from "components";

interface FormData {
  jobTitle: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  jobDescription: string;
  priorityIndicator: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  location: string;
  languages: string[];
  certifications: string[];
}

const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("This field is required"),
  employmentType: Yup.array().min(
    1,
    "Please select at least one employment type",
  ),
  salaryRange: Yup.string().required("This field is required"),
  yearsOfExperience: Yup.string().required("This field is required"),
  priorityIndicator: Yup.string().required("This field is required"),
  jobDescription: Yup.string().required("This field is required"),
  coreSkills: Yup.array()
    .min(3, "Please add at least 3 core skills")
    .required("This field is required"),
  interpersonalSkills: Yup.array()
    .min(3, "Please add at least 3 interpersonal skills")
    .required("This field is required"),
  education: Yup.string().required("This field is required"),
  location: Yup.string().required("This field is required"),
  languages: Yup.array()
    .min(1, "This field is required")
    .required("This field is required"),
});

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <img src={saveChanges} alt="Loading" />
    </div>
  </div>
);

const JobListingForm: FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handlePreviewConfirm = (): void => {
    setShowPreview(false);
    setIsLoading(true);
    setTimeout(() => {
      navigate("/employer/feed");
    }, 1500);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    isValid,
  } = useFormik<FormData & { employmentType: string[] }>({
    initialValues: {
      jobTitle: "",
      employmentType: [],
      salaryRange: "",
      yearsOfExperience: "",
      jobDescription: "",
      priorityIndicator: "",
      coreSkills: [],
      interpersonalSkills: [],
      education: "",
      location: "",
      languages: [],
      certifications: [],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (): void => {
      setShowPreview(true);
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement) {
      if (e.target.tagName === "TEXTAREA") return;

      e.preventDefault();

      if (e.target.closest(".tag-input")) return;
    }
  };

  return (
    <>
      <JobListingPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={values}
        onConfirm={handlePreviewConfirm}
      />
      {isLoading && <LoadingOverlay />}
      <div className="w-full max-w-[927px] min-h-[825px] bg-transparent md:bg-[#2D3A41] text-white mx-2 px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center relative w-full mb-6 md:mb-14">
          <NavLink
            to="/employer/feed"
            className="absolute left-0 md:left-4"
          >
            <ChevronLeft strokeWidth={4} className="h-6 w-6" />
          </NavLink>

          <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-orange-500">
            <span className="inline-flex items-center gap-2 justify-center">
              Create Job Listing
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-16 xl:gap-x-[115px] p-4 md:p-8 "
        >
          {/* Left Column */}
          <div className="space-y-6">
            <InputField
              label="Job Title"
              className="bg-transparent"
              error={errors.jobTitle}
              touched={touched.jobTitle}
            >
              <Input
                name="jobTitle"
                value={values.jobTitle}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
                placeholder="Provide a Job Title"
              />
            </InputField>

            <InputField
              label="Employment Type"
              error={errors.employmentType}
              touched={touched.employmentType}
              showIcon={true}
              tooltipContent="You may select one up to three employment types that you are looking for"
            >
              <MultiSelect
                value={values.employmentType}
                onChange={(value) => setFieldValue("employmentType", value)}
                options={selectOptions.employmentType}
              />
            </InputField>

            <InputField
              label="Salary Range"
              error={errors.salaryRange}
              touched={touched.salaryRange}
            >
              <Select
                name="salaryRange"
                value={values.salaryRange}
                onValueChange={(value) => setFieldValue("salaryRange", value)}
              >
                <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2">
                  <SelectValue placeholder="Select Salary Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                  {selectOptions.salaryRange.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className={cn("rounded-none justify-start pl-3 h-[55px]")}
                      value={value}
                    >
                      <div className="py-3 w-full text-center">{label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputField>

            <InputField
              label="Job Description"
              error={errors.jobDescription}
              touched={touched.jobDescription}
              className="relative"
            >
              <Textarea
                name="jobDescription"
                value={values.jobDescription}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] min-h-[150px] md:min-h-[175px] pt-4 resize-none border-2 focus-within:border-orange-500 placeholder:text-white"
                placeholder="Please provide a job description"
              />
              <span className="flex left-0 italic text-[11px] absolute">
                Maximum of 500 words
              </span>
            </InputField>

            <InputField
              label="Years of Experience"
              error={errors.yearsOfExperience}
              touched={touched.yearsOfExperience}
            >
              <Select
                name="yearsOfExperience"
                value={values.yearsOfExperience}
                onValueChange={(value) =>
                  setFieldValue("yearsOfExperience", value)
                }
              >
                <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 ">
                  <SelectValue placeholder="Select Years of Experience" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                  {selectOptions.yearsOfExperience.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className={cn("rounded-none justify-start pl-3 h-[55px]")}
                      value={value}
                    >
                      <div className="py-3 w-full text-center">{label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputField>

            <InputField
              label="Certificates"
              error={errors.certifications}
              touched={touched.certifications}
              showIcon={true}
              tooltipContent="Job-specific, measurable abilities like software proficiency, coding, or design tools."
            >
              <CertificationTagInput
                value={values.certifications || []}
                onChange={(value) => setFieldValue("certifications", value)}
                className="h-[56px] pt-1 px-1"
                alternateColors={{
                  firstColor: "#168AAD",
                  secondColor: "#184E77",
                }}
                placeholder="Type and enter to add certificate"
              />
            </InputField>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6 ">
            <InputField
              label="Priority Indicator"
              error={errors.priorityIndicator}
              touched={touched.priorityIndicator}
              showIcon={true}
              tooltipContent={
                <div className="flex flex-wrap items-center justify-start text-[9px]">
                  <span>This will sort your</span>
                  <div className="flex items-center">
                    <img
                      src={sparkeIcon}
                      alt="Spark Icon"
                      className="w-3 h-3 object-contain"
                    />
                    <span className="text-orange-500">Perfect Matches</span>
                  </div>
                  <span>based on the criteria you choose.</span>
                </div>
              }
            >
              <Select
                name="priorityIndicator"
                value={values.priorityIndicator}
                onValueChange={(value) =>
                  setFieldValue("priorityIndicator", value)
                }
              >
                <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 ">
                  <SelectValue
                    placeholder={
                      <div className="flex items-center gap-1 text-white">
                        <span>Select</span>
                        <div className="flex items-center">
                          <img
                            src={sparkeIcon}
                            className="w-4 h-4 text-orange-500"
                          />
                          <span className="text-[#F5722E] ">Perfect Match</span>
                        </div>
                        <span>Indicator</span>
                      </div>
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                  {selectOptions.priorityIndicator.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className={cn("rounded-none justify-start pl-3 h-[55px]")}
                      value={value}
                    >
                      <div className="py-3 w-full text-center">{label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputField>

            <InputField
              label="Location"
              error={errors.location}
              touched={touched.location}
            >
              <Input
                name="location"
                value={values.location}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus-within:border-orange-500 placeholder:text-white"
                placeholder="Type and enter country"
              />
            </InputField>

            <InputField
              label="Languages"
              error={errors.languages}
              touched={touched.languages}
              showIcon={true}
              tooltipContent="Feel free to enter up to 4 languages in which you are fluent, both in speaking and writing."
            >
              <LanguageTagInput
                value={values.languages || []}
                onChange={(value) => setFieldValue("languages", value)}
                className="min-h-[56px] pt-1 px-1"
                tagClassName="bg-orange-500"
                placeholder="Type and enter to add language"
              />
            </InputField>

            <InputField
              label="Education"
              error={errors.education}
              touched={touched.education}
            >
              <Select
                name="education"
                value={values.education}
                onValueChange={(value) => setFieldValue("education", value)}
              >
                <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                  <SelectValue placeholder="Select your Education Level" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7] items-center p-0 [&>*]:p-0 border-none rounded-none">
                  {selectOptions.education.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className={cn("rounded-none justify-start pl-3 h-[55px]")}
                      value={value}
                    >
                      <div className="py-3 w-full text-center">{label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </InputField>

            <div className="mb-8 md:mb-14">
              <InputField
                label="Core Skills"
                error={errors.coreSkills}
                touched={touched.coreSkills}
                showIcon={true}
                tooltipContent="Job-specific, measurable abilities like software proficiency, coding, or design tools."
              >
                <CoreSkillsTagInput
                  value={values.coreSkills || []}
                  onChange={(value) => setFieldValue("coreSkills", value)}
                  className="h-[99px] pt-2 px-2"
                  alternateColors={{
                    firstColor: "#168AAD",
                    secondColor: "#184E77",
                  }}
                  placeholder="Type and enter to add core skill"
                />
              </InputField>
            </div>

            <div className="mb-8 md:mb-14">
              <InputField
                label="Interpersonal Skills"
                error={errors.interpersonalSkills}
                touched={touched.interpersonalSkills}
                showIcon={true}
                tooltipContent="Personal qualities like communication, teamwork, and problem-solving."
              >
                <InterpersonalSkillsTagInput
                  value={values.interpersonalSkills || []}
                  onChange={(value) =>
                    setFieldValue("interpersonalSkills", value)
                  }
                  className="h-[99px] pt-1 px-1"
                  alternateColors={{
                    firstColor: "#168AAD",
                    secondColor: "#184E77",
                  }}
                  placeholder="Type and enter to add interpersonal skill"
                />
              </InputField>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="col-span-full flex justify-end mt-8 md:mt-12">
            <Button
              type="submit"
              className={cn(
                "w-full md:w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E]",
                isValid
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-[#AEADAD] hover:bg-[#AEADAD]",
              )}
            >
              Add Job
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export { JobListingForm };

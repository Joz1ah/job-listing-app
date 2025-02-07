import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Input, Button, Textarea } from "components";
import { NavLink } from "react-router-dom";
import sparkeIcon from "images/sparkle-icon.png";
import saveChanges from "images/save-changes.svg?url";
import { selectOptions } from "mockData/job-listing-form-options";
import { useJobListCreateMutation } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useContext } from "react";
import { KeywordMappingContext } from "contexts/KeyWordMappingContext";

import { MultiSelect } from "components";

import { JobListingPreview } from "./JobListingPreview";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";

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
  jobDescription: Yup.string()
  .required("This field is required")
  .test(
    "maxWords",
    "Must not exceed 500 words",
    value => value?.split(/\s+/).filter(Boolean).length <= 500
  ),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { user, refreshUser } = useAuth();
  const { keywordToIdMap } = useContext(KeywordMappingContext);
  const { showError } = useErrorModal();

  const [createJobList] = useJobListCreateMutation();

  const handlePreviewConfirm = async () => {
    setShowPreview(false);
    setIsSubmitting(true);

    try {
      // Combine all skills and certifications
      const allKeywords = [
        ...values.coreSkills,
        ...values.interpersonalSkills,
        ...values.certifications
      ];
      
      // Map all keywords to their IDs
      const keywordIds = allKeywords
        .map((keyword) => keywordToIdMap[keyword])
        .filter(Boolean)
        .map((id) => Number(id));

      const payload = {
        employerId: user?.data?.user?.relatedDetails?.id,
        title: values.jobTitle,
        priorityIndicator: values.priorityIndicator,
        description: values.jobDescription,
        location: values.location,
        employmentType: values.employmentType.join(", "),
        salaryRange: values.salaryRange,
        yearsOfExperience: values.yearsOfExperience,
        expiresAt: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        education: values.education,
        language: values.languages.join(","),
        keywords: keywordIds,
      };

      // Validate payload before submission
      console.log("Submitting form data:", payload);

      await createJobList(payload).unwrap();

      // Refresh user data in auth context
      await refreshUser();

      navigate("/dashboard");
    } catch (error: any) {
      if (error?.data?.errors === "Job listing already exists.") {
        showError(
          'Job Listing Creation Failed',
          'Job listing already exists. Please use a different Job title.'
        );
      } else {
        showError(
          'Job Listing Creation Failed',
          'An unexpected error occurred while creating your job listing.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
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

  const isFirstJobListing = user?.data?.user?.jobCounts?.count === 0;

  return (
    <>
      <JobListingPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={values}
        onConfirm={handlePreviewConfirm}
      />
      {isSubmitting && <LoadingOverlay />}
      <div className="w-full max-w-[927px] min-h-[825px] bg-[#2D3A41] text-white mx-2 px-4 py-8 md:py-12">
        <div className="flex items-center relative w-full mb-6 md:mb-14">
          {!isFirstJobListing && (
            <NavLink to="/dashboard/feed" className="absolute left-0 md:left-4">
              <ChevronLeft strokeWidth={4} className="h-6 w-6" />
            </NavLink>
          )}

          <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-[#F5722E]">
            <span className="inline-flex items-center gap-2 justify-center">
            {isFirstJobListing ? "Create Your First Job Listing" : "Create Job Listing"}
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-16 xl:gap-x-[115px] p-4 md:p-8"
        >
          <InputField
            label="Job Title"
            className="bg-transparent"
            error={errors.jobTitle}
            touched={touched.jobTitle}
            variant="primary"
          >
            <Input
              name="jobTitle"
              value={values.jobTitle}
              onChange={handleChange}
              className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
              placeholder="Provide a Job Title"
            />
          </InputField>

          <InputField
            label="Priority Indicator"
            error={errors.priorityIndicator}
            touched={touched.priorityIndicator}
            showIcon={true}
            variant="primary"
            tooltipContent={
              <div className="flex flex-wrap items-center justify-start">
                <span>This will sort your</span>
                <div className="flex items-center">
                  <img
                    src={sparkeIcon}
                    alt="Spark Icon"
                    className="w-3 h-3 object-contain"
                  />
                  <span className="text-[#F5722E]">Perfect Matches</span>
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
              <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
                <SelectValue
                  placeholder={
                    <div className="flex items-center gap-1 text-white">
                      <span>Select</span>
                      <div className="flex items-center">
                        <img
                          src={sparkeIcon}
                          className="w-4 h-4 text-[#F5722E]"
                        />
                        <span className="text-[#F5722E]">Perfect Match</span>
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
            label="Employment Type"
            error={errors.employmentType}
            touched={touched.employmentType}
            showIcon={true}
            tooltipContent="You may select one up to three employment types that you are looking for"
            variant="primary"
          >
            <MultiSelect
              value={values.employmentType}
              onChange={(value) => setFieldValue("employmentType", value)}
              options={selectOptions.employmentType}
            />
          </InputField>

          <InputField
            label="Location"
            error={errors.location}
            touched={touched.location}
            variant="primary"
          >
            <Input
              name="location"
              value={values.location}
              onChange={handleChange}
              className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus-within:border-[#F5722E] placeholder:text-[#AEADAD]"
              placeholder="Add Location"
            />
          </InputField>

          <InputField
            label="Salary Range"
            error={errors.salaryRange}
            touched={touched.salaryRange}
            variant="primary"
          >
            <Select
              name="salaryRange"
              value={values.salaryRange}
              onValueChange={(value) => setFieldValue("salaryRange", value)}
            >
              <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
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
            label="Education"
            error={errors.education}
            touched={touched.education}
            variant="primary"
          >
            <Select
              name="education"
              value={values.education}
              onValueChange={(value) => setFieldValue("education", value)}
            >
              <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
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

          <InputField
            label="Languages"
            error={errors.languages}
            touched={touched.languages}
            showIcon={true}
            tooltipContent="Feel free to enter up to 4 languages in which you are fluent, both in speaking and writing."
            variant="primary"
          >
            <LanguageTagInput
              value={values.languages || []}
              onChange={(value) => setFieldValue("languages", value)}
              className="min-h-[56px] pt-1 px-1"
              tagClassName="bg-[#F5722E]"
              placeholder="Type and enter to add language"
            />
          </InputField>

          <InputField
            label="Years of Experience"
            error={errors.yearsOfExperience}
            touched={touched.yearsOfExperience}
            variant="primary"
          >
            <Select
              name="yearsOfExperience"
              value={values.yearsOfExperience}
              onValueChange={(value) =>
                setFieldValue("yearsOfExperience", value)
              }
            >
              <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
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
            label="Core Skills"
            error={errors.coreSkills}
            touched={touched.coreSkills}
            showIcon={true}
            tooltipContent="Job-specific, measurable abilities like software proficiency, coding, or design tools."
            variant="primary"
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

          <InputField
            label="Interpersonal Skills"
            error={errors.interpersonalSkills}
            touched={touched.interpersonalSkills}
            showIcon={true}
            tooltipContent="Personal qualities like communication, teamwork, and problem-solving."
            variant="primary"
          >
            <InterpersonalSkillsTagInput
              value={values.interpersonalSkills || []}
              onChange={(value) => setFieldValue("interpersonalSkills", value)}
              className="h-[99px] pt-1 px-1"
              alternateColors={{
                firstColor: "#168AAD",
                secondColor: "#184E77",
              }}
              placeholder="Type and enter to add interpersonal skill"
            />
          </InputField>

          <InputField
            label="Certificates"
            error={errors.certifications}
            touched={touched.certifications}
            showIcon={true}
            tooltipContent="Job-specific, measurable abilities like software proficiency, coding, or design tools."
            variant="primary"
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

          <InputField
            label="Job Description"
            error={errors.jobDescription}
            touched={touched.jobDescription}
            className="relative"
            variant="primary"
          >
            <Textarea
              name="jobDescription"
              value={values.jobDescription}
              onChange={handleChange}
              className="bg-transparent border-[#AEADAD] min-h-[150px] md:min-h-[175px] pt-4 resize-none border-2 focus-within:border-[#F5722E] placeholder:text-[#AEADAD]"
              placeholder="Please provide a job description"
            />
            <span className="flex left-0 italic text-[11px] absolute">
              Maximum of 500 words
            </span>
          </InputField>

          {/* Footer Button */}
          <div className="col-span-full flex justify-end mt-8 md:mt-12">
            <Button
              type="submit"
              className={cn(
                "w-full md:w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E]",
                isValid
                  ? "bg-[#F5722E] hover:bg-orange-600"
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

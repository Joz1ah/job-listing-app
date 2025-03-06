import React, { FC, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Input, Button, Textarea } from "components";
import sparkeIcon from "images/sparkle-icon.png";
import saveChanges from "images/save-changes.svg?url";
import { selectOptions } from "mockData/job-listing-form-options";
import { useJobListCreateMutation } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useContext } from "react";
import { KeywordMappingContext } from "contexts/KeyWordMappingContext";
import { MultiSelect } from "components";
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

interface JobDetails {
  id: string;
  title?: string;
  employmentType?: string;
  salaryRange?: string;
  yearsOfExperience?: string;
  description?: string;
  priorityIndicator?: string;
  education?: string;
  location?: string;
  language?: string;
  skills?: Array<{
    id: string | number;
    keyword: string;
    type: "core" | "interpersonal" | "certification";
  }>;
}

interface EditJobListingFormProps {
  jobDetails: JobDetails;
  onCancel: () => void;
  onSuccess: () => void;
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
      (value) => value?.split(/\s+/).filter(Boolean).length <= 500,
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

const EditJobListingForm: FC<EditJobListingFormProps> = ({ 
  jobDetails, 
  onCancel, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();
  const { keywordToIdMap, addMapping } = useContext(KeywordMappingContext);
  const { showError } = useErrorModal();
  const [updateJobList] = useJobListCreateMutation(); // We'll use this for updates too

  // Ensure skill keywords are mapped to IDs
  useEffect(() => {
    // Add existing skills to the keyword mapping
    if (jobDetails.skills && jobDetails.skills.length > 0) {
      jobDetails.skills.forEach(skill => {
        addMapping(skill.keyword, skill.id);
      });
    }
  }, [jobDetails.skills, addMapping]);

  const handleSaveChanges = async () => {
    if (!isValid) {
      handleSubmit(); // This will trigger validation errors to show
      return;
    }

    setIsSubmitting(true);

    try {
      // Debug skills and mapping
      console.log("Core skills:", values.coreSkills);
      console.log("Interpersonal skills:", values.interpersonalSkills);
      console.log("Certifications:", values.certifications);
      console.log("Keyword map:", keywordToIdMap);

      // Collect all skills
      const allKeywords = [
        ...values.coreSkills,
        ...values.interpersonalSkills,
        ...values.certifications,
      ];

      // Map all keywords to their IDs, with logging for debugging
      const keywordIds = allKeywords
        .map((keyword) => {
          const id = keywordToIdMap[keyword];
          console.log(`Mapping ${keyword} to ID: ${id}`);
          return id;
        })
        .filter(Boolean)
        .map((id) => Number(id));

      console.log("Final keyword IDs:", keywordIds);
        
      // Set expiration date to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const payload = {
        id: jobDetails.id,
        employerId: user?.data?.user?.relatedDetails?.id,
        title: values.jobTitle,
        priorityIndicator: values.priorityIndicator,
        description: values.jobDescription,
        location: values.location,
        employmentType: values.employmentType.join(", "),
        salaryRange: values.salaryRange,
        yearsOfExperience: values.yearsOfExperience,
        education: values.education,
        language: values.languages.join(","),
        keywords: keywordIds,
        expiresAt: expiresAt.toISOString(), // Include the expiration date
      };

      console.log("Submitting payload:", payload);

      // Making a PUT request with the same mutation endpoint
      await updateJobList({
        ...payload,
        method: 'PUT', // Signal to the API that this is an update
        endpoint: `/job/${jobDetails.id}` // Specify the endpoint for update
      }).unwrap();
      
      // Refresh user data in auth context
      await refreshUser();

      // Call the success callback
      onSuccess();
    } catch (error: any) {
      console.error("Error updating job listing:", error);
      showError(
        "Job Listing Update Failed",
        error?.data?.message || "An unexpected error occurred while updating your job listing."
      );
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
  } = useFormik<FormData>({
    initialValues: {
      jobTitle: jobDetails.title || "",
      employmentType: jobDetails.employmentType ? jobDetails.employmentType.split(", ") : [],
      salaryRange: jobDetails.salaryRange || "",
      yearsOfExperience: jobDetails.yearsOfExperience || "",
      jobDescription: jobDetails.description || "",
      priorityIndicator: jobDetails.priorityIndicator || "",
      coreSkills: jobDetails.skills?.filter(skill => skill.type === "core").map(skill => skill.keyword) || [],
      interpersonalSkills: jobDetails.skills?.filter(skill => skill.type === "interpersonal").map(skill => skill.keyword) || [],
      education: jobDetails.education || "",
      location: jobDetails.location || "",
      languages: jobDetails.language ? jobDetails.language.split(",").map(lang => lang.trim()) : [],
      certifications: jobDetails.skills?.filter(skill => skill.type === "certification").map(skill => skill.keyword) || [],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (): void => {
      handleSaveChanges();
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
      {isSubmitting && <LoadingOverlay />}
      <div className="w-full max-w-[927px] min-h-[825px] bg-[#2D3A41] text-white mx-2 px-4 py-8 md:py-12">
        <div className="flex items-center relative w-full mb-6 md:mb-14">
          <button 
            onClick={onCancel}
            className="absolute left-0 md:left-4"
          >
            <ChevronLeft strokeWidth={4} className="h-6 w-6" />
          </button>

          <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-[#F5722E]">
            <span className="inline-flex items-center gap-2 justify-center">
              Edit Job Listing
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="p-4 md:p-8"
        >
          {/* Top section - single column with two fields per row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-16 mb-8">
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
                <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none">
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
              tooltipContent="You may select one up to three employment types"
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
                <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none">
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
              label="Languages"
              error={errors.languages}
              touched={touched.languages}
              showIcon={true}
              tooltipContent="Enter up to 4 languages"
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
          </div>

          {/* Two columns section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-x-16">
            {/* Left Column */}
            <div className="space-y-6">
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
                  className="bg-transparent border-[#AEADAD] min-h-[150px] pt-4 resize-none border-2 focus-within:border-[#F5722E] placeholder:text-[#AEADAD]"
                  placeholder="Please provide a job description"
                />
                {!(touched.jobDescription && errors.jobDescription) && (
                  <span className="flex right-1 italic text-[11px] absolute">
                    Maximum of 500 words
                  </span>
                )}
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
                  className="min-h-[56px] pt-1 px-1"
                  alternateColors={{
                    firstColor: "#168AAD",
                    secondColor: "#184E77",
                  }}
                  placeholder="Type and enter to add certificate"
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
                  <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none">
                    {selectOptions.yearsOfExperience.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className={cn(
                          "rounded-none justify-start pl-3 h-[55px]",
                        )}
                        value={value}
                      >
                        <div className="py-3 w-full text-center">{label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </InputField>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
                  <SelectContent className="bg-[#F5F5F7] items-center p-0 [&>*]:px-0 border-none rounded-none">
                    {selectOptions.education.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className={cn(
                          "rounded-none justify-start pl-3 h-[55px]",
                        )}
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
                tooltipContent="Job-specific, measurable abilities"
                variant="primary"
              >
                <CoreSkillsTagInput
                  value={values.coreSkills || []}
                  onChange={(value) => {
                    console.log("Core skills updated:", value);
                    setFieldValue("coreSkills", value);
                  }}
                  className="min-h-[99px] pt-1 px-1"
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
                tooltipContent="Personal qualities and soft skills"
                variant="primary"
              >
                <InterpersonalSkillsTagInput
                  value={values.interpersonalSkills || []}
                  onChange={(value) => {
                    console.log("Interpersonal skills updated:", value);
                    setFieldValue("interpersonalSkills", value);
                  }}
                  className="min-h-[99px] pt-1 px-1"
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
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={onCancel}
              type="button"
              className="bg-transparent border border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "bg-[#F5722E] text-white hover:bg-orange-600",
                !isValid && "bg-[#AEADAD] hover:bg-[#AEADAD]",
              )}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export { EditJobListingForm };
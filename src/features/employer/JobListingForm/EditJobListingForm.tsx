import React, { FC, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Input, Textarea, Button } from "components";
import sparkeIcon from "images/sparkle-icon.png";
import { selectOptions } from "mockData/job-listing-form-options";
import { useJobListUpdateMutation } from "api/akaza/akazaAPI";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { MultiSelect } from "components";
import { useContext } from "react";
import { KeywordMappingContext } from "contexts/KeyWordMappingContext";

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
  title: string;
  employmentType: string;
  salaryRange: string;
  yearsOfExperience: string;
  description: string;
  priorityIndicator: string;
  education: string;
  location: string;
  language: string;
  skills: {
    id: number;
    keyword: string;
    type: "core" | "interpersonal" | "certification";
  }[];
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

interface EditJobListingFormProps {
  jobDetails: JobDetails;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditJobListingForm: FC<EditJobListingFormProps> = ({
  jobDetails,
  onCancel,
  onSuccess,
}) => {
  const [buttonState, setButtonState] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const { showError } = useErrorModal();
  const [skillMapping, setSkillMapping] = useState<Record<string, number>>({});
  const { keywordToIdMap, addMappings } = useContext(KeywordMappingContext);

  const [updateJobList] = useJobListUpdateMutation();

  // Store the original skill IDs when component mounts and maintain skills mapping
  useEffect(() => {
    if (jobDetails && jobDetails.skills && jobDetails.skills.length > 0) {
      // Create a mapping of skill keywords to IDs for quick lookup
      const skillMap: Record<string, number> = {};
      const mappingsForContext: Array<{ keyword: string; id: number }> = [];

      jobDetails.skills.forEach((skill) => {
        skillMap[skill.keyword] = skill.id;
        mappingsForContext.push({ keyword: skill.keyword, id: skill.id });
      });

      // Update local skill mapping
      setSkillMapping(skillMap);

      // Also update the global keyword mapping context
      if (mappingsForContext.length > 0) {
        addMappings(mappingsForContext);
      }

      console.log("Initialized skill mappings:", skillMap);
    }
  }, [jobDetails, addMappings]);

  // Set up formik with initial job data
  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    isValid,
    setValues,
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
    onSubmit: async (): Promise<void> => {
      await handleUpdateJob();
    },
  });

  // Prepare data from jobDetails
  useEffect(() => {
    if (jobDetails) {
      // Extract skills by type
      const coreSkills: string[] = [];
      const interpersonalSkills: string[] = [];
      const certifications: string[] = [];

      // Categorize skills based on their type
      jobDetails.skills.forEach((skill) => {
        if (skill.type === "core") {
          coreSkills.push(skill.keyword);
        } else if (skill.type === "interpersonal") {
          interpersonalSkills.push(skill.keyword);
        } else if (skill.type === "certification") {
          certifications.push(skill.keyword);
        }
      });

      // Parse languages from comma-separated string
      const languages = jobDetails.language
        ? jobDetails.language.split(",").map((lang: string) => lang.trim())
        : [];

      // Parse employment types from comma-separated string
      const employmentTypes = jobDetails.employmentType
        ? jobDetails.employmentType
            .split(",")
            .map((type: string) => type.trim())
        : [];

      setValues({
        jobTitle: jobDetails.title || "",
        employmentType: employmentTypes,
        salaryRange: jobDetails.salaryRange || "",
        yearsOfExperience: jobDetails.yearsOfExperience || "",
        jobDescription: jobDetails.description || "",
        priorityIndicator: jobDetails.priorityIndicator || "",
        coreSkills,
        interpersonalSkills,
        education: jobDetails.education || "",
        location: jobDetails.location || "",
        languages,
        certifications,
      });
    }
  }, [jobDetails, setValues]);

  // Reset button state after showing "saved" message
  useEffect(() => {
    if (buttonState === "success") {
      const timer = setTimeout(() => {
        onSuccess();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [buttonState, onSuccess]);

  // Track changes in skills for debugging purposes
  useEffect(() => {
    if (jobDetails && jobDetails.skills) {
      // Get original skills by type
      const originalCoreSkills = jobDetails.skills
        .filter((skill) => skill.type === "core")
        .map((skill) => skill.keyword);

      const originalInterpersonalSkills = jobDetails.skills
        .filter((skill) => skill.type === "interpersonal")
        .map((skill) => skill.keyword);

      const originalCertifications = jobDetails.skills
        .filter((skill) => skill.type === "certification")
        .map((skill) => skill.keyword);

      // Identify new skills (current skills that weren't in the original list)
      const newCoreSkills = values.coreSkills.filter(
        (skill) => !originalCoreSkills.includes(skill),
      );

      const newInterpersonalSkills = values.interpersonalSkills.filter(
        (skill) => !originalInterpersonalSkills.includes(skill),
      );

      const newCertificationSkills = values.certifications.filter(
        (skill) => !originalCertifications.includes(skill),
      );

      // Log skill changes for debugging
      console.log("New skills detected:", {
        core: newCoreSkills,
        interpersonal: newInterpersonalSkills,
        certification: newCertificationSkills,
      });
    }
  }, [
    values.coreSkills,
    values.interpersonalSkills,
    values.certifications,
    jobDetails,
  ]);

  const handleUpdateJob = async (): Promise<void> => {
    try {
      if (!isValid) {
        handleSubmit();
        return;
      }

      setButtonState("loading");

      // Process all skills and map to IDs
      const allKeywords = [
        ...values.coreSkills,
        ...values.interpersonalSkills,
        ...values.certifications,
      ];

      const skillIds = [];
      const missingKeywords = [];

      for (const keyword of allKeywords) {
        if (skillMapping[keyword]) {
          skillIds.push(skillMapping[keyword]);
          continue;
        }

        if (keywordToIdMap[keyword]) {
          skillIds.push(Number(keywordToIdMap[keyword]));
          continue;
        }

        missingKeywords.push(keyword);
      }

      if (missingKeywords.length > 0) {
        console.warn("Skills without IDs:", missingKeywords);
      }

      // Calculate expiration date (30 days from now)
      const expiresAt = new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000,
      ).toISOString();

      // Build the update payload
      const payload = {
        jobId: Number(jobDetails.id),
        title: values.jobTitle,
        priorityIndicator: values.priorityIndicator,
        description: values.jobDescription,
        location: values.location,
        employmentType: values.employmentType.join(", "),
        salaryRange: values.salaryRange,
        yearsOfExperience: values.yearsOfExperience,
        expiresAt,
        education: values.education,
        language: values.languages.join(","),
        keywords: skillIds,
      };

      console.log("Submitting update with skills:", {
        totalSkillIds: skillIds.length,
        skillIds,
      });

      await updateJobList(payload).unwrap();
      setButtonState("success");
    } catch (error: any) {
      setButtonState("idle");
      if (error?.data?.errors === "Job listing already exists.") {
        showError(
          "Job Listing Update Failed",
          "Job listing with this title already exists. Please use a different Job title.",
        );
      } else {
        showError(
          "Job Listing Update Failed",
          "An unexpected error occurred while updating your job listing.",
        );
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" && e.target instanceof HTMLElement) {
      if (e.target.tagName === "TEXTAREA") return;
      e.preventDefault();
      if (e.target.closest(".tag-input")) return;
    }
  };

  // Get button text based on state
  const getButtonText = () => {
    switch (buttonState) {
      case "idle":
        return "Save Changes";
      case "loading":
        return "Saving...";
      case "success":
        return "Changes Saved!";
    }
  };

  return (
    <div className="w-full max-w-[927px] min-h-[825px] bg-[#2D3A41] text-white mx-2 px-4 py-8 md:py-12">
      <div className="flex items-center relative w-full mb-6 md:mb-14">
        <div
          onClick={onCancel}
          className="absolute left-0 md:left-4 cursor-pointer"
        >
          <ChevronLeft strokeWidth={4} className="h-6 w-6" />
        </div>

        <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-[#F5722E]">
          <span className="inline-flex items-center gap-2 justify-center">
            Edit Job Listing
          </span>
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateJob();
        }}
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
                      className={cn("rounded-none justify-start pl-3 h-[55px]")}
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
              tooltipContent="Job-specific, measurable abilities"
              variant="primary"
            >
              <CoreSkillsTagInput
                value={values.coreSkills || []}
                onChange={(value) => setFieldValue("coreSkills", value)}
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
                onChange={(value) =>
                  setFieldValue("interpersonalSkills", value)
                }
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

        {/* Footer Button */}
        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            disabled={buttonState !== "idle" || !isValid}
            className={cn(
              "w-[177px] h-[37px] text-sm rounded-md font-medium text-white flex items-center justify-center",
              !isValid && buttonState === "idle"
                ? "bg-gray-500 "
                : "bg-[#F5722E] hover:bg-[#F5722E]/90",
            )}
          >
            {getButtonText()}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { EditJobListingForm };

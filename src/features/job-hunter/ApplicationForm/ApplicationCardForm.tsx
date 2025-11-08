import React, { FC, useState, useEffect } from "react";
import { Input, Button, InputField } from "components";
import { useNavigate } from "react-router-dom";
import saveChanges from "images/save-changes.svg?url";
import { useContext } from "react";
import { KeywordMappingContext } from "contexts/KeyWordMappingContext";
import { CountrySelect } from "components";
import { X } from "lucide-react";

import { selectOptions } from "mockData/app-form-options";

import { AppCardPreview } from "features/employer";

import {
  LanguageTagInput,
  CoreSkillsTagInput,
  InterpersonalSkillsTagInput,
  CertificationTagInput,
  MultiSelect,
} from "components";

import { ApplicationFormPreview } from "./ApplicationFormPreview";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components";

import { cn } from "lib/utils";
import { useFormik, FormikErrors } from "formik";
import * as Yup from "yup";

import { useJobHunterProfileMutation } from "api";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

// FormerEmployer interface
interface FormerEmployer {
  name: string;
  jobTitle: string;
  duration: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  location: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  languages: string[];
  country: string;
  certifications: string[];
  linkedln: string;
  formerEmployers: FormerEmployer[];
}

// Create dynamic validation schema based on years of experience
const createValidationSchema = (
  yearsOfExperience: string,
): Yup.ObjectSchema<any> => {
  // Base validation schema
  const schema = {
    firstName: Yup.string().required("This field is required"),
    lastName: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    employmentType: Yup.array().min(
      1,
      "Please select at least one employment type",
    ),
    salaryRange: Yup.string().required("This field is required"),
    location: Yup.string().required("This field is required"),
    yearsOfExperience: Yup.string().required("This field is required"),
    coreSkills: Yup.array()
      .min(3, "Please add at least 3 core skills")
      .required("This field is required"),
    interpersonalSkills: Yup.array()
      .min(3, "Please add at least 3 interpersonal skills")
      .required("This field is required"),
    education: Yup.string().required("This field is required"),
    languages: Yup.array()
      .min(1, "This field is required")
      .required("This field is required"),
    linkedln: Yup.string()
      .nullable()
      .test(
        "is-linkedin-url",
        "Please enter a valid LinkedIn profile URL",
        (value) => {
          if (!value) return true; // Allow null values
          // Check for LinkedIn URL format (accepts various LinkedIn URL formats)
          const linkedinRegex =
            /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+\/?$/i;
          return linkedinRegex.test(value);
        },
      ),
    formerEmployers: Yup.array().of(
      Yup.object().shape({
        name: Yup.string(),
        jobTitle: Yup.string(),
        duration: Yup.string(),
      }),
    ),
  };

  // If user has experience, require at least one former employer
  if (yearsOfExperience && yearsOfExperience !== "No experience") {
    schema.formerEmployers = Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required("Employer name is required"),
          jobTitle: Yup.string().required("Job title is required"),
          duration: Yup.string().required("Duration is required"),
        }),
      )
      .min(1, "At least one former employer is required");
  }

  return Yup.object().shape(schema);
};

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <img src={saveChanges} alt="Loading" />
    </div>
  </div>
);

const ApplicationCardForm: FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { keywordToIdMap } = useContext(KeywordMappingContext);
  const [submitJobHunterProfile] = useJobHunterProfileMutation();
  const { refreshUser, user } = useAuth();
  const { showError } = useErrorModal();
  const [validationSchema, setValidationSchema] = useState(() =>
    createValidationSchema(""),
  );

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    isValid,
    setFieldTouched,
    validateForm,
  } = useFormik<FormData>({
    initialValues: {
      firstName: "",
      lastName: "",
      location: "",
      employmentType: [],
      salaryRange: "",
      yearsOfExperience: "",
      coreSkills: [],
      interpersonalSkills: [],
      education: "",
      languages: [],
      country: user?.data?.user?.relatedDetails?.country || "",
      certifications: [],
      linkedln: "",
      formerEmployers: [{ name: "", jobTitle: "", duration: "" }],
    },
    validationSchema,
    validateOnMount: true,
    validateOnChange: true, // Ensure this is true for immediate validation
    validateOnBlur: true, // Ensure this is true for validation on blur
    onSubmit: () => {
      setShowPreview(true);
    },
  });

  const previewValues = {
    ...values,
    linkedinProfile: values.linkedln, // Add this line to map linkedln to linkedinProfile
  };

  const handleLinkedInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the field value without triggering validation on former employers
    setFieldValue("linkedln", e.target.value, false);
    // Only validate the linkedln field
    validateForm({
      ...values,
      linkedln: e.target.value,
    });
  };

  const handleYearsOfExperienceChange = (value: string) => {
    setFieldValue("yearsOfExperience", value, false); // Don't validate immediately

    // If "No experience" selected, reset former employers without validation
    if (value === "No experience") {
      setFieldValue(
        "formerEmployers",
        [{ name: "", jobTitle: "", duration: "" }],
        false,
      );
    }

    // Update validation schema with new value
    const newValidationSchema = createValidationSchema(value);
    setValidationSchema(newValidationSchema);

    // Then validate the form with the new schema
    setTimeout(() => {
      validateForm();
    }, 0);
  };

  // Update validation schema when years of experience changes
  useEffect(() => {
    const newValidationSchema = createValidationSchema(
      values.yearsOfExperience,
    );
    setValidationSchema(newValidationSchema);

    // Re-validate form with new schema
    validateForm();

    // If user selects no experience, reset formerEmployers to empty array
    if (values.yearsOfExperience === "No experience") {
      setFieldValue("formerEmployers", [
        { name: "", jobTitle: "", duration: "" },
      ]);
    }
  }, [values.yearsOfExperience, validateForm, setFieldValue]);

  // Check if we should show former employer fields - using the exact value from your options
  const showFormerEmployer =
    values.yearsOfExperience && values.yearsOfExperience !== "No experience";

  const addEmployer = () => {
    if (values.formerEmployers.length < 3) {
      setFieldValue("formerEmployers", [
        ...values.formerEmployers,
        { name: "", jobTitle: "", duration: "" },
      ]);
    }
  };

  const removeEmployer = (index: number) => {
    const updatedEmployers = [...values.formerEmployers];
    updatedEmployers.splice(index, 1);
    setFieldValue("formerEmployers", updatedEmployers);
  };

  // Type-safe error accessor function
  const getEmployerFieldError = (
    index: number,
    field: keyof FormerEmployer,
  ): string | undefined => {
    if (
      !errors.formerEmployers ||
      !Array.isArray(errors.formerEmployers) ||
      !errors.formerEmployers[index]
    ) {
      return undefined;
    }

    const fieldError = errors.formerEmployers[index];
    if (typeof fieldError === "string") {
      return fieldError;
    }

    return (fieldError as FormikErrors<FormerEmployer>)[field];
  };

  // Type-safe touched accessor function
  const isEmployerFieldTouched = (
    index: number,
    field: keyof FormerEmployer,
  ): boolean => {
    if (
      !touched.formerEmployers ||
      !Array.isArray(touched.formerEmployers) ||
      !touched.formerEmployers[index]
    ) {
      return false;
    }

    const fieldTouched = touched.formerEmployers[index];
    if (typeof fieldTouched !== "object") {
      return false;
    }

    return !!(fieldTouched as Record<string, boolean>)[field];
  };

  const handleFormSubmit = async () => {
    setShowPreview(false);
    setIsSubmitting(true);

    try {
      // Define language options
      const languages = [
        { label: "Arabic", value: "ar" },
        { label: "Bengali", value: "bn" },
        { label: "Chinese (Cantonese)", value: "zh-hk" },
        { label: "Chinese (Mandarin)", value: "zh" },
        { label: "Dutch", value: "nl" },
        { label: "English", value: "en" },
        { label: "Finnish", value: "fi" },
        { label: "French", value: "fr" },
        { label: "German", value: "de" },
        { label: "Hindi", value: "hi" },
        { label: "Italian", value: "it" },
        { label: "Japanese", value: "ja" },
        { label: "Korean", value: "ko" },
        { label: "Malay", value: "ms" },
        { label: "Polish", value: "pl" },
        { label: "Portuguese", value: "pt" },
        { label: "Russian", value: "ru" },
        { label: "Spanish", value: "es" },
        { label: "Swedish", value: "sv" },
        { label: "Tagalog", value: "tl" },
        { label: "Thai", value: "th" },
        { label: "Turkish", value: "tr" },
        { label: "Vietnamese", value: "vi" },
      ];

      // Transform keywords to IDs during submission
      const coreSkillIds = values.coreSkills.map(
        (keyword) => keywordToIdMap[keyword] || keyword,
      );

      const interpersonalSkillIds = values.interpersonalSkills.map(
        (keyword) => keywordToIdMap[keyword] || keyword,
      );

      const certificationIds = values.certifications.map(
        (keyword) => keywordToIdMap[keyword] || keyword,
      );

      const formattedLanguages = values.languages
        .map((lang) => {
          const languageOption = languages.find((opt) => opt.value === lang);
          return languageOption?.label || lang;
        })
        .join(",");

      const formattedEmploymentTypes = values.employmentType.join(",");

      // Only include formerEmployers if user has experience
      const filteredFormerEmployers: FormerEmployer[] = [];
      if (showFormerEmployer) {
        values.formerEmployers.forEach((employer) => {
          if (employer.name || employer.jobTitle || employer.duration) {
            filteredFormerEmployers.push({
              name: employer.name || "",
              jobTitle: employer.jobTitle || "",
              duration: employer.duration || "",
            });
          }
        });
      }

      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        location: values.location,
        language: formattedLanguages,
        employmentType: formattedEmploymentTypes,
        education: values.education,
        yearsOfExperience: values.yearsOfExperience || "No experience",
        core: coreSkillIds,
        interpersonal: interpersonalSkillIds,
        certification: certificationIds,
        salaryRange: values.salaryRange,
        country: values.country,
        linkedln: values.linkedln || "", // Make LinkedIn profile optional
        formerEmployers: showFormerEmployer ? filteredFormerEmployers : [], // Only include if user has experience
      };

      await submitJobHunterProfile(payload).unwrap();
      await refreshUser();
      navigate(ROUTE_CONSTANTS.DASHBOARD);
    } catch (error) {
      showError(
        "Profile Update Failed",
        "Unable to update your application card. Please try again or contact support if the issue persists.",
      );
      console.error("Error submitting profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement) {
      if (e.target.tagName === "TEXTAREA") return;

      e.preventDefault();

      if (e.target.closest(".tag-input")) return;
    }
  };

  return (
    <>
      <ApplicationFormPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={values}
        onConfirm={handleFormSubmit}
      />
      {isSubmitting && <LoadingOverlay />}

      <div className="flex flex-col xl:flex-row gap-8 pt-6">
        <div className="w-full md:w-[800px] min-h-[960px] bg-[#2D3A41] text-white">
          <div className="flex items-center relative w-full md:mb-10">
            <h1 className="flex-1 text-center text-xl md:text-[32px] md:pt-6 font-normal text-[#F5722E]">
              <span className="inline-flex items-center gap-2 justify-center">
                Complete Your Application Card
              </span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="p-8"
          >
            {/* First section - 4 pairs in 1 column */}
            <div className="flex flex-col gap-y-6 mb-8">
              {/* First Name / Last Name */}
              <div className="flex flex-col md:flex-row md:gap-x-[65px] gap-y-6">
                <div className="flex-1">
                  <InputField
                    label="First Name"
                    className="bg-transparent"
                    error={errors.firstName}
                    touched={touched.firstName}
                    variant="primary"
                  >
                    <Input
                      name="firstName"
                      value={values.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  </InputField>
                </div>

                <div className="flex-1">
                  <InputField
                    label="Last Name"
                    className="bg-transparent"
                    error={errors.lastName}
                    touched={touched.lastName}
                    variant="primary"
                  >
                    <Input
                      name="lastName"
                      value={values.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  </InputField>
                </div>
              </div>

              {/* Location / Language */}
              <div className="flex flex-col md:flex-row md:gap-x-[65px] gap-y-6">
                <div className="flex-1">
                  <InputField
                    label="Location"
                    className="bg-transparent"
                    error={errors.location}
                    touched={touched.location}
                    variant="primary"
                  >
                    <Input
                      name="location"
                      value={values.location}
                      onChange={handleChange}
                      placeholder="Add location"
                      className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  </InputField>
                </div>

                <div className="flex-1">
                  <InputField
                    label="Language"
                    error={errors.languages}
                    touched={touched.languages}
                    showIcon={true}
                    tooltipContent="Feel free to enter up to 4 languages in which you are fluent, both in speaking and writing."
                    variant="primary"
                    disableErrorBorder={true}
                  >
                    <LanguageTagInput
                      value={values.languages || []}
                      onChange={(value) => setFieldValue("languages", value)}
                      className="min-h-[56px] pt-1 px-1"
                      tagClassName="bg-[#F5722E]"
                      placeholder="Select Language"
                      error={Boolean(errors.languages && touched.languages)}
                    />
                  </InputField>
                </div>
              </div>

              {/* LinkedIn Profile / Country */}
              <div className="flex flex-col md:flex-row md:gap-x-[65px] gap-y-6">
                <div className="flex-1">
                  <InputField
                    label="LinkedIn Profile"
                    className="bg-transparent"
                    onChange={handleLinkedInChange}
                    error={errors.linkedln}
                    touched={touched.linkedln}
                    variant="primary"
                  >
                    <Input
                      name="linkedln"
                      value={values.linkedln}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  </InputField>
                </div>

                <div className="flex-1">
                  <InputField
                    label="Country"
                    error={errors.country}
                    touched={touched.country}
                    variant="primary"
                  >
                    <CountrySelect
                      value={values.country || ""}
                      onChange={(value) => setFieldValue("country", value)}
                      className="w-full bg-transparent border-[#AEADAD] h-[56px] hover:text-white border-2 focus:border-[#F5722E] rounded-[8px] text-white placeholder:text-[#AEADAD] px-3 py-2"
                      popoverClassName="md:w-[335px]"
                    />
                  </InputField>
                </div>
              </div>

              {/* Education / Years of Experience */}
              <div className="flex flex-col md:flex-row md:gap-x-[65px] gap-y-6">
                <div className="flex-1">
                  <InputField
                    label="Education"
                    error={errors.education}
                    touched={touched.education}
                    variant="primary"
                  >
                    <Select
                      name="education"
                      value={values.education}
                      onValueChange={(value) =>
                        setFieldValue("education", value)
                      }
                    >
                      <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
                        <SelectValue placeholder="Select highest education level" />
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
                            <div className="py-3 w-full text-center">
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InputField>
                </div>

                <div className="flex-1">
                  <InputField
                    label="Years of Experience"
                    error={errors.yearsOfExperience}
                    touched={touched.yearsOfExperience}
                    variant="primary"
                  >
                    <Select
                      name="yearsOfExperience"
                      value={values.yearsOfExperience}
                      onValueChange={handleYearsOfExperienceChange}
                    >
                      <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
                        <SelectValue placeholder="Select Years of Experience" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none">
                        {selectOptions.yearsOfExperience.map(
                          ({ value, label }) => (
                            <SelectItem
                              key={value}
                              className={cn(
                                "rounded-none justify-start pl-3 h-[55px]",
                              )}
                              value={value}
                            >
                              <div className="py-3 w-full text-center">
                                {label}
                              </div>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </InputField>
                </div>
              </div>
            </div>

            {/* Second section - 2 columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-[65px] gap-y-6">
              {/* Left Column - Main fields */}
              <div className="flex flex-col gap-y-6">
                {/* Employment Type */}
                <div>
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
                      onChange={(value) =>
                        setFieldValue("employmentType", value)
                      }
                      options={selectOptions.employmentType}
                    />
                  </InputField>
                </div>

                {/* Salary Range */}
                <div>
                  <InputField
                    label="Salary Range"
                    error={errors.salaryRange}
                    touched={touched.salaryRange}
                    variant="primary"
                  >
                    <Select
                      name="salaryRange"
                      value={values.salaryRange}
                      onValueChange={(value) =>
                        setFieldValue("salaryRange", value)
                      }
                    >
                      <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
                        <SelectValue placeholder="Select a Salary Range" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:px-0 border-none rounded-none">
                        {selectOptions.salaryRange.map(({ value, label }) => (
                          <SelectItem
                            key={value}
                            className={cn(
                              "rounded-none justify-start pl-3 h-[55px]",
                            )}
                            value={value}
                          >
                            <div className="py-3 w-full text-center">
                              {label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </InputField>
                </div>

                {/* Core Skills */}
                <div>
                  <InputField
                    label="Core Skills"
                    error={errors.coreSkills}
                    touched={touched.coreSkills}
                    showIcon={true}
                    tooltipContent="Job-specific, measurable abilities like software proficiency, coding, or design tools."
                    variant="primary"
                    disableErrorBorder={true}
                  >
                    <CoreSkillsTagInput
                      value={values.coreSkills || []}
                      onChange={(value) => setFieldValue("coreSkills", value)}
                      className="min-h-[56px] pt-1 px-1"
                      alternateColors={{
                        firstColor: "#184E77",
                        secondColor: "#168AAD",
                      }}
                      placeholder="Type and enter to add core skill"
                      error={Boolean(errors.coreSkills && touched.coreSkills)}
                    />
                  </InputField>
                </div>

                {/* Interpersonal Skills */}
                <div>
                  <InputField
                    label="Interpersonal Skills"
                    error={errors.interpersonalSkills}
                    touched={touched.interpersonalSkills}
                    showIcon={true}
                    tooltipContent="Personal qualities like communication, teamwork, and problem-solving."
                    variant="primary"
                    disableErrorBorder={true}
                  >
                    <InterpersonalSkillsTagInput
                      value={values.interpersonalSkills || []}
                      onChange={(value) =>
                        setFieldValue("interpersonalSkills", value)
                      }
                      className="min-h-[56px] pt-1 px-1"
                      alternateColors={{
                        firstColor: "#184E77",
                        secondColor: "#168AAD",
                      }}
                      placeholder="Type and enter to add interpersonal skill"
                      error={Boolean(errors.interpersonalSkills && touched.interpersonalSkills)}
                    />
                  </InputField>
                </div>

                {/* Certificates */}
                <div>
                  <InputField
                    label="Certificates"
                    error={errors.certifications}
                    touched={touched.certifications}
                    showIcon={true}
                    tooltipContent="Select relevant certifications that enhance your job qualifications. If not listed, You may leave it blank."
                    variant="primary"
                    disableErrorBorder={true}
                  >
                    <CertificationTagInput
                      value={values.certifications || []}
                      onChange={(value) =>
                        setFieldValue("certifications", value)
                      }
                      className="min-h-[56px] pt-1 px-1"
                      tagClassName="bg-[#168AAD]"
                      placeholder="Type and enter to add certificate"
                      alternateColors={{
                        firstColor: "#184E77",
                        secondColor: "#168AAD",
                      }}
                      error={Boolean(errors.certifications && touched.certifications)}
                    />
                  </InputField>
                </div>
              </div>

              {/* Right Column - Former Employer section */}
              <div className="flex flex-col gap-y-6">
                {showFormerEmployer && (
                  <>
                    {/* Former Employer Name */}
                    <div>
                      <InputField
                        label="Former Employer Name"
                        className="bg-transparent"
                        variant="primary"
                        showIcon={true}
                        tooltipContent="Add Former Employer/ Company Name"
                        error={getEmployerFieldError(0, "name")}
                        touched={isEmployerFieldTouched(0, "name")}
                      >
                        <Input
                          name="formerEmployers[0].name"
                          value={values.formerEmployers[0]?.name}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched(
                              "formerEmployers[0].name",
                              true,
                              false,
                            );
                            validateForm();
                          }}
                          placeholder="Former Employer"
                          className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        />
                      </InputField>
                    </div>

                    {/* Former Job Title */}
                    <div>
                      <InputField
                        label="Former Job Title"
                        className="bg-transparent"
                        variant="primary"
                        showIcon={true}
                        tooltipContent="Add Former Job Title with the same Employer"
                        error={getEmployerFieldError(0, "jobTitle")}
                        touched={isEmployerFieldTouched(0, "jobTitle")}
                      >
                        <Input
                          name="formerEmployers[0].jobTitle"
                          value={values.formerEmployers[0]?.jobTitle}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched(
                              "formerEmployers[0].jobTitle",
                              true,
                              false,
                            );
                            validateForm();
                          }}
                          placeholder="Former Job Title"
                          className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        />
                      </InputField>
                    </div>

                    {/* Duration */}
                    <div>
                      <InputField
                        label="Duration"
                        className="bg-transparent"
                        variant="primary"
                        showIcon={true}
                        tooltipContent="Type number + year, and/ or number + months"
                        error={getEmployerFieldError(0, "duration")}
                        touched={isEmployerFieldTouched(0, "duration")}
                      >
                        <Input
                          name="formerEmployers[0].duration"
                          value={values.formerEmployers[0]?.duration}
                          onChange={handleChange}
                          onBlur={() => {
                            setFieldTouched(
                              "formerEmployers[0].duration",
                              true,
                              false,
                            );
                            validateForm();
                          }}
                          placeholder="(e.g. 2 years, 10 months)"
                          className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        />
                      </InputField>
                    </div>

                    {/* Add More button for first employer */}
                    {values.formerEmployers.length === 1 && (
                      <div>
                        <button
                          type="button"
                          onClick={addEmployer}
                          className="flex items-center justify-center bg-transparent h-[56px] border-2 border-[#F5F5F5] text-white py-2 px-4 rounded-[8px] hover:border-[#F5722E] w-full"
                        >
                          <span className="mr-1">+</span> Add more
                        </button>
                      </div>
                    )}

                    {/* Additional employer entries */}
                    {values.formerEmployers.slice(1).map((employer, index) => {
                      const actualIndex = index + 1;
                      return (
                        <React.Fragment key={actualIndex}>
                          {/* Former Employer Name */}
                          <div className="relative mt-4">
                            <InputField
                              label="Former Employer Name"
                              className="bg-transparent"
                              variant="primary"
                              showIcon={true}
                              tooltipContent="Add Former Employer/ Company Name"
                              error={getEmployerFieldError(actualIndex, "name")}
                              touched={isEmployerFieldTouched(
                                actualIndex,
                                "name",
                              )}
                            >
                              <Input
                                name={`formerEmployers[${actualIndex}].name`}
                                value={employer.name}
                                onChange={handleChange}
                                onBlur={() =>
                                  setFieldTouched(
                                    `formerEmployers[${actualIndex}].name`,
                                    true,
                                  )
                                }
                                placeholder="Former Employer"
                                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                              />
                            </InputField>
                            <button
                              type="button"
                              onClick={() => removeEmployer(actualIndex)}
                              className="absolute right-[-24px] top-[20px] text-white hover:text-[#F5722E]"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          {/* Former Job Title */}
                          <div>
                            <InputField
                              label="Former Job Title"
                              className="bg-transparent"
                              variant="primary"
                              showIcon={true}
                              tooltipContent="Add Former Job Title with the same Employer"
                              error={getEmployerFieldError(
                                actualIndex,
                                "jobTitle",
                              )}
                              touched={isEmployerFieldTouched(
                                actualIndex,
                                "jobTitle",
                              )}
                            >
                              <Input
                                name={`formerEmployers[${actualIndex}].jobTitle`}
                                value={employer.jobTitle}
                                onChange={handleChange}
                                onBlur={() =>
                                  setFieldTouched(
                                    `formerEmployers[${actualIndex}].jobTitle`,
                                    true,
                                  )
                                }
                                placeholder="Former Job Title"
                                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                              />
                            </InputField>
                          </div>

                          {/* Duration */}
                          <div>
                            <InputField
                              label="Duration"
                              className="bg-transparent"
                              variant="primary"
                              showIcon={true}
                              tooltipContent="Type number + year, and/ or number + months"
                              error={getEmployerFieldError(
                                actualIndex,
                                "duration",
                              )}
                              touched={isEmployerFieldTouched(
                                actualIndex,
                                "duration",
                              )}
                            >
                              <Input
                                name={`formerEmployers[${actualIndex}].duration`}
                                value={employer.duration}
                                onChange={handleChange}
                                onBlur={() =>
                                  setFieldTouched(
                                    `formerEmployers[${actualIndex}].duration`,
                                    true,
                                  )
                                }
                                placeholder="(e.g. 2 years, 10 months)"
                                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                              />
                            </InputField>
                          </div>
                        </React.Fragment>
                      );
                    })}

                    {/* Show Add more button after the last added employer */}
                    {values.formerEmployers.length > 1 &&
                      values.formerEmployers.length < 3 && (
                        <div>
                          <button
                            type="button"
                            onClick={addEmployer}
                            className="flex items-center justify-center bg-transparent h-[56px] border-2 border-[#F5F5F5] text-white py-2 px-4 rounded-[8px] hover:border-[#F5722E] w-full mt-2"
                          >
                            <span className="mr-1">+</span> Add more
                          </button>
                        </div>
                      )}
                  </>
                )}
              </div>
            </div>

            {/* Footer Button */}
            <div className="flex justify-center md:justify-end md:mt-[60px] mt-4 mb-0">
              <Button
                type="submit"
                className={cn(
                  "block md:w-auto text-white text-[16px] h-8 py-0 rounded-sm font-normal px-8",
                  isValid
                    ? "bg-[#F5722E] hover:bg-orange-600"
                    : "bg-[#AEADAD] hover:bg-[#AEADAD]",
                )}
              >
                Save and Preview
              </Button>
            </div>
          </form>
        </div>
        <div className="w-auto flex justify-center">
          <AppCardPreview values={previewValues} selectOptions={selectOptions} />
        </div>
      </div>
    </>
  );
};

export { ApplicationCardForm };

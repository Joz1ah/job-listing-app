import React, { FC, useState, useEffect } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Input, Button, InputField } from "components";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import saveChanges from "images/save-changes.svg?url";

import { selectOptions } from "mockData/app-form-options";

import { AppCardPreview } from "features/employer";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useJobHunterProfileMutation } from "api/akaza/akazaAPI";
import { useContext } from "react";
import { KeywordMappingContext } from "contexts/KeyWordMappingContext";
import { CountrySelect } from "components";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

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

import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";

// FormerEmployer interface
interface FormerEmployer {
  name: string;
  jobTitle: string; // Changed from 'title' to 'jobTitle'
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

interface JobHunterSkill {
  id: string | number;
  keyword: string;
  type: "core" | "interpersonal" | "certification";
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

const LoadingOverlay: FC = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <img src={saveChanges} alt="Loading" />
    </div>
  </div>
);

const EditApplicationCard: FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const { user, refreshUser } = useAuth();
  const [submitJobHunterProfile] = useJobHunterProfileMutation();
  const { keywordToIdMap, addMapping } = useContext(KeywordMappingContext);
  const { showError } = useErrorModal();
  const [validationSchema, setValidationSchema] = useState(() =>
    createValidationSchema(""),
  );

  // Parse employment type string into array
  const employmentTypes = user?.data?.user?.relatedDetails?.employmentType
    ? user.data.user.relatedDetails.employmentType.split(",")
    : [];

  useEffect(() => {
    if (user?.data?.user?.relatedDetails?.JobHunterSkill) {
      user.data.user.relatedDetails.JobHunterSkill.forEach(
        (skill: JobHunterSkill) => {
          addMapping(skill.keyword, skill.id);
        },
      );
    }
  }, [user, addMapping]);

  // Convert former employers from 'title' to 'jobTitle' if necessary
  const defaultFormerEmployers = user?.data?.user?.relatedDetails
    ?.FormerEmployer
    ? user.data.user.relatedDetails.FormerEmployer.map((employer: any) => ({
        name: employer.name || "",
        jobTitle: employer.jobTitle || employer.title || "", // Handle both field names
        duration: employer.duration || "",
      }))
    : [];

  const initialFormerEmployers =
    defaultFormerEmployers.length > 0
      ? defaultFormerEmployers
      : [{ name: "", jobTitle: "", duration: "" }];

  const initialYearsOfExperience =
    user?.data?.user?.relatedDetails?.yearsOfExperience || "";

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
      firstName: user?.data?.user?.relatedDetails?.firstName || "",
      lastName: user?.data?.user?.relatedDetails?.lastName || "",
      location: user?.data?.user?.relatedDetails?.location || "",
      employmentType: employmentTypes,
      salaryRange: user?.data?.user?.relatedDetails?.salaryRange || "",
      yearsOfExperience: initialYearsOfExperience,
      coreSkills:
        user?.data?.user?.relatedDetails?.JobHunterSkill?.filter(
          (skill: JobHunterSkill) => skill.type === "core",
        )?.map((skill: JobHunterSkill) => skill.keyword) || [],
      interpersonalSkills:
        user?.data?.user?.relatedDetails?.JobHunterSkill?.filter(
          (skill: JobHunterSkill) => skill.type === "interpersonal",
        )?.map((skill: JobHunterSkill) => skill.keyword) || [],
      certifications:
        user?.data?.user?.relatedDetails?.JobHunterSkill?.filter(
          (skill: JobHunterSkill) => skill.type === "certification",
        )?.map((skill: JobHunterSkill) => skill.keyword) || [],
      education: user?.data?.user?.relatedDetails?.education || "",
      languages: user?.data?.user?.relatedDetails?.language
        ? user.data.user.relatedDetails.language
            .split(",")
            .map((lang: string) => lang.trim())
        : [],
      country: user?.data?.user?.relatedDetails?.country || "",
      linkedln: user?.data?.user?.relatedDetails?.
      linkedln || "",
      formerEmployers: initialFormerEmployers,
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async () => {
      setShowPreview(true);
    },
  });

  // Update validation schema when years of experience changes
  useEffect(() => {
    const newValidationSchema = createValidationSchema(
      values.yearsOfExperience,
    );
    setValidationSchema(newValidationSchema);

    // If user selects no experience, reset formerEmployers to empty array
    if (values.yearsOfExperience === "No experience") {
      setFieldValue("formerEmployers", [
        { name: "", jobTitle: "", duration: "" },
      ]);
    }

    // Run validation immediately after schema update to update isValid state
    validateForm();
  }, [values.yearsOfExperience, setFieldValue, validateForm]);

  // Check if we should show former employer fields
  const showFormerEmployer =
    values.yearsOfExperience && values.yearsOfExperience !== "No experience";

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement) {
      if (e.target.tagName === "TEXTAREA") return;

      e.preventDefault();

      if (e.target.closest(".tag-input")) return;
    }
  };

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
      const coreSkillIds = values.coreSkills
        .map((keyword) => {
          const id = keywordToIdMap[keyword];
          return id ? String(id) : null; // Convert to string
        })
        .filter(Boolean);

      const interpersonalSkillIds = values.interpersonalSkills
        .map((keyword) => {
          const id = keywordToIdMap[keyword];
          return id ? String(id) : null; // Convert to string
        })
        .filter(Boolean);

      const certificationIds = values.certifications
        .map((keyword) => {
          const id = keywordToIdMap[keyword];
          return id ? String(id) : null; // Convert to string
        })
        .filter(Boolean);

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
            // The API expects 'title' field, not 'jobTitle'
            filteredFormerEmployers.push({
              name: employer.name || "",
              jobTitle: employer.jobTitle || "", // Map jobTitle to title for the API
              duration: employer.duration || "",
            });
          }
        });
      }

      // Then use in payload
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        location: values.location,
        language: formattedLanguages,
        employmentType: formattedEmploymentTypes,
        education: values.education,
        yearsOfExperience: values.yearsOfExperience || "No experience",
        core: coreSkillIds as string[],
        interpersonal: interpersonalSkillIds as string[],
        certification: certificationIds as string[],
        salaryRange: values.salaryRange,
        country: values.country,
        linkedln: values.linkedln || null,
        formerEmployers: showFormerEmployer ? filteredFormerEmployers : [], // Only include if user has experience
      };

      await submitJobHunterProfile(payload).unwrap();

      // Refresh user data in auth context
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
          <div className="flex items-center w-full px-0 py-4 md:px-4 md:py-6 relative">
            <NavLink
              to={ROUTE_CONSTANTS.DASHBOARD}
              className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 md:top-6 md:translate-y-0"
            >
              <ChevronLeft strokeWidth={4} className="h-6 w-6 mr-2" />
            </NavLink>

            <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-[#F5722E]">
              <span className="inline-flex items-center gap-2 justify-center">
                Edit Your Application Card
              </span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-[65px] gap-y-6 mb-4 md:mb-0">
              {/* Left Column */}
              <div className="flex flex-col gap-6">
                {/* First Name */}
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
                {/* Last Name */}
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

                {/* Location */}
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

                {/* Language */}
                <InputField
                  label="Language"
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
                    placeholder="Select language"
                  />
                </InputField>

                {/* Country */}
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

                {/* LinkedIn Profile */}
                <InputField
                  label="LinkedIn Profile"
                  className="bg-transparent"
                  error={errors.linkedln}
                  touched={touched.linkedln}
                  showIcon={true}
                  tooltipContent="Enter your LinkedIn Profile URL (optional)"
                  variant="primary"
                >
                  <Input
                    name="linkedln"
                    value={values.linkedln}
                    onChange={handleChange}
                    placeholder="Add LinkedIn Profile URL"
                    className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                  />
                </InputField>

                {/* Education */}
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
                          <div className="py-3 w-full text-center">{label}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputField>

                {/* Years of Experience */}
                <InputField
                  label="Years of Experience"
                  error={errors.yearsOfExperience}
                  touched={touched.yearsOfExperience}
                  variant="primary"
                >
                  <Select
                    name="yearsOfExperience"
                    value={values.yearsOfExperience}
                    onValueChange={(value) => {
                      setFieldValue("yearsOfExperience", value);

                      if (value !== "No experience") {
                        // Run validation immediately after field touch to update isValid
                        setTimeout(() => validateForm(), 0);
                      } else {
                        // For "No experience", run validation immediately
                        setTimeout(() => validateForm(), 0);
                      }
                    }}
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

              {/* Right Column */}
              <div className="flex flex-col gap-6">
                {/* Employment Type */}
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

                {/* Salary Range */}
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
                          <div className="py-3 w-full text-center">{label}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputField>

                {/* Interpersonal Skills */}
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
                    onChange={(value) =>
                      setFieldValue("interpersonalSkills", value)
                    }
                    className="min-h-[56px] pt-1 px-1"
                    alternateColors={{
                      firstColor: "#184E77",
                      secondColor: "#168AAD",
                    }}
                    placeholder="Type and enter to add interpersonal skill"
                  />
                </InputField>

                {/* Core Skills */}
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
                    className="min-h-[56px] pt-1 px-1"
                    alternateColors={{
                      firstColor: "#184E77",
                      secondColor: "#168AAD",
                    }}
                    placeholder="Type and enter to add core skill"
                  />
                </InputField>

                {/* Certificates */}
                <InputField
                  label="Certificates"
                  error={errors.certifications}
                  touched={touched.certifications}
                  showIcon={true}
                  tooltipContent="Select relevant certifications that enhance your job qualifications. If not listed, You may leave it blank."
                  variant="primary"
                >
                  <CertificationTagInput
                    value={values.certifications || []}
                    onChange={(value) => setFieldValue("certifications", value)}
                    className="min-h-[56px] pt-1 px-1"
                    tagClassName="bg-[#168AAD]"
                    placeholder="Type and enter to add certificate"
                    alternateColors={{
                      firstColor: "#184E77",
                      secondColor: "#168AAD",
                    }}
                  />
                </InputField>

                {/* Only show former employer fields when years of experience is not 'No experience' */}
                {showFormerEmployer && (
                  <div className="flex flex-col gap-6">
                    {/* Former Employer Name */}
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
                        onBlur={() =>
                          setFieldTouched("formerEmployers[0].name", true)
                        }
                        placeholder="Former Employer"
                        className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                      />
                    </InputField>

                    {/* Former Job Title */}
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
                        onBlur={() =>
                          setFieldTouched("formerEmployers[0].jobTitle", true)
                        }
                        placeholder="Former Job Title"
                        className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                      />
                    </InputField>

                    {/* Duration */}
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
                        onBlur={() =>
                          setFieldTouched("formerEmployers[0].duration", true)
                        }
                        placeholder="(e.g. 2 years, 10 months)"
                        className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                      />
                    </InputField>

                    {/* Only show Add more button if no additional employers yet */}
                    {values.formerEmployers.length === 1 && (
                      <button
                        type="button"
                        onClick={addEmployer}
                        className="flex items-center justify-center bg-transparent h-[56px] border-2 border-[#F5F5F5] text-white py-2 px-4 rounded-[8px] hover:border-[#F5722E] w-full mt-2"
                      >
                        <span className="mr-1">+</span> Add more
                      </button>
                    )}
                  </div>
                )}

                {/* Additional employer entries - only shown when years of experience is not 'No experience' */}
                {showFormerEmployer &&
                  values.formerEmployers.slice(1).map((employer, index) => {
                    // Add 1 to index since we're displaying the first entry separately
                    const actualIndex = index + 1;

                    return (
                      <div key={actualIndex} className="flex flex-col gap-6">
                        {/* Former Employer Name */}
                        <div className="relative">
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
                        <InputField
                          label="Former Job Title"
                          className="bg-transparent"
                          variant="primary"
                          showIcon={true}
                          tooltipContent="Add Former Job Title with the same Employer"
                          error={getEmployerFieldError(actualIndex, "jobTitle")}
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

                        {/* Duration */}
                        <InputField
                          label="Duration"
                          className="bg-transparent"
                          variant="primary"
                          showIcon={true}
                          tooltipContent="Type number + year, and/ or number + months"
                          error={getEmployerFieldError(actualIndex, "duration")}
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
                    );
                  })}

                {/* Show Add more button after the last added employer - only when years of experience is not 'No experience' */}
                {showFormerEmployer &&
                  values.formerEmployers.length > 1 &&
                  values.formerEmployers.length < 3 && (
                    <button
                      type="button"
                      onClick={addEmployer}
                      className="flex items-center justify-center bg-transparent h-[56px] border-2 border-[#F5F5F5] text-white py-2 px-4 rounded-[8px] hover:border-[#F5722E] w-full mt-2"
                    >
                      <span className="mr-1">+</span> Add more
                    </button>
                  )}
              </div>
            </div>

            {/* Footer Button */}
            <div className="flex justify-center md:justify-end md:mt-[60px] mb-0">
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
          <AppCardPreview values={values} selectOptions={selectOptions} />
        </div>
      </div>
    </>
  );
};

export { EditApplicationCard };

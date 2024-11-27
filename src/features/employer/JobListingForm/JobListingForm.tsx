import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  AlertTriangle,
  CircleAlert,
  Check,
  ChevronDown,
} from "lucide-react";
import { Input, Button, Textarea, Label } from "components";
import { NavLink } from "react-router-dom";
import sparkeIcon from "images/sparkle-icon.png";
import saveChanges from "images/save-changes.svg?url";

import { Badge } from "components";

import { Command, CommandGroup, CommandItem, CommandList } from "components";

import { Popover, PopoverContent, PopoverTrigger, PreviewModal } from "components";

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

import { Tooltip } from "components";

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

{
  /*Floating Label*/
}
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string | string[];
  touched?: boolean;
  showIcon?: boolean;
  tooltipContent?: string | React.ReactNode; // Modified to accept ReactNode
}

const FormField: FC<FormFieldProps> = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ label, children, className, error, touched, showIcon, tooltipContent }, ref) => {
    const showError = touched && error;

    return (
      <div ref={ref} className={cn("relative pt-4", className)}>
        <div className="relative">
          <div className="absolute -top-3 left-4 md:left-5 bg-[#242625] md:bg-[#2D3A41] px-2 z-20">
            <div className="flex items-center gap-2">
              <Label className="text-sm md:text-base font-normal text-white">
                {label}
              </Label>
              {showIcon && tooltipContent && (
                <Tooltip content={tooltipContent}>
                  <CircleAlert
                    className="relative -top-1 cursor-pointer fill-gray-400 text-[#2D3A41]"
                    strokeWidth={1.5}
                    size={14}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="relative">
            {children}
            {showError && (
              <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                <AlertTriangle
                  className="fill-red-500 text-[#242625] md:text-[#2D3A41]"
                  size={20}
                />
              </div>
            )}
          </div>
        </div>
        {showError && (
          <div className="absolute text-xs md:text-sm italic text-red-500 mt-1">
            {error}
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

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

  const selectOptions = {
    employmentType: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract only" },
    ],
    salaryRange: [
      { value: "negotiable", label: "Negotiable" },
      { value: "0-30", label: "$0 - $30,000" },
      { value: "31-50", label: "$31,000 - $50,000" },
      { value: "51-70", label: "$51,000 - $70,000" },
      { value: "71-100", label: "$71,000 - $100,000" },
      { value: "101-120", label: "$101,000 - $120,000" },
      { value: "121-plus", label: "$121,000 or more" },
    ],

    yearsOfExperience: [
      { value: "no-exp", label: "No experience" },
      { value: "less-than-1", label: "Under a year" },
      { value: "1-3-years", label: "1-3 years" },
      { value: "3-5-years", label: "3-5 years" },
      { value: "5-10-years", label: "5-10 years" },
      { value: "10-plus-years", label: "10+ years" },
    ],
    education: [
      { value: "bachelors-degree", label: "Bachelor's Degree" },
      { value: "high-school-diploma", label: "High School Diploma" },
      { value: "masters-degree", label: "Master's Degree" },
      { value: "associate-degree", label: "Associate Degree" },
      {
        value: "professional-certification",
        label: "Professional Certification only",
      },
      {
        value: "vocational-training",
        label: "Vocational/Technical Training only",
      },
      { value: "phd-doctorate", label: "Doctorate/PhD" },
      { value: "incomplete-college", label: "Incomplete College Degree" },
    ],
    priorityIndicator: [
      { value: "location", label: "Location" },
      { value: "salary", label: "Salary" },
      { value: "language", label: "Language" },
      { value: "none", label: "None" },
    ],
  };

  const handleSaveChanges = (): void => {
    setShowPreview(true);
  };

  const handlePreviewConfirm = (): void => {
    setShowPreview(false);
    setIsLoading(true);
    setTimeout(() => {
      navigate("/job-feed-employer");
    }, 1500);
  };

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit, isValid } =
    useFormik<FormData & { employmentType: string[] }>({
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
    <PreviewModal
    isOpen={showPreview}
    onClose={() => setShowPreview(false)}
    formData={values}
    onConfirm={handlePreviewConfirm}
  />
      {isLoading && <LoadingOverlay />}
      <div className="w-full max-w-[927px] min-h-[825px] bg-transparent md:bg-[#2D3A41] text-white mx-2 px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center relative w-full mb-6 md:mb-14">
          <NavLink to="/job-feed-employer" className="absolute left-0 md:left-4">
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
              <FormField
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
              </FormField>

              <FormField
              label="Employment Type"
              error={errors.employmentType}
              touched={touched.employmentType}
              showIcon={true}
              tooltipContent="You may select one up to three employment types that you are looking for"
            >
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between bg-transparent border-gray-300 h-[56px] font-normal hover:bg-transparent hover:text-white border-2",
                      "focus-within:border-orange-500 data-[state=open]:border-orange-500 px-3 relative",
                    )}
                  >
                    <div className="flex items-center w-[calc(100%-24px)] overflow-hidden">
                      {values.employmentType.length === 0 ? (
                        <span className="text-white">
                          Select Employment Type
                        </span>
                      ) : (
                        <div className="flex flex-nowrap overflow-hidden gap-1">
                          {values.employmentType.map((value) => (
                            <Badge
                              key={value}
                              variant="secondary"
                              className={cn(
                                "font-normal text-[13px] rounded-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]",
                                {
                                  "bg-orange-600 text-white":
                                    value === "contract",
                                  "bg-orange-500 text-white":
                                    value !== "contract",
                                },
                              )}
                            >
                              {
                                selectOptions.employmentType.find(
                                  (type) => type.value === value,
                                )?.label
                              }
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50 absolute right-3" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-none rounded-none">
                  <Command className="border-0 rounded-none">
                    <CommandList>
                      <CommandGroup className="p-0 bg-[#F5F5F5]">
                        {selectOptions.employmentType.map((type) => (
                          <CommandItem
                            key={type.value}
                            value={type.value}
                            data-selected={values.employmentType.includes(
                              type.value,
                            )}
                            onSelect={(currentValue) => {
                              const newValue = [...values.employmentType];
                              const index = newValue.indexOf(currentValue);
                              if (index === -1) {
                                newValue.push(currentValue);
                              } else {
                                newValue.splice(index, 1);
                              }
                              setFieldValue("employmentType", newValue);
                            }}
                            className={cn(
                              "rounded-none justify-start px-2 h-[55px]",
                              "transition-all duration-500 ease-in-out",
                              "data-[selected=true]:bg-orange-500 data-[selected=true]:text-white",
                            )}
                          >
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "mr-2 h-5 w-5 border rounded flex items-center justify-center cursor-pointer",
                                  values.employmentType.includes(type.value)
                                    ? "border-blue-400 bg-blue-400 hover:bg-blue-500"
                                    : "border-gray-400 bg-white hover:border-gray-500",
                                )}
                              >
                                {values.employmentType.includes(type.value) && (
                                  <Check className="h-3 w-3 text-white" />
                                )}
                              </div>
                              {type.label}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormField>

              <FormField
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
                    <SelectValue
                      placeholder="Select Salary Range"
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
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
              </FormField>

              <FormField
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
                <span className="flex right-0 italic text-[11px] absolute">
                  Maximum of 500 words
                </span>
              </FormField>

              <FormField
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
              </FormField>

              <FormField
                label="Certification"
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
              </FormField>
            </div>

            {/* Right Column */}
            <div className="flex flex-col space-y-6 ">
              
                <FormField
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
                              <span className="text-[#F5722E] ">
                                Perfect Match
                              </span>
                            </div>
                            <span>Indicator</span>
                          </div>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                      {selectOptions.priorityIndicator.map(
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
                </FormField>

                <FormField
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
                </FormField>

                <FormField
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
                </FormField>

                <FormField
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
                </FormField>

              <div className="mb-8 md:mb-14">
                <FormField
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
                </FormField>
              </div>

              <div className="mb-8 md:mb-14">
                <FormField
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
                </FormField>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="col-span-full flex flex-col md:flex-row justify-end gap-4 mt-8 md:mt-12">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveChanges}
                className="w-full md:w-auto border-orange-500 text-orange-500 bg-[#242625] md:bg-[#2D3A41] hover:bg-orange-500 hover:text-white"
              >
                Save Changes
              </Button>
              <Button
                type="submit"
                className={cn("w-full md:w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E]",
                isValid ? "bg-orange-500 hover:bg-orange-600" : "bg-[#AEADAD] hover:bg-[#AEADAD]"
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

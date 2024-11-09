import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  AlertTriangle,
  CircleAlert,
  Check,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Input, TagInput, Button, Textarea, Label } from "components";
import { NavLink } from "react-router-dom";
import sparkeIcon from "images/sparkle-icon.png";

import { Badge } from "components";

import { Command, CommandGroup, CommandItem, CommandList } from "components";

import { Popover, PopoverContent, PopoverTrigger } from "components";

import { LanguageTagInput } from "components";

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

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, children, className, error, touched, showIcon, tooltipContent },
    ref,
  ) => {
    const showError = touched && error;

    return (
      <div ref={ref} className={cn("relative pt-4", className)}>
        <div className="relative">
          <div className="absolute -top-3 left-5 bg-[#2D3A41] px-1 z-20">
            <div className="flex items-center">
              <Label className="text-base font-normal text-white">
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
              <div className="absolute -right-7 top-1/2 -translate-y-1/2">
                <AlertTriangle
                  className="fill-red-500 text-[#2D3A41]"
                  size={20}
                />
              </div>
            )}
          </div>
        </div>
        {showError && (
          <div className="absolute text-sm italic text-red-500">{error}</div>
        )}
      </div>
    );
  },
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

const MatchCreation = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFormData = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, []);

  const selectOptions = {
    employmentType: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract" },
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
    priorityIndicator: [
      { value: "location", label: "Location" },
      { value: "salary", label: "Salary" },
      { value: "language", label: "Language" },
    ],
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    handleReset,
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
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
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
    <div className="flex-1 flex justify-center items-start px-4 md:mr-16 mx-auto mb-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-[600px]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="w-full md:w-[927px] min-h-[825px] bg-[#2D3A41] text-white pt-6 pb-12 mt-9 ml-1">
          <div className="flex items-center relative w-full mb-8 md:mb-14">
            <NavLink to="/job-feed-employer" className="absolute left-0">
              <ChevronLeft strokeWidth={4} className="h-6 w-6 ml-4" />
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
            className="w-full px-4 md:max-w-[831px] md:mx-[48px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-[115px]"
          >
            {/* Left Column */}
            <div className="space-y-6 md:space-y-[40px]">
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
              >
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between bg-transparent border-gray-300 h-[56px] font-normal hover:bg-transparent hover:text-white border-2",
                        "focus-within:border-orange-500 data-[state=open]:border-orange-500 px-3",
                      )}
                    >
                      <div className="flex flex-wrap overflow-hidden">
                        {values.employmentType.length === 0 &&
                          "Select Employment Type"}
                        {values.employmentType.map((value) => (
                          <Badge
                            key={value}
                            variant="secondary"
                            className={cn(
                              "mr-1 font-normal text-[16px] rounded-sm",
                              {
                                // Custom styles for Contract selection
                                "bg-orange-600 text-white":
                                  value === "contract",
                                // Custom styles for Full-time and Part-time
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
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
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
                                "data-[selected=true]:bg-[#BF532C] data-[selected=true]:text-white",
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
                                  {values.employmentType.includes(
                                    type.value,
                                  ) && <Check className="h-3 w-3 text-white" />}
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
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                    <SelectValue
                      placeholder="Select Salary Range"
                      className=""
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0 border-none rounded-none">
                    {selectOptions.salaryRange.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className={cn(
                          "rounded-none justify-start pl-3 h-[55px] transition-all duration-500 ease-in-out",
                          "focus:bg-[#BF532C] focus:text-white",
                          "data-[state=checked]:bg-orange-500 data-[state=checked]:text-white data-[state=checked]:font-bold",
                          "data-[state=checked]:focus:bg-[#BF532C]",
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
                          "rounded-none justify-start pl-3 h-[55px] transition-all duration-500 ease-in-out",
                          "focus:bg-[#BF532C] focus:text-white",
                          "data-[state=checked]:bg-orange-500 data-[state=checked]:text-white data-[state=checked]:font-bold",
                          "data-[state=checked]:focus:bg-[#BF532C]",
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
                  className="bg-transparent border-[#AEADAD] min-h-[150px] md:min-h-[179px] pt-4 resize-none border-2 focus-within:border-orange-500 placeholder:text-white"
                  placeholder="Please provide a job description"
                />
                <span className="flex right-0 italic text-[11px] absolute">
                  Maximum of 500 words
                </span>
              </FormField>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
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
                className="pb-[40px]"
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
                    {selectOptions.priorityIndicator.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className={cn(
                          "rounded-none justify-start pl-3 h-[55px] transition-all duration-500 ease-in-out",
                          "focus:bg-[#BF532C] focus:text-white",
                          "data-[state=checked]:bg-orange-500 data-[state=checked]:text-white data-[state=checked]:font-bold",
                          "data-[state=checked]:focus:bg-[#BF532C]",
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
                  <TagInput
                    value={values.coreSkills || []}
                    onChange={(value) => setFieldValue("coreSkills", value)}
                    className="bg-transparent border-[#AEADAD] h-[99px] pt-1 px-1 border-2 focus-within:border-orange-500"
                    placeholder="Type and enter to add skills"
                  />
                </FormField>
              </div>

              <div className="mb-14">
                <FormField
                  label="Interpersonal Skills"
                  error={errors.interpersonalSkills}
                  touched={touched.interpersonalSkills}
                  showIcon={true}
                  tooltipContent="Personal qualities like communication, teamwork, and problem-solving."
                >
                  <TagInput
                    value={values.interpersonalSkills || []}
                    onChange={(value) =>
                      setFieldValue("interpersonalSkills", value)
                    }
                    className="bg-transparent border-[#AEADAD] h-[99px] pt-1 px-1 border-2 focus-within:border-orange-500 "
                    placeholder="Type and enter to add skills"
                  />
                </FormField>
              </div>

              <div className="space-y-[40px]">
                {/* Regular spacing for remaining fields */}
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
                            "rounded-none justify-start pl-3 h-[55px] transition-all duration-500 ease-in-out",
                            "focus:bg-[#BF532C] focus:text-white",
                            "data-[state=checked]:bg-orange-500 data-[state=checked]:text-white data-[state=checked]:font-bold",
                            "data-[state=checked]:focus:bg-[#BF532C]",
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
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="col-span-full flex flex-col md:flex-row justify-end gap-4 mt-8 md:-mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="w-full md:w-auto border-orange-500 text-orange-500 bg-[#2D3A41] hover:bg-orange-500 hover:text-white"
              >
                Save Changes
              </Button>
              <Button
                type="submit"
                className="w-full md:w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E]"
              >
                Add Job
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export { MatchCreation };

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
  tooltipContent?: string;
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  (
    { label, children, className, error, touched, showIcon, tooltipContent },
    ref,
  ) => {
    const showError = touched && error;

    return (
      <div ref={ref} className={cn("relative", className)}>
        <div className="absolute -top-3 left-5 z-50 bg-[#2D3A41] pl-2">
          <div className="flex items-center">
            <Label className="text-[16px] font-normal text-white">
              {label}
            </Label>
            {showIcon && tooltipContent && (
              <Tooltip content={tooltipContent}>
                <CircleAlert
                  className="text-[#2D3A41] relative -top-1 fill-gray-400 cursor-pointer"
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
                className="text-[#2D3A41] fill-red-500"
                size={20}
              />
            </div>
          )}
        </div>
        {showError && (
          <div className="text-red-500 italic text-[13px] absolute">
            {error}
          </div>
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
      { value: "full-time", label: "Full time" },
      { value: "part-time", label: "Part time" },
      { value: "contract", label: "Contract" },
    ],
    salaryRange: [
      { value: "nego", label: "Negotiable" },
      { value: "0-30", label: "$0 - $30,000" },
      { value: "31-50", label: "$31,000 - $50,000" },
      { value: "51-70", label: "$51,000 - $70,000" },
      { value: "71-100", label: "$71,000 - $100,000" },
      { value: "100-120", label: "$100,000 - $120,000" },
      { value: "121+", label: "121,000 or more" },
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
      { value: "inc", label: "Incomplete College Degree" },
    ],
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    handleSubmit,
    handleReset,
  } = useFormik<FormData & { employmentType: string[] }>({
    initialValues: {
      jobTitle: "",
      employmentType: [],
      salaryRange: "",
      yearsOfExperience: "",
      jobDescription: "",
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
    <div className="flex-1 flex justify-center items-start px-4 mr-16">
      {isLoading ? (
        <div className="flex justify-center items-center h-[600px]">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="w-[927px] h-[825px] bg-[#2D3A41] text-white pt-4 pb-12 mt-9 ml-1">
          <div className="flex items-center relative w-full mb-14">
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
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="max-w-[831px] mx-[48px] grid grid-cols-1 md:grid-cols-2 gap-[115px]"
          >
            {/* Left Column */}
            <div className="space-y-[40px]">
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
                  onBlur={handleBlur}
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500"
                />
              </FormField>

              <FormField
                label="Employment Type"
                error={errors.employmentType}
                touched={touched.employmentType}
              >
                <Popover
                  onOpenChange={(open) => {
                    if (!open) {
                      setFieldTouched("employmentType", true);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between bg-transparent border-gray-300 h-[56px] font-normal hover:bg-transparent hover:text-white border-2",
                        "focus-within:border-orange-500 data-[state=open]:border-orange-500",
                      )}
                    >
                      <div className="flex flex-wrap overflow-hidden">
                        {values.employmentType.length === 0 &&
                          "Select Employment Type"}
                        {values.employmentType.map((value) => (
                          <Badge
                            key={value}
                            variant="secondary"
                            className="mr-1 bg-orange-500 text-white pr-1 font-normal text-[16px] rounded-sm"
                          >
                            {
                              selectOptions.employmentType.find(
                                (type) => type.value === value,
                              )?.label
                            }
                            <button className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"></button>
                          </Badge>
                        ))}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command className="border-0">
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
                                setFieldTouched(
                                  "employmentType",
                                  newValue.length === 0,
                                );
                              }}
                              className={cn(
                                "border-b border-black last:border-b-0 rounded-none justify-start px-3 py-3",
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
                  onOpenChange={(open) => {
                    if (!open) {
                      setFieldTouched("salaryRange", true);
                    }
                  }}
                >
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                    <SelectValue placeholder="Select Salary Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0">
                    {selectOptions.salaryRange.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
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
                  onOpenChange={(open) => {
                    if (!open) {
                      setFieldTouched("yearsOfExperience", true);
                    }
                  }}
                >
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                    <SelectValue placeholder="Select Years of Experience" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] p-0 [&>*]:p-0">
                    {selectOptions.yearsOfExperience.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
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
              >
                <Textarea
                  name="jobDescription"
                  value={values.jobDescription}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="bg-transparent border-[#AEADAD] min-h-[179px] pt-4 resize-none border-2 focus-within:border-orange-500"
                />
                <span className="flex right-0 italic text-[11px] absolute">
                  Maximum of 500 words
                </span>
              </FormField>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              <div className="mb-14">
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
                    onBlur={() => setFieldTouched("coreSkills", true)}
                    className="bg-transparent border-[#AEADAD] h-[99px] pt-1 px-4 border-2 focus-within:border-orange-500"
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
                    onBlur={(value) => {
                      setFieldValue("interpersonalSkills", value);
                      setFieldTouched("interpersonalSkills", true);
                    }}
                    className="bg-transparent border-[#AEADAD] h-[99px] pt-1 px-4 border-2 focus-within:border-orange-500"
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
                    onOpenChange={(open) => {
                      if (!open) {
                        setFieldTouched("education", true);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                      <SelectValue placeholder="Select your Education Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#F5F5F7] items-center p-0 [&>*]:p-0">
                      {selectOptions.education.map(({ value, label }) => (
                        <SelectItem
                          key={value}
                          className="focus:bg-orange-500 focus:text-white border-b border-black last:border-b-0 rounded-none justify-center p-0"
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
                    onBlur={handleBlur}
                    className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus-within:border-orange-500"
                  />
                </FormField>
                <FormField
                  label="Languages"
                  error={errors.languages}
                  touched={touched.languages}
                  showIcon={true}
                  tooltipContent="Feel free to enter up to 4 languages in which you are fluent, both in speaking and writing."
                >
                  <TagInput
                    value={values.languages || []}
                    onChange={(value) => setFieldValue("languages", value)}
                    onBlur={(value) => {
                      setFieldValue("languages", value);
                      setFieldTouched("languages", true);
                    }}
                    className="bg-transparent border-[#AEADAD] h-[56px] pt-1 px-4 border-2 focus-within:border-orange-500"
                    tagClassName="bg-orange-500"
                  />
                </FormField>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="col-span-full flex justify-end gap-4 -mt-10">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
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
      )}
    </div>
  );
};

export { MatchCreation };

import React, { FC, useState } from "react";
import {
  ChevronLeft,
  AlertTriangle,
  CircleAlert,
  Check,
  ChevronDown,
} from "lucide-react";
import { Input, Button, Label } from "components";
import { NavLink } from "react-router-dom";
import { Badge } from "components";
import { useNavigate } from "react-router-dom";
import saveChanges from "images/save-changes.svg?url";

import { Command, CommandGroup, CommandItem, CommandList } from "components";

import { Popover, PopoverContent, PopoverTrigger } from "components";

import { AppCardPreview } from "features";
import {
  LanguageTagInput,
  BirthdayInput,
  PhoneInput,
  CoreSkillsTagInput,
  InterpersonalSkillsTagInput,
  CertificationTagInput,
} from "components";

import { PreviewAppCard } from "components";

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

import { isValidPhoneNumber } from "react-phone-number-input";

import { Tooltip } from "components";

interface FormData {
  firstName: string;
  lastName: string;
  birthday: string;
  emailAddress: string;
  mobileNumber: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  languages: string[];
  country: string;
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
  (
    { label, children, className, error, touched, showIcon, tooltipContent },
    ref,
  ) => {
    const showError = touched && error;

    return (
      <div ref={ref} className={cn("relative pt-4 w-full", className)}>
        <div className="relative">
          <div className="absolute -top-3 left-5 bg-[#242625] md:bg-[#2D3A41] px-1 z-20">
            <div className="flex items-center">
              <Label className="text-sm md:text-base font-normal text-white">
                {label}
              </Label>
              {showIcon && tooltipContent && (
                <Tooltip content={tooltipContent}>
                  <CircleAlert
                    className="relative -top-1 cursor-pointer fill-gray-400 text-[#2D3A41] ml-1"
                    strokeWidth={1.5}
                    size={14}
                  />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="relative w-full">
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
          <div className="absolute text-xs md:text-sm italic text-red-500">
            {error}
          </div>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  birthday: Yup.string()
    .matches(/^(1[0-2]|[1-9])\/(3[01]|[12][0-9]|[1-9])$/, "Invalid date format")
    .required("Birthday is required"),
  emailAddress: Yup.string()
    .required("This field is required")
    .email("Invalid email address"),
  mobileNumber: Yup.string()
    .required("This field is required")
    .test("phone", "Please enter a valid phone number", function (value) {
      return value ? isValidPhoneNumber(value) : false;
    }),
  country: Yup.string().required("This field is required"),
  employmentType: Yup.array().min(
    1,
    "Please select at least one employment type",
  ),
  salaryRange: Yup.string().required("This field is required"),
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
});

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <img src={saveChanges} alt="Loading" />
    </div>
  </div>
);

const ApplicationForm: FC = () => {
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
    country: [
      { value: "us", label: "United States" },
      { value: "ca", label: "Canada" },
      { value: "gb", label: "United Kingdom" },
      { value: "au", label: "Australia" },
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "jp", label: "Japan" },
      { value: "sg", label: "Singapore" },
      { value: "ae", label: "United Arab Emirates" },
      { value: "in", label: "India" },
      { value: "ph", label: "Philippines" },
      { value: "cn", label: "China" },
    ],

    languages: [
      { value: "en", label: "English" },
      { label: "French", value: "fr" },
      { label: "German", value: "de" },
      { label: "Spanish", value: "es" },
      { label: "Portuguese", value: "pt" },
      { label: "Russian", value: "ru" },
      { label: "Japanese", value: "ja" },
      { label: "Korean", value: "ko" },
      { label: "Chinese", value: "zh" },
    ],
    coreSkills: [
      // Technical/Hard Skills
      { label: "HTML", value: "html" },
      { label: "CSS", value: "css" },
      { label: "Bootstrap", value: "bootstrap" },
      { label: "Tailwind CSS", value: "tailwind-css" },
      { label: "JavaScript", value: "javascript" },
      { label: "Python", value: "python" },
      { label: "React", value: "react" },
      { label: "Node.js", value: "nodejs" },
      { label: "SQL", value: "sql" },
      { label: "Data Analysis", value: "data-analysis" },
      { label: "Project Management", value: "project-management" },
      { label: "DevOps", value: "devops" },
      { label: "UI/UX Design", value: "uiux-design" },
      { label: "Machine Learning", value: "machine-learning" },
      { label: "Cloud Computing", value: "cloud-computing" },
      { label: "Agile Methodologies", value: "agile" },
      { label: "Quality Assurance", value: "qa" },
      { label: "Digital Marketing", value: "digital-marketing" },
      { label: "Content Writing", value: "content-writing" },
    ],
  };

  const handlePreviewConfirm = (): void => {
    setShowPreview(false);
    setIsLoading(true);
    setTimeout(() => {
      navigate("/job-feed-hunter");
    }, 1500);
  };

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } =
    useFormik<FormData & { employmentType: string[] }>({
      initialValues: {
        firstName: "",
        lastName: "",
        birthday: "",
        emailAddress: "",
        mobileNumber: "",
        employmentType: [],
        salaryRange: "",
        yearsOfExperience: "",
        coreSkills: [],
        interpersonalSkills: [],
        education: "",
        languages: [],
        country: "",
        certifications: [],
      },
      validationSchema,
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
    <PreviewAppCard
    isOpen={showPreview}
    onClose={() => setShowPreview(false)}
    formData={values}
    onConfirm={handlePreviewConfirm}
  />
  {isLoading && <LoadingOverlay />}
    <div className="md:pt-10 md:flex md:flex-row md:gap-10">
      <div className="w-full md:w-[800px] min-h-[825px] bg-[#242625] md:bg-[#2D3A41] text-white mt-4 md:pt-6 md:mt-9">
        <div className="flex items-center relative w-full mb-8 md:mb-14">
          <NavLink to="/job-feed-employer" className="absolute left-0">
            <ChevronLeft strokeWidth={4} className="h-6 w-6 ml-4" />
          </NavLink>

          <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-orange-500">
            <span className="inline-flex items-center gap-2 justify-center">
              Edit Your Application Card
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 md:gap-x-[65px] gap-y-[24px]"
        >
          {/* Left Column */}
          <div className="space-y-[24px]">
            <FormField
              label="First Name"
              className="bg-transparent"
              error={errors.firstName}
              touched={touched.firstName}
            >
              <Input
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
              />
            </FormField>

            <FormField
              label="Birthday"
              error={errors.birthday}
              touched={touched.birthday}
            >
              <BirthdayInput
                name="birthday"
                value={values.birthday}
                onChange={(name, value) => setFieldValue(name, value)}
              />
            </FormField>

            <FormField
              label="Mobile Number"
              error={errors.mobileNumber}
              touched={touched.mobileNumber}
            >
              <PhoneInput
                name="mobileNumber"
                value={values.mobileNumber}
                onChange={handleChange}
                className="bg-transparent border-2 rounded-md border-[#AEADAD] h-[56px] focus-within:border-orange-500 transition-colors flex justify-between"
                defaultCountry="CA"
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
                  <SelectValue placeholder="Select Salary Range" className="" />
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
                  className="h-[99px] pt-1 px-1"
                  alternateColors={{
                    firstColor: "#168AAD",
                    secondColor: "#184E77",
                  }}
                  placeholder="Type and enter to add core skill"
                />
              </FormField>
            </div>

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
                tagClassName="bg-[#168AAD]"
                placeholder="Type and enter to add certificate"
              />
            </FormField>
          </div>

          {/* Right Column */}
          <div className="space-y-[24px]">
            <FormField
              label="Last Name"
              className="bg-transparent"
              error={errors.lastName}
              touched={touched.lastName}
            >
              <Input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
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
              label="Country of Residence"
              error={errors.country}
              touched={touched.country}
            >
              <Select
                name="country"
                value={values.country}
                onValueChange={(value) => setFieldValue("country", value)}
              >
                <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                  <SelectValue placeholder="Select your Country of Residence" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7] items-center p-0 [&>*]:p-0 border-none rounded-none">
                  {selectOptions.country.map(({ value, label }) => (
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
              label="Email Address"
              className="bg-transparent"
              error={errors.emailAddress}
              touched={touched.emailAddress}
            >
              <Input
                name="emailAddress"
                value={values.emailAddress}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
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

            <div className="mb-14">
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
          <div className="col-span-full flex justify-end md:mt-[60px] mb-0 ">
            <Button
              type="submit"
              className="hidden md:block md:w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E] text-[16px] h-8 py-0 rounded-sm font-normal px-8"
            >
              Save Your Profile
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full md:w-auto p-4 md:p-0">
        <AppCardPreview values={values} selectOptions={selectOptions} />
        <div className="flex justify-center mt-10 mb-8 md:hidden">
          <Button
          type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E] text-[16px] h-8 py-0 rounded-sm font-normal px-8"
          >
            Save Your Profile
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export { ApplicationForm };

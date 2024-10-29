import React from "react";
import { ChevronLeft, AlertTriangle, CircleAlert } from "lucide-react";
import { Input, TagInput, Button, Textarea, Label } from "components";
import { NavLink } from "react-router-dom";
import sparkeIcon from "images/sparkle-icon.png";

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

interface FormData {
  jobTitle: string;
  employmentType: string;
  salaryRange: string;
  yearsOfExperience: string;
  jobDescription: string;
  coreSkills: string;
  interpersonalSkills: string;
  education: string;
  location: string;
  languages: string;
}

{
  /*Floating Label*/
}
const FormField = React.forwardRef<
  HTMLDivElement,
  {
    label: string;
    children: React.ReactNode;
    className?: string;
    error?: string;
    touched?: boolean;
    showIcon?: boolean;
  }
>(({ label, children, className, error, touched, showIcon }, ref) => {
  const showError = touched && error;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="absolute -top-3 left-5 z-50 bg-[#2D3A41] px-2">
        <div className="flex items-center">
          <Label className="text-[16px] font-normal text-white">{label}</Label>
          {showIcon && (
            <CircleAlert
              className="text-[#2D3A41] relative -top-1 fill-gray-300 cursor-pointer"
              strokeWidth={1.5}
              size={14}
            />
          )}
        </div>
      </div>
      <div className="relative">
        {children}
        {showError && (
          <div className="absolute -right-7 top-1/2 -translate-y-1/2">
            <AlertTriangle className="text-[#2D3A41] fill-red-500" size={20} />
          </div>
        )}
      </div>
      {showError && (
        <div className="text-red-500 italic text-[13px] absolute">{error}</div>
      )}
    </div>
  );
});

FormField.displayName = "FormField";

const validationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("This field is required"),
  employmentType: Yup.string().required("This field is required"),
  salaryRange: Yup.string().required("This field is required"),
  yearsOfExperience: Yup.string().required("This field is required"),
  jobDescription: Yup.string().required("This field is required"),
  coreSkills: Yup.string().required("Atleast 3 Core skills"),
  interpersonalSkills: Yup.string().required("Atleast 3 Interpersonal skills"),
  education: Yup.string().required("This field is required"),
  location: Yup.string().required("This field is required"),
  languages: Yup.string().required("This field is required"),
});

const MatchCreation = () => {
  const selectOptions = {
    employmentType: [
      { value: "full-time", label: "Full-time" },
      { value: "part-time", label: "Part-time" },
      { value: "contract", label: "Contract" },
    ],
    salaryRange: [
      { value: "10-20k", label: "$10,000 - $20,000" },
      { value: "20-30k", label: "$20,000 - $30,000" },
      { value: "30-40k", label: "$30,000 - $40,000" },
      { value: "40-50k", label: "$40,000 - $50,000" },
      { value: "50k+", label: "$50,000+" },
      { value: "nego", label: "Negotiable" },
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
  } = useFormik<FormData>({
    initialValues: {
      jobTitle: "",
      employmentType: "",
      salaryRange: "",
      yearsOfExperience: "",
      jobDescription: "",
      coreSkills: "",
      interpersonalSkills: "",
      education: "",
      location: "",
      languages: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  return (
    <div className="flex-1 flex justify-center items-start px-4 mr-16">
      <div className="w-[927px] h-[825px] bg-[#2D3A41] text-white pt-4 pb-12 mt-14 ml-1">
        <div className="flex items-center relative w-full mb-8">
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
                className="bg-transparent border-gray-300 h-[56px]"
              />
            </FormField>

            <FormField
              label="Employment Type"
              error={errors.employmentType}
              touched={touched.employmentType}
            >
              <Select
                name="employmentType"
                value={values.employmentType}
                onValueChange={(value) =>
                  setFieldValue("employmentType", value)
                }
                onOpenChange={(open) => {
                  if (!open) {
                    setFieldTouched("employmentType", true);
                  }
                }}
              >
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select Employment Type" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7]">
                  {selectOptions.employmentType.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
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
                onOpenChange={(open) => {
                  if (!open) {
                    setFieldTouched("salaryRange", true);
                  }
                }}
              >
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select Salary Range" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7]">
                  {selectOptions.salaryRange.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
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
                <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                  <SelectValue placeholder="Select Years of Experience" />
                </SelectTrigger>
                <SelectContent className="bg-[#F5F5F7]">
                  {selectOptions.yearsOfExperience.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                      value={value}
                    >
                      {label}
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
                className="bg-transparent border-gray-300 min-h-[179px] pt-4 resize-none"
              />
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
              >
                <TagInput
                  value={values.coreSkills}
                  onChange={(value) => setFieldValue("coreSkills", value)}
                  onBlur={(value) => {
                    setFieldValue("coreSkills", value);
                    setFieldTouched("coreSkills", true);
                  }}
                  className="bg-transparent border-gray-300 h-[99px] pt-1 px-4"
                />
              </FormField>
            </div>

            <div className="mb-14">
              <FormField
                label="Interpersonal Skills"
                error={errors.interpersonalSkills}
                touched={touched.interpersonalSkills}
                showIcon={true}
              >
                <TagInput
                  value={values.interpersonalSkills}
                  onChange={(value) =>
                    setFieldValue("interpersonalSkills", value)
                  }
                  onBlur={(value) => {
                    setFieldValue("interpersonalSkills", value);
                    setFieldTouched("interpersonalSkills", true);
                  }}
                  className="bg-transparent border-gray-300 h-[99px] pt-1 px-4"
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
                  <SelectTrigger className="bg-transparent border-gray-300 h-[56px]">
                    <SelectValue placeholder="Select your Education Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] items-center">
                    {selectOptions.education.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className="focus:text-orange-500 border-b border-black last:border-b-0 rounded-none justify-center px-0 py-3"
                        value={value}
                      >
                        {label}
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
                  className="bg-transparent border-gray-300 h-[56px]"
                />
              </FormField>
              <FormField
                label="Languages"
                error={errors.languages}
                touched={touched.languages}
                showIcon={true}
              >
                <TagInput
                  value={values.languages}
                  onChange={(value) => setFieldValue("languages", value)}
                  onBlur={(value) => {
                    setFieldValue("languages", value);
                    setFieldTouched("languages", true);
                  }}
                  className="bg-transparent border-gray-300 h-[56px] pt-1 px-4"
                  tagClassName="bg-orange-500"
                />
              </FormField>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="col-span-full flex justify-end gap-4 -mt-4">
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
    </div>
  );
};

export { MatchCreation };

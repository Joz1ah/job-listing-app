import React, { FC, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Input, Button, InputField } from "components";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import saveChanges from "images/save-changes.svg?url";

import { selectOptions } from "mockData/app-form-options";

import { AppCardPreview } from "features/employer";

import {
  LanguageTagInput,
  BirthdayInput,
  PhoneInput,
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
import { useFormik } from "formik";
import * as Yup from "yup";

import { isValidPhoneNumber } from "react-phone-number-input";

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

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  birthday: Yup.string()
    .matches(
      /^(January|February|March|April|May|June|July|August|September|October|November|December)\s(3[01]|[12][0-9]|[1-9])$/,
      "Day is required",
    )
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

const EditApplicationCard: FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

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
      firstName: "Nadine",
      lastName: "Lustre",
      birthday: "",
      emailAddress: "nadine@gmail.com",
      mobileNumber: "+63888888888",
      employmentType: [],
      salaryRange: "",
      yearsOfExperience: "",
      coreSkills: ["React", "JavaScript", "CSS", "HTML", "Git"],
      interpersonalSkills: [
        "Leadership",
        "Team Collaboration",
        "Problem Solving",
      ],
      education: "",
      languages: ["English"],
      country: "",
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
      <ApplicationFormPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={values}
        onConfirm={() => {
          setShowPreview(false);
          setIsSubmitting(true);
          // Your existing submission logic here
          setTimeout(() => {
            navigate("/job-hunter/feed");
          }, 1500);
        }}
      />
      {isSubmitting && <LoadingOverlay />}
      
      <div className="flex flex-col xl:flex-row gap-8 pt-6">
        <div className="w-full md:w-[800px] min-h-[960px] bg-[#242625] md:bg-[#2D3A41] text-white">
          <div className="flex items-center relative w-full mb-6 md:mb-10">
            <NavLink to="/job-hunter/feed" className="absolute left-4 top-6">
              <ChevronLeft strokeWidth={4} className="h-6 w-6 ml-4" />
            </NavLink>

            <h1 className="flex-1 text-center text-xl md:text-[32px] pt-6 font-normal text-[#F5722E]">
              <span className="inline-flex items-center gap-2 justify-center">
                Edit Your Application Card
              </span>
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="grid grid-cols-1 md:grid-cols-2 p-4 md:p-8 md:gap-x-[65px] gap-y-6"
          >
            {/* Left Column */}
            <div className="space-y-[24px]">
              <InputField
                label="First Name"
                className="bg-transparent"
                error={errors.firstName}
                touched={touched.firstName}
              >
                <Input
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

              <InputField
                label="Birthday"
                error={errors.birthday}
                touched={touched.birthday}
              >
                <BirthdayInput
                  name="birthday"
                  value={values.birthday}
                  onChange={(name, value) => setFieldValue(name, value)}
                />
              </InputField>

              <InputField
                label="Mobile Number"
                error={errors.mobileNumber}
                touched={touched.mobileNumber}
              >
                <PhoneInput
                  name="mobileNumber"
                  value={values.mobileNumber}
                  onChange={handleChange}
                  className="bg-transparent border-2 rounded-md border-[#AEADAD] h-[56px] focus-within:border-[#F5722E] transition-colors flex justify-between"
                  defaultCountry="CA"
                />
              </InputField>

              <InputField
                label="Education"
                error={errors.education}
                touched={touched.education}
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
                label="Salary Range"
                error={errors.salaryRange}
                touched={touched.salaryRange}
              >
                <Select
                  name="salaryRange"
                  value={values.salaryRange}
                  onValueChange={(value) => setFieldValue("salaryRange", value)}
                >
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
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

              <div className="mb-8 md:mb-14">
                <InputField
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
                </InputField>
              </div>

              <InputField
                label="Certificates"
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
              </InputField>
            </div>

            {/* Right Column */}
            <div className="space-y-[24px]">
              <InputField
                label="Last Name"
                className="bg-transparent"
                error={errors.lastName}
                touched={touched.lastName}
              >
                <Input
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

              <InputField
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
                  tagClassName="bg-[#F5722E]"
                  placeholder="Type and enter to add language"
                />
              </InputField>

              <InputField
                label="Country of Residence"
                error={errors.country}
                touched={touched.country}
              >
                <Select
                  name="country"
                  value={values.country}
                  onValueChange={(value) => setFieldValue("country", value)}
                >
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E]">
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
              </InputField>

              <InputField
                label="Email Address"
                className="bg-transparent"
                error={errors.emailAddress}
                touched={touched.emailAddress}
              >
                <Input
                  name="emailAddress"
                  value={values.emailAddress}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

              <InputField
                label="Employment Type"
                error={errors.employmentType}
                touched={touched.employmentType}
                showIcon={true}
                tooltipContent="You may select one up to three employment types that you are looking for"
              >
                <MultiSelect
                  value={values.employmentType}
                  onChange={(value) => setFieldValue("employmentType", value)}
                  options={selectOptions.employmentType}
                />
              </InputField>

              <InputField
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
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] ">
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
              </InputField>

              <div className="mb-14">
                <InputField
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
                </InputField>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="col-span-full flex justify-center md:justify-end md:mt-[60px] mb-0 ">
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

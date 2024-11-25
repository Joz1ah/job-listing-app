import React, { FC } from "react";
import { ChevronLeft, AlertTriangle, CircleAlert } from "lucide-react";
import { Input, Button, Label, Textarea } from "components";
import { NavLink } from "react-router-dom";

import employerProfileCard from "images/EmployerProfileCard.svg?url";

import { PhoneInput } from "components";

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
  businessName: string;
  firstName: string;
  lastName: string;
  position: string;
  industry: string;
  emailAddress: string;
  mobileNumber: string;
  companyWebsite: string;
  yearFounded: number;
  unitAndBldg: string;
  buildingName: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
  companyOverview: string;
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

const FormField: FC<FormFieldProps> = React.forwardRef<
  HTMLDivElement,
  FormFieldProps
>(
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
  businessName: Yup.string().required("This field is required"),
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  position: Yup.string().required("This field is required"),
  industry: Yup.string().required("This field is required"),
  companyWebsite: Yup.string().required("This field is required"),
  yearFounded: Yup.number()
    .required("This field is required")
    .typeError("Please enter a valid number")
    .integer("Year must be a whole number")
    .min(1800, "Year must be after 1800")
    .max(new Date().getFullYear(), "Year cannot be in the future"),
  emailAddress: Yup.string()
    .required("This field is required")
    .email("Invalid email address"),
  mobileNumber: Yup.string()
    .required("This field is required")
    .test("phone", "Please enter a valid phone number", function (value) {
      return value ? isValidPhoneNumber(value) : false;
    }),
  unitAndBldg: Yup.string(),
  streetAddress: Yup.string().required("Street address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string().required("Postal code is required"),
  country: Yup.string().required("Country is required"),
  companyOverview: Yup.string().required("This field is required"),
});

const EmployerProfile: FC = () => {
  const selectOptions = {
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
  };

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit } =
    useFormik<FormData & { employmentType: string[] }>({
      initialValues: {
        businessName: "",
        firstName: "",
        lastName: "",
        position: "",
        industry: "",
        emailAddress: "",
        yearFounded: 2000,
        mobileNumber: "",
        companyWebsite: "",
        employmentType: [],
        unitAndBldg: "",
        buildingName: "",
        streetAddress: "",
        city: "",
        state: "",
        postalCode: 0,
        country: "",
        companyOverview: "",
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
    <div className="md:pt-10 md:flex md:flex-row md:gap-10 mb-10">
      <div className="w-full md:w-[800px] min-h-[825px] bg-[#242625] md:bg-[#2D3A41] text-white md:pt-6">
        <div className="flex items-center relative w-full mb-8 md:mb-14">
          <NavLink to="/job-feed-employer" className="absolute left-0">
            <ChevronLeft strokeWidth={4} className="h-6 w-6 ml-4" />
          </NavLink>

          <h1 className="flex-1 text-center text-xl md:text-[32px] font-normal text-orange-500">
            <span className="inline-flex items-center gap-2 justify-center">
              Edit Your Company Profile
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="space-y-6 p-8"
        >
          <FormField
            label="Legal Business Name"
            className="bg-transparent"
            error={errors.businessName}
            touched={touched.businessName}
            showIcon={true}
            tooltipContent="Please enter your company’s complete legal business name
                            e.g. “ Imagination Ventures LLC”"
          >
            <Input
              name="bussinessName"
              value={values.businessName}
              onChange={handleChange}
              className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
            />
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-[65px]">
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
                label="Position of the Representative"
                className="bg-transparent"
                error={errors.position}
                touched={touched.position}
              >
                <Input
                  name="position"
                  value={values.position}
                  onChange={handleChange}
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
                />
              </FormField>

              <FormField
                label="Industry"
                className="bg-transparent"
                error={errors.industry}
                touched={touched.industry}
              >
                <Input
                  name="industry"
                  value={values.industry}
                  onChange={handleChange}
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
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
                label="Company Website"
                className="bg-transparent"
                error={errors.companyWebsite}
                touched={touched.companyWebsite}
              >
                <Input
                  name="companyWebsite"
                  value={values.companyWebsite}
                  onChange={handleChange}
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
                />
              </FormField>

              <FormField
                label="Year Founded"
                className="bg-transparent"
                error={errors.yearFounded}
                touched={touched.yearFounded}
              >
                <Input
                  name="yearFounded"
                  value={values.yearFounded}
                  onChange={handleChange}
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
                />
              </FormField>
            </div>
          </div>

          <h2 className="text-white text-lg mb-4 flex">
            Complete Company Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-[65px]">
            <FormField
              label="Unit No./Building"
              error={errors.unitAndBldg}
              touched={touched.unitAndBldg}
            >
              <Input
                name="unitAndBldg"
                value={values.unitAndBldg}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
              />
            </FormField>

            <FormField
              label="Street Address"
              error={errors.streetAddress}
              touched={touched.streetAddress}
            >
              <Input
                name="streetAddress"
                value={values.streetAddress}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
              />
            </FormField>

            <FormField label="City" error={errors.city} touched={touched.city}>
              <Input
                name="city"
                value={values.city}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
              />
            </FormField>

            <FormField
              label="State/Province/Region"
              error={errors.state}
              touched={touched.state}
            >
              <Input
                name="state"
                value={values.state}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
              />
            </FormField>

            {/* Empty column on the left */}
            <div className="md:col-span-1"></div>

            {/* Country field on the right */}
            <div className="md:col-span-1">
              <FormField
                label="Country"
                error={errors.country}
                touched={touched.country}
              >
                <Select
                  name="country"
                  value={values.country}
                  onValueChange={(value) => setFieldValue("country", value)}
                >
                  <SelectTrigger className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F5F7] items-center p-0 [&>*]:p-0 border-none rounded-none">
                    {selectOptions.country.map(({ value, label }) => (
                      <SelectItem
                        key={value}
                        className={cn(
                          "rounded-none justify-start pl-3 h-[55px] transition-all duration-500 ease-in-out",
                        )}
                        value={value}
                      >
                        <div className="py-3 w-full text-center">{label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </div>

          <FormField
            label="Job Description"
            error={errors.companyOverview}
            touched={touched.companyOverview}
            className="relative "
          >
            <Textarea
              name="companyOverview"
              value={values.companyOverview}
              onChange={handleChange}
              className="bg-transparent border-[#AEADAD] h-[90px] pt-4 resize-none border-2 focus-within:border-orange-500 placeholder:text-white"
              placeholder="Please provide a job description"
            />
            {/* <span className="flex right-0 italic text-[11px] absolute">
              Maximum of 500 words
            </span> */}
          </FormField>

          {/* Footer Buttons */}
          <div className="col-span-full flex justify-end pt-[60px] mb-0">
            <Button
              type="submit"
              className="w-full md:w-auto bg-[#AEADAD] text-white hover:bg-[#F5722E] text-[16px] h-8 rounded-sm mr-2 mb-2 font-normal px-8"
            >
              Save Your Profile
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full md:w-auto">
        <img src={employerProfileCard} alt="Employer Profile" />
      </div>
    </div>
  );
};

export { EmployerProfile };

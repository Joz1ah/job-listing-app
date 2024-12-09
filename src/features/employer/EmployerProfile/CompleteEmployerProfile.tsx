import React, { FC, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Input, Button, Textarea, InputField } from "components";

import employerProfileCard from "images/EmployerProfileCard.svg?url";
import saveChanges from "images/save-changes.svg?url";

import { NavLink, useNavigate } from "react-router-dom";

import { PhoneInput } from "components";

import { selectOptions } from "mockData/employer-profile-options";

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
  country: Yup.string()
    .required("Country is required")
    .test("validCountry", "Please select a valid country", function(value) {
      return selectOptions.country.some(option => option.value === value);
    }),
  companyOverview: Yup.string().required("This field is required"),
});

// Loading Overlay Component
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="flex flex-col items-center">
      <img src={saveChanges} alt="Loading" />
    </div>
  </div>
);

const CompleteEmployerProfile: FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, setFieldValue, handleSubmit, isValid } =
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
      validateOnMount:true,
      onSubmit: async (values) => {
        setIsSubmitting(true);
        try {
          // Simulate API call with setTimeout
          await new Promise(resolve => setTimeout(resolve, 2000));
          console.log(values);
          // After successful submission, navigate to job feed
          navigate('/employer/feed');
        } catch (error) {
          console.error('Error submitting form:', error);
          setIsSubmitting(false);
        }
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
    {isSubmitting && <LoadingOverlay />}
    
    <div className="flex flex-col xl:flex-row gap-8 px-4 md:px-8 lg:px-12 py-6">
      <div className="w-full xl:w-[800px] min-h-[825px] bg-[#242625] md:bg-[#2D3A41] text-white">
        <div className="flex items-center relative w-full mb-6 md:mb-10">
          <NavLink to="/employer/feed" className="absolute left-4 top-6">
            <ChevronLeft strokeWidth={4} className="h-6 w-6" />
          </NavLink>

          <h1 className="flex-1 text-center text-xl md:text-[32px] pt-6 font-normal text-orange-500">
            <span className="inline-flex items-center gap-2 justify-center">
              Complete Your Company Profile
            </span>
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          className="space-y-6 p-4 md:p-8"
        >
          <InputField
            label="Legal Business Name"
            className="bg-transparent"
            error={errors.businessName}
            touched={touched.businessName}
            showIcon={true}
            tooltipContent="Please enter your company’s complete legal business name e.g. “ Imagination Ventures LLC”"
          >
            <Input
              name="businessName"
              value={values.businessName}
              onChange={handleChange}
              className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
            />
          </InputField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-[65px]">
            {/* Left Column */}
            <div className="space-y-6">
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
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
                />
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
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
                />
              </InputField>

              <InputField
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
              </InputField>

              <InputField
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
              </InputField>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
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
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
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
                  className="bg-transparent border-2 rounded-md border-[#AEADAD] h-[56px] focus-within:border-orange-500 transition-colors flex justify-between"
                  defaultCountry="CA"
                />
              </InputField>

              <InputField
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
              </InputField>

              <InputField
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
              </InputField>
            </div>
          </div>

          <h2 className="text-white text-lg mb-4 flex justify-center">
            Complete Company Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-[65px]">
            <InputField
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
            </InputField>

            <InputField
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
            </InputField>

            <InputField label="City" error={errors.city} touched={touched.city}>
              <Input
                name="city"
                value={values.city}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-orange-500 placeholder:text-white"
              />
            </InputField>

            <InputField
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
            </InputField>

            {/* Empty column on the left */}
            <div className="md:col-span-1"></div>

            {/* Country field on the right */}
            <div className="md:col-start-2">
              <InputField
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
              </InputField>
            </div>
          </div>

          <InputField
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
          </InputField>

          {/* Footer Buttons */}
          <div className="flex justify-center md:justify-end pt-8 md:pt-12">
            <Button
              type="submit"
              className={cn(
                "block md:w-auto text-white text-[16px] h-8 py-0 rounded-sm font-normal px-8",
                isValid && !isSubmitting
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-[#AEADAD] hover:bg-[#AEADAD]"
              )}
            >
              Save and Preview
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full xl:w-auto flex xl:block justify-center">
        <img src={employerProfileCard} alt="Employer Profile" />
      </div>
    </div>
    </>
  );
};

export { CompleteEmployerProfile };

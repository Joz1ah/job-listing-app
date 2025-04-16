import React, { FC, useState } from "react";
import {
  Input,
  Button,
  Textarea,
  InputField,
  IndustrySearch,
} from "components";

import saveChanges from "images/save-changes.svg?url";

import { useNavigate } from "react-router-dom";

import { PhoneInput } from "components";

import { EmployerProfilePreview } from "./EmployerProfilePreview";

import { CountrySelect } from "components";

import { cn } from "lib/utils";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useEmployerProfileMutation } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

export interface FormData {
  businessName: string;
  firstName: string;
  lastName: string;
  position: string;
  industryId: string;
  industryName: string;
  emailAddress: string;
  mobileNumber: string;
  companyWebsite: string;
  yearFounded: string;
  unitAndBldg: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  companyOverview: string;
  employmentType: string[];
}

const validationSchema = Yup.object().shape({
  businessName: Yup.string().required("This field is required"),
  firstName: Yup.string().required("This field is required"),
  lastName: Yup.string().required("This field is required"),
  position: Yup.string().required("This field is required"),
  industryId: Yup.string().required("This field is required"),
  companyWebsite: Yup.string()
    .trim()
    .required("This field is required")
    .matches(/^(?:https?:\/\/)(.+)/i, {
      message:
        'URL must start with "http://" or "https://"',
      excludeEmptyString: true,
    })
    .test({
      name: "protocol-check",
      message: "Website URL must be valid with content after protocol",
      test: (value) => {
        if (!value?.trim()) return true; // Skip validation for empty or whitespace-only strings
        const lowerValue = value.toLowerCase();
        return (
          (lowerValue.startsWith("http://") && lowerValue.length > 7) ||
          (lowerValue.startsWith("https://") && lowerValue.length > 8)
        );
      },
    }),
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
    .test(
      "phone",
      "Please enter a valid international phone number",
      function (value) {
        if (!value) return false;

        // Remove all non-digit characters except plus sign at start
        const cleaned = value.replace(/(?!^\+)\D/g, "");

        // Check if it starts with a plus sign
        const hasPlus = value.startsWith("+");

        // Get only digits
        const digitsOnly = cleaned.replace(/\+/g, "");

        if (!hasPlus) return false;
        if (digitsOnly.length < 10 || digitsOnly.length > 15) return false;

        // Basic country code validation (1-4 digits after +)
        const countryCode = digitsOnly.slice(0, 4);
        if (!/^\d{1,4}$/.test(countryCode)) return false;

        return true;
      },
    ),
  unitAndBldg: Yup.string().required("This field is required"),
  streetAddress: Yup.string().required("This field is required"),
  city: Yup.string().required("This field is required"),
  state: Yup.string().required("This field is required"),
  country: Yup.string().required("This field is required"),
  companyOverview: Yup.string()
    .required("This field is required")
    .test(
      "maxWords",
      "Must not exceed 500 words",
      (value) => value?.split(/\s+/).filter(Boolean).length <= 500,
    ),
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
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employerProfile] = useEmployerProfileMutation();
  const navigate = useNavigate();
  const { refreshUser, user } = useAuth();
  const { showError } = useErrorModal();

  const {
    values,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
    isValid,
  } = useFormik<FormData>({
    initialValues: {
      businessName: user?.data?.user?.relatedDetails?.businessName || "",
      firstName: user?.data?.user?.relatedDetails?.firstName || "",
      lastName: user?.data?.user?.relatedDetails?.lastName || "",
      position: user?.data?.user?.relatedDetails?.position || "",
      industryId: "",
      industryName: "",
      emailAddress: user?.data?.user?.email || "",
      yearFounded: "",
      mobileNumber: "",
      companyWebsite: user?.data?.user?.relatedDetails?.website || "",
      unitAndBldg: "",
      streetAddress: user?.data?.user?.relatedDetails?.address || "",
      city: "",
      state: "",
      country: "",
      companyOverview: "",
      employmentType: [],
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: () => {
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

  // Add this function to handle the final submission
  const handleProfileSubmission = async () => {
    setShowPreview(false);
    setIsSubmitting(true);

    try {
      // Remove '+' and any non-digit characters for the API
      const formattedPhoneNumber = values.mobileNumber.replace(/[^\d]/g, "");

      const profileData = {
        businessName: values.businessName,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.emailAddress,
        phoneNumber: formattedPhoneNumber,
        position: values.position,
        website: values.companyWebsite,
        industryId: parseInt(values.industryId, 10),
        yearFounded: values.yearFounded,
        unit: values.unitAndBldg,
        address: values.streetAddress,
        city: values.city,
        state: values.state,
        country: values.country,
        description: values.companyOverview,
      };

      console.log("Profile Data being sent:", profileData);
      // Call the API
      await employerProfile(profileData).unwrap();

      // Refresh user data in auth context
      await refreshUser();

      // Navigate on success
      navigate(ROUTE_CONSTANTS.JOB_LISTING);
    } catch (error) {
      showError(
        "Profile Update Failed",
        "Unable to update your company profile. Please try again or contact support if the issue persists.",
      );
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <EmployerProfilePreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={values}
        onConfirm={handleProfileSubmission}
      />
      {isSubmitting && <LoadingOverlay />}

      <div className="flex gap-8 px-4 md:px-8 lg:px-12 py-6 justify-center">
        <div className="w-full md:w-[800px] min-h-[825px] bg-[#2D3A41] text-white">
          <div className="flex items-center relative w-full mb-6 md:mb-10">
            <h1 className="flex-1 text-center text-xl md:text-[32px] md:pt-6 font-normal text-[#F5722E]">
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
            {/* Business Name - Full Width */}
            <InputField
              label="Legal Business Name"
              className="bg-transparent"
              error={errors.businessName}
              touched={touched.businessName}
              showIcon={true}
              tooltipContent="Please enter your company's complete legal business name e.g. "
              variant="primary"
            >
              <Input
                name="businessName"
                value={values.businessName}
                onChange={handleChange}
                placeholder="Legal Business Name"
                className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
              />
            </InputField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-[65px]">
              {/* Personal Information */}
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
                  placeholder="Representative's First Name"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

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
                  placeholder="Representative's Last Name"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

              <InputField
                label="Email Address"
                className="bg-transparent"
                error={errors.emailAddress}
                touched={touched.emailAddress}
                variant="primary"
              >
                <Input
                  name="emailAddress"
                  value={values.emailAddress}
                  onChange={handleChange}
                  placeholder="Email Address"
                  disabled={!!user?.data?.user?.email}
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </InputField>

              <InputField
                label="Mobile Number"
                error={errors.mobileNumber}
                touched={touched.mobileNumber}
                variant="primary"
              >
                <PhoneInput
                  name="mobileNumber"
                  value={values.mobileNumber}
                  onChange={handleChange}
                  className="bg-transparent border-2 rounded-[10px] border-[#AEADAD] h-[56px] focus-within:border-[#F5722E] transition-colors flex justify-between"
                  defaultCountry="CA"
                />
              </InputField>

              <InputField
                label="Position of the Representative"
                className="bg-transparent"
                error={errors.position}
                touched={touched.position}
                variant="primary"
              >
                <Input
                  name="position"
                  value={values.position}
                  onChange={handleChange}
                  placeholder="e.g. Recruitement Supervisor"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

              <InputField
                label="Company Website"
                className="bg-transparent"
                error={errors.companyWebsite}
                touched={touched.companyWebsite}
                variant="primary"
              >
                <Input
                  name="companyWebsite"
                  value={values.companyWebsite}
                  onChange={handleChange}
                  placeholder="Company Website"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>

              <InputField
                label="Industry"
                className="bg-transparent"
                error={errors.industryId}
                touched={touched.industryId}
                variant="primary"
              >
                <IndustrySearch
                  onValueChange={(id, name) => {
                    setFieldValue("industryId", id);
                    setFieldValue("industryName", name);
                  }}
                />
              </InputField>

              <InputField
                label="Year Founded"
                className="bg-transparent"
                error={errors.yearFounded}
                touched={touched.yearFounded}
                variant="primary"
              >
                <Input
                  name="yearFounded"
                  value={values.yearFounded}
                  onChange={handleChange}
                  placeholder="Year Founded"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>
            </div>

            {/* Company Address Section */}
            <h2 className="text-white text-[16px] md:text-lg mb-4 pt-10 md:pt-4 flex justify-center">
              Complete Company Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-[65px]">
              <InputField
                label="Unit No./Building"
                error={errors.unitAndBldg}
                touched={touched.unitAndBldg}
                variant="primary"
              >
                <Input
                  name="unitAndBldg"
                  value={values.unitAndBldg}
                  onChange={handleChange}
                  placeholder="Unit No./Building"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>
              <InputField
                label="Street Address"
                error={errors.streetAddress}
                touched={touched.streetAddress}
                variant="primary"
              >
                <Input
                  name="streetAddress"
                  value={values.streetAddress}
                  onChange={handleChange}
                  placeholder="Street Address"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>
              <InputField
                label="City"
                error={errors.city}
                touched={touched.city}
                variant="primary"
              >
                <Input
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>
              <InputField
                label="State/Province/Region"
                error={errors.state}
                touched={touched.state}
                variant="primary"
              >
                <Input
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  placeholder="State/Province/Region"
                  className="bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                />
              </InputField>
              <div className="hidden md:block"></div>{" "}
              {/* Empty placeholder for grid alignment */}
              <InputField
                label="Country"
                error={errors.country}
                touched={touched.country}
                variant="primary"
              >
                <CountrySelect
                  value={values.country || ""}
                  onChange={(value) => setFieldValue("country", value)}
                  className="bg-transparent border-[#AEADAD] h-[56px] hover:text-white border-2 focus:border-[#F5722E] w-full rounded-[8px] text-white placeholder:text-[#AEADAD] px-3 py-2"
                  popoverClassName="w-[335px]"
                />
              </InputField>
            </div>

            <InputField
              label="Company Overview"
              error={errors.companyOverview}
              touched={touched.companyOverview}
              className="relative"
              variant="primary"
            >
              <Textarea
                name="companyOverview"
                value={values.companyOverview}
                onChange={handleChange}
                className="bg-transparent border-[#AEADAD] h-[236px] md:h-[90px] pt-4 resize-none border-2 focus-within:border-[#F5722E] placeholder:text-[#AEADAD]"
                placeholder="Please provide a company overview"
              />
              <span className="flex left-0 italic text-[11px] absolute">
                Maximum of 500 words
              </span>
            </InputField>

            {/* Footer Buttons */}
            <div className="flex justify-center md:justify-end pt-8 md:pt-12">
              <Button
                type="submit"
                className={cn(
                  "block md:w-auto text-white text-[16px] h-8 py-0 rounded-sm font-normal px-8",
                  isValid && !isSubmitting
                    ? "bg-[#F5722E] hover:bg-orange-600"
                    : "bg-[#AEADAD] hover:bg-[#AEADAD]",
                )}
              >
                Save and Preview
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export { CompleteEmployerProfile };

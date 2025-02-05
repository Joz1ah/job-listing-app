import {
  useEmployerContactMutation,
  useLoginMutation,
} from "api/akaza/akazaAPI";
import { useState } from "react";
import * as Yup from "yup";
import { useLanding } from "../useLanding";
import { useModal } from "components/modal/useModal";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";

// Define the type for form data
type FormData = {
  firstName: string;
  lastName: string;
  position: string;
  businessName: string;
  address: string;
  website: string;
};

const employerInfoSchema = Yup.object().shape({
  firstName: Yup.string().trim().required("This field is required"),

  lastName: Yup.string().trim().required("This field is required"),

  position: Yup.string().trim().required("This field is required"),

  businessName: Yup.string().trim().required("This field is required"),

  address: Yup.string().trim().required("This field is required"),

  website: Yup.string()
    .required("This field is required")
    .matches(
      /^https?:\/\/.+$/i,
      'Website URL must start with "http://" or "https://"',
    ),
});

const EmployerAdditionalInformation = () => {
  const { handleSetSelectedModalHeader } = useModal();
  const { tempLoginEmail, tempLoginPassword, handleSetModalState, modalState } =
    useLanding();
  const [employerContactSubmit] = useEmployerContactMutation();
  const [loginSubmit] = useLoginMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    position: "",
    businessName: "",
    address: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    firstName: "",
    lastName: "",
    position: "",
    businessName: "",
    address: "",
    website: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate individual field
    try {
      const fieldSchema = Yup.object().shape({
        [name]: employerInfoSchema.fields[name as keyof FormData],
      });
      fieldSchema.validateSync({ [name]: value }, { abortEarly: true });
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors((prev) => ({
          ...prev,
          [name]: err.message,
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    try {
      employerInfoSchema.validateSync(formData, { abortEarly: false });
      setErrors({
        firstName: "",
        lastName: "",
        position: "",
        businessName: "",
        address: "",
        website: "",
      });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errorObj = err.inner.reduce(
          (acc, curr) => {
            if (curr.path) {
              acc[curr.path as keyof FormData] = curr.message;
            }
            return acc;
          },
          {} as Record<keyof FormData, string>,
        );
        setErrors(errorObj);
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        setIsSubmitting(true);

        // First ensure we have a valid auth token
        if (tempLoginEmail && tempLoginPassword) {
          try {
            const { data } = await loginSubmit({
              email: tempLoginEmail,
              password: tempLoginPassword,
            }).unwrap();

            // Check if we have a valid token
            if (!data?.token) {
              throw new Error("No token received from login");
            }

            // Wait a bit for the auth token to be set in cookies
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Now submit the employer contact info
            const response = await employerContactSubmit({
              firstName: formData.firstName,
              lastName: formData.lastName,
              position: formData.position,
              businessName: formData.businessName,
              address: formData.address,
              website: formData.website.startsWith("http")
                ? formData.website
                : `https://${formData.website}`,
            }).unwrap();

            console.log("Employer contact submission successful:", response);

            // Continue to next step
            handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
            handleSetModalState(MODAL_STATES.SIGNUP_STEP5);
          } catch (loginErr) {
            console.error("Error during login:", loginErr);
            alert(
              "There was an issue with your session. Please try refreshing the page.",
            );
          }
        } else {
          console.error("Missing login credentials");
          alert(
            "There was an issue with your registration. Please try refreshing the page.",
          );
        }

        // Continue to next step
        handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_CLOSE);
        handleSetModalState(MODAL_STATES.SIGNUP_STEP5);
      } catch (err: any) {
        console.error("Error submitting employer contact:", err);

        // Log detailed error information
        console.log("Error details:", {
          status: err.status,
          data: err.data,
          message: err.message,
          stack: err.stack,
        });

        if (err.status === 409) {
          alert(
            "This employer information has already been registered. Please try again with different information.",
          );
        } else if (err.status === 400) {
          // Handle validation errors from the API
          const errorMessages = err.data?.errors || {};
          setErrors((prev) => ({
            ...prev,
            ...Object.keys(errorMessages).reduce((acc: any, key) => {
              acc[key as keyof FormData] = errorMessages[key][0];
              return acc;
            }, {}),
          }));
        } else if (err.status === 401) {
          alert("Your session has expired. Please log in again.");
          // Optionally redirect to login
        } else {
          // Handle other types of errors
          alert(
            "An error occurred while saving your information. Please try again.",
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    handleSetModalState(MODAL_STATES.SIGNUP_STEP3);
  };

  return modalState && modalState == MODAL_STATES.SIGNUP_STEP4_EMPLOYER ? (
    <div
      id="step4_signup"
      className="flex flex-col items-center justify-center w-full h-full p-4"
    >
      <div className="flex flex-col gap-6 w-full max-w-md">
        <div className="text-center text-[#263238] mb-4 text-[18px]">
          Additional Information
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative w-full">
              <input
                type="text"
                name="firstName"
                placeholder="First Name *"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2"
              />
              {errors.firstName && (
                <div className="absolute text-red-500 text-xs mt-1">
                  {errors.firstName}
                </div>
              )}
            </div>
            <div className="relative w-full">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name *"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2"
              />
              {errors.lastName && (
                <div className="absolute text-red-500 text-xs mt-1">
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              name="position"
              placeholder="Position of the Representative *"
              value={formData.position}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2"
            />
            {errors.position && (
              <div className="absolute text-red-500 text-xs mt-1">
                {errors.position}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="businessName"
              placeholder="Legal Business Name *"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2"
            />
            {errors.businessName && (
              <div className="absolute text-red-500 text-xs mt-1">
                {errors.businessName}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="address"
              placeholder="Company Address *"
              value={formData.address}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2"
            />
            {errors.address && (
              <div className="absolute text-red-500 text-xs mt-1">
                {errors.address}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type="text"
              name="website"
              placeholder="Company Website *"
              value={formData.website}
              onChange={handleChange}
              className="w-full border-b-2 border-gray-300 focus:border-orange-500 outline-none py-2"
            />
            {errors.website && (
              <div className="absolute text-red-500 text-xs mt-1">
                {errors.website}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 mt-6">
          <button
            type="button"
            onClick={handlePrevious}
            className="px-4 py-2 border-2 border-[#F5722E] bg-white text-[#F5722E] rounded-md hover:bg-[#F5722E] hover:text-white"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center justify-between px-4 py-2 border-2 border-[#F5722E] bg-[#F5722E] text-white rounded-md hover:bg-white hover:text-[#F5722E]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className="w-4 h-4 mr-2"
                />
                Next
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default EmployerAdditionalInformation;

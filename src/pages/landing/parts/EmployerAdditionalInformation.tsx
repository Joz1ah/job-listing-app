import {
  useEmployerContactMutation,
  useLoginMutation,
} from "api/akaza/akazaAPI";
import { useState } from "react";
import styles from "./../landing.module.scss";
import * as Yup from "yup";
import { useLanding } from "../useLanding";
import { useModal } from "components/modal/useModal";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";

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
      /^https?:\/\/.+/,
      'Website URL must start with "http://" or "https://"',
    ),
});

const EmployerAdditionalInformation = () => {
  const { handleSetSelectedModalHeader } = useModal();
  const {
    tempLoginEmail,
    tempLoginPassword,
    setModalState,
    modalStates,
    modalState,
  } = useLanding();
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
            handleSetSelectedModalHeader(2);
            setModalState(modalStates.SIGNUP_STEP5);
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
        handleSetSelectedModalHeader(2);
        setModalState(modalStates.SIGNUP_STEP5);
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
    setModalState(modalStates.SIGNUP_STEP3);
  };

  return (
    <div
      id="step4_signup"
      className={`${styles["modal-content"]}`}
      hidden={modalState !== modalStates.SIGNUP_STEP4_EMPLOYER}
    >
      <div className={`${styles["employer-additional-information-container"]}`}>
        <div className={`${styles["title-desc"]}`}>Additional Information</div>
        <div className={`${styles["form-field"]}`}>
          <div className={`${styles["name-field-wrapper"]}`}>
            <div className={`${styles["input-fields-container"]}`}>
              <div className={`${styles["input-container"]}`}>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name *"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <div className={`${styles["error-label"]}`}>
                    {errors.firstName}
                  </div>
                )}
              </div>
            </div>
            <div className={`${styles["input-fields-container"]}`}>
              <div className={`${styles["input-container"]}`}>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name *"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <div className={`${styles["error-label"]}`}>
                    {errors.lastName}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`${styles["input-fields-container"]}`}>
            <div className={`${styles["input-container"]}`}>
              <input
                type="text"
                name="position"
                placeholder="Position of the Representative *"
                value={formData.position}
                onChange={handleChange}
              />
              {errors.position && (
                <div className={`${styles["error-label"]}`}>
                  {errors.position}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles["input-fields-container"]}`}>
            <div className={`${styles["input-container"]}`}>
              <input
                type="text"
                name="businessName"
                placeholder="Legal Business Name *"
                value={formData.businessName}
                onChange={handleChange}
              />
              {errors.businessName && (
                <div className={`${styles["error-label"]}`}>
                  {errors.businessName}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles["input-fields-container"]}`}>
            <div className={`${styles["input-container"]}`}>
              <input
                type="text"
                name="address"
                placeholder="Company Address *"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <div className={`${styles["error-label"]}`}>
                  {errors.address}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles["input-fields-container"]}`}>
            <div className={`${styles["input-container"]}`}>
              <input
                type="text"
                name="website"
                placeholder="Company Website *"
                value={formData.website}
                onChange={handleChange}
              />
              {errors.website && (
                <div className={`${styles["error-label"]}`}>
                  {errors.website}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles["action-buttons"]}>
          <button
            type="button"
            onClick={handlePrevious}
            className={styles["button-custom-basic"]}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={handleNext}
            className={styles["button-custom-orange"]}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className={styles["button-spinner"]}
                />
                Loading...
              </>
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployerAdditionalInformation;

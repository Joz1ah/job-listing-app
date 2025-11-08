import { useSignUpMutation, useOtpGenerateMutation } from "api";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { useLanding } from "../useLanding";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";
import { NavLink } from "react-router-dom";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";

type ErrorFields = "email" | "password" | "passwordConfirm";
type ErrorState = Record<ErrorFields, string>;

interface PasswordRequirements {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  special: boolean;
}

const UserNamePasswordSignup = () => {
  const {
    handleSetModalState,
    dataStates,
    handleSetCredentials,
    handleSetTempCredentials,
    modalState,
  } = useLanding();
  const { showError } = useErrorModal();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [organizedErrors, setOrganizedErrors] = useState<ErrorState>({
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [signUpSubmit] = useSignUpMutation();
  const [generateOTP] = useOtpGenerateMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .test(
        "password-requirements",
        "Password requirements not met",
        (value) =>
          Boolean(
            value &&
              value.length >= 12 &&
              /[a-z]/.test(value) &&
              /[A-Z]/.test(value) &&
              /[^a-zA-Z0-9]/.test(value),
          ),
      ),

    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Please confirm your password")
      .nullable(),
  });

  // Check password requirements
  const checkPasswordRequirements = (password: string): PasswordRequirements => {
    return {
      length: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };
  };

  // Generate specific password error messages
  const getPasswordErrorMessage = (password: string): string => {
    if (!password) return "";
    
    const requirements = checkPasswordRequirements(password);
    const missing = [];
    
    if (!requirements.length) missing.push("at least 12 characters");
    if (!requirements.lowercase) missing.push("a lowercase letter");
    if (!requirements.uppercase) missing.push("an uppercase letter");
    if (!requirements.special) missing.push("a special character");
    
    if (missing.length === 0) return "";
    
    return `Password must include ${missing.join(", ")}`;
  };

  // Only validate on input change after form has been submitted once
  useEffect(() => {
    if (formSubmitted) {
      validateForm();
    }
  }, [credentials, formSubmitted]);

  const validateForm = async () => {
    try {
      await schema.validate(credentials, { abortEarly: false });
      setOrganizedErrors({ email: "", password: "", passwordConfirm: "" });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const _organizedErrors: ErrorState = {
          email: "",
          password: "",
          passwordConfirm: "",
        };

        err.inner.forEach((error: Yup.ValidationError) => {
          if (error.path && isErrorField(error.path)) {
            if (error.path === "password") {
              _organizedErrors[error.path] = getPasswordErrorMessage(credentials.password);
            } else {
              _organizedErrors[error.path] = error.message;
            }
          }
        });
        setOrganizedErrors(_organizedErrors);
      }
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    try {
      // Validate the form data
      await schema.validate(credentials, { abortEarly: false });
      setIsSubmitting(true);
      try {
        await signUpSubmit({
          ...credentials,
          type: dataStates.selectedUserType,
        })
          .unwrap()
          .then(() => {
            handleSetTempCredentials({
              tempLoginEmail: credentials.email,
              tempLoginPassword: credentials.password,
            });

            handleSetCredentials({
              ...dataStates,
              email: credentials.email,
            });
          });

        handleSetModalState(MODAL_STATES.SIGNUP_STEP3);

        await generateOTP({ email: credentials.email })
          .unwrap()
          .catch((err) => {
            setIsSubmitting(false);
            // Show error modal for OTP generation failure
            showError(
              "OTP Generation Failed",
              err?.data?.message || "Failed to send verification code. Please try again."
            );
          });
        setTimeout(() => {
          setIsSubmitting(false);
          handleSetModalState(MODAL_STATES.SIGNUP_STEP3);
        }, 1000);
      } catch (err: any) {
        setIsSubmitting(false);

        // Check for internet connection issues first
        if (
          err.data &&
          err.data.message &&
          (err.data.message.includes("ERR_INTERNET_DISCONNECTED") ||
            err.data.message.includes("network") ||
            err.data.message.includes("internet"))
        ) {
          // Show network error in the modal
          showError(
            "Connection Error", 
            "Internet connection error. Please check your connection and try again."
          );
          return;
        }

        // Handle FETCH_ERROR separately
        if (
          err.status === "FETCH_ERROR" ||
          err.message === "Failed to fetch" ||
          err.error === "Failed to fetch"
        ) {
          // Show generic fetch error in the modal
          showError(
            "Request Failed", 
            "Unable to complete the request. Please try again."
          );
          return;
        }

        // Handle email already exists error - check if error message contains email-related keywords
        if (
          err?.data?.message &&
          (err.data.message.toLowerCase().includes("email already exists") ||
           err.data.message.toLowerCase().includes("email is already taken") ||
           err.data.message.toLowerCase().includes("user already exists") ||
           err.data.message.toLowerCase().includes("account with this email already exists"))
        ) {
          setOrganizedErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));
        } else {
          // For all other errors, use the error modal
          const errorMessage =
            err?.data?.message ||
            "An error occurred during sign up. Please try again.";
            
          showError("Sign Up Error", errorMessage);
        }
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setIsSubmitting(false);
        const _organizedErrors: ErrorState = {
          email: "",
          password: "",
          passwordConfirm: "",
        };

        err.inner.forEach((error: Yup.ValidationError) => {
          if (error.path && isErrorField(error.path)) {
            if (error.path === "password") {
              _organizedErrors[error.path] = getPasswordErrorMessage(credentials.password);
            } else {
              _organizedErrors[error.path] = error.message;
            }
          }
        });
        setOrganizedErrors(_organizedErrors);
      }
    }
  };

  // Check if form is valid
  const isFormValid = () => {
    try {
      schema.validateSync(credentials, { abortEarly: false });
      return true;
    } catch {
      return false;
    }
  };

  // Type guard to ensure the error path is a valid error field
  const isErrorField = (value: string): value is ErrorFields => {
    return ["email", "password", "passwordConfirm"].includes(value);
  };

  // Get password requirements display
  const getPasswordRequirementsDisplay = () => {
    if (organizedErrors.password) {
      return (
        <div className="text-[#E63946] text-[10px] mt-1">
          {organizedErrors.password}
        </div>
      );
    }
    
    // Check if password requirements are met
    const requirements = checkPasswordRequirements(credentials.password);
    const allMet = credentials.password && Object.values(requirements).every(Boolean);
    
    // Only show requirements text if password requirements are not met
    if (!allMet) {
      return (
        <div className="text-[#4BAF66] text-[10px] mt-1">
          Password must be at least 12 characters and include a lowercase
          letter, uppercase letter, and special character
        </div>
      );
    }
    
    return null;
  };

  // Get password confirm display
  const getPasswordConfirmDisplay = () => {
    if (organizedErrors.passwordConfirm) {
      return (
        <div className="text-[#E63946] text-[10px] mt-1">
          {organizedErrors.passwordConfirm}
        </div>
      );
    }
    
    // Show "Password Matched" if passwords match and both fields have values
    if (credentials.password && credentials.passwordConfirm && 
        credentials.password === credentials.passwordConfirm) {
      return (
        <div className="text-[#4BAF66] text-[10px] mt-1">
          Password matched
        </div>
      );
    }
    
    return null;
  };

  return modalState && modalState == MODAL_STATES.SIGNUP_STEP2 ? (
    <div className="flex flex-col h-full w-full justify-center items-cente p-4">
      <form onSubmit={handleSubmit} className="w-full h-full md:px-[50px]">
        <div className="text-left mb-5">
          <h1 className="text-sm md:text-xl font-bold text-[#F5722E]">
            Sign Up
          </h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              className="w-full bg-[#F5F5F7] text-sm py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
            />
            {organizedErrors.email && (
              <div className="text-[#E63946] text-[10px] mt-1">
                {organizedErrors.email}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              required
              className="w-full bg-[#F5F5F7] text-sm py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {getPasswordRequirementsDisplay()}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={credentials.passwordConfirm}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  passwordConfirm: e.target.value,
                })
              }
              required
              className="w-full bg-[#F5F5F7] text-sm py-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {getPasswordConfirmDisplay()}
          </div>
        </div>

        <div className="mt-[50px] md:mt-[100px]">
          <div className="mt-6 text-center text-sm text-gray-600">
            <span className="text-[#263238] text-[12px] font-[400]">
              By clicking "Next," you agree to our
            </span>
            <div>
              <NavLink
                to={"/terms-and-conditions"}
                className="text-[#F5722E] text-[12px]"
              >
                Terms & Conditions
              </NavLink>
              <span className="text-[#263238] text-[12px] font-[400]">
                &nbsp;and&nbsp;
              </span>
              <NavLink
                to={"/privacy-policy"}
                className="text-[#F5722E] text-[12px]"
              >
                Privacy Policy.
              </NavLink>
            </div>
          </div>
          <div className="mt-5 flex justify-center items-center gap-4">
            <button
              onClick={handlePrevious}
              type="button"
              className="w-[108px] h-10 border-2 border-orange-500 text-orange-500 rounded-md"
            >
              Previous
            </button>
            <button
              type="submit"
              className={`w-[108px] h-10 rounded-md flex items-center justify-center ${
                isFormValid() 
                  ? "bg-orange-500 text-white" 
                  : "bg-[#AEADAD] text-white"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className="w-6 h-6 animate-spin"
                />
              ) : (
                "Next"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
};

export default UserNamePasswordSignup;
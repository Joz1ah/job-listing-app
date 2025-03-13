import { useSignUpMutation, useOtpGenerateMutation } from "api/akaza/akazaAPI";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { useLanding } from "../useLanding";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";
import { NavLink } from "react-router-dom";

type ErrorFields = "email" | "password" | "passwordConfirm";
type ErrorState = Record<ErrorFields, string>;

const UserNamePasswordSignup = () => {
  const {
    handleSetModalState,
    dataStates,
    handleSetCredentials,
    handleSetTempCredentials,
    modalState,
  } = useLanding();
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
        "Password must be at least 12 characters and include a lowercase letter, uppercase letter, and special character",
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
            _organizedErrors[error.path] = error.message;
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
          .catch(() => {
            setIsSubmitting(false);
          });
        setTimeout(() => {
          setIsSubmitting(false);
          handleSetModalState(MODAL_STATES.SIGNUP_STEP3);
        }, 1000);
      } catch (err: any) {
        setIsSubmitting(false);

        // Check for internet connection issues
        if (
          err.status === "FETCH_ERROR" ||
          err.message === "Failed to fetch" ||
          err.error === "Failed to fetch" ||
          (err.data &&
            err.data.message &&
            (err.data.message.includes("ERR_INTERNET_DISCONNECTED") ||
              err.data.message.includes("network") ||
              err.data.message.includes("internet")))
        ) {
          setOrganizedErrors((prev) => ({
            ...prev,
            email:
              "Internet connection error. Please check your connection and try again.",
          }));
          return;
        }

        // Handle email already exists error
        if (
          err.status === 409 ||
          (err?.data?.message &&
            err.data.message.toLowerCase().includes("email already exists"))
        ) {
          setOrganizedErrors((prev) => ({
            ...prev,
            email: "Email already exists",
          }));
        } else {
          // For other errors, display the actual error message
          const errorMessage =
            err?.data?.message ||
            "An error occurred during sign up. Please try again.";

          // Try to determine which field the error applies to
          if (errorMessage.toLowerCase().includes("email")) {
            setOrganizedErrors((prev) => ({
              ...prev,
              email: errorMessage,
            }));
          } else if (errorMessage.toLowerCase().includes("password")) {
            setOrganizedErrors((prev) => ({
              ...prev,
              password: errorMessage,
            }));
          } else {
            // Default to showing in email field if can't determine
            setOrganizedErrors((prev) => ({
              ...prev,
              email: errorMessage,
            }));
          }
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
            _organizedErrors[error.path] = error.message;
          }
        });
        setOrganizedErrors(_organizedErrors);
      }
    }
  };

  // Type guard to ensure the error path is a valid error field
  const isErrorField = (value: string): value is ErrorFields => {
    return ["email", "password", "passwordConfirm"].includes(value);
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
            {!organizedErrors.password ? (
              <div className="text-[#4BAF66] text-[10px] mt-1">
                Password must be at least 12 characters and include a lowercase
                letter, uppercase letter, and special character
              </div>
            ) : (
              organizedErrors.password && (
                <div className="text-[#E63946] text-[10px] mt-1">
                  {organizedErrors.password}
                </div>
              )
            )}
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
            {organizedErrors.passwordConfirm && (
              <div className="text-[#E63946] text-[10px] mt-1">
                {organizedErrors.passwordConfirm}
              </div>
            )}
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
              className="w-[108px] h-10 bg-orange-500 text-white rounded-md flex items-center justify-center"
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

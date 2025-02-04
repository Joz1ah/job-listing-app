import { useSignUpMutation, useOtpGenerateMutation } from "api/akaza/akazaAPI";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import { useLanding } from "../useLanding";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";

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

  const schema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),

    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Passwords must match")
      .required("Please confirm your password")
      .nullable(),
  });

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    handleSetModalState(MODAL_STATES.SIGNUP_SELECT_USER_TYPE);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrganizedErrors({ email: "", password: "", passwordConfirm: "" });

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
        if (
          err.status === 409 ||
          err?.data?.message?.toLowerCase().includes("email already exists")
        ) {
          setOrganizedErrors((prev) => ({
            ...prev,
            email: "This email is already registered",
          }));
        } else {
          setOrganizedErrors((prev) => ({
            ...prev,
            email: err?.data?.message || "Email already exists",
          }));
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
    <div
      id="aniez"
      className="flex flex-col h-full w-full justify-center items-center"
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-6 text-left">
          <h1 className="text-2xl font-semibold text-orange-500">Sign Up</h1>
        </div>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Email"
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
              className="w-full p-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
            />
            {organizedErrors.email && (
              <div className="text-red-500 text-xs mt-1">
                {organizedErrors.email}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  password: e.target.value,
                })
              }
              required
              className="w-full p-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {organizedErrors.password && (
              <div className="text-red-500 text-xs mt-1">
                {organizedErrors.password}
              </div>
            )}
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  passwordConfirm: e.target.value,
                })
              }
              required
              className="w-full p-2 border-b-2 border-gray-300 focus:border-orange-500 focus:outline-none"
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
              <div className="text-red-500 text-xs mt-1">
                {organizedErrors.passwordConfirm}
              </div>
            )}
          </div>
        </div>

        <div className="mt-0 sm:mt-16">
          <div className="mt-6 text-center text-sm text-gray-600">
            <div>By clicking "Next," you agree to our</div>
            <div>
              <a
                href="https://app.websitepolicies.com/policies/view/azn4i7fg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                Terms & Conditions
              </a>
              &nbsp;and&nbsp;
              <a
                href="https://app.websitepolicies.com/policies/view/2albjkzj"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-500 underline"
              >
                Privacy Policy.
              </a>
            </div>
          </div>
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={handlePrevious}
              type="button"
              className="w-24 h-10 border-2 border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
            >
              Previous
            </button>
            <button
              type="submit"
              className="w-24 h-10 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className="w-6 h-6"
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

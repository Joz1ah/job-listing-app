import { useSignUpMutation, useOtpGenerateMutation } from "api/akaza/akazaAPI";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./../landing.module.scss";
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

  return (
    <div
      id="step2_signup"
      className={`${styles["modal-content"]}`}
      hidden={modalState !== MODAL_STATES.SIGNUP_STEP2}
    >
      <div className={`${styles["password-confirmation-container"]}`}>
        <form onSubmit={handleSubmit}>
          <div className={`${styles["password-input-fields"]}`}>
            <div className={`${styles["transparent-input-field"]}`}>
              <div className={`${styles["input-container"]}`}>
                <input
                  type="text"
                  placeholder="Email"
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  required
                ></input>
              </div>
              {organizedErrors.email && (
                <div className={`${styles["error-label"]}`}>
                  {organizedErrors.email}
                </div>
              )}
            </div>
            <div
              id="signup_password"
              className={`${styles["transparent-input-field"]}`}
            >
              <div className={`${styles["input-container"]}`}>
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className={styles["toggle-visibility"]}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              {organizedErrors.password && (
                <div className={`${styles["error-label"]}`}>
                  {organizedErrors.password}
                </div>
              )}
            </div>

            <div
              id="signup_password_confirm"
              className={`${styles["transparent-input-field"]}`}
            >
              <div className={`${styles["input-container"]}`}>
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
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                  className={styles["toggle-visibility"]}
                >
                  {showConfirmPassword ? (
                    <Eye size={20} />
                  ) : (
                    <EyeOff size={20} />
                  )}
                </button>
              </div>
              {organizedErrors.passwordConfirm && (
                <div className={`${styles["error-label"]}`}>
                  {organizedErrors.passwordConfirm}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles["continue-signup-terms-and-conditions"]}`}>
            <div>
              <div>By clicking "Next," you agree to our</div>
              <div>
                <a
                  href="https://app.websitepolicies.com/policies/view/azn4i7fg"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <u className={styles["link"]}>Terms & Conditions</u>
                </a>
                and
                <a
                  href="https://app.websitepolicies.com/policies/view/2albjkzj"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <u className={styles["link"]}>Privacy Policy.</u>
                </a>
              </div>
            </div>
          </div>
          <div className={`${styles["action-buttons"]}`}>
            <button
              onClick={handlePrevious}
              type="button"
              className={`${styles["button-custom-basic"]}`}
            >
              Previous
            </button>
            <button
              type="submit"
              className={styles["button-custom-orange"]}
              disabled={isSubmitting}
            >
              <img
                src={button_loading_spinner}
                alt="Loading"
                className={styles["button-spinner"]}
                hidden={!isSubmitting}
              />
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserNamePasswordSignup;

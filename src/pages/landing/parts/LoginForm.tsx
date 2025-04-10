import { useLoginMutation } from "api/akaza/akazaAPI";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useState } from "react";
import { useLanding } from "../useLanding";
import { Eye, EyeOff } from "lucide-react";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";
import * as Yup from "yup";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useNavigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm = () => {
  const [loginSubmit] = useLoginMutation();
  const [apiLoginErrorMessage, setApiLoginErrorMessage] = useState("");
  const { login } = useAuth();
  const { isResetPasswordSuccesful, handleSetModalState } = useLanding();
  const { showError } = useErrorModal();
  const navigate = useNavigate();

  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotPassword = async () => {
    handleSetModalState(MODAL_STATES.FORGOT_PASSWORD_EMAIL);
  };

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }: any,
  ) => {
    try {
      const response = await loginSubmit(values).unwrap();

      // Check if we have the token in the response
      if (response?.data?.token) {
        // Store user preferences in localStorage
        const userType = response.data.user?.type;
        const isFreeTrial = response.data.user?.freeTrial;

        // Store user preferences
        localStorage.setItem("userType", userType);
        localStorage.setItem(
          "subscriptionTier",
          isFreeTrial ? "freeTrial" : "monthlyPlan",
        );

        // Let the AuthContext handle the login (token storage)
        login(response.data.token);
        
        // Explicitly navigate to dashboard after successful login
        // This ensures redirection to dashboard regardless of which page login occurs from
        navigate(ROUTE_CONSTANTS.DASHBOARD, { replace: true });
      } else {
        throw new Error("No token received");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      
      // Handle different types of errors
      if (err.status === 401) {
        // Authentication errors (wrong credentials) stay in the form
        setApiLoginErrorMessage("Invalid Username or Password");
        setFieldError("general", "Invalid Username or Password");
      } else if (
        err.status === "FETCH_ERROR" ||
        err.message === "Failed to fetch" ||
        err.error === "Failed to fetch" ||
        (err.data &&
          err.data.message &&
          (err.data.message.includes("ERR_INTERNET_DISCONNECTED") ||
            err.data.message.includes("network") ||
            err.data.message.includes("internet")))
      ) {
        // Only show serious network errors in modal
        showError(
          "Connection Error",
          "Internet connection error. Please check your connection and try again."
        );
        setApiLoginErrorMessage("Network error. Please check your connection.");
      } else {
        // Only display unexpected server errors in the modal
        showError(
          "Server Error",
          err?.data?.message || "An unexpected error occurred. Please try again."
        );
        
        // Keep the error message in the form
        setApiLoginErrorMessage("An error occurred during login. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <Formik<LoginFormValues>
      initialValues={{ email: "", password: "", rememberMe: false }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, values: { email, password } }) => (
        <Form className="flex flex-col w-full py-5 px-4 md:py-4 md:px-[50px]">
          <div className="text-left mb-5">
            {isResetPasswordSuccesful ? (
              <>
                <h1 className="text-sm md:text-xl font-bold text-[#F5722E]">
                  Password Reset Successful!
                </h1>
                <h1 className="text-sm md:text-xs font-medium text-[#F5722E]">
                  Your password has been updated. You can now log in with your
                  new credentials.
                </h1>
              </>
            ) : (
              <h1 className="text-sm md:text-xl font-bold text-[#F5722E]">
                Login
              </h1>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <div>
              <div className="relative">
                <Field
                  name="email"
                  type="text"
                  placeholder="Email"
                  className={`w-full bg-[#F5F5F7] text-sm py-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-[10px] mt-1"
              />
            </div>
            <div>
              <div className="relative">
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full bg-[#F5F5F7] text-sm py-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.password && errors.password ? "border-red-500" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-[10px] mt-1"
              />
            </div>
            <div className="text-red-500 text-[10px] mt-1">
              {apiLoginErrorMessage ? apiLoginErrorMessage : ""}
            </div>
          </div>

          <div className="flex justify-between items-center pb-4">
            <div className="flex items-center ml-1">
              <Field
                type="checkbox"
                name="rememberMe"
                className="mr-2 w-5 h-5"
              />
              <label className="text-[10px]">Remember me</label>
            </div>
            <div
              className="text-[10px] text-[#F5722E] cursor-pointer"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </div>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className={`${email && password ? "bg-[#F5722E]" : "bg-[#AEADAD]"} text-white py-2 px-4 rounded disabled:opacity-50 w-full h-[45px]`}
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? (
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className="inline-block mr-2 h-6 animate-spin"
                />
              ) : null}
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
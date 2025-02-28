import { MODAL_STATES } from "store/modal/modal.types";
import { useLanding } from "../useLanding";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { Eye, EyeOff } from "lucide-react";
import { useState,useEffect } from "react";
import { useResetPasswordMutation } from "api/akaza/akazaAPI";
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";

interface resetPasswordNewPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordNewPasswordModal = () => {
  const { modalState, handleSetModalState } = useLanding();
  const [resetPasswordErrorMessage, setResetPasswordErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const [resetPasswordSubmit] = useResetPasswordMutation();
  const resetPasswordtoken = location.state?.resetPasswordtoken || null;
  useEffect(()=>{
    window.history.replaceState({ resetPasswordToken: null }, "", null);
  },[resetPasswordtoken])
  const handleSubmit = async (
    values: resetPasswordNewPasswordValues,
    //{ setSubmitting }: any,
  ) => {
    try {
      const payload = {
        password: values.newPassword,
        token: resetPasswordtoken
      }
      await resetPasswordSubmit(payload).unwrap().then(()=>{
        handleSetModalState(MODAL_STATES.FORGOT_PASSWORD_OTP)
      });
      //handleSetModalState(MODAL_STATES.FORGOT_PASSWORD_OTP)
    } catch (err: any) {
      console.error("Reset Password error:", err);
      // Handle API-specific errors
      if (err.status === 401) {
        setResetPasswordErrorMessage("Please enter a valid Password");
      } else if (err.status === 400) {
        setResetPasswordErrorMessage("Invalid or expired token");
      } else {
        setResetPasswordErrorMessage("An error occurred during while resetting password");
      }
    } finally {
      //setSubmitting(false);
    }
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
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
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  return modalState && modalState == MODAL_STATES.FORGOT_PASSWORD_NEW_PASSWORD ? (
    <Formik<resetPasswordNewPasswordValues>
      initialValues={{ newPassword: "", confirmPassword: ""}}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, values: { newPassword, confirmPassword } }) => (
        <Form className="flex flex-col text-center justify-center w-full py-5 px-4 md:py-4 md:px-[50px]">
          <div className="mb-3 mt-5 md:mt-20">
            <h1 className="text-2xl md:text-[1.75rem] font-medium text-[#F5722E]">Set a new password</h1>
            <h1 className="mt-4 px-8 text-xs md:text-sm font-medium text-[#263238]">Password must be at least 12 characters and include a lowercase letter, uppercase letter, and special character</h1>
          </div>
          <div className="relative flex flex-col items-center justify-center">
            <Field
              name="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={newPassword}
              required
              className={`w-10/12 md:w-8/12 bg-[#F5F5F7] text-sm py-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.newPassword && errors.newPassword ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              className="absolute right-8 md:right-24 top-2 text-gray-500"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <ErrorMessage
                name="newPassword"
                component="div"
                className="text-red-500 text-[10px] mt-1 w-10/12 md:w-8/12"
              />
          </div>
          <div className="relative">
            <Field
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              required
              className={`w-10/12 md:w-8/12 bg-[#F5F5F7] text-sm py-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.confirmPassword && errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              tabIndex={-1}
              className="absolute right-8 md:right-24 top-2 text-gray-500"
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 text-[10px] mt-1"
              />
          </div>

          <div className="text-center mt-3">
            <button
              type="submit"
              className={`${newPassword && confirmPassword ? "bg-[#F5722E]" : "bg-[#AEADAD]"} text-white py-2 px-4 rounded disabled:opacity-50 w-10/12 md:w-8/12 h-[45px]`}
              disabled={isSubmitting || !newPassword || !confirmPassword}
            >
              <img
                src={button_loading_spinner}
                alt="Loading"
                className={`inline-block mr-2 h-full ${isSubmitting ? "block animate-spin" : "hidden"}`}
              />
              Reset Password
            </button>
          </div>
          <div className="text-red-500 text-[10px] mt-1">
              {resetPasswordErrorMessage ? resetPasswordErrorMessage : ""}
          </div>
          <button
            className="mt-8 w-full h-[25px] flex items-center justify-center gap-4"
            onClick={() => handleSetModalState(MODAL_STATES.LOGIN)}
          >
            <img
              className="absolute mr-[80px]"
              src={arrow_left_icon}
            ></img>
            <span className="font-medium text-[10px] text-[#AEADAD]">
              Back to login
            </span>
          </button>
        </Form>
      )}
    </Formik>
  ) : (
    <></>
  );
};

export default ForgotPasswordNewPasswordModal;

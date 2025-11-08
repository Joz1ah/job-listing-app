import { MODAL_STATES } from "store/modal/modal.types";
import { useLanding } from "../useLanding";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useForgotPasswordMutation } from "api"
import arrow_left_icon from "assets/Keyboard-arrow-left.svg?url";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import * as Yup from "yup";

interface resetPasswordEmailValues {
  email: string;
}

const ForgotPasswordModal = () => {
  const { modalState, handleSetModalState, handleSetCurrentResetPasswordEmail } = useLanding();
  const [forgotPasswordSubmit] = useForgotPasswordMutation();
  const [resetPasswordErrorMessage, setResetPasswordErrorMessage] = useState("");
  const [confirmationLinkSent, setConfirmationLinkSent] = useState(false);
  const handleSubmit = async (
    values: resetPasswordEmailValues,
    { setSubmitting }: any,
  ) => {
    try {
      await forgotPasswordSubmit(values).unwrap().then(()=>{
        handleSetCurrentResetPasswordEmail(values.email)
        setConfirmationLinkSent(true)
        //handleSetModalState(MODAL_STATES.FORGOT_PASSWORD_NEW_PASSWORD)
      });
    } catch (err: any) {
      console.error("Reset Password error:", err);
      // Handle API-specific errors
      if (err.status === 401) {
        setResetPasswordErrorMessage("Please enter a valid email address");
      } else {
        setResetPasswordErrorMessage("An error occurred during while resetting password");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  return modalState && modalState == MODAL_STATES.FORGOT_PASSWORD_EMAIL ? (
    <Formik<resetPasswordEmailValues>
      initialValues={{ email: ""}}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting, values: { email } }) => (
        <Form className="flex flex-col text-center justify-center w-full py-5 px-4 md:py-4 md:px-[50px]">
          <div className="mb-3 mt-5 md:mt-20">
            <h1 className="text-2xl md:text-[1.75rem] font-medium text-[#F5722E]">Forgot your password?</h1>
            <h1 className="mt-4 px-8 text-xs md:text-sm font-medium text-[#263238]">No problem! We’ll get you back on track with a quick reset.</h1>
          </div>
          <div className="flex flex-col space-y-2">
            <div>
              <div className="relative">
                <Field
                  name="email"
                  type="text"
                  placeholder="Email"
                  className={`w-10/12 md:w-8/12 bg-[#F5F5F7] text-sm py-2 border-b-2 focus:border-orange-500 focus:outline-none ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                />
              </div>
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-[10px] mt-1"
              />
            </div>
          </div>

          <div className="text-center mt-3">
            <button
              type="submit"
              className={`${email ? "bg-[#F5722E]" : "bg-[#AEADAD]"} text-white py-2 px-4 rounded disabled:opacity-50 w-10/12 md:w-8/12 h-[45px]`}
              disabled={isSubmitting || !email}
            >
              <img
                src={button_loading_spinner}
                alt="Loading"
                className={`inline-block mr-2 h-full ${isSubmitting ? "block animate-spin" : "hidden"}`}
              />
              Reset Password
            </button>
          </div>
          {
            confirmationLinkSent ?
            <div className="text-[#4BAF66] text-[10px] mt-1">
              A reset link has been sent to your email. Please check your inbox and spam folder.
            </div>
            : <></>
          }

          <div className="text-red-500 text-[10px] mt-1">
              {resetPasswordErrorMessage && !confirmationLinkSent ? resetPasswordErrorMessage : ""}
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

export default ForgotPasswordModal;

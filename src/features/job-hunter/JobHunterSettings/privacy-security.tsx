import React, { FC, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "components";
import { Button } from "components";
import { Eye, EyeOff, ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "lib/utils";
import { InputField } from "components";
import { DeleteAccountAlert } from "./alerts/DeleteAccountAlert";
import { useUpdatePasswordMutation } from "api/akaza/akazaAPI";
import { useJobHunterContext } from "components";
import { AdDialogWrapper } from "components";
import jobHunterPopAds from "images/popup-hunter.svg?url";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";

interface FormData {
  originalPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ErrorResponse {
  status: number;
  data: {
    errors: string;
    message: string;
    statusCode: number;
    success: false;
  };
}

const PrivacyAndSecuritySettings: FC = () => {
  const { subscriptionPlan } = useJobHunterContext();
  const adTriggerRef = useRef<HTMLDivElement>(null);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const [showOriginalPassword, setShowOriginalPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const validationSchema = Yup.object().shape({
    originalPassword: Yup.string().required("Original password is required"),
    newPassword: Yup.string()
      .required("Password is required")
      .test(
        "password-requirements",
        "Password must be at least 12 characters and include a lowercase letter, uppercase letter, number, and special character",
        (value) =>
          Boolean(
            value &&
              value.length >= 12 &&
              /[a-z]/.test(value) &&
              /[A-Z]/.test(value) &&
              /[0-9]/.test(value) &&
              /[^a-zA-Z0-9]/.test(value),
          ),
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik<FormData>({
    initialValues: {
      originalPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: async (values, { resetForm, setFieldError }) => {
      if (subscriptionPlan === "freeTrial") {
        adTriggerRef.current?.click();
        return;
      }

      setIsSuccess(false);
      try {
        await Promise.all([
          updatePassword({
            oldPassword: values.originalPassword,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword,
          }).unwrap(),
        ]);

        resetForm();
        setIsSuccess(true);
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "data" in error &&
          typeof (error as ErrorResponse).data?.message === "string" &&
          (error as ErrorResponse).data.message === "Old password is incorrect"
        ) {
          setFieldError("originalPassword", "Original password is incorrect");
        } else {
          setFieldError("originalPassword", "An unexpected error occurred");
        }
        setIsSuccess(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, isValid } =
    formik;

  const inputClassName =
    "w-full bg-transparent border-[#AEADAD] border-2 rounded-[10px] px-3 pr-10 text-white h-[56px] focus:border-[#F5722E] focus:outline-none transition-colors duration-200 placeholder:text-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";

  const passwordTooltipContent = (
    <div className="space-y-1">
      <p>Password must be at least 12 characters long.</p>
      <p>With the following:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Atleast one lower case letter (a-z)</li>
        <li>Alteast one upper case letter (A-Z)</li>
        <li>Alteast one number (0-9)</li>
        <li>Atleast one special character (e.g. !@#$%^&*)</li>
      </ul>
    </div>
  );

  return (
    <div className="w-full">
      <div>
        <h2 className="text-white text-xl md:text-2xl font-normal mb-3">
          Privacy & Security
        </h2>
        <p className="text-white text-sm font-light">
          We take your privacy and security seriously. Here, you can manage your
          account settings to ensure your information remains safe and
          protected. Review your options below to customize your account's
          security and safeguard your data.
        </p>
      </div>

      <div className="mt-8">
        <h3 className="text-white text-base md:text-lg font-medium mb-6">
          Reset Your Password
        </h3>

        <div className="flex justify-center">
          <div className="w-full max-w-md flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col w-full md:w-[355px]"
            >
              <div className="w-full space-y-8 mb-8">
                <InputField
                  label="Original Password"
                  error={errors.originalPassword}
                  touched={touched.originalPassword}
                  variant="primary"
                >
                  <div className="relative">
                    <Input
                      type={showOriginalPassword ? "text" : "password"}
                      name="originalPassword"
                      value={values.originalPassword}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowOriginalPassword(!showOriginalPassword)
                      }
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200 bg-[#2D3A41] p-0.5"
                    >
                      {showOriginalPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </InputField>

                <InputField
                  label="New Password"
                  error={errors.newPassword}
                  touched={touched.newPassword}
                  showIcon={true}
                  tooltipContent={passwordTooltipContent}
                  variant="primary"
                >
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200 bg-[#2D3A41] p-0.5"
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </InputField>

                <InputField
                  label="Confirm Password"
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  variant="primary"
                >
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors duration-200 bg-[#2D3A41] p-0.5"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </InputField>
              </div>

              <div className="flex flex-col items-end w-full gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full md:w-[133px] h-[32px] text-xs p-0 rounded-sm transition-colors duration-200 font-normal flex items-center justify-center gap-2",
                    isLoading
                      ? "bg-white text-[#F5722E]"
                      : !isValid
                        ? "bg-[#AEADAD] text-white hover:bg-[#AEADAD]"
                        : "bg-[#F5722E] hover:bg-[#F5722E]/90 text-white",
                  )}
                >
                  {isLoading && (
                    <img
                      src={button_loading_spinner}
                      alt="loading"
                      className="w-6 h-6 animate-spin"
                    />
                  )}
                  {isLoading ? "Resetting" : "Reset Password"}
                </Button>
                {isSuccess && (
                  <p className="text-[#4CAF50] text-sm">
                    <Check className="w-4 h-4 text-[#4BAF66] inline" /> Password
                    reset successful!
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-8 relative">
        <div
          className={cn(
            "w-full md:absolute left-0 bg-[#263238] transition-all duration-200",
            isDeleteOpen ? "rounded-md" : "rounded-t-lg",
          )}
        >
          <button
            type="button"
            className="flex items-center justify-between w-full py-2 px-4 md:px-6"
            onClick={() => setIsDeleteOpen(!isDeleteOpen)}
          >
            <span className="text-[#E53835] text-sm font-normal transition-colors duration-200">
              Delete Your Account
            </span>
            {isDeleteOpen ? (
              <ChevronUp className="text-white" size={20} />
            ) : (
              <ChevronDown className="text-white" size={20} />
            )}
          </button>

          {isDeleteOpen && (
            <div className="p-4 pt-0">
              <p className="text-[12px] md:text-sm text-gray-300 mb-4 pl-4">
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
              <div className="flex justify-end">
                <DeleteAccountAlert
                  isOpen={isDeleteAlertOpen}
                  onOpenChange={setIsDeleteAlertOpen}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ad Dialog for Free Trial Users */}
      <div className="hidden">
        <AdDialogWrapper popupImage={jobHunterPopAds} ref={adTriggerRef} />
      </div>
    </div>
  );
};

export { PrivacyAndSecuritySettings };

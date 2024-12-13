import React, { FC } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "components";
import { Button } from "components";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "lib/utils";
import { InputField } from "components";

interface FormData {
  originalPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const PrivacyAndSecuritySettings: FC = () => {
  const [showOriginalPassword, setShowOriginalPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

  const validationSchema = Yup.object().shape({
    originalPassword: Yup.string().required("Original password is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z].*[A-Z]|.*[a-z].*[0-9]|.*[a-z].*[!@#$%^&*]|.*[A-Z].*[0-9]|.*[A-Z].*[!@#$%^&*]|.*[0-9].*[!@#$%^&*])/,
        "Must contain at least 2 of: lowercase letters, uppercase letters, numbers, or special characters",
      )
      .required("New password is required"),
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
    onSubmit: (values): void => {
      console.log("Form submitted:", values);
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, isValid } =
    formik;

  const inputClassName =
    "w-full bg-transparent border-[#AEADAD] border-2 rounded-[10px] px-3 pr-10 text-white h-[56px] focus:border-[#F5722E] focus:outline-none transition-colors duration-200 placeholder:text-white [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";

  const passwordTooltipContent = (
    <div className="space-y-1">
      <p>Password must be at least 8 characters.</p>
      <p>With at least 2 of the following:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Lower case letters (a-z)</li>
        <li>Upper case letters (A-Z)</li>
        <li>Numbers (0-9)</li>
        <li>Special characters (e.g. !@#$%^&*)</li>
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
          <div className="w-[355px] max-w-md">
            <form onSubmit={handleSubmit} className="flex flex-col w-[355px]">
              <div className="space-y-8 mb-8 w-[355px]">
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

              <div className="flex justify-end w-full">
                <Button
                  type="submit"
                  className={cn(
                    "w-full md:w-[133px] h-[32px] text-xs p-0 text-white rounded-sm transition-colors duration-200 font-normal",
                    isValid
                      ? "bg-[#F5722E] hover:bg-orange-600"
                      : "bg-[#AEADAD] hover:bg-[#AEADAD]",
                  )}
                >
                  Reset Password
                </Button>
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
                <button
                  type="button"
                  className="text-[#E53835] hover:text-white hover:bg-[#E53835] border border-[#E53835] rounded px-4 py-2 text-sm font-normal transition-colors duration-200"
                  onClick={() => {
                    console.log("Confirm delete account");
                  }}
                >
                  Delete Your Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { PrivacyAndSecuritySettings };

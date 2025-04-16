import { usePaymentCreateMutation, useLoginMutation } from "api/akaza/akazaAPI";
import { InputField, Input } from "components";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useState, useEffect, useRef } from "react";
import { Formik, Field, FieldProps } from "formik";
import styles from "./../landing.module.scss";
import { useLanding } from "../useLanding";
import * as Yup from "yup";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { ROUTE_CONSTANTS } from "constants/routeConstants";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";
import { PLAN_SELECTION_ITEMS } from "store/user/user.types";
import { CountrySelect } from "components";
import close_icon from "assets/close.svg?url";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import authnet_logo from "assets/authnet-logo2.svg?url";
import { useModal } from "components/modal/useModal";
import { CloseConfirmationModal } from "components/modal/close-confirmation";
import {
  createAuthNetTokenizer,
  createAuthnetPaymentSecureData,
} from "services/authnet/authnetService";
import { NavLink } from "react-router-dom";

interface PaymentFormValues {
  cardNumber: string;
  firstName: string;
  lastName: string;
  expiryDate: string;
  cvv: string;
  email: string;
  billingAddress: string;
  stateProvince: string;
  zipPostalCode: string;
  city: string;
  country: string;
  termsAccepted: boolean;
}

const AuthnetPaymentFullModal = () => {
  const {
    currentSelectedPlan,
    handleSetModalState,
    modalState,
    tempLoginEmail,
    tempLoginPassword,
    dataStates,
  } = useLanding();
  const { isModalOpen, toggleModal, resetModalState } = useModal();
  const [paymentSubmit] = usePaymentCreateMutation();
  const [loginSubmit] = useLoginMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useErrorModal();
  const { login } = useAuth();
  const closeModalRef = useRef<HTMLImageElement>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Determine if user is employer
  const isEmployer = dataStates.selectedUserType === "employer";

  const formatExpirationDate = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleExpirationDateKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    const { key, target } = event;
    const inputElement = target as HTMLInputElement;

    if (key === "Backspace" && inputElement.selectionStart === 3) {
      const updatedValue = inputElement.value.slice(0, 2);
      inputElement.value = updatedValue;
      event.preventDefault();
      inputElement.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    setIsSubmitting(true);
    const baseAmount =
      currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
        ? isEmployer
          ? 50
          : 5
        : isEmployer
          ? 550
          : 55;
    const transactionFee = baseAmount * 0.096;
    const subtotal = baseAmount + transactionFee;
    const tax =
      values.country?.toLowerCase() === "canada" ? subtotal * 0.13 : 0;
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const secureData = createAuthnetPaymentSecureData({
      cardNumber: values.cardNumber,
      month: values.expiryDate.split("/")[0],
      year: values.expiryDate.split("/")[1],
      cardCode: values.cvv,
    });
    console.log(secureData);
    Accept.dispatchData(secureData, async (acceptResponse: any) => {
      if (acceptResponse.messages.resultCode === "Ok") {
        const token = acceptResponse.opaqueData.dataValue;
        try {
          const paymentResponse = await paymentSubmit({
            provider: "authnet",
            plan:
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                ? "Monthly"
                : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                  ? "Yearly"
                  : "",
            amount: totalAmount,
            paymentMethodId: token,
            daysTrial: 0,
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.billingAddress,
            city: values.city,
            state: values.stateProvince,
            zip: values.zipPostalCode,
            country: values.country,
          }).unwrap();

          console.log("Payment successful:", paymentResponse);

          // After successful payment, attempt login
          try {
            const loginResponse = await loginSubmit({
              email: tempLoginEmail,
              password: tempLoginPassword,
            }).unwrap();

            if (loginResponse?.data?.token) {
              login(loginResponse.data.token);
              handleSetModalState(MODAL_STATES.LOADING);

              const userType = loginResponse.data.user?.type;
              const navigationTarget =
                userType === "employer"
                  ? ROUTE_CONSTANTS.COMPLETE_PROFILE
                  : ROUTE_CONSTANTS.CREATE_APPLICATION;

              window.location.href = navigationTarget;
            }
          } catch (loginErr) {
            console.error("Login error after payment:", loginErr);
            showError(
              "Login Error",
              "Payment successful but login failed. Please try logging in manually.",
            );
            setIsSubmitting(false);
          }
        } catch (err: any) {
          showError(err?.data?.errors, err?.data?.message);
          setIsSubmitting(false);
          console.error("Payment submission error:", err);
        }
      } else {
        setIsSubmitting(false);
        alert("Error: " + acceptResponse.messages.message[0].text);
      }
    });
  };

  useEffect(() => {
    createAuthNetTokenizer();
  }, []);

  if (!isModalOpen || modalState !== MODAL_STATES.AUTHNET_PAYMENT_FULL) {
    return null;
  }

  const handleCloseAttempt = () => {
    setShowConfirmation(true);
  };

  // Handler for "Stay" button
  const handleStay = () => {
    setShowConfirmation(false);
  };

  // Handler for "Leave" button
  const handleLeave = () => {
    setShowConfirmation(false);
    resetModalState();
    toggleModal(false);
  };

  const PaymentIcons = ({ className = "" }) => {
    return (
      <div className={`flex items-center gap-1 md:gap-2 ${className}`}>
        <img src={visa_icon} alt="Visa" className="h-7 sm:h-8" />
        <img src={amex_icon} alt="American Express" className="h-7 sm:h-8" />
        <img src={mastercard_icon} alt="Mastercard" className="h-7 sm:h-8" />
        <img src={discover_icon} alt="Discover" className="h-7 sm:h-8" />
      </div>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative bg-white shadow-lg w-full md:w-[642px] h-[554px] flex flex-col mx-4">
          {/* Fixed Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex flex-row items-center p-2 md:p-4 md:gap-4">
              {/* Container with relative positioning for mobile */}
              <div className="relative w-full flex justify-center md:justify-between">
                {/* Logo - Centered on mobile, left on desktop */}
                <div className="w-auto flex">
                  <img
                    src={authnet_logo}
                    alt="Akaza Logo"
                    className="h-8 sm:h-10"
                  />
                </div>

                {/* Payment Icons & Close Button - Right-aligned on desktop */}
                <div className="hidden md:flex items-center justify-end gap-3">
                  <PaymentIcons />
                  <img
                    ref={closeModalRef}
                    className="cursor-pointer w-6 h-6"
                    src={close_icon}
                    alt="Close"
                    onClick={handleCloseAttempt}
                  />
                </div>
              </div>

              {/* Mobile-only close button - Absolutely positioned and vertically centered */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 md:hidden">
                <img
                  ref={closeModalRef}
                  className="cursor-pointer w-4 h-4"
                  src={close_icon}
                  alt="Close"
                  onClick={handleCloseAttempt}
                />
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="w-full p-6 md:p-4">
              <div className={`${styles["authnet-paymentfull-container"]}`}>
                <Formik
                  initialValues={{
                    cardNumber: "",
                    firstName: "",
                    lastName: "",
                    expiryDate: "",
                    cvv: "",
                    email: "",
                    billingAddress: "",
                    stateProvince: "",
                    zipPostalCode: "",
                    city: "",
                    country: "",
                    termsAccepted: false,
                  }}
                  validationSchema={Yup.object({
                    cardNumber: Yup.string()
                      .required("This field is required")
                      .matches(/^\d{13,19}$/, "Please enter valid card number")
                      .test("luhn", "Invalid card number", (value) => {
                        if (!value) return false;
                        // Luhn algorithm implementation
                        const digits = value.split("").map(Number);
                        let sum = 0;
                        let isEven = false;

                        for (let i = digits.length - 1; i >= 0; i--) {
                          let digit = digits[i];

                          if (isEven) {
                            digit *= 2;
                            if (digit > 9) {
                              digit -= 9;
                            }
                          }

                          sum += digit;
                          isEven = !isEven;
                        }

                        return sum % 10 === 0;
                      }),
                    firstName: Yup.string()
                      .required("This field is required")
                      .matches(
                        /^[a-zA-ZÀ-ÿ\s'-]+$/,
                        "Please enter a valid name",
                      )
                      .max(50, "Name is too long"),
                    lastName: Yup.string()
                      .required("This field is required")
                      .matches(
                        /^[a-zA-ZÀ-ÿ\s'-]+$/,
                        "Please enter a valid name",
                      )
                      .max(50, "Name is too long"),
                    expiryDate: Yup.string()
                      .required("This field is required")
                      .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "MM/YY format")
                      .test("expiry", "Invalid date", function (value) {
                        if (!value) return false;

                        const [month, year] = value.split("/");
                        const expiry = new Date(
                          2000 + parseInt(year),
                          parseInt(month),
                        );
                        const today = new Date();

                        // Set both dates to first of month for accurate comparison
                        today.setDate(1);
                        today.setHours(0, 0, 0, 0);

                        if (expiry < today) {
                          return false;
                        }

                        // Check if date is more than 10 years in future
                        const maxDate = new Date();
                        maxDate.setDate(1);
                        maxDate.setFullYear(maxDate.getFullYear() + 10);

                        if (expiry > maxDate) {
                          return false;
                        }

                        return true;
                      }),
                    cvv: Yup.string()
                      .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
                      .required("This field is required"),
                    email: Yup.string()
                      .email("Please enter a valid email address")
                      .required("This field is required"),
                    billingAddress: Yup.string()
                      .required("This field is required")
                      .max(100, "Address is too long"),
                    stateProvince: Yup.string().required(
                      "This field is required",
                    ),
                    zipPostalCode: Yup.string()
                      .matches(
                        /^[a-zA-Z0-9]{1,6}$/,
                        "Must be alphanumeric and up to 6 characters",
                      )
                      .required("This field is required"),
                    city: Yup.string()
                      .required("This field is required")
                      .max(50, "City name is too long"),
                    country: Yup.string().required("This field is required"),
                    termsAccepted: Yup.boolean()
                      .oneOf(
                        [true],
                        "You must accept the Terms and Privacy Policy",
                      )
                      .required("You must accept the Terms and Privacy Policy"),
                  })}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                      <div className={`${styles["authnet-paymentfull-form"]}`}>
                        <div className={`${styles["form-left"]}`}>
                          <div className={styles["input-form"]}>
                            <PaymentIcons className="justify-center flex sm:hidden mt-2 gap-4" />
                            <div className="space-y-5 md:space-y-4">
                              <InputField
                                variant={"secondary"}
                                label="Card Number"
                                className="bg-transparent"
                                error={errors.cardNumber}
                                touched={touched.cardNumber}
                                showIcon={false}
                                showAlertIcon={false}
                                tooltipContent="N/A"
                                size="sm"
                                errorMessageSize="tiny"
                              >
                                <Field name="cardNumber">
                                  {({ field, form }: FieldProps) => (
                                    <Input
                                      {...field}
                                      placeholder="Card Number"
                                      className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const value = event.target.value;
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={() => {
                                        form.validateField(field.name);
                                      }}
                                    />
                                  )}
                                </Field>
                              </InputField>

                              <InputField
                                variant={"secondary"}
                                label="First Name"
                                className="bg-transparent"
                                error={errors.firstName}
                                touched={touched.firstName}
                                showIcon={false}
                                showAlertIcon={false}
                                tooltipContent="N/A"
                                size="sm"
                                errorMessageSize="tiny"
                              >
                                <Field name="firstName">
                                  {({ field, form }: FieldProps) => (
                                    <Input
                                      {...field}
                                      placeholder="First Name"
                                      className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const value = event.target.value;
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={() => {
                                        form.validateField(field.name);
                                      }}
                                    />
                                  )}
                                </Field>
                              </InputField>

                              <InputField
                                variant={"secondary"}
                                label="Last Name"
                                className="bg-transparent"
                                error={errors.lastName}
                                touched={touched.lastName}
                                showIcon={false}
                                showAlertIcon={false}
                                tooltipContent="N/A"
                                size="sm"
                                errorMessageSize="tiny"
                              >
                                <Field name="lastName">
                                  {({ field, form }: FieldProps) => (
                                    <Input
                                      {...field}
                                      placeholder="Last Name"
                                      className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const value = event.target.value;
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={() => {
                                        form.validateField(field.name);
                                      }}
                                    />
                                  )}
                                </Field>
                              </InputField>

                              <div className={styles["expiry-cvv"]}>
                                <InputField
                                  variant={"secondary"}
                                  label="Expiry Date"
                                  className="bg-transparent"
                                  error={errors.expiryDate}
                                  touched={touched.expiryDate}
                                  showIcon={false}
                                  showAlertIcon={false}
                                  tooltipContent="N/A"
                                  size="sm"
                                  errorMessageSize="tiny"
                                >
                                  <Field name="expiryDate">
                                    {({ field, form }: FieldProps) => (
                                      <Input
                                        {...field}
                                        placeholder="MM/YY"
                                        className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                        onChange={(
                                          event: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                          const formattedValue =
                                            formatExpirationDate(
                                              event.target.value,
                                            );
                                          form.setFieldValue(
                                            field.name,
                                            formattedValue,
                                          );
                                        }}
                                        onBlur={() => {
                                          form.validateField(field.name);
                                        }}
                                        onKeyDown={handleExpirationDateKeyDown}
                                      />
                                    )}
                                  </Field>
                                </InputField>

                                <InputField
                                  variant={"secondary"}
                                  label="CVV"
                                  className="bg-transparent"
                                  error={errors.cvv}
                                  touched={touched.cvv}
                                  showIcon={false}
                                  showAlertIcon={false}
                                  tooltipContent="N/A"
                                  size="sm"
                                  errorMessageSize="tiny"
                                >
                                  <Field name="cvv">
                                    {({ field, form }: FieldProps) => (
                                      <Input
                                        {...field}
                                        placeholder="CVV"
                                        className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                        onChange={(
                                          event: React.ChangeEvent<HTMLInputElement>,
                                        ) => {
                                          const value = event.target.value;
                                          form.setFieldValue(field.name, value);
                                        }}
                                        onBlur={() => {
                                          form.validateField(field.name);
                                        }}
                                      />
                                    )}
                                  </Field>
                                </InputField>
                              </div>

                              <InputField
                                variant={"secondary"}
                                label="Email"
                                className="bg-transparent"
                                error={errors.email}
                                touched={touched.email}
                                showIcon={false}
                                showAlertIcon={false}
                                tooltipContent="Your contact email address"
                                size="sm"
                                errorMessageSize="tiny"
                              >
                                <Field name="email">
                                  {({ field, form }: FieldProps) => (
                                    <Input
                                      {...field}
                                      placeholder="Email Address"
                                      className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const value = event.target.value;
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={() => {
                                        form.validateField(field.name);
                                      }}
                                    />
                                  )}
                                </Field>
                              </InputField>

                              <InputField
                                variant={"secondary"}
                                label="Billing Address"
                                className="bg-transparent"
                                error={errors.billingAddress}
                                touched={touched.billingAddress}
                                showIcon={false}
                                showAlertIcon={false}
                                tooltipContent="The address linked to your payment method"
                                size="sm"
                                errorMessageSize="tiny"
                              >
                                <Field name="billingAddress">
                                  {({ field, form }: FieldProps) => (
                                    <Input
                                      {...field}
                                      placeholder="Billing Address"
                                      className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const value = event.target.value;
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={() => {
                                        form.validateField(field.name);
                                      }}
                                    />
                                  )}
                                </Field>
                              </InputField>

                              <InputField
                                variant={"secondary"}
                                label="State/Province"
                                className="bg-transparent"
                                error={errors.stateProvince}
                                touched={touched.stateProvince}
                                showIcon={false}
                                showAlertIcon={false}
                                tooltipContent="N/A"
                                size="sm"
                                errorMessageSize="tiny"
                              >
                                <Field name="stateProvince">
                                  {({ field, form }: FieldProps) => (
                                    <Input
                                      {...field}
                                      placeholder="State/Province"
                                      className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                      onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const value = event.target.value;
                                        form.setFieldValue(field.name, value);
                                      }}
                                      onBlur={() => {
                                        form.validateField(field.name);
                                      }}
                                    />
                                  )}
                                </Field>
                              </InputField>
                            </div>
                          </div>
                        </div>

                        <div className={`${styles["form-right"]}`}>
                          <div className="space-y-4">
                            <InputField
                              variant={"secondary"}
                              label="City"
                              className="bg-transparent"
                              error={errors.city}
                              touched={touched.city}
                              showIcon={false}
                              showAlertIcon={false}
                              tooltipContent="City of residence"
                              size="sm"
                              errorMessageSize="tiny"
                            >
                              <Field name="city">
                                {({ field, form }: FieldProps) => (
                                  <Input
                                    {...field}
                                    placeholder="City"
                                    className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                    onChange={(
                                      event: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                      const value = event.target.value;
                                      form.setFieldValue(field.name, value);
                                    }}
                                    onBlur={() => {
                                      form.validateField(field.name);
                                    }}
                                  />
                                )}
                              </Field>
                            </InputField>

                            <InputField
                              variant={"secondary"}
                              label="Country"
                              className="bg-transparent"
                              error={errors.country}
                              touched={touched.country}
                              showIcon={false}
                              showAlertIcon={false}
                              tooltipContent="N/A"
                              size="sm"
                              errorMessageSize="tiny"
                            >
                              <Field name="country">
                                {({ field, form }: FieldProps) => (
                                  <div className="relative">
                                    <CountrySelect
                                      value={field.value}
                                      onChange={(value) => {
                                        form.setFieldValue(field.name, value);
                                      }}
                                      className="border-[#000] border-2 focus:border-[#F5722E] rounded-md px-3"
                                      popoverClassName="z-50"
                                    />
                                  </div>
                                )}
                              </Field>
                            </InputField>

                            <InputField
                              variant={"secondary"}
                              label="Zip/Postal Code"
                              className="bg-transparent"
                              error={errors.zipPostalCode}
                              touched={touched.zipPostalCode}
                              showIcon={false}
                              showAlertIcon={false}
                              tooltipContent="N/A"
                              size="sm"
                              errorMessageSize="tiny"
                            >
                              <Field name="zipPostalCode">
                                {({ field, form }: FieldProps) => (
                                  <Input
                                    {...field}
                                    placeholder="Zip/Postal Code"
                                    className="bg-transparent border-[#000] h-[35px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                                    onChange={(
                                      event: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                      // Remove any spaces from the input value
                                      const value = event.target.value.replace(
                                        /\s/g,
                                        "",
                                      );
                                      form.setFieldValue(field.name, value);
                                    }}
                                    onKeyDown={(
                                      event: React.KeyboardEvent<HTMLInputElement>,
                                    ) => {
                                      // Prevent space key from being entered
                                      if (
                                        event.key === " " ||
                                        event.code === "Space"
                                      ) {
                                        event.preventDefault();
                                      }
                                    }}
                                    onBlur={() => {
                                      form.validateField(field.name);
                                    }}
                                  />
                                )}
                              </Field>
                            </InputField>
                          </div>

                          <div className="space-y-[10px] border-gray-200 pt-8 mb-4">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#263238]">
                                Subscription Fee
                              </span>
                              <span className="font-medium">
                                CAD $
                                {currentSelectedPlan ==
                                PLAN_SELECTION_ITEMS.MONTHLY
                                  ? isEmployer
                                    ? "50.00"
                                    : "5.00"
                                  : isEmployer
                                    ? "550.00"
                                    : "55.00"}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#263238]">
                                Transaction Fee 9.6%
                              </span>
                              <span className="font-medium">
                                CAD $
                                {currentSelectedPlan ==
                                PLAN_SELECTION_ITEMS.MONTHLY
                                  ? ((isEmployer ? 50 : 5) * 0.096).toFixed(2)
                                  : ((isEmployer ? 550 : 55) * 0.096).toFixed(
                                      2,
                                    )}
                              </span>
                            </div>
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#263238]">
                                {values.country?.toLowerCase() === "canada"
                                  ? "13% Tax"
                                  : "0% Tax"}
                              </span>
                              <span className="font-medium">
                                CAD $
                                {(() => {
                                  const baseAmount =
                                    currentSelectedPlan ==
                                    PLAN_SELECTION_ITEMS.MONTHLY
                                      ? isEmployer
                                        ? 50
                                        : 5
                                      : isEmployer
                                        ? 550
                                        : 55;
                                  const transactionFee = baseAmount * 0.096;
                                  const subtotal = baseAmount + transactionFee;
                                  return values.country?.toLowerCase() ===
                                    "canada"
                                    ? (subtotal * 0.13).toFixed(2)
                                    : "0.00";
                                })()}
                              </span>
                            </div>
                            <div className="flex justify-between border-gray-200">
                              <span className="text-[11px] text-orange-500">
                                Total
                              </span>
                              <span className="text-[11px] text-orange-500">
                                CAD $
                                {(() => {
                                  const baseAmount =
                                    currentSelectedPlan ==
                                    PLAN_SELECTION_ITEMS.MONTHLY
                                      ? isEmployer
                                        ? 50
                                        : 5
                                      : isEmployer
                                        ? 550
                                        : 55;
                                  const transactionFee = baseAmount * 0.096;
                                  const subtotal = baseAmount + transactionFee;
                                  const tax =
                                    values.country?.toLowerCase() === "canada"
                                      ? subtotal * 0.13
                                      : 0;
                                  return (subtotal + tax).toFixed(2);
                                })()}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`${styles["terms-and-privacy"]} relative`}
                          >
                            <Field name="termsAccepted">
                              {({ field }: FieldProps) => (
                                <div className="flex items-center">
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      {...field}
                                      className={`mt-1 ${errors.termsAccepted && touched.termsAccepted ? "border-red-500" : ""}`}
                                    />
                                    {errors.termsAccepted &&
                                      touched.termsAccepted && (
                                        <div
                                          className="absolute left-0 -top-4 bg-red-500 text-white text-[10px] py-1 px-2 rounded shadow-md"
                                          style={{
                                            whiteSpace: "nowrap",
                                            zIndex: 10,
                                            transform: "translateY(-50%)",
                                          }}
                                        >
                                          {errors.termsAccepted}
                                          <div className="absolute -bottom-1 left-2 w-2 h-2 bg-red-500 rotate-45" />
                                        </div>
                                      )}
                                  </div>
                                  <div className="ml-2">
                                    <label>
                                      I have read, understood and agree to the{" "}
                                    </label>
                                    <NavLink
                                      to={"/terms-and-conditions"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles["link"]}
                                    >
                                      <u>Terms of Use</u>
                                    </NavLink>
                                    <label> and </label>
                                    <NavLink
                                      to={"/privacy-policy"}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={styles["link"]}
                                    >
                                      <u>Privacy Policy.</u>
                                    </NavLink>
                                  </div>
                                </div>
                              )}
                            </Field>
                          </div>

                          <div className={styles["complete-payment-container"]}>
                            <label>
                              By Clicking "Complete Payment" you will be charged
                              the total price of{" "}
                            </label>
                            <label>
                              CAD $
                              {(() => {
                                const baseAmount =
                                  currentSelectedPlan ==
                                  PLAN_SELECTION_ITEMS.MONTHLY
                                    ? isEmployer
                                      ? 50
                                      : 5
                                    : isEmployer
                                      ? 550
                                      : 55;
                                const transactionFee = baseAmount * 0.096;
                                const subtotal = baseAmount + transactionFee;
                                const tax =
                                  values.country?.toLowerCase() === "canada"
                                    ? subtotal * 0.13
                                    : 0;
                                return (subtotal + tax).toFixed(2);
                              })()}
                            </label>
                          </div>

                          <button
                            type="submit"
                            className={`${styles["button-custom-orange"]} ${styles["noselect"]}`}
                          >
                            <img
                              src={button_loading_spinner}
                              alt="Loading"
                              className={styles["button-spinner"]}
                              hidden={!isSubmitting}
                            />
                            Complete Payment
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CloseConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onStay={handleStay}
        onLeave={handleLeave}
      />
    </>
  );
};

export default AuthnetPaymentFullModal;

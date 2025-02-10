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
    createAuthNetTokenizer,
    modalState,
    tempLoginEmail,
    tempLoginPassword,
  } = useLanding();
  const { isModalOpen, toggleModal } = useModal();
  const [paymentSubmit] = usePaymentCreateMutation();
  const [loginSubmit] = useLoginMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useErrorModal();
  const { login } = useAuth();
  const closeModalRef = useRef<HTMLImageElement>(null);

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
      currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? 5 : 55;
    const transactionFee = baseAmount * 0.096;
    const subtotal = baseAmount + transactionFee;
    const tax =
      values.country?.toLowerCase() === "canada" ? subtotal * 0.13 : 0;
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const secureData = {
      authData: {
        clientKey:
          "7wuXYQ768E3G3Seuy6aTf28PfU3mJWu7Bbj564KfTPqRa7RXUPZvTsnKz9Jf7daJ",
        apiLoginID: "83M29Sdd8",
      },
      cardData: {
        cardNumber: values.cardNumber,
        month: values.expiryDate.split("/")[0],
        year: values.expiryDate.split("/")[1],
        cardCode: values.cvv,
      },
    };

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

  const handleCloseModal = () => {
    toggleModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white shadow-lg w-full md:w-[642px] h-[554px] flex flex-col">
        {/* Fixed Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex flex-row items-center justify-between p-2 md:p-4 md:gap-4">
            {/* Logo - Full width on mobile, normal on desktop */}
            <div className="w-auto flex">
              <img src={authnet_logo} alt="Akaza Logo" className="h-8 sm:h-10" />
            </div>
            
            {/* Payment Icons & Close Button - Centered on mobile, right-aligned on desktop */}
            <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-3">
              <div className="flex items-center gap-1 md:gap-2">
                <img src={visa_icon} alt="Visa" className="h-6 sm:h-8" />
                <img src={amex_icon} alt="American Express" className="h-6 sm:h-8" />
                <img src={mastercard_icon} alt="Mastercard" className="h-6 sm:h-8" />
                <img src={discover_icon} alt="Discover" className="h-6 sm:h-8" />
              </div>

              <img
                ref={closeModalRef}
                className="cursor-pointer w-4 h-4 md:w-6 md:h-6"
                src={close_icon}
                alt="Close"
                onClick={handleCloseModal}
              />
            </div>
          </div>
        </div>
      <div className="flex-1 overflow-y-auto">
        <div className="w-full p-4">
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
                  .matches(
                    /^\d{13,19}$/,
                    "Card number must be between 13 and 19 digits",
                  )
                  .required("Card number is required"),
                firstName: Yup.string()
                  .matches(
                    /^[a-zA-Z\s]+$/,
                    "First name must only contain letters and spaces",
                  )
                  .required("First name is required"),
                lastName: Yup.string()
                  .matches(
                    /^[a-zA-Z\s]+$/,
                    "Last name must only contain letters and spaces",
                  )
                  .required("Last name is required"),
                expiryDate: Yup.string().required("ExpiryDate is required"),
                cvv: Yup.string()
                  .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
                  .required("CVV/CVC is required"),
                email: Yup.string()
                  .email("Must be a valid email")
                  .required("Email is required"),
                billingAddress: Yup.string().required(
                  "Billing address is required",
                ),
                stateProvince: Yup.string().required(
                  "State/Province is required",
                ),
                zipPostalCode: Yup.string()
                  .matches(
                    /^[a-zA-Z0-9]{1,6}$/,
                    "Zip/Postal code must be alphanumeric and up to 6 characters",
                  )
                  .required("Zip/Postal code is required"),
                city: Yup.string().required("City is required"),
                country: Yup.string().required("Country is required"),
                termsAccepted: Yup.boolean()
                  .oneOf([true], "You must accept the Terms and Privacy Policy")
                  .required("You must accept the Terms and Privacy Policy"),
              })}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, handleSubmit, values }) => (
                <form onSubmit={handleSubmit}>
                  <div className={`${styles["authnet-paymentfull-form"]}`}>
                    <div className={`${styles["form-left"]}`}>
                      <div className={styles["input-form"]}>
                        <div className="space-y-4">
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

                      <div className="space-y-[10px] border-gray-200 pt-8 mb-4">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#263238]">
                            Subscription Fee
                          </span>
                          <span className="font-medium">
                            $
                            {currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                              ? "5.00"
                              : "55.00"}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#263238]">
                            Transaction Fee 9.6%
                          </span>
                          <span className="font-medium">
                            $
                            {currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                              ? (5 * 0.096).toFixed(2)
                              : (55 * 0.096).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-[#263238]">
                            {values.country?.toLowerCase() === "canada"
                              ? "13% Tax"
                              : "Tax"}
                          </span>
                          <span className="font-medium">
                            $
                            {(() => {
                              const baseAmount =
                                currentSelectedPlan ==
                                PLAN_SELECTION_ITEMS.MONTHLY
                                  ? 5
                                  : 55;
                              const transactionFee = baseAmount * 0.096;
                              const subtotal = baseAmount + transactionFee;
                              return values.country?.toLowerCase() === "canada"
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
                            $
                            {(() => {
                              const baseAmount =
                                currentSelectedPlan ==
                                PLAN_SELECTION_ITEMS.MONTHLY
                                  ? 5
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
                            <div className="flex items-start">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  {...field}
                                  className={`mt-1 ${errors.termsAccepted && touched.termsAccepted ? "border-red-500" : ""}`}
                                />
                                {errors.termsAccepted &&
                                  touched.termsAccepted && (
                                    <div
                                      className="absolute left-0 -top-4 bg-red-500 text-white text-xs py-1 px-2 rounded shadow-md"
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
                                <a
                                  href="https://app.websitepolicies.com/policies/view/azn4i7fg"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles["link"]}
                                >
                                  <u>Terms of Use</u>
                                </a>
                                <label> and </label>
                                <a
                                  href="https://app.websitepolicies.com/policies/view/2albjkzj"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles["link"]}
                                >
                                  <u>Privacy Policy.</u>
                                </a>
                              </div>
                            </div>
                          )}
                        </Field>
                      </div>

                      <div className={styles["complete-payment-container"]}>
                        <label>
                          By Clicking "Complete Payment" you will be charged the
                          total price of{" "}
                        </label>
                        <label>
                          $
                          {(() => {
                            const baseAmount =
                              currentSelectedPlan ==
                              PLAN_SELECTION_ITEMS.MONTHLY
                                ? 5
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
  );
};

export default AuthnetPaymentFullModal;

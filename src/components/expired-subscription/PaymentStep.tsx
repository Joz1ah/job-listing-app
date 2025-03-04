import React, { useState, useEffect } from "react";
import { usePaymentCreateMutation } from "api/akaza/akazaAPI";
import { Button } from "components";
import { Input } from "components";
import { InputField } from "components";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { Formik, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { LockKeyhole, ChevronLeft } from "lucide-react";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import companyLogoLight from "images/company-logo-light.svg?url";
import companyLogoDark from "images/company-logo-dark.svg?url";
import { CountrySelect } from "components";
import { createAuthNetTokenizer, createAuthnetPaymentSecureData } from "services/authnet/authnetService";

interface PaymentStepProps {
  planType: "yearly" | "monthly";
  onBack: () => void;
  features: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  onSuccess: () => void;
}

interface PaymentFormValues {
  firstName: string;
  lastName: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface AddressFormValues {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  termsAccepted?: boolean;
}

interface AcceptJsResponse {
  messages: {
    resultCode: string;
    message: Array<{ text: string }>;
  };
  opaqueData: {
    dataValue: string;
  };
}

declare global {
  interface Window {
    Accept: {
      dispatchData: (
        data: any,
        callback: (response: AcceptJsResponse) => void,
      ) => void;
    };
  }
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  planType,
  features,
  onSuccess,
  onBack,
}) => {
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useErrorModal();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [addressFormData, setAddressFormData] = useState<AddressFormValues>({
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    termsAccepted: false,
  });

  const formatExpirationDate = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  useEffect(() => {
    createAuthNetTokenizer();
  }, []);

  const handleSubmit = async (values: AddressFormValues) => {
    setIsSubmitting(true);
    setAddressFormData(values);

    const baseAmount = planType === "monthly" ? 5 : 55;
    const transactionFee = baseAmount * 0.096;
    const subtotal = baseAmount + transactionFee;
    const tax =
      values.country?.toLowerCase() === "canada" ? subtotal * 0.13 : 0;
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const secureData = createAuthnetPaymentSecureData({
      cardNumber: paymentFormData.cardNumber,
      month: paymentFormData.expiryDate.split("/")[0],
      year: paymentFormData.expiryDate.split("/")[1],
      cardCode: paymentFormData.cvv,
   })

    window.Accept.dispatchData(
      secureData,
      async (response: AcceptJsResponse) => {
        if (response.messages.resultCode === "Ok") {
          try {
            await paymentSubmit({
              provider: "authnet",
              plan: planType === "monthly" ? "Monthly" : "Yearly",
              amount: totalAmount,
              paymentMethodId: response.opaqueData.dataValue,
              daysTrial: 0,
              firstName: paymentFormData.firstName,
              lastName: paymentFormData.lastName,
              email: paymentFormData.email,
              address: values.address,
              city: values.city,
              state: values.state,
              zip: values.zipCode,
              country: values.country,
            }).unwrap();

            setIsSubmitting(false);
            onSuccess();
          } catch (err: any) {
            showError(err?.data?.errors, err?.data?.message);
            setIsSubmitting(false);
          }
        } else {
          setIsSubmitting(false);
          showError("Payment Error", response.messages.message[0].text);
        }
      },
    );
  };

  const handleBackToPaymentForm = () => {
    setCurrentStep(1);
  };

  const handleBackToPlans = () => {
    onBack();
  };

  const handleFirstStep = (values: PaymentFormValues) => {
    setPaymentFormData(values);
    setCurrentStep(2);
  };

  const renderCompanyLogo = () => (
    <div className="md:mx-8">
      <img
        src={planType === "monthly" ? companyLogoDark : companyLogoLight}
        className="w-[80px] h-[25px] -ml-1 mb-1"
      />
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[#F5722E] font-semibold text-[22px]">
          {planType === "yearly" ? "Yearly Plan" : "Monthly Plan"}
        </span>
      </div>
      <p
        className={`text-[13px] font-light mb-2 ${
          planType === "yearly" ? "text-[#F5F5F7]" : "text-[#263238]"
        }`}
      >
        Maximize your reach, save more, and hire the best talent faster
      </p>
    </div>
  );

  if (currentStep === 1) {
    const getInputClassName = () => {
      return `bg-transparent h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD] ${
        planType === "yearly"
          ? "text-[#F5F5F7] border-[#F5F5F7]"
          : "text-[#263238] border-[#263238]"
      }`;
    };

    return (
      <div className="w-full">
        <div>
          <button
            onClick={handleBackToPlans}
            className={`flex items-center text-${planType === "yearly" ? "[#F5F5F7]" : "[#F5722E]"} text-xs bg-transparent px-2 py-1 rounded-md border border-${planType === "yearly" ? "[#F5F5F7]" : "[#F5722E]"} mb-4 hover:bg-${planType === "yearly" ? "[#F5F5F7]/10" : "[#F5722E]/10"}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="ml-1">Back to Plans</span>
          </button>
        </div>
        {renderCompanyLogo()}

        <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl md:mx-8">
          <div className="mb-8 md:mb-0">
            <div className="flex flex-col pb-6">
              <div className="flex justify-start mt-4">
                <div className="flex gap-2">
                  <img src={visa_icon} alt="Visa" />
                  <img src={amex_icon} alt="American Express" />
                  <img src={mastercard_icon} alt="Mastercard" />
                  <img src={discover_icon} alt="Discover" />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[24px] md:text-[32px] font-extrabold text-[#F5722E]">
                  ${planType === "yearly" ? "55" : "5"}
                </span>
                <span className="text-xl font-bold text-[#F5722E]">
                  /{planType === "yearly" ? "year" : "month"}
                </span>
                {planType === "yearly" && (
                  <span className="text-[24px] md:text-[32px] text-[#AEADAD] ml-2 relative after:absolute after:w-full after:h-[1px] after:bg-[#AEADAD] after:left-0 after:top-1/2">
                    $60/year
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] -mt-2 font-extralight ${
                  planType === "yearly" ? "text-[#F5F5F7]" : "text-[#263238]"
                }`}
              >
                + transaction fee
              </span>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[#F5722E]">
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      size: 18,
                      className: "stroke-current",
                    })}
                  </span>
                  <span
                    className={`text-sm ${planType === "yearly" ? "text-[#F5F5F7]" : "text-[#263238]"}`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Formik
              initialValues={paymentFormData}
              validationSchema={Yup.object({
                firstName: Yup.string()
                  .required("This field is required")
                  .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Please enter a valid name")
                  .max(50, "Name is too long"),
                lastName: Yup.string()
                  .required("This field is required")
                  .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Please enter a valid name")
                  .max(50, "Name is too long"),
                email: Yup.string()
                  .email("Please enter a valid email address")
                  .required("This field is required"),
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
                expiryDate: Yup.string()
                  .required("This field is required")
                  .matches(
                    /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                    "Must be in MM/YY format",
                  )
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
                  .required("CVV is required")
                  .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
              })}
              validateOnMount
              onSubmit={handleFirstStep}
            >
              {({ errors, touched, isValid, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <InputField
                      label="First Name"
                      variant={planType === "yearly" ? "primary" : "payment"}
                      size="sm"
                    >
                      <Field name="firstName">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            className={getInputClassName()}
                            placeholder="First name"
                          />
                        )}
                      </Field>
                      {errors.firstName && touched.firstName && (
                        <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                          {errors.firstName}
                        </div>
                      )}
                    </InputField>

                    <InputField
                      label="Last Name"
                      variant={planType === "yearly" ? "primary" : "payment"}
                      size="sm"
                    >
                      <Field name="lastName">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            className={getInputClassName()}
                            placeholder="Last name"
                          />
                        )}
                      </Field>
                      {errors.lastName && touched.lastName && (
                        <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                          {errors.lastName}
                        </div>
                      )}
                    </InputField>

                    <InputField
                      label="Card Number"
                      variant={planType === "yearly" ? "primary" : "payment"}
                      size="sm"
                    >
                      <Field name="cardNumber">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            className={getInputClassName()}
                            placeholder="Enter card number"
                          />
                        )}
                      </Field>
                      {errors.cardNumber && touched.cardNumber && (
                        <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                          {errors.cardNumber}
                        </div>
                      )}
                    </InputField>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <InputField
                          label="Expiry Date"
                          variant={
                            planType === "yearly" ? "primary" : "payment"
                          }
                          size="sm"
                        >
                          <Field name="expiryDate">
                            {({ field, form }: FieldProps) => (
                              <Input
                                {...field}
                                className={getInputClassName()}
                                placeholder="MM/YY"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                  const formattedValue = formatExpirationDate(
                                    e.target.value,
                                  );
                                  form.setFieldValue(
                                    field.name,
                                    formattedValue,
                                  );
                                }}
                              />
                            )}
                          </Field>
                          {errors.expiryDate && touched.expiryDate && (
                            <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                              {errors.expiryDate}
                            </div>
                          )}
                        </InputField>
                      </div>
                      <div>
                        <InputField
                          label="CVV"
                          variant={
                            planType === "yearly" ? "primary" : "payment"
                          }
                          size="sm"
                        >
                          <Field name="cvv">
                            {({ field }: FieldProps) => (
                              <Input
                                {...field}
                                className={getInputClassName()}
                                placeholder="XXX"
                              />
                            )}
                          </Field>
                          {errors.cvv && touched.cvv && (
                            <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                              {errors.cvv}
                            </div>
                          )}
                        </InputField>
                      </div>
                    </div>

                    <InputField
                      label="Email Address"
                      variant={planType === "yearly" ? "primary" : "payment"}
                      size="sm"
                    >
                      <Field name="email">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="email"
                            className={getInputClassName()}
                            placeholder="Email address"
                          />
                        )}
                      </Field>
                      {errors.email && touched.email && (
                        <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                          {errors.email}
                        </div>
                      )}
                    </InputField>
                  </div>

                  <div className="space-y-3 mt-5">
                    <Button
                      type="submit"
                      disabled={!isValid}
                      className={`w-full ${
                        isValid
                          ? "bg-[#F5722E] hover:bg-[#F5722E]/90"
                          : "bg-[#AEADAD]"
                      } text-white h-[34px] rounded`}
                    >
                      Next
                    </Button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }

  const getInputClassName = () => {
    return `bg-transparent h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD] ${
      planType === "yearly"
        ? "text-[#F5F5F7] border-[#F5F5F7]"
        : "text-[#263238] border-[#263238]"
    }`;
  };

  return (
    <div className="w-full">
      <div>
        <button
          onClick={handleBackToPaymentForm}
          className={`flex items-center text-${planType === "yearly" ? "[#F5F5F7]" : "[#F5722E]"} text-xs bg-transparent px-2 py-1 rounded-md border border-${planType === "yearly" ? "[#F5F5F7]" : "[#F5722E]"} mb-4 hover:bg-${planType === "yearly" ? "[#F5F5F7]/10" : "[#F5722E]/10"}`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1">Back</span>
        </button>
      </div>

      {renderCompanyLogo()}

      <Formik
        initialValues={addressFormData}
        validationSchema={Yup.object({
          address: Yup.string()
            .required("Address is required")
            .max(100, "Address is too long"),
          city: Yup.string()
            .required("City is required")
            .max(50, "City name is too long"),
          state: Yup.string().required("State is required"),
          country: Yup.string().required("Country is required"),
          zipCode: Yup.string()
            .matches(
              /^[a-zA-Z0-9]{1,6}$/,
              "Must be alphanumeric and up to 6 characters",
            )
            .required("This field is required"),
          termsAccepted: Yup.boolean()
            .oneOf([true], "You must accept the Terms and Privacy Policy")
            .required("You must accept the Terms and Privacy Policy"),
        })}
        validateOnMount
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isValid, handleSubmit, values }) => (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl md:mx-8 gap-8 pt-2">
              {/* Left Column - Address Form */}
              <div className="space-y-4">
                <InputField
                  label="Billing Address"
                  variant={planType === "yearly" ? "primary" : "payment"}
                  size="sm"
                >
                  <Field name="address">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        className={getInputClassName()}
                        placeholder="House No./Bldg./Street"
                      />
                    )}
                  </Field>
                  {errors.address && touched.address && (
                    <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                      {errors.address}
                    </div>
                  )}
                </InputField>

                <InputField
                  label="State"
                  variant={planType === "yearly" ? "primary" : "payment"}
                  size="sm"
                >
                  <Field name="state">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        className={getInputClassName()}
                        placeholder="State"
                      />
                    )}
                  </Field>
                  {errors.state && touched.state && (
                    <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                      {errors.state}
                    </div>
                  )}
                </InputField>

                <InputField
                  label="City"
                  variant={planType === "yearly" ? "primary" : "payment"}
                  size="sm"
                >
                  <Field name="city">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        className={getInputClassName()}
                        placeholder="City"
                      />
                    )}
                  </Field>
                  {errors.city && touched.city && (
                    <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                      {errors.city}
                    </div>
                  )}
                </InputField>

                <InputField
                  label="Country"
                  variant={planType === "yearly" ? "primary" : "payment"}
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
                          className={`${getInputClassName()} rounded-md px-3 w-full hover:text-[#F5F5F7]`}
                          popoverClassName="z-50"
                        />
                      </div>
                    )}
                  </Field>
                  {errors.country && touched.country && (
                    <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                      {errors.country}
                    </div>
                  )}
                </InputField>

                <InputField
                  label="Zip/Postal Code"
                  variant={planType === "yearly" ? "primary" : "payment"}
                  size="sm"
                >
                  <Field name="zipCode">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        className={getInputClassName()}
                        placeholder="Zip/Postal Code"
                      />
                    )}
                  </Field>
                  {errors.zipCode && touched.zipCode && (
                    <div className="absolute text-red-500 right-0 italic text-[10px] md:text-xs mt-1">
                      {errors.zipCode}
                    </div>
                  )}
                </InputField>
              </div>

              {/* Right Column - Payment Summary and Buttons */}
              <div className="space-y-1 pt-2">
                <div className="relative">
                  <Field name="termsAccepted">
                    {({ field }: FieldProps) => (
                      <div className="flex items-start">
                        <div className="relative">
                          <input
                            type="checkbox"
                            {...field}
                            className={`mt-1 w-5 h-5 cursor-pointer items-center ${
                              errors.termsAccepted && touched.termsAccepted
                                ? "border-red-500"
                                : "border-[#F5F5F7]"
                            }`}
                          />
                          {errors.termsAccepted && touched.termsAccepted && (
                            <div
                              className="absolute left-0 -top-4 bg-red-500 text-white text-[11px] py-1 px-2 rounded shadow-md"
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
                        <div className="ml-2 text-[14px]">
                          <label
                            className={`${
                              planType === "yearly"
                                ? "text-[#F5F5F7]"
                                : "text-[#263238]"
                            }`}
                          >
                            I have read, understood and agree to the{" "}
                            <a
                              href="https://app.websitepolicies.com/policies/view/azn4i7fg"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F5722E] underline"
                            >
                              Terms of Use
                            </a>{" "}
                            and{" "}
                            <a
                              href="https://app.websitepolicies.com/policies/view/2albjkzj"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F5722E] underline"
                            >
                              Privacy Policy
                            </a>
                          </label>
                        </div>
                      </div>
                    )}
                  </Field>
                </div>

                <div className="space-y-2 text-sm pt-4">
                  <div
                    className={`flex justify-between ${
                      planType === "yearly"
                        ? "text-[#F5F5F7]"
                        : "text-[#263238]"
                    }`}
                  >
                    <span>Subscription Fee</span>
                    <span>${planType === "yearly" ? "55.00" : "5.00"}</span>
                  </div>
                  <div
                    className={`flex justify-between ${
                      planType === "yearly"
                        ? "text-[#F5F5F7]"
                        : "text-[#263238]"
                    }`}
                  >
                    <span>Transaction Fee (9.6%)</span>
                    <span>
                      ${(planType === "yearly" ? 5.28 : 0.48).toFixed(2)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between ${
                      planType === "yearly"
                        ? "text-[#F5F5F7]"
                        : "text-[#263238]"
                    }`}
                  >
                    <span>
                      {values.country?.toLowerCase() === "canada"
                        ? "13% Tax"
                        : "Tax"}
                    </span>
                    <span>
                      $
                      {(() => {
                        const baseAmount = planType === "yearly" ? 55 : 5;
                        const transactionFee = baseAmount * 0.096;
                        const subtotal = baseAmount + transactionFee;
                        return values.country?.toLowerCase() === "canada"
                          ? (subtotal * 0.13).toFixed(2)
                          : "0.00";
                      })()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#F5722E] font-semibold mt-4">
                    <span>Total</span>
                    <span>
                      $
                      {(() => {
                        const baseAmount = planType === "yearly" ? 55 : 5;
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

                <div className="space-y-3 pt-6">
                  <div
                    className={`text-[14px] pt-2 ${
                      planType === "yearly"
                        ? "text-[#F5F5F7]"
                        : "text-[#263238]"
                    }`}
                  >
                    By clicking "Complete Payment" you will be charged the total
                    price of{" "}
                    <span className="text-[#F5722E]">
                      $
                      {(() => {
                        const baseAmount = planType === "yearly" ? 55 : 5;
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

                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`w-full ${
                      isValid
                        ? "bg-[#F5722E] hover:bg-[#F5722E]/90"
                        : "bg-[#AEADAD] cursor-not-allowed"
                    } text-white h-[34px] rounded`}
                  >
                    {isSubmitting ? "Processing..." : "Complete Payment"}
                  </Button>

                  <div className="flex flex-col items-start pb-3.5">
                    <div className="flex items-center">
                      <LockKeyhole className="text-[#4BAF66]" size={11} />
                      <a className="text-[#4BAF66] text-[9px] underline ml-2">
                        Security & Policy
                      </a>
                    </div>
                    <p
                      className={`text-[10px] ${
                        planType === "yearly"
                          ? "text-[#F5F5F7]"
                          : "text-[#263238]"
                      }`}
                    >
                      We maintain industry-standard physical, technical, and
                      administrative measures to safeguard your personal
                      information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export { PaymentStep };

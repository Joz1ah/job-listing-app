import React, { useState, useEffect } from "react";
import { usePaymentCreateMutation } from "api/akaza/akazaAPI";
import { Button } from "components";
import { Input } from "components";
import { InputField } from "components";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { Formik, Field, FieldProps } from "formik";
import { LockKeyhole, ChevronLeft } from "lucide-react";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import companyLogoLight from "images/company-logo-light.svg?url";
import companyLogoDark from "images/company-logo-dark.svg?url";
import { CountrySelect } from "components";
import { useAuth } from "contexts/AuthContext/AuthContext";
import {
  createAuthNetTokenizer,
  createAuthnetPaymentSecureData,
} from "services/authnet/authnetService";
import { NavLink } from "react-router-dom";
import {
  createPaymentStepValidationSchema,
  createAddressValidationSchema,
} from "utils/cardValidationSchema";

interface PaymentStepProps {
  planType: "yearly" | "monthly";
  onBack: () => void;
  features: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  onSuccess: () => void;
  // Optional prop to override user type
  userType?: "employer" | "job_hunter";
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
  userType: propUserType,
}) => {
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showError } = useErrorModal();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const { user } = useAuth();

  // Determine if user is employer - first try from props, then from auth context
  const contextUserType = user?.data?.user?.type;
  const isEmployer =
    propUserType === "employer" || contextUserType === "employer";

  // Set base prices based on user type
  const yearlyPrice = isEmployer ? 550 : 55;
  const monthlyPrice = isEmployer ? 50 : 5;

  // Get the current base amount based on plan type and user type
  const baseAmount = planType === "monthly" ? monthlyPrice : yearlyPrice;

  // Calculate derived values
  const transactionFee = Number((baseAmount * 0.096).toFixed(2));

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

    const subtotal = baseAmount + transactionFee;
    const tax =
      values.country?.toLowerCase() === "canada" ? subtotal * 0.13 : 0;
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const secureData = createAuthnetPaymentSecureData({
      cardNumber: paymentFormData.cardNumber,
      month: paymentFormData.expiryDate.split("/")[0],
      year: paymentFormData.expiryDate.split("/")[1],
      cardCode: paymentFormData.cvv,
    });

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
        className={`text-[13px] font-light ${
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
              <div className="flex items-baseline">
                <span className="text-[#F5722E] mr-1 text-sm font-bold">
                  CAD
                </span>
                <span className="text-[#F5722E] text-sm">$</span>
                <span className="text-[32px] font-bold text-[#F5722E]">
                  {planType === "yearly" ? yearlyPrice : monthlyPrice}
                </span>
                
                <span className="text-lg font-semibold text-[#F5722E]">
                  /{planType === "yearly" ? "year" : "month"}
                </span>
                {planType === "yearly" && (
                  <span className="text-2xl text-gray-400 ml-2 line-through">
                    ${isEmployer ? "600" : "60"}/year
                  </span>
                )}
              </div>
              <span
                className={`text-[13px] -mt-1 font-extralight ${planType === "yearly" ? "text-[#F5F5F7]" : "text-[#263238]"}`}
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
              validationSchema={createPaymentStepValidationSchema()}
              validateOnMount
              validateOnChange={true}
              validateOnBlur={true}
              onSubmit={handleFirstStep}
            >
              {({
                errors,
                touched,
                isValid,
                handleSubmit,
                setFieldTouched,
              }) => (
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              field.onChange(e);
                              setFieldTouched("firstName", true, false);
                            }}
                          />
                        )}
                      </Field>
                      {errors.firstName && touched.firstName && (
                        <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              field.onChange(e);
                              setFieldTouched("lastName", true, false);
                            }}
                          />
                        )}
                      </Field>
                      {errors.lastName && touched.lastName && (
                        <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              field.onChange(e);
                              setFieldTouched("cardNumber", true, false);
                            }}
                          />
                        )}
                      </Field>
                      {errors.cardNumber && touched.cardNumber && (
                        <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                                  setFieldTouched("expiryDate", true, false);
                                }}
                              />
                            )}
                          </Field>
                          {errors.expiryDate && touched.expiryDate && (
                            <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>,
                                ) => {
                                  field.onChange(e);
                                  setFieldTouched("cvv", true, false);
                                }}
                              />
                            )}
                          </Field>
                          {errors.cvv && touched.cvv && (
                            <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              field.onChange(e);
                              setFieldTouched("email", true, false);
                            }}
                          />
                        )}
                      </Field>
                      {errors.email && touched.email && (
                        <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
                          {errors.email}
                        </div>
                      )}
                    </InputField>
                  </div>

                  <div className="space-y-3 mt-5">
                    <Button
                      type="submit"
                      className={`w-full ${
                        isValid
                          ? "bg-[#F5722E] hover:bg-[#F5722E]/90"
                          : "bg-[#AEADAD] hover:bg-[#AEADAD]/90"
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
        validationSchema={createAddressValidationSchema()}
        validateOnMount
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={handleSubmit}
      >
        {({
          errors,
          touched,
          isValid,
          handleSubmit,
          values,
          setFieldTouched,
        }) => (
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e);
                          setFieldTouched("address", true, false);
                        }}
                      />
                    )}
                  </Field>
                  {errors.address && touched.address && (
                    <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e);
                          setFieldTouched("state", true, false);
                        }}
                      />
                    )}
                  </Field>
                  {errors.state && touched.state && (
                    <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          field.onChange(e);
                          setFieldTouched("city", true, false);
                        }}
                      />
                    )}
                  </Field>
                  {errors.city && touched.city && (
                    <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                            setFieldTouched("country", true, false);
                          }}
                          className={`${getInputClassName()} rounded-md px-3 w-full hover:text-[#F5F5F7]`}
                          popoverClassName="z-50"
                        />
                      </div>
                    )}
                  </Field>
                  {errors.country && touched.country && (
                    <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px] mr-1">
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
                    {({ field, form }: FieldProps) => (
                      <Input
                        {...field}
                        className={getInputClassName()}
                        placeholder="Zip/Postal Code"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                          // Remove any spaces from the input value
                          const value = event.target.value.replace(/\s/g, "");
                          form.setFieldValue(field.name, value);
                          setFieldTouched("zipCode", true, false);
                        }}
                        onKeyDown={(
                          event: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                          // Prevent space key from being entered
                          if (event.key === " " || event.code === "Space") {
                            event.preventDefault();
                          }
                        }}
                      />
                    )}
                  </Field>
                  {errors.zipCode && touched.zipCode && (
                    <div className="absolute text-red-500 right-0 italic text-[9px] md:text-[10px]">
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
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("termsAccepted", true, false);
                            }}
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
                            <NavLink
                              to={"/terms-and-conditions"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F5722E] underline"
                            >
                              Terms of Use
                            </NavLink>{" "}
                            and{" "}
                            <NavLink
                              to={"/privacy-policy"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#F5722E] underline"
                            >
                              Privacy Policy
                            </NavLink>
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
                    <span>CAD ${baseAmount.toFixed(2)}</span>
                  </div>
                  <div
                    className={`flex justify-between ${
                      planType === "yearly"
                        ? "text-[#F5F5F7]"
                        : "text-[#263238]"
                    }`}
                  >
                    <span>Transaction Fee (9.6%)</span>
                    <span>CAD ${transactionFee.toFixed(2)}</span>
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
                      CAD $
                      {(() => {
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
                      CAD $
                      {(() => {
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
                      CAD $
                      {(() => {
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
                    disabled={isSubmitting}
                    className={`w-full ${
                      isValid
                        ? "bg-[#F5722E] hover:bg-[#F5722E]/90"
                        : "bg-[#AEADAD] hover:bg-[#AEADAD]/90"
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

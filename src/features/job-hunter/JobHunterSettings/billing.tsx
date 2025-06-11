import { FC, useEffect, useState, useRef } from "react";
import { Tooltip, Button } from "components";
import { Info, X } from "lucide-react";
import { useJobHunterContext } from "components";
import rocketIcon from "images/rocket-subscribe.svg?url";
import { Link } from "react-router-dom";
import {
  usePaymentCardDetailsMutation,
  useUpdatePaymentCardMutation,
} from "api/akaza/akazaAPI";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import jcb_icon from "assets/credit-card-icons/cc_jcb.svg?url";
import undetected_card from "assets/credit-card-icons/cc_undetected.svg?url";
import { Formik, Field, FieldProps, FormikProps } from "formik";
import { Input } from "components";
import { InputField } from "components";
import { CountrySelect } from "components";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import {
  createAuthNetTokenizer,
  createAuthnetPaymentSecureData,
} from "services/authnet/authnetService";
import { createBillingValidationSchema } from "utils/cardValidationSchema";

interface PaymentCardFormValues {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Extended interface to store all payment details
interface PaymentDetails {
  cardNumber: string;
  expirationDate: string;
  cardType: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  cvv?: string; // CVV typically won't be returned for security reasons
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

const formatExpirationDate = (value: string): string => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

const BillingSettings: FC = () => {
  const { subscriptionPlan } = useJobHunterContext();
  const { showError } = useErrorModal();

  // Updated state to store complete payment details
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: "",
    expirationDate: "",
    cardType: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formikRef = useRef<FormikProps<PaymentCardFormValues>>(null);

  // Use the mutation hooks
  const [getCardDetails, { isLoading }] = usePaymentCardDetailsMutation();
  const [updatePaymentCard] = useUpdatePaymentCardMutation();

  useEffect(() => {
    // Initialize AuthNet tokenizer
    createAuthNetTokenizer();

    // Only fetch card details if user has a paid subscription
    if (subscriptionPlan && subscriptionPlan !== "freeTrial") {
      fetchCardDetails();
    } else {
      setLoading(false);
    }
  }, [subscriptionPlan]);

  const fetchCardDetails = async () => {
    try {
      const response = await getCardDetails({
        provider: "authnet",
        customerId: "",
      }).unwrap();

      // Extract comprehensive payment details from the response
      if (response && response.length > 0) {
        const paymentData = response[0];
        const creditCard = paymentData?.payment?.creditCard;
        const billTo = paymentData?.billTo; // Assuming billing info is in billTo object

        setPaymentDetails({
          cardNumber: creditCard?.cardNumber || "",
          expirationDate: creditCard?.expirationDate || "",
          cardType: creditCard?.cardType || "",
          firstName: billTo?.firstName || "",
          lastName: billTo?.lastName || "",
          email: billTo?.email || "",
          address: billTo?.address || "",
          city: billTo?.city || "",
          state: billTo?.state || "",
          country: billTo?.country || "",
          zipCode: billTo?.zip || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch card details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Smooth transition between views
  const handleEditClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowPaymentForm(true);

      // Populate the form with only first name, last name, and card number
      if (formikRef.current) {
        formikRef.current.setValues({
          firstName: paymentDetails.firstName,
          lastName: paymentDetails.lastName,
          cardNumber: paymentDetails.cardNumber,
          expiryDate: "", // Leave empty
          cvv: "", // Leave empty for security
          email: "", // Leave empty
          address: "", // Leave empty
          city: "", // Leave empty
          state: "", // Leave empty
          country: "", // Leave empty
          zipCode: "", // Leave empty
        });
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  // Smooth transition when closing form and reset form values
  const handleClosePaymentForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowPaymentForm(false);
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
      setTimeout(() => {
        setIsAnimating(false);
      }, 50);
    }, 200);
  };

  const handleSubmitPaymentForm = async (values: PaymentCardFormValues) => {
    setIsSubmitting(true);

    try {
      const secureData = createAuthnetPaymentSecureData({
        cardNumber: values.cardNumber,
        month: values.expiryDate.split("/")[0],
        year: values.expiryDate.split("/")[1],
        cardCode: values.cvv,
      });

      window.Accept.dispatchData(
        secureData,
        async (response: AcceptJsResponse) => {
          if (response.messages.resultCode === "Ok") {
            try {
              // Step 3: Use the opaque token in the API call
              await updatePaymentCard({
                provider: "authnet",
                paymentMethodId: response.opaqueData.dataValue, // ✅ Using opaque data now
                daysTrial: 0,
                firstName: values.firstName,
                lastName: values.lastName,
                address: values.address,
                city: values.city,
                state: values.state,
                zip: values.zipCode,
                country: values.country,
              }).unwrap();

              // Refresh card details after successful update
              await fetchCardDetails();

              // Close the form and go back to card details interface
              handleClosePaymentForm();

              setIsSubmitting(false);
            } catch (err: any) {
              setIsSubmitting(false);
              showError(
                err?.data?.errors,
                err?.data?.message || "Failed to update payment card",
              );
            }
          } else {
            setIsSubmitting(false);
            showError("Payment Error", response.messages.message[0].text);
          }
        },
      );
    } catch (error) {
      setIsSubmitting(false);
      console.error("Failed to process payment card update:", error);
      showError("Payment Error", "Failed to process payment information");
    }
  };

  const editTooltip =
    subscriptionPlan === "freeTrial"
      ? "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!"
      : "Update your payment information";

  // Free trial view
  if (subscriptionPlan === "freeTrial") {
    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div className="max-w-3xl mb-4 sm:mb-0">
            <h2 className="text-white text-xl sm:text-2xl font-normal mb-3">
              Billing & Information
            </h2>
            <p className="text-white text-sm sm:text-[15px] font-light">
              Last 4 digits of the card currently used for your subscription.
            </p>
          </div>
        </div>

        {/* Free Trial Content */}
        {/* Edit Button Section */}
        <div className="flex justify-end gap-2 mb-6">
          <Button className="text-[13px] px-3 py-0.5 rounded bg-[#F5722E] text-white text-sm hover:bg-[#F5722E]/70 transition-colors">
            Edit
          </Button>
          <Tooltip content={editTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
          </Tooltip>
        </div>

        <div className="flex flex-col items-center justify-center mt-8 sm:mt-16">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <img
              src={rocketIcon}
              alt="Rocket"
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
          </div>

          <h3 className="text-[#F5722E] text-lg sm:text-xl font-medium mb-4 text-center">
            Take the next step—subscribe and explore!
          </h3>

          <p className="text-white text-center mb-6 max-w-md">
            It appears that you are not currently subscribed. Subscribing will
            give you access to exclusive features, updates, and benefits.
          </p>

          <p className="text-white text-center mb-8">
            Consider subscribing to make the most of your experience!
          </p>

          <Link to="/dashboard/account-settings/subscription">
            <button className="w-full sm:w-auto px-6 py-2 bg-[#F5722E] text-white rounded text-sm hover:bg-orange-600 transition-colors">
              Subscribe Now
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header Section - Always visible */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div className="max-w-3xl mb-4 sm:mb-0">
          <h2 className="text-white text-xl sm:text-2xl font-normal mb-3">
            Billing & Information
          </h2>
          <p className="text-white text-sm sm:text-[15px] font-light">
            The card details below are the ones currently used for your
            subscription.
          </p>
        </div>
      </div>

      {/* Content Container */}
      <div className="relative">
        {/* Card Details View */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            !showPaymentForm
              ? isAnimating
                ? "opacity-0 transform -translate-x-6"
                : "opacity-100 transform translate-x-0"
              : "hidden"
          }`}
        >
          {/* Edit Button Section */}
          <div className="flex justify-end gap-2 mb-6">
            <Button
              className="px-3 py-0.5 h-[26px] rounded bg-[#F5722E] text-white text-sm hover:bg-[#F5722E]/70 transition-colors"
              onClick={handleEditClick}
              disabled={showPaymentForm || isAnimating}
            >
              Edit
            </Button>
            <Tooltip content={editTooltip}>
              <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
            </Tooltip>
          </div>

          {/* Card Section */}
          <div className="flex justify-center items-center w-full my-12">
            {loading || isLoading ? (
              <div className="flex justify-center w-full">
                <div className="w-full max-w-[315px] h-[184px] bg-gray-700 rounded-xl flex items-center justify-center">
                  <p className="text-white">Loading card information...</p>
                </div>
              </div>
            ) : paymentDetails.cardNumber ? (
              <div className="flex justify-center w-full">
                <div
                  className="relative overflow-hidden w-full max-w-[315px] h-[184px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #d1d1d1, #efefef)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* Card Logo */}
                  <div className="absolute top-4 right-4">
                    {paymentDetails.cardType === "Visa" && (
                      <img src={visa_icon} alt="Visa" className="h-6" />
                    )}
                    {paymentDetails.cardType === "MasterCard" && (
                      <img
                        src={mastercard_icon}
                        alt="MasterCard"
                        className="h-6"
                      />
                    )}
                    {paymentDetails.cardType === "Discover" && (
                      <img src={discover_icon} alt="Discover" className="h-6" />
                    )}
                    {paymentDetails.cardType === "American Express" && (
                      <img
                        src={amex_icon}
                        alt="American Express"
                        className="h-6"
                      />
                    )}
                    {paymentDetails.cardType === "JCB" && (
                      <img src={jcb_icon} alt="JCB" className="h-6" />
                    )}
                    {![
                      "Visa",
                      "MasterCard",
                      "Discover",
                      "American Express",
                      "JCB",
                    ].includes(paymentDetails.cardType) && (
                      <img
                        src={undetected_card}
                        alt="Undetected Card"
                        className="h-6"
                      />
                    )}
                  </div>

                  {/* Card Number - Blurred except last 4 digits - moved to bottom */}
                  <div className="absolute bottom-6 left-6 text-gray-800 font-mono flex items-center">
                    <span className="blur-sm mr-1 text-gray-600">
                      XXXX XXXX XXXX
                    </span>
                    <span className="ml-1">
                      {paymentDetails.cardNumber.slice(-4)}
                    </span>
                  </div>

                  {/* Expiration Date - blurred and aligned with card number */}
                  <div className="absolute bottom-6 right-6 text-gray-800 font-mono">
                    <span className="blur-sm">
                      {paymentDetails.expirationDate}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="w-full max-w-[315px] h-[184px] bg-gray-700 rounded-xl flex items-center justify-center">
                  <p className="text-white">No card information available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payment Form View */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            showPaymentForm
              ? isAnimating
                ? "opacity-0 transform translate-x-6"
                : "opacity-100 transform translate-x-0"
              : "hidden"
          }`}
        >
          {/* X Button for Close */}
          <div className="flex justify-end mb-4">
            <Button
              className="text-white bg-transparent hover:bg-transparent p-0"
              onClick={handleClosePaymentForm}
              disabled={isAnimating || isSubmitting}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              cardNumber: "",
              expiryDate: "",
              cvv: "",
              email: "",
              address: "",
              city: "",
              state: "",
              country: "",
              zipCode: "",
            }}
            validationSchema={createBillingValidationSchema()}
            validateOnMount
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={handleSubmitPaymentForm}
            innerRef={formikRef}
            enableReinitialize={true} // This allows the form to update when initialValues change
          >
            {({ handleSubmit, errors, isValid, touched, setFieldTouched }) => (
              <form onSubmit={handleSubmit} className="w-full">
                {/* Credit card icons - moved directly above the First Name field, left aligned */}
                <div className="flex gap-2 justify-center md:justify-start mb-5 mx-5">
                  <img src={visa_icon} alt="Visa" className="h-7 sm:h-8" />
                  <img
                    src={amex_icon}
                    alt="American Express"
                    className="h-7 sm:h-8"
                  />
                  <img
                    src={mastercard_icon}
                    alt="Mastercard"
                    className="h-7 sm:h-8"
                  />
                  <img
                    src={discover_icon}
                    alt="Discover"
                    className="h-7 sm:h-8"
                  />
                  <img src={jcb_icon} alt="JCB" className="h-7 sm:h-8" />
                  <img
                    src={undetected_card}
                    alt="Other Cards"
                    className="h-7 sm:h-8"
                  />
                </div>

                {/* Form layout - rest of the form remains the same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mx-2 md:mx-4">
                  <div className="space-y-5">
                    <InputField
                      label="First Name"
                      variant="primary"
                      size="sm"
                      error={
                        touched.firstName && errors.firstName
                          ? errors.firstName
                          : ""
                      }
                      touched={!!touched.firstName}
                      showAlertIcon={true}
                    >
                      <Field name="firstName">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="First Name"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("firstName", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>

                    <InputField
                      label="Last Name"
                      variant="primary"
                      size="sm"
                      error={
                        touched.lastName && errors.lastName
                          ? errors.lastName
                          : ""
                      }
                      touched={!!touched.lastName}
                      showAlertIcon={true}
                    >
                      <Field name="lastName">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="Last Name"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("lastName", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>

                    <InputField
                      label="Card Number"
                      variant="primary"
                      size="sm"
                      error={
                        touched.cardNumber && errors.cardNumber
                          ? errors.cardNumber
                          : ""
                      }
                      touched={!!touched.cardNumber}
                      showAlertIcon={true}
                    >
                      <Field name="cardNumber">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="Card Number"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              const value = event.target.value;
                              form.setFieldValue(field.name, value);
                              setFieldTouched("cardNumber", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>

                    <div className="grid grid-cols-2 gap-7">
                      <InputField
                        label="Expiry Date"
                        variant="primary"
                        size="sm"
                        error={
                          touched.expiryDate && errors.expiryDate
                            ? errors.expiryDate
                            : ""
                        }
                        touched={!!touched.expiryDate}
                        showAlertIcon={true}
                      >
                        <Field name="expiryDate">
                          {({ field, form }: FieldProps) => (
                            <Input
                              {...field}
                              placeholder="MM/YY"
                              className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                              onChange={(e) => {
                                const formatted = formatExpirationDate(
                                  e.target.value,
                                );
                                form.setFieldValue(field.name, formatted);
                                setFieldTouched("expiryDate", true, false);
                              }}
                            />
                          )}
                        </Field>
                      </InputField>

                      <InputField
                        label="CVV"
                        variant="primary"
                        size="sm"
                        error={touched.cvv && errors.cvv ? errors.cvv : ""}
                        touched={!!touched.cvv}
                        showAlertIcon={true}
                      >
                        <Field name="cvv">
                          {({ field }: FieldProps) => (
                            <Input
                              {...field}
                              placeholder="XXX"
                              className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                              onChange={(e) => {
                                field.onChange(e);
                                setFieldTouched("cvv", true, false);
                              }}
                            />
                          )}
                        </Field>
                      </InputField>
                    </div>

                    <InputField
                      label="Email Address"
                      variant="primary"
                      size="sm"
                      error={touched.email && errors.email ? errors.email : ""}
                      touched={!!touched.email}
                      showAlertIcon={true}
                    >
                      <Field name="email">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            type="email"
                            placeholder="Email Address"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("email", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>
                  </div>

                  <div className="space-y-5">
                    <InputField
                      label="Billing Address"
                      variant="primary"
                      size="sm"
                      error={
                        touched.address && errors.address ? errors.address : ""
                      }
                      touched={!!touched.address}
                      showAlertIcon={true}
                    >
                      <Field name="address">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="House No./Bldg./Street"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("address", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>

                    <InputField
                      label="State"
                      variant="primary"
                      size="sm"
                      error={touched.state && errors.state ? errors.state : ""}
                      touched={!!touched.state}
                      showAlertIcon={true}
                    >
                      <Field name="state">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="State"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("state", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>

                    <InputField
                      label="City"
                      variant="primary"
                      size="sm"
                      error={touched.city && errors.city ? errors.city : ""}
                      touched={!!touched.city}
                      showAlertIcon={true}
                    >
                      <Field name="city">
                        {({ field }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="City"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(e) => {
                              field.onChange(e);
                              setFieldTouched("city", true, false);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>

                    <InputField
                      label="Country"
                      variant="primary"
                      size="sm"
                      error={
                        touched.country && errors.country ? errors.country : ""
                      }
                      touched={!!touched.country}
                      showAlertIcon={true}
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
                              className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] rounded-md px-3 w-full hover:text-[#F5F5F7]"
                              popoverClassName="z-50"
                            />
                          </div>
                        )}
                      </Field>
                    </InputField>

                    <InputField
                      label="Zip/Postal Code"
                      variant="primary"
                      size="sm"
                      error={
                        touched.zipCode && errors.zipCode ? errors.zipCode : ""
                      }
                      touched={!!touched.zipCode}
                      showAlertIcon={true}
                    >
                      <Field name="zipCode">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field}
                            placeholder="Zip/Postal Code"
                            className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              // Remove any spaces from the input value
                              const value = event.target.value.replace(
                                /\s/g,
                                "",
                              );
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
                    </InputField>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className={`w-full ${
                          isValid && Object.keys(touched).length > 0
                            ? "bg-[#F5722E] hover:bg-[#F5722E]/90"
                            : "bg-[#AEADAD] hover:bg-[#AEADAD]/90"
                        } text-white h-[46px] rounded ${
                          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isSubmitting ? "Saving..." : "Save Details"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export { BillingSettings };

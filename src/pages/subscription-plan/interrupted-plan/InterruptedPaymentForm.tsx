import React from "react";
import { Formik, Field, FieldProps } from "formik";
import * as Yup from "yup";
import { Input } from "components";
import { InputField } from "components";
import { Button } from "components";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import { CountrySelect } from "components";

interface InterruptedPaymentFormProps {
  planType: "monthly" | "yearly";
  onSubmit: (values: CombinedFormValues) => Promise<void>;
  isSubmitting: boolean;
}

interface CombinedFormValues {
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
  termsAccepted: boolean;
}

const formatExpirationDate = (value: string): string => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
};

const InterruptedPaymentForm: React.FC<InterruptedPaymentFormProps> = ({
  planType,
  onSubmit,
  isSubmitting,
}) => {
  const baseAmount = planType === "monthly" ? 5 : 55;
  const transactionFee = Number((baseAmount * 0.096).toFixed(2));
  const subtotal = baseAmount + transactionFee;

  const initialValues: CombinedFormValues = {
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
    termsAccepted: false,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .required("This field is required")
          .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Please enter a valid name")
          .max(50, "Name is too long"),
        lastName: Yup.string()
          .required("This field is required")
          .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Please enter a valid name")
          .max(50, "Name is too long"),
        cardNumber: Yup.string()
          .required("Required")
          .matches(/^\d{13,19}$/, "Invalid card number"),
        expiryDate: Yup.string()
          .required("This field is required")
          .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Must be in MM/YY format")
          .test("expiry", "Invalid date", function (value) {
            if (!value) return false;

            const [month, year] = value.split("/");
            const expiry = new Date(2000 + parseInt(year), parseInt(month));
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
        address: Yup.string()
          .required("This field is required")
          .max(100, "Address is too long"),
        city: Yup.string()
          .required("This field is required")
          .max(50, "City name is too long"),
        state: Yup.string().required("This field is required"),
        country: Yup.string().required("This field is required"),
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
      onSubmit={onSubmit}
    >
      {({ handleSubmit, errors, isValid, touched, values }) => (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex gap-2 mt-6">
                <img src={visa_icon} alt="Visa" />
                <img src={amex_icon} alt="American Express" />
                <img src={mastercard_icon} alt="Mastercard" />
                <img src={discover_icon} alt="Discover" />
              </div>

              <InputField label="First Name" variant="primary" size="sm">
                <Field name="firstName">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="First Name"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.firstName && touched.firstName && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.firstName}
                  </div>
                )}
              </InputField>

              <InputField label="Last Name" variant="primary" size="sm">
                <Field name="lastName">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="Last Name"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.lastName && touched.lastName && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.lastName}
                  </div>
                )}
              </InputField>

              <InputField label="Card Number" variant="primary" size="sm">
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
                      }}
                      onBlur={() => {
                        form.validateField(field.name);
                      }}
                    />
                  )}
                </Field>
                {errors.cardNumber && touched.cardNumber && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.cardNumber}
                  </div>
                )}
              </InputField>

              <div className="grid grid-cols-2 gap-4">
                <InputField label="Expiry Date" variant="primary" size="sm">
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
                        }}
                      />
                    )}
                  </Field>
                  {errors.expiryDate && touched.expiryDate && (
                    <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                      {errors.expiryDate}
                    </div>
                  )}
                </InputField>

                <InputField label="CVV" variant="primary" size="sm">
                  <Field name="cvv">
                    {({ field }: FieldProps) => (
                      <Input
                        {...field}
                        placeholder="XXX"
                        className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                      />
                    )}
                  </Field>
                  {errors.cvv && touched.cvv && (
                    <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                      {errors.cvv}
                    </div>
                  )}
                </InputField>
              </div>

              <InputField label="Email Address" variant="primary" size="sm">
                <Field name="email">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email Address"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.email && touched.email && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.email}
                  </div>
                )}
              </InputField>

              <div className="hidden md:block">
                <Field name="termsAccepted">
                  {({ field }: FieldProps) => (
                    <div className="flex items-start">
                      <div className="relative">
                        <input
                          type="checkbox"
                          {...field}
                          className={`mt-1 w-5 h-5 items-center ${errors.termsAccepted && touched.termsAccepted ? "border-red-500" : ""}`}
                        />
                        {errors.termsAccepted && touched.termsAccepted && (
                          <div className="absolute left-0 -top-4 bg-red-500 text-white text-[11px] py-1 px-2 rounded shadow-md whitespace-nowrap z-10">
                            {errors.termsAccepted}
                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-red-500 rotate-45" />
                          </div>
                        )}
                      </div>
                      <div className="ml-2">
                        <label className="text-[#F5F5F7] text-sm">
                          I have read, understood and agree to the{" "}
                          <a href="/terms" className="text-[#F5722E] underline">
                            Terms of Use
                          </a>{" "}
                          and{" "}
                          <a
                            href="/privacy"
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
            </div>

            {/* Right Column */}
            <div className="space-y-2">
              <InputField label="Billing Address" variant="primary" size="sm">
                <Field name="address">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="House No./Bldg./Street"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.address && touched.address && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.address}
                  </div>
                )}
              </InputField>

              <InputField label="State" variant="primary" size="sm">
                <Field name="state">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="State"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.state && touched.state && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.state}
                  </div>
                )}
              </InputField>

              <InputField label="City" variant="primary" size="sm">
                <Field name="city">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="City"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.city && touched.city && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.city}
                  </div>
                )}
              </InputField>

              <InputField label="Country" variant="primary" size="sm">
                <Field name="country">
                  {({ field, form }: FieldProps) => (
                    <div className="relative">
                      <CountrySelect
                        value={field.value}
                        onChange={(value) => {
                          form.setFieldValue(field.name, value);
                        }}
                        className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] rounded-md px-3 w-full hover:text-[#F5F5F7]"
                        popoverClassName="z-50"
                      />
                    </div>
                  )}
                </Field>
                {errors.country && touched.country && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.country}
                  </div>
                )}
              </InputField>

              <InputField label="Zip/Postal Code" variant="primary" size="sm">
                <Field name="zipCode">
                  {({ field }: FieldProps) => (
                    <Input
                      {...field}
                      placeholder="Zip/Postal Code"
                      className="bg-transparent text-[#F5F5F7] border-[#F5F5F7] h-[46px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    />
                  )}
                </Field>
                {errors.zipCode && touched.zipCode && (
                  <div className="absolute text-red-500 right-0 italic text-xs mt-1">
                    {errors.zipCode}
                  </div>
                )}
              </InputField>

              <div className="space-y-2 text-sm pt-4">
                <div className="flex justify-between text-[#F5F5F7]">
                  <span>Subscription Fee</span>
                  <span>${baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#F5F5F7]">
                  <span>Transaction 9.6%</span>
                  <span>${transactionFee}</span>
                </div>
                <div className="flex justify-between text-[#F5F5F7]">
                  <span>
                    {values.country?.toLowerCase() === "canada"
                      ? "13% Tax"
                      : "0% Tax"}
                  </span>
                  <span>
                    $
                    {values.country?.toLowerCase() === "canada"
                      ? (subtotal * 0.13).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-[#F5722E] font-semibold mt-4">
                  <span>Total</span>
                  <span>
                    $
                    {(() => {
                      const tax =
                        values.country?.toLowerCase() === "canada"
                          ? subtotal * 0.13
                          : 0;
                      return (subtotal + tax).toFixed(2);
                    })()}
                  </span>
                </div>

                <div className="block md:hidden">
                  <Field name="termsAccepted">
                    {({ field }: FieldProps) => (
                      <div className="flex items-start mb-4">
                        <div className="relative">
                          <input
                            type="checkbox"
                            {...field}
                            className={`mt-1 w-5 h-5 items-center ${errors.termsAccepted && touched.termsAccepted ? "border-red-500" : ""}`}
                          />
                          {errors.termsAccepted && touched.termsAccepted && (
                            <div className="absolute left-0 -top-4 bg-red-500 text-white text-[11px] py-1 px-2 rounded shadow-md whitespace-nowrap z-10">
                              {errors.termsAccepted}
                              <div className="absolute -bottom-1 left-2 w-2 h-2 bg-red-500 rotate-45" />
                            </div>
                          )}
                        </div>
                        <div className="ml-2">
                          <label className="text-[#F5F5F7] text-sm">
                            I have read, understood and agree to the{" "}
                            <a
                              href="/terms"
                              className="text-[#F5722E] underline"
                            >
                              Terms of Use
                            </a>{" "}
                            and{" "}
                            <a
                              href="/privacy"
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

                <div className="text-[#F5F5F7] text-sm mt-4">
                  By clicking "Complete Payment" you will be charged the total
                  price of{" "}
                  <span className="text-[#F5722E]">
                    $
                    {(() => {
                      const tax =
                        values.country?.toLowerCase() === "canada"
                          ? subtotal * 0.13
                          : 0;
                      return (subtotal + tax).toFixed(2);
                    })()}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`w-full ${
                    isValid
                      ? "bg-[#F5722E] hover:bg-[#F5722E]/90"
                      : "bg-[#AEADAD]"
                  } text-white h-[34px] rounded mt-4 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Complete Payment"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export { InterruptedPaymentForm };

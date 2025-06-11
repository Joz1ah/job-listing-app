// utils/cardValidationSchema.js
import * as Yup from "yup";
import { isTestCard, isProductionEnvironment } from "constants/testCardConstants";

// Reusable card number validation schema
export const createCardNumberValidation = () => {
  return Yup.string()
    .required("This field is required")
    .matches(/^\d{13,19}$/, "Invalid card number")
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
    })
    .test("test-card", "Invalid card number", (value) => {
      // Only block test cards in production environment
      if (!isProductionEnvironment()) {
        return true; // Allow test cards in non-production environments
      }

      if (!value) return false;

      // Block test cards in production
      return !isTestCard(value);
    });
};

// Reusable expiry date validation
export const createExpiryDateValidation = () => {
  return Yup.string()
    .required("This field is required")
    .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "MM/YY format")
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
    });
};

// Reusable name validation
export const createNameValidation = () => {
  return Yup.string()
    .required("This field is required")
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Please enter a valid name")
    .max(50, "Name is too long");
};

// Reusable CVV validation
export const createCvvValidation = () => {
  return Yup.string()
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .required("This field is required");
};

// Reusable email validation
export const createEmailValidation = () => {
  return Yup.string()
    .email("Please enter a valid email address")
    .required("This field is required");
};

// Reusable address validation
export const createAddressValidation = (maxLength = 100) => {
  return Yup.string()
    .required("This field is required")
    .max(maxLength, "Address is too long");
};

// Reusable city validation
export const createCityValidation = () => {
  return Yup.string()
    .required("This field is required")
    .max(50, "City name is too long");
};

// Reusable zip code validation
export const createZipCodeValidation = () => {
  return Yup.string()
    .matches(
      /^[a-zA-Z0-9]{1,6}$/,
      "Must be alphanumeric and up to 6 characters"
    )
    .required("This field is required");
};

// Reusable terms validation
export const createTermsValidation = () => {
  return Yup.boolean()
    .oneOf([true], "You must accept the Terms and Privacy Policy")
    .required("You must accept the Terms and Privacy Policy");
};

// Complete payment form validation schema for BillingSettings
export const createBillingValidationSchema = () => {
  return Yup.object({
    firstName: createNameValidation(),
    lastName: createNameValidation(),
    cardNumber: createCardNumberValidation(),
    expiryDate: createExpiryDateValidation(),
    cvv: createCvvValidation(),
    email: createEmailValidation(),
    address: createAddressValidation(50), // BillingSettings uses max 50
    city: createCityValidation(),
    state: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    zipCode: createZipCodeValidation(),
  });
};

// Complete payment form validation schema for PaymentStep
export const createPaymentStepValidationSchema = () => {
  return Yup.object({
    firstName: createNameValidation(),
    lastName: createNameValidation(),
    email: createEmailValidation(),
    cardNumber: createCardNumberValidation(),
    expiryDate: createExpiryDateValidation(),
    cvv: createCvvValidation(),
  });
};

// Complete address form validation schema for PaymentStep
export const createAddressValidationSchema = () => {
  return Yup.object({
    address: createAddressValidation(),
    city: createCityValidation(),
    state: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    zipCode: createZipCodeValidation(),
    termsAccepted: createTermsValidation(),
  });
};

// Complete form validation schema for AuthnetPaymentFullModal
export const createAuthnetPaymentValidationSchema = () => {
  return Yup.object({
    cardNumber: createCardNumberValidation(),
    firstName: createNameValidation(),
    lastName: createNameValidation(),
    expiryDate: createExpiryDateValidation(),
    cvv: createCvvValidation(),
    email: createEmailValidation(),
    billingAddress: createAddressValidation(),
    stateProvince: Yup.string().required("This field is required"),
    zipPostalCode: createZipCodeValidation(),
    city: createCityValidation(),
    country: Yup.string().required("This field is required"),
    termsAccepted: createTermsValidation(),
  });
};

// Complete form validation schema for InterruptedPaymentForm
export const createInterruptedPaymentValidationSchema = () => {
  return Yup.object({
    firstName: createNameValidation(),
    lastName: createNameValidation(),
    cardNumber: createCardNumberValidation(),
    expiryDate: createExpiryDateValidation(),
    cvv: createCvvValidation(),
    email: createEmailValidation(),
    address: createAddressValidation(),
    city: createCityValidation(),
    state: Yup.string().required("This field is required"),
    country: Yup.string().required("This field is required"),
    zipCode: createZipCodeValidation(),
    termsAccepted: createTermsValidation(),
  });
};
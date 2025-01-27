import { usePaymentCreateMutation } from "api/akaza/akazaAPI";
import { InputField, Input } from "components";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useState, useEffect } from "react";
import { Formik, Field, FieldProps } from "formik";
import { useNavigate } from "react-router-dom";
import styles from "./../landing.module.scss";
import { useLanding } from "../useLanding";
import * as Yup from "yup";

import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import authnet_logo from "assets/authnet-logo2.svg?url";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";

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
}

const AuthnetPaymentFullModal = () => {
  const {
    currentSelectedPlan,
    PLAN_SELECTION_ITEMS,
    dataStates,
    handleSetModalState,
    createAuthNetTokenizer,
    modalState,
  } = useLanding();
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showError } = useErrorModal();

  const formatExpirationDate = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
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

    // Handle backspace when cursor is at the third position (before the `/`)
    if (key === "Backspace" && inputElement.selectionStart === 3) {
      const updatedValue = inputElement.value.slice(0, 2); // Remove the '/'
      inputElement.value = updatedValue;
      event.preventDefault();
      inputElement.dispatchEvent(new Event("input", { bubbles: true })); // Trigger Formik's `onChange`
    }
  };

  const handleSubmit = async (values: PaymentFormValues) => {
    console.log("values");
    console.log(values);
    setIsSubmitting(true);
    const secureData = {
      authData: {
        clientKey:
          "7wuXYQ768E3G3Seuy6aTf28PfU3mJWu7Bbj564KfTPqRa7RXUPZvTsnKz9Jf7daJ", // Replace with your actual client key
        apiLoginID: "83M29Sdd8", // Replace with your actual API login ID
      },
      cardData: {
        cardNumber: values.cardNumber,
        month: values.expiryDate.split("/")[0],
        year: values.expiryDate.split("/")[1],
        cardCode: values.cvv,
      },
    };

    console.log("generating token...");
    Accept.dispatchData(secureData, async (acceptResponse: any) => {
      if (acceptResponse.messages.resultCode === "Ok") {
        const token = acceptResponse.opaqueData.dataValue;
        console.log(acceptResponse);
        console.log("token generation success");
        console.log(token);
        // Send the token to your server for processing
        console.log({
          provider: "authnet",
          userId: dataStates.userId,
          plan:
            currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
              ? "Monthly"
              : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                ? "Yearly"
                : "",
          amount:
            currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
              ? 5
              : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                ? 55
                : "",
          paymentMethodId: token,
          daysTrial: 0,
        });
        try {
          const res = await paymentSubmit({
            provider: "authnet",
            //"userId": dataStates.userId,
            plan:
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                ? "Monthly"
                : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                  ? "Yearly"
                  : "",
            amount:
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                ? 5
                : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                  ? 55
                  : "",
            paymentMethodId: token,
            daysTrial: 0,
            firstName: values.firstName,
            lastName: values.lastName,
            address: values.billingAddress,
            city: values.city,
            state: values.stateProvince,
            zip: values.zipPostalCode,
            country: values.country,
          })
            .unwrap()
            .then((res) => {
              console.log(res);
              handleSetModalState(MODAL_STATES.LOADING);
              setTimeout(() => {
                console.log(`navigating to ${dataStates.selectedUserType}`);
                navigate(
                  dataStates.selectedUserType === "employer"
                    ? "/employer/employer-profile"
                    : "/job-hunter/jobhunter-profile",
                );
                console.log(`done navigating`);
              }, 1000);
            })
            .catch((err) => {
              showError(err?.data?.errors, err?.data?.message);
              setIsSubmitting(false);
              console.log(err);
            });
          console.log(res);
        } catch (err: any) {
          console.log(err);
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
        alert("Error: " + acceptResponse.messages.message[0].text); // Use acceptResponse here
      }
    });
  };

  useEffect(() => {
    createAuthNetTokenizer();
  }, []);

  return (
    <div
      className={`${styles["modal-content"]}`}
      hidden={modalState !== MODAL_STATES.AUTHNET_PAYMENT_FULL}
    >
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
            expiryDate: Yup.string()
              .matches(
                /^(0[1-9]|1[0-2])\/\d{2}$/,
                "Expiration date must be in MM/YY format",
              )
              .required("ExpiryDate is required"),
            cvv: Yup.string()
              .matches(/^\d{3,4}$/, "CVV/CVC must be 3 or 4 digits")
              .required("CVV/CVC is required"),
            email: Yup.string()
              .email("Must be a valid email")
              .required("Email is required"),
            billingAddress: Yup.string().required(
              "Billing address is required",
            ),
            stateProvince: Yup.string().required("State/Province is required"),
            zipPostalCode: Yup.string()
              .matches(
                /^[a-zA-Z0-9]{1,6}$/,
                "Zip/Postal code must be alphanumeric and up to 6 characters",
              )
              .required("Zip/Postal code is required"),
            city: Yup.string().required("City is required"),
            country: Yup.string().required("Country is required"),
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className={`${styles["authnet-paymentfull-form"]}`}>
                <div className={`${styles["form-left"]}`}>
                  <div className={`${styles["credit-card-container"]}`}>
                    <img src={visa_icon}></img>
                    <img src={amex_icon}></img>
                    <img src={mastercard_icon}></img>
                    <img src={discover_icon}></img>
                  </div>
                  <div className={styles["input-form"]}>
                    <InputField
                      variant={"tulleGray"}
                      label="Card Number"
                      className="bg-transparent mt-2"
                      error={errors.cardNumber}
                      touched={touched.cardNumber}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="N/A"
                    >
                      <Field name="cardNumber">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="Card Number"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                      variant={"tulleGray"}
                      label="First Name"
                      className="bg-transparent mt-3"
                      error={errors.firstName}
                      touched={touched.firstName}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="N/A"
                    >
                      <Field name="firstName">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="First Name"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                      variant={"tulleGray"}
                      label="Last Name"
                      className="bg-transparent mt-3"
                      error={errors.lastName}
                      touched={touched.lastName}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="N/A"
                    >
                      <Field name="lastName">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="Last Name"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                        variant={"tulleGray"}
                        label="Expiry Date"
                        className="bg-transparent mt-3"
                        error={errors.expiryDate}
                        touched={touched.expiryDate}
                        showIcon={false}
                        showAlertIcon={false}
                        tooltipContent="N/A"
                      >
                        <Field name="expiryDate">
                          {({ field, form }: FieldProps) => (
                            <Input
                              {...field} // Spread field props
                              placeholder="MM/YY"
                              className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                const formattedValue = formatExpirationDate(
                                  event.target.value,
                                ); // Format input
                                form.setFieldValue(field.name, formattedValue);
                              }}
                              onBlur={() => {
                                form.validateField(field.name);
                              }}
                              onKeyDown={handleExpirationDateKeyDown} // Retain custom keydown handler
                            />
                          )}
                        </Field>
                      </InputField>

                      <InputField
                        variant={"tulleGray"}
                        label="CVV"
                        className="bg-transparent mt-3"
                        error={errors.cvv}
                        touched={touched.cvv}
                        showIcon={false}
                        showAlertIcon={false}
                        tooltipContent="N/A"
                      >
                        <Field name="cvv">
                          {({ field, form }: FieldProps) => (
                            <Input
                              {...field} // Spread field props
                              placeholder="CVV"
                              className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                      variant={"tulleGray"}
                      label="Email Address"
                      className="bg-transparent mt-3"
                      error={errors.email}
                      touched={touched.email}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="Your contact email address"
                    >
                      <Field name="email">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="Email Address"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                    <div className={`${styles["terms-and-privacy"]}`}>
                      <input type="checkbox"></input>
                      <div>
                        <label>I have read, understood and agree to the</label>
                        <a
                          href="https://app.websitepolicies.com/policies/view/azn4i7fg"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <u className={styles["link"]}>Terms & Conditions</u>
                        </a>
                        <label>and</label>
                        <a
                          href="https://app.websitepolicies.com/policies/view/2albjkzj"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <u className={styles["link"]}>Privacy Policy.</u>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles["form-right"]}`}>
                  <InputField
                    variant={"tulleGray"}
                    label="Billing Address"
                    className="bg-transparent mt-3"
                    error={errors.billingAddress}
                    touched={touched.billingAddress}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="The address linked to your payment method"
                  >
                    <Field name="billingAddress">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="Billing Address"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                    variant={"tulleGray"}
                    label="State/Province"
                    className="bg-transparent mt-3"
                    error={errors.stateProvince}
                    touched={touched.stateProvince}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="N/A"
                  >
                    <Field name="stateProvince">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="State/Province"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                    variant={"tulleGray"}
                    label="City"
                    className="bg-transparent mt-3"
                    error={errors.city}
                    touched={touched.city}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="City of residence"
                  >
                    <Field name="city">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="City"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                    variant={"tulleGray"}
                    label="Country"
                    className="bg-transparent mt-3"
                    error={errors.country}
                    touched={touched.country}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="N/A"
                  >
                    <Field name="country">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="Country"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                    variant={"tulleGray"}
                    label="Zip/Postal Code"
                    className="bg-transparent mt-3"
                    error={errors.zipPostalCode}
                    touched={touched.zipPostalCode}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="N/A"
                  >
                    <Field name="zipPostalCode">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="Zip/Postal Code"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
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
                  <div className={styles["complete-payment-container"]}>
                    <label>
                      By Clicking “Complete Payment” you will be charged the
                      total price of{" "}
                    </label>
                    <label>
                      {currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                        ? `\$${5 * 1.096}`
                        : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                          ? `\$${55 * 1.096}`
                          : ""}
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
        <div className={`${styles["authnet-footer"]}`}>
          <div className={`${styles["authnet-footer-desc"]}`}>
            {/*
              <label>Akaza{"\u00A0"}</label>
              <label>integrates seamlessly with Authorize.net, a leading payment processor, to provide secure and efficient online payment solutions.</label> 
            */}
          </div>
          <div className={`${styles["authnet-logo-wrapper"]}`}>
            <img src={authnet_logo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthnetPaymentFullModal;

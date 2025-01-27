import { usePaymentCreateMutation } from "api/akaza/akazaAPI";
import { useState, useRef, useEffect } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import { useNavigate } from "react-router-dom";
import styles from "./../landing.module.scss";
import CustomInput from "./CustomInput";
import { useLanding } from "../useLanding";
import * as Yup from "yup";

import green_lock_icon from "assets/green-lock.svg?url";
import button_loading_spinner from "assets/loading-spinner-orange.svg?url";
import { MODAL_STATES } from "store/modal/modal.types";

interface FormValues {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
}

const CreditCardForm: React.FC = () => {
  const {
    handleSetModalState,
    createAuthNetTokenizer,
    dataStates,
    currentSelectedPlan,
    PLAN_SELECTION_ITEMS,
  } = useLanding();
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const previousButton = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (previousButton.current) {
      previousButton.current.onclick = () => {
        handleSetModalState(MODAL_STATES.AUTHNET_PAYMENT);
      };
    }
    createAuthNetTokenizer();
  }, []);

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      //.matches(/^\d{15}$/, 'Card number must be 15 digits')
      .required("Card number is required"),
    cardholderName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Name must only contain letters and spaces")
      .required("Cardholder name is required"),
    expirationDate: Yup.string()
      .matches(
        /^(0[1-9]|1[0-2])\/\d{2}$/,
        "Expiration date must be in MM/YY format",
      )
      .required("Expiration date is required"),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, "CVV/CVC must be 3 or 4 digits")
      .required("CVV/CVC is required"),
  });

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

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    const secureData = {
      authData: {
        clientKey: process.env.AUTHORIZE_NET_CLIENT_KEY, // Replace with your actual client key
        apiLoginID: process.env.AUTHORIZE_NET_API_LOGIN_ID, // Replace with your actual API login ID
      },
      cardData: {
        cardNumber: values.cardNumber,
        month: values.expirationDate.split("/")[0],
        year: values.expirationDate.split("/")[1],
        cardCode: values.cvv,
      },
    };

    Accept.dispatchData(secureData, async (acceptResponse: any) => {
      if (acceptResponse.messages.resultCode === "Ok") {
        const token = acceptResponse.opaqueData.dataValue;
        try {
          const res = await paymentSubmit({
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
          })
            .unwrap()
            .then((res) => {
              console.log(res);
              handleSetModalState(MODAL_STATES.LOADING);
              setTimeout(() => {
                navigate("/dashboard");
              }, 1000);
            })
            .catch((err) => {
              alert(JSON.stringify(err));
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

  return (
    <Formik
      initialValues={{
        cardNumber: "",
        cardholderName: "",
        expirationDate: "",
        cvv: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div className={styles["stripe-form-inputs-container"]}>
            <div className={styles["stripe-form-upper-inputs"]}>
              <div>
                <Field
                  component={CustomInput}
                  id="cardNumber"
                  placeholder="Card Number *"
                  name="cardNumber"
                  type="text"
                />
                <ErrorMessage
                  className={styles["error-label"]}
                  name="cardNumber"
                  component="div"
                />
              </div>
              <div>
                <Field
                  component={CustomInput}
                  id="cardholderName"
                  placeholder="Cardholder Name *"
                  name="cardholderName"
                  type="text"
                />
                <ErrorMessage
                  className={styles["error-label"]}
                  name="cardholderName"
                  component="div"
                />
              </div>
            </div>
            <div className={styles["stripe-form-lower-inputs"]}>
              <div>
                <Field name="expirationDate">
                  {({ field, form }: { field: any; form: any }) => (
                    <CustomInput
                      {...field}
                      id="expirationDate"
                      placeholder="Expiration Date *"
                      type="text"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>,
                      ) => {
                        const formattedValue = formatExpirationDate(
                          event.target.value,
                        );
                        form.setFieldValue(field.name, formattedValue); // Update Formik state
                      }}
                      onKeyDown={handleExpirationDateKeyDown}
                    />
                  )}
                </Field>
                <ErrorMessage
                  className={styles["error-label"]}
                  name="expirationDate"
                  component="div"
                />
              </div>
              <div>
                <Field
                  component={CustomInput}
                  id="cvv"
                  placeholder="CVV/CVC *"
                  name="cvv"
                  type="text"
                />
                <ErrorMessage
                  className={styles["error-label"]}
                  name="cvv"
                  component="div"
                />
              </div>
            </div>
          </div>

          <div className={styles["security-privacy-container"]}>
            <div>
              <img src={green_lock_icon} alt="Security Lock" />
            </div>
            <div>
              <div>Security & Privacy</div>
              <div>
                We maintain industry-standard physical, technical, and
                administrative measures to safeguard your personal information
              </div>
            </div>
          </div>

          <div className={styles["action-buttons"]}>
            <button
              ref={previousButton}
              type="button"
              className={styles["button-custom-basic"]}
            >
              Previous
            </button>
            <button
              type="submit"
              className={styles["button-custom-orange"]}
              disabled={isSubmitting}
            >
              <img
                src={button_loading_spinner}
                alt="Loading"
                className={styles["button-spinner"]}
                hidden={!isSubmitting}
              />
              Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreditCardForm;

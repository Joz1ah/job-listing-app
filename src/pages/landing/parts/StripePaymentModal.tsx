import { useLanding } from "../useLanding";
import styles from "./../landing.module.scss";

import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import authnet_visa_solution from "assets/authnet-logo-light.svg?url";
import CreditCardForm from "./CreditCardForm";
import { MODAL_STATES } from "store/modal/modal.types";

const StripePaymentModal = () => {
  const { modalState } = useLanding();
  return (
    modalState && modalState == MODAL_STATES.AUTHNET_PAYMENT ?
    <div
      className={`${styles["modal-content"]}`}
    >
      <div className={`${styles["stripe-payment-container"]}`}>
        <div className={`${styles["stripe-payment-form"]}`}>
          <div className={`${styles["credit-card-container"]}`}>
            <img src={visa_icon}></img>
            <img src={amex_icon}></img>
            <img src={mastercard_icon}></img>
            <img src={discover_icon}></img>
          </div>
          <div className={`${styles["stripe-form-container"]}`}>
            <CreditCardForm />
          </div>
        </div>
        <div className={`${styles["stripe-footer"]}`}>
          <div className={`${styles["stripe-footer-desc"]}`}>
            <label>Akaza{"\u00A0"}</label>
            <label>
              integrates seamlessly with Stripe, a leading payment processor, to
              provide secure and efficient online payment solutions.
            </label>
          </div>
          <div className={`${styles["powered-by-stripe-wrapper"]}`}>
            <img src={authnet_visa_solution} />
          </div>
        </div>
      </div>
    </div>
    :<></>
  );
};

export default StripePaymentModal;

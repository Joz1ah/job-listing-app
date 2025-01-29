import { useLoginMutation } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../landing.module.scss";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import unchecked_green from "assets/toggles/unchecked-green.svg?url";
import checked_green from "assets/toggles/checked-green.svg?url";
import subscription_sparkle_icon from "assets/subscription-plan-icons/sparkle.svg?url";
import subscription_thumbsup_icon from "assets/subscription-plan-icons/thumbsup.svg?url";
import subscription_shield_person_icon from "assets/subscription-plan-icons/shield-person.svg?url";
import subscription_linegraph_icon from "assets/subscription-plan-icons/linegraph.svg?url";
import subscription_lock_icon from "assets/subscription-plan-icons/lock.svg?url";
import subscription_chat_icon from "assets/subscription-plan-icons/chat.svg?url";
import subscription_gift_icon from "assets/subscription-plan-icons/gift.svg?url";
import subscription_bolt_icon from "assets/subscription-plan-icons/bolt.svg?url";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { PLAN_SELECTION_ITEMS } from "store/user/user.types";

const SubscriptionPlanSelection = () => {
  const { handleSetSelectedModalHeader } = useModal();
  const {
    dataStates,
    currentSelectedPlan,
    tempLoginEmail,
    tempLoginPassword,
    handleSetModalState,
    modalState,
    handleSetSelectedPlan,
  } = useLanding();
  const subscription_plan1 = useRef<HTMLDivElement>(null);
  const subscription_plan2 = useRef<HTMLDivElement>(null);
  const subscription_plan3 = useRef<HTMLDivElement>(null);
  const buttonSubscribe = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginSubmit] = useLoginMutation();

  useEffect(() => {
    if (
      !subscription_plan1.current ||
      !subscription_plan2.current ||
      !subscription_plan3.current ||
      !buttonSubscribe.current
    ) {
      return;
    }

    const handleSubscription = async () => {
      handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      const userType = dataStates.selectedUserType;

      if (currentSelectedPlan === PLAN_SELECTION_ITEMS.FREE) {
        try {
          const response = await loginSubmit({
            email: tempLoginEmail,
            password: tempLoginPassword,
          }).unwrap();
          if (response?.data?.token) {
            login(response.data.token);
            localStorage.setItem("subscriptionTier", "freeTrial");
            localStorage.setItem("userType", String(userType));
            handleSetModalState(MODAL_STATES.LOADING);
            setTimeout(() => {
              navigate(
                userType === "employer"
                  ? "/dashboard/employer-profile"
                  : "/dashboard/jobhunter-profile",
              );
            }, 1000);
          }
        } catch (error) {
          console.error("Auto-login failed:", error);
        }
      } else {
        const selectedTier =
          currentSelectedPlan === PLAN_SELECTION_ITEMS.MONTHLY
            ? "monthlyPlan"
            : "yearlyPlan";
        localStorage.setItem("pendingSubscriptionTier", selectedTier);
        localStorage.setItem("userType", String(userType));
        handleSetModalState(MODAL_STATES.AUTHNET_PAYMENT_FULL);
      }
    };

    buttonSubscribe.current.onclick = handleSubscription;

    subscription_plan1.current.onclick = () =>
      handleSetSelectedPlan(PLAN_SELECTION_ITEMS.FREE);
    subscription_plan2.current.onclick = () =>
      handleSetSelectedPlan(PLAN_SELECTION_ITEMS.MONTHLY);
    subscription_plan3.current.onclick = () =>
      handleSetSelectedPlan(PLAN_SELECTION_ITEMS.ANNUAL);
  }, [
    currentSelectedPlan,
    navigate,
    login,
    loginSubmit,
    tempLoginEmail,
    tempLoginPassword,
  ]);

  return (
    modalState && modalState == MODAL_STATES.SIGNUP_STEP5 ?
    <div
      className={`${styles["modal-content"]}`}
    >
      <div className={`${styles["subscription-plans-container"]}`}>
        <div className={`${styles["subscription-selection-items"]}`}>
          <div
            ref={subscription_plan1}
            className={`${styles["subscription-item"]} ${styles["noselect"]}
                ${currentSelectedPlan === PLAN_SELECTION_ITEMS.FREE ? styles["selected"] : ""}`}
          >
            <div className={`${styles["subscription-item-pricing-container"]}`}>
              <div className={`${styles["subscription-item-pricing-desc"]}`}>
                Free
              </div>
              <div className={`${styles["subscription-item-pricing-subdesc"]}`}>
                enjoy with zero fees
              </div>
            </div>
            <div className={`${styles["subscription-item-pricing-desc"]}`}>
              3-days Free Trial
            </div>
            <div className={`${styles["subscription-check-icon"]}`}>
              <img src={unchecked_green} />
            </div>
          </div>

          <div
            ref={subscription_plan2}
            className={`${styles["subscription-item"]} ${styles["noselect"]}
                ${currentSelectedPlan === PLAN_SELECTION_ITEMS.MONTHLY ? styles["selected"] : ""}`}
          >
            <div className={`${styles["subscription-item-pricing-container"]}`}>
              <div className={`${styles["subscription-item-pricing-desc"]}`}>
                <label>$</label>
                <label>5</label>
                <label>/month</label>
              </div>
              <div className={`${styles["subscription-item-pricing-subdesc"]}`}>
                + transaction fee
              </div>
            </div>
            <div className={`${styles["subscription-item-pricing-desc"]}`}>
              flexible monthly access
            </div>
            <div className={`${styles["subscription-check-icon"]}`}>
              <img src={unchecked_green} />
            </div>
          </div>

          <div
            ref={subscription_plan3}
            className={`${styles["subscription-item"]} ${styles["noselect"]} 
                ${currentSelectedPlan === PLAN_SELECTION_ITEMS.ANNUAL ? styles["selected"] : ""}`}
          >
            <div className={`${styles["subscription-item-pricing-container"]}`}>
              <div className={`${styles["subscription-item-pricing-desc"]}`}>
                <label>$</label>
                <label>55</label>
                <label>/year</label>
              </div>
              <div className={`${styles["subscription-item-pricing-subdesc"]}`}>
                + transaction fee
              </div>
            </div>
            <div className={`${styles["subscription-item-pricing-desc"]}`}>
              plus one month free
            </div>
            <div className={`${styles["subscription-check-icon"]}`}>
              <img src={checked_green} />
            </div>
          </div>
        </div>
        <div
          id="outline_container"
          className={`${styles["subscription-selection-description-container"]}`}
        >
          <div className={`${styles["selection-description-title"]}`}>
            {currentSelectedPlan == PLAN_SELECTION_ITEMS.FREE
              ? "Your Free Trial includes:"
              : currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY
                ? "Your Monthly Plan includes:"
                : currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL
                  ? "Your Yearly Plan includes:"
                  : ""}
          </div>
          <div
            className={`${styles["selection-description-outline-container"]}`}
          >
            <div className={`${styles["selection-description-outline"]}`}>
              <img src={subscription_sparkle_icon}></img>
              <div>Perfect Match automation</div>
            </div>
            <div className={`${styles["selection-description-outline"]}`}>
              <img src={subscription_thumbsup_icon}></img>
              <div>Ratings & Feedback</div>
            </div>
            <div className={`${styles["selection-description-outline"]}`}>
              <img src={subscription_shield_person_icon}></img>
              <div>Access to diverse private sector industries</div>
            </div>
            <div className={`${styles["selection-description-outline"]}`}>
              <img src={subscription_linegraph_icon}></img>
              <div>Basic analytic page</div>
            </div>
            <div className={`${styles["selection-description-outline"]}`}>
              <img src={subscription_lock_icon}></img>
              <div>Access to exclusive informative content</div>
            </div>
            <div className={`${styles["selection-description-outline"]}`}>
              <img src={subscription_chat_icon}></img>
              <div>Live chat support</div>
            </div>
            <div
              id="free_outline_item"
              className={`${styles["selection-description-outline"]}`}
              hidden={currentSelectedPlan !== PLAN_SELECTION_ITEMS.ANNUAL}
            >
              <img src={subscription_gift_icon}></img>
              <div>PLUS ONE MONTH FREE</div>
            </div>
            <div
              id="annual_outline_item"
              className={`${styles["selection-description-outline"]}`}
              hidden={currentSelectedPlan !== PLAN_SELECTION_ITEMS.FREE}
            >
              <img src={subscription_bolt_icon}></img>
              <div>FREE FOR THREE DAYS</div>
            </div>
          </div>
          <div
            ref={buttonSubscribe}
            className={`${styles["action-button"]} ${styles["noselect"]}`}
          >
            Subscribe Today
          </div>
          <div
            id="btn_free_trial"
            className={`${styles["action-button action-button-orange"]} ${styles["noselect"]}`}
            hidden
          >
            Start Free Trial
          </div>
        </div>
      </div>
    </div>
    :<></>
  );
};

export default SubscriptionPlanSelection;

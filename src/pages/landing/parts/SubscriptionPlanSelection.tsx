import {
  useLoginMutation,
  useUpdateFreeTrialStatusMutation,
} from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useNavigate } from "react-router-dom";
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
import { ROUTE_CONSTANTS } from "constants/routeConstants";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { useCallback } from "react";
import PriceTag from "./SubscriptionPlanSelection/PriceTag";
import PlanBenefit from "./SubscriptionPlanSelection/PlanBenefit";

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
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginSubmit] = useLoginMutation();
  const [updateFreeTrialStatus] = useUpdateFreeTrialStatusMutation();
  const { showError } = useErrorModal();

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

          // Update free trial status
          try {
            await updateFreeTrialStatus({}).unwrap();
          } catch (trialError) {
            console.error("Failed to update free trial status:", trialError);
            // Continue with navigation even if free trial update fails
          }

          handleSetModalState(MODAL_STATES.LOADING);
          setTimeout(() => {
            navigate(
              userType === "employer"
                ? ROUTE_CONSTANTS.COMPLETE_PROFILE
                : ROUTE_CONSTANTS.CREATE_APPLICATION,
            );
          }, 1000);
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
        showError("Login Error", "Failed to login. Please try again.");
      }
    } else {
      handleSetModalState(MODAL_STATES.AUTHNET_PAYMENT_FULL);
    }
  };

  const isSelected = useCallback(
    (refPlan: PLAN_SELECTION_ITEMS) => {
      return currentSelectedPlan === refPlan;
    },
    [currentSelectedPlan],
  );

  const summaryLabel: Record<PLAN_SELECTION_ITEMS, string> = {
    [PLAN_SELECTION_ITEMS.FREE]: "Free Trial",
    [PLAN_SELECTION_ITEMS.MONTHLY]: "Monthly Plan",
    [PLAN_SELECTION_ITEMS.ANNUAL]: "Yearly Plan",
  };

  const defaultBenefits: {
    icon: string;
    iconAlt: string;
    text: string;
  }[] = [
    {
      icon: subscription_sparkle_icon,
      iconAlt: "Sparkle",
      text: "Perfect Match automation",
    },
    {
      icon: subscription_thumbsup_icon,
      iconAlt: "Thumbs Up",
      text: "Ratings & Feedback",
    },
    {
      icon: subscription_shield_person_icon,
      iconAlt: "Shield Person",
      text: "Access to diverse private sector industries",
    },
    {
      icon: subscription_linegraph_icon,
      iconAlt: "Line Graph",
      text: "Basic analytic page",
    },
    {
      icon: subscription_lock_icon,
      iconAlt: "Lock",
      text: "Access to exclusive informative content",
    },
    {
      icon: subscription_chat_icon,
      iconAlt: "Chat",
      text: "Live chat support",
    },
  ];

  return modalState && modalState == MODAL_STATES.SIGNUP_STEP5 ? (
    <div className="flex items-center justify-center w-full h-full max-h-full sm:max-w-screen-sm">
      <div className="flex w-full gap-1">
        <div className="flex flex-col w-full gap-4">
          <PriceTag
            key="free-tag"
            handler={() => handleSetSelectedPlan(PLAN_SELECTION_ITEMS.FREE)}
            icon={
              isSelected(PLAN_SELECTION_ITEMS.FREE)
                ? checked_green
                : unchecked_green
            }
            label="Free"
            selectedPlan={currentSelectedPlan}
            text1="enjoy with zero fees"
            text2="3-days Free Trial"
            planRef={PLAN_SELECTION_ITEMS.FREE}
          />

          <PriceTag
            key="monthly-tag"
            handler={() => handleSetSelectedPlan(PLAN_SELECTION_ITEMS.MONTHLY)}
            icon={
              isSelected(PLAN_SELECTION_ITEMS.MONTHLY)
                ? checked_green
                : unchecked_green
            }
            label={
              <>
                <span>$</span>
                <span className="text-2xl">5</span>
                <span>/month</span>
              </>
            }
            selectedPlan={currentSelectedPlan}
            text1="+ $0.48 transaction fee"
            text2="flexible monthly access"
            planRef={PLAN_SELECTION_ITEMS.MONTHLY}
          />

          <PriceTag
            key="annual-tag"
            handler={() => handleSetSelectedPlan(PLAN_SELECTION_ITEMS.ANNUAL)}
            icon={
              isSelected(PLAN_SELECTION_ITEMS.ANNUAL)
                ? checked_green
                : unchecked_green
            }
            label={
              <>
                <span>$</span>
                <span className="text-2xl">55</span>
                <span>/year</span>
              </>
            }
            selectedPlan={currentSelectedPlan}
            text1="+ $5.28 transaction fee"
            text2="plus one month free"
            planRef={PLAN_SELECTION_ITEMS.ANNUAL}
          />
        </div>

        <div
          id="outline_container"
          className="flex flex-col items-center justify-center p-4 border rounded-md bg-orange-500 text-white w-full"
        >
          <div className="text-lg font-semibold mb-4 md:text-base">
            {currentSelectedPlan
              ? `Your ${summaryLabel[currentSelectedPlan]} includes:`
              : ""}
          </div>
          <div className="flex flex-col gap-2">
            {defaultBenefits.map(({ icon, iconAlt, text }, index) => (
              <PlanBenefit
                icon={icon}
                iconAlt={iconAlt}
                text={text}
                key={index}
              />
            ))}
            {currentSelectedPlan === PLAN_SELECTION_ITEMS.ANNUAL && (
              <PlanBenefit
                icon={subscription_gift_icon}
                iconAlt="Gift"
                text="PLUS ONE MONTH FREE"
              />
            )}
            {currentSelectedPlan === PLAN_SELECTION_ITEMS.FREE && (
              <PlanBenefit
                icon={subscription_bolt_icon}
                iconAlt="Bolt"
                text="FREE FOR THREE DAYS"
              />
            )}
          </div>
          <button
            onClick={handleSubscription}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Subscribe Today
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default SubscriptionPlanSelection;

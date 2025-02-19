import React, { useCallback } from "react";
import { Carousel, CarouselContent, CarouselItem } from "components";
import gift_selection from "assets/images/gift.gif";
import {
  useLoginMutation,
  useUpdateFreeTrialStatusMutation,
} from "api/akaza/akazaAPI";
import { Trophy } from 'lucide-react';
import { useAuth } from "contexts/AuthContext/AuthContext";
import { useModal } from "components/modal/useModal";
import { useLanding } from "../useLanding";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { MODAL_HEADER_TYPE, MODAL_STATES } from "store/modal/modal.types";
import { PLAN_SELECTION_ITEMS } from "store/user/user.types";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

import unchecked_green from "assets/toggles/unchecked-green.svg?url";
import checked_green from "assets/toggles/checked-green.svg?url";
import subscription_sparkle_icon from "assets/subscription-plan-icons/sparkle.svg?url";
import subscription_thumbsup_icon from "assets/subscription-plan-icons/thumbsup.svg?url";
import subscription_shield_person_icon from "assets/subscription-plan-icons/shield-person.svg?url";
import subscription_linegraph_icon from "assets/subscription-plan-icons/linegraph.svg?url";
import subscription_chat_icon from "assets/subscription-plan-icons/chat.svg?url";
import subscription_bolt_icon from "assets/subscription-plan-icons/bolt.svg?url";
import subscription_unlimited from "assets/subscription-plan-icons/unli.svg?url";
import subscription_card from "assets/subscription-plan-icons/card.svg?url";
import subscription_calendar from "assets/subscription-plan-icons/calendar.svg?url";

interface PlanFeature {
  icon: string;
  text: string;
}

interface PriceTagProps {
  handler: () => void;
  icon: string;
  label: React.ReactNode;
  selectedPlan: PLAN_SELECTION_ITEMS | undefined;
  text1: string;
  text2: string;
  planRef: PLAN_SELECTION_ITEMS;
}

// Desktop Price Tag Component
const PriceTag: React.FC<PriceTagProps> = ({
  handler,
  icon,
  label,
  selectedPlan,
  text1,
  text2,
  planRef,
}) => {
  const isSelected = selectedPlan === planRef;

  return (
    <button
      onClick={handler}
      className={`relative w-full shadow-lg rounded-none overflow-hidden
        ${isSelected ? "p-[3px] bg-gradient-to-r from-orange-400 to-orange-700" : "p-[1px] bg-gradient-to-br from-gray-200 to-gray-300"}`}
    >
      <div className="grid grid-cols-[1fr,1fr,0.5fr] items-center w-full h-[111px] p-4 bg-white rounded-none">
        <div className="flex flex-col items-start">
          <div className="text-xl font-semibold text-orange-500">{label}</div>
          <div className="text-[10px] text-gray-500">{text1}</div>
        </div>
        <div className="flex justify-start">
          <div className="text-[11px] text-gray-500">{text2}</div>
        </div>
        <div className="flex justify-end">
          <img src={icon} alt="selection" className="w-6 h-6" />
        </div>
      </div>
    </button>
  );
};

interface MobilePlanCardProps {
  plan: PLAN_SELECTION_ITEMS;
  features: PlanFeature[];
  price: string;
  transactionFee?: string;
  subtitle?: string;
  isSelected?: boolean;
  onSelect: (plan: PLAN_SELECTION_ITEMS) => void;
}

// Mobile Plan Card Component
const MobilePlanCard: React.FC<MobilePlanCardProps> = ({
  plan,
  features,
  price,
  transactionFee,
  onSelect,
}) => {
  const isFree = plan === PLAN_SELECTION_ITEMS.FREE;
  const isAnnual = plan === PLAN_SELECTION_ITEMS.ANNUAL;

  return (
    <div className="relative">
      {isAnnual && (
        <div className="absolute top-0 font-semibold left-1 text-orange-500 italic px-2 py-1 rounded flex items-center gap-1 text-[11px]">
          <Trophy size={14} />
          Best Value
        </div>
      )}
      <div
        className={`w-[246px] h-[400px] rounded-lg overflow-hidden ${
          isAnnual ? "shadow-xl shadow-orange-400/30" : "shadow-lg"
        }`}
      >
        <div className="h-[400px] w-full rounded-lg bg-white flex flex-col">
          <div className="p-2 flex-grow">
            <div className="text-start pl-6 mb-2">
              {price && (
                <div className="mt-4">
                  <div className="text-3xl font-bold text-orange-500">
                    {price}
                  </div>
                  <div className="text-[15px] text-[#263238]">
                    {transactionFee}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <img src={feature.icon} alt="" className="w-5 h-5" />
                  <span className="text-[15px] text-orange-500">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center px-4 pb-4">
            <button
              onClick={() => onSelect(plan)}
              className={`py-1 rounded-md font-semibold text-[16px] w-[161px] h-[34px] transition-colors ${
                isAnnual
                  ? "bg-green-500 text-white"
                  : "bg-white text-orange-500 border border-orange-500 hover:bg-orange-50"
              }`}
            >
              {isFree ? "Start Free Trial" : "Subscribe Today"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlanSelection: React.FC = () => {
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

          try {
            await updateFreeTrialStatus({}).unwrap();
          } catch (trialError) {
            console.error("Failed to update free trial status:", trialError);
          }

          // Set loading state first
          handleSetModalState(MODAL_STATES.LOADING);

          // Wait for loading state to be set and modal to appear
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Now handle the navigation
          const redirectUrl =
            userType === "employer"
              ? ROUTE_CONSTANTS.COMPLETE_PROFILE
              : ROUTE_CONSTANTS.CREATE_APPLICATION;

          window.location.href = redirectUrl;
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
        showError("Login Error", "Failed to login. Please try again.");
      }
    } else {
      handleSetModalState(MODAL_STATES.AUTHNET_PAYMENT_FULL);
    }
  };

  // Update the handleMobileSubscription function similarly
  const handleMobileSubscription = async (
    selectedPlan: PLAN_SELECTION_ITEMS,
  ) => {
    // First set the selected plan
    handleSetSelectedPlan(selectedPlan);

    // Add a small delay to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));

    // For free trial, handle directly
    if (selectedPlan === PLAN_SELECTION_ITEMS.FREE) {
      try {
        const response = await loginSubmit({
          email: tempLoginEmail,
          password: tempLoginPassword,
        }).unwrap();

        if (response?.data?.token) {
          login(response.data.token);

          try {
            await updateFreeTrialStatus({}).unwrap();
          } catch (trialError) {
            console.error("Failed to update free trial status:", trialError);
          }

          // Set loading state first
          handleSetModalState(MODAL_STATES.LOADING);

          // Wait for loading state to be set and modal to appear
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Now handle the navigation
          const redirectUrl =
            dataStates.selectedUserType === "employer"
              ? ROUTE_CONSTANTS.COMPLETE_PROFILE
              : ROUTE_CONSTANTS.CREATE_APPLICATION;

          window.location.href = redirectUrl;
        }
      } catch (error) {
        console.error("Auto-login failed:", error);
        showError("Login Error", "Failed to login. Please try again.");
      }
    } else {
      // For paid plans, proceed with payment form
      handleSetSelectedModalHeader(MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE);
      handleSetModalState(MODAL_STATES.AUTHNET_PAYMENT_FULL);
    }
  };

  const isSelected = useCallback(
    (refPlan: PLAN_SELECTION_ITEMS): boolean => currentSelectedPlan === refPlan,
    [currentSelectedPlan],
  );

  const getPlanFeatures = (plan = currentSelectedPlan): PlanFeature[] => {
    if (plan === undefined) return [];

    switch (plan) {
      case PLAN_SELECTION_ITEMS.FREE:
        return [
          { icon: subscription_sparkle_icon, text: "Perfect Match Automation" },
          { icon: subscription_chat_icon, text: "Live chat support" },
          { icon: subscription_bolt_icon, text: "FREE FOR THREE DAYS" },
          {
            icon: subscription_card,
            text: "No credit or debit card required",
          },
        ];
      case PLAN_SELECTION_ITEMS.MONTHLY:
        return [
          { icon: subscription_calendar, text: "Up to 5 Job Listings" },
          {
            icon: subscription_unlimited,
            text: "Unlimited Interview Invites",
          },
          { icon: subscription_sparkle_icon, text: "Perfect Match Automation" },
          { icon: subscription_thumbsup_icon, text: "Insights and Feedback" },
          { icon: subscription_linegraph_icon, text: "Labour Market Insights" },
          {
            icon: subscription_shield_person_icon,
            text: "Exclusive resources",
          },
          { icon: subscription_chat_icon, text: "Live chat support" },
        ];
      case PLAN_SELECTION_ITEMS.ANNUAL:
        return [
          {
            icon: subscription_unlimited,
            text: "Unlimited Interview Invites",
          },
          { icon: subscription_calendar, text: "Up to 5 Job Listings" },
          { icon: subscription_sparkle_icon, text: "Perfect Match Automation" },
          { icon: subscription_thumbsup_icon, text: "Insights and Feedback" },
          { icon: subscription_linegraph_icon, text: "Labour Market Insights" },
          {
            icon: subscription_shield_person_icon,
            text: "Exclusive Employer Resources",
          },
          { icon: subscription_chat_icon, text: "Live chat support" },
        ];
      default:
        return [];
    }
  };

  const getFeaturesList = (): React.ReactNode => {
    if (currentSelectedPlan === undefined) return null;

    const features = getPlanFeatures();

    if (currentSelectedPlan === PLAN_SELECTION_ITEMS.FREE) {
      return (
        <div className="p-[4px] bg-orange-500 rounded-md h-[452px]">
          <div className="flex flex-col h-full w-full bg-[#F5F5F7] rounded-none">
            <div className="flex-1 p-2">
              <h3 className="flex justify-center font-semibold mb-8 text-gray-800">
                Your Free Trial Includes:
              </h3>
              <div className="flex flex-col gap-5">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img src={feature.icon} alt="" className="w-5 h-5" />
                    <span className="text-[13px] text-[#263238]">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center p-4 pt-0">
              <img
                src={gift_selection}
                alt="gift"
                className="w-[100px] h-[100px]"
              />
              <p className="text-center text-[13px] text-orange-500 mb-4">
                Go beyond free and experience it all
              </p>
              <button
                onClick={handleSubscription}
                className="w-full px-4 py-1 text-[15px] h-[32px] bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentSelectedPlan === PLAN_SELECTION_ITEMS.MONTHLY) {
      return (
        <div className="p-[4px] bg-gradient-to-t from-[#D35D00] to-[#f7781e] rounded-md h-[452px]">
          <div className="flex flex-col h-full w-full bg-white rounded-none">
            <div className="flex-1 p-2">
              <h3 className="flex justify-center font-semibold mb-8 text-gray-800">
                Your Monthly Plan Includes:
              </h3>
              <div className="flex flex-col gap-5">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img src={feature.icon} alt="" className="w-5 h-5" />
                    <span className="text-[13px] text-[#263238]">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 pt-0">
              <button
                onClick={handleSubscription}
                className="w-full px-4 py-1 text-[15px] h-[32px] bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Subscribe Today
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-[6px] bg-gradient-to-t from-[#d34300] to-[#eba979] rounded-md h-[452px]">
        <div className="flex flex-col h-full w-full bg-[#FF6B00] rounded-none">
          <div className="flex-1 p-2">
            <h3 className="flex justify-center font-semibold mb-8 text-white">
              Your Yearly Plan Includes:
            </h3>
            <div className="flex flex-col gap-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <img src={feature.icon} alt="" className="w-5 h-5" />
                  <span className="text-[13px] text-white">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 pt-0">
            <button
              onClick={handleSubscription}
              className="w-full px-4 py-1 text-[15px] h-[32px] bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Subscribe Today
            </button>
          </div>
        </div>
      </div>
    );
  };

  return modalState && modalState == MODAL_STATES.SIGNUP_STEP5 ? (
    <>
      {/* Mobile View */}
      <div className="md:hidden w-full">
        <Carousel
          className="w-full relative"
          opts={{
            align: "start",
            loop: false,
          }}
        >
          <CarouselContent className="-ml-4">
            <CarouselItem className="mx-2 basis-[246px] min-w-[246px] relative">
              <MobilePlanCard
                plan={PLAN_SELECTION_ITEMS.ANNUAL}
                features={getPlanFeatures(PLAN_SELECTION_ITEMS.ANNUAL)}
                price="$55/year"
                transactionFee="+ $5.28 transaction fee"
                onSelect={handleMobileSubscription}
              />
            </CarouselItem>

            <CarouselItem className="mx-2 basis-[246px] min-w-[246px] relative">
              <MobilePlanCard
                plan={PLAN_SELECTION_ITEMS.MONTHLY}
                features={getPlanFeatures(PLAN_SELECTION_ITEMS.MONTHLY)}
                price="$5/month"
                transactionFee="+ $0.48 transaction fee"
                onSelect={handleMobileSubscription}
              />
            </CarouselItem>

            <CarouselItem className="mx-2 basis-[246px] min-w-[246px] relative">
              <MobilePlanCard
                plan={PLAN_SELECTION_ITEMS.FREE}
                features={getPlanFeatures(PLAN_SELECTION_ITEMS.FREE)}
                price="Free"
                transactionFee="enjoy with zero fees"
                onSelect={handleMobileSubscription}
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex items-center justify-center w-full h-full max-h-full sm:max-w-screen-sm">
        <div className="flex w-full h-full justify-between">
          <div className="flex flex-col w-[55%] gap-4">
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

            <PriceTag
              key="monthly-tag"
              handler={() =>
                handleSetSelectedPlan(PLAN_SELECTION_ITEMS.MONTHLY)
              }
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
          </div>

          {/* Second column - Features list (thinner) */}
          <div className="w-2/5">{getFeaturesList()}</div>
        </div>
      </div>
    </>
  ) : null;
};

export default SubscriptionPlanSelection;

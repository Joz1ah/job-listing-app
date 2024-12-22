import React from "react";
import { Button } from "components";
import {
  Gift,
  CalendarCheck,
  ThumbsUp,
  ChartNoAxesCombined,
  LockKeyhole,
  MessageCircleMore,
  Trophy,
  Infinity,
} from "lucide-react";
import { useJobHunterContext } from "components";
import sparkle_icon from "assets/images/sparkle-icon.png";
import { SubscriptionDialog } from "./alerts/SubscriptionDialog";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeatures {
  yearly: Feature[];
  monthly: Feature[];
}

interface SubscriptionCardProps {
  title: string;
  description: string;
  features: Feature[];
  isHighlighted?: boolean;
  buttonText: string;
  isCurrentPlan?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  description,
  features,
  isHighlighted = false,
  buttonText,
  isCurrentPlan = false,
}) => {
  const { subscriptionPlan } = useJobHunterContext();

  return (
    <div
      className={`md:w-[360px] h-[440px] p-4 rounded transition-all duration-300 ease-in-out flex flex-col ${
        isCurrentPlan && subscriptionPlan !== "freeTrial"
          ? "scale-105 group-hover:scale-100 hover:!scale-105"
          : "hover:scale-105"
      } ${
        isHighlighted
          ? "bg-[#263238] shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          : "bg-[#F5F5F7BF]/75"
      }`}
    >
      <div className="flex-1">
        {isHighlighted && (
          <div className="mb-2 flex gap-1">
            <Trophy size={20} className="text-[#F5722E]" />
            <span className="text-[#F5722E] text-sm">Best Value</span>
          </div>
        )}

        <h3 className="text-2xl flex justify-center text-[#F5722E] font-semibold mb-2">
          {title}
        </h3>

        <p
          className={`text-sm mb-2 ${
            isHighlighted ? "text-[#F5F5F7]" : "text-[#263238]"
          }`}
        >
          {description}
        </p>

        <div className="space-y-3 mb-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <span className="text-[#F5722E]">
                {React.cloneElement(feature.icon as React.ReactElement, {
                  size: 20,
                  className: "stroke-current",
                })}
              </span>
              <span
                className={`text-[13px] ${
                  isHighlighted ? "text-[#F5F5F7]" : "text-[#263238]"
                }`}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex justify-center">
        <Button
          className={`w-full md:w-[300px] h-8 py-2 px-4 rounded-[2px] ${
            isHighlighted
              ? "bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7]"
              : "border bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7]"
          }`}
        >
          {isCurrentPlan
            ? subscriptionPlan === "yearlyPlan"
              ? "Keep Your Yearly Savings"
              : "Renew"
            : buttonText}
        </Button>
      </div>
    </div>
  );
};

const SubscriptionSettings: React.FC = () => {
  const { subscriptionPlan } = useJobHunterContext();

  const features: PlanFeatures = {
    yearly: [
      { icon: <Gift />, text: "PLUS ONE MONTH FREE" },
      { icon: <CalendarCheck />, text: "Hire with Ease" },
      { icon: <Infinity />, text: "Unlimited interviews" },
      {
        icon: <img src={sparkle_icon} className="w-5 h-5" />,
        text: "Perfect Match automation",
      },
      { icon: <ThumbsUp />, text: "Insights and Feedback" },
      { icon: <ChartNoAxesCombined />, text: "Labour Market Insights" },
      { icon: <LockKeyhole />, text: "Exclusive Employer Resources" },
      { icon: <MessageCircleMore />, text: "Live chat support" },
    ],
    monthly: [
      { icon: <CalendarCheck />, text: "Hire with Ease" },
      { icon: <Infinity />, text: "Unlimited interviews" },
      {
        icon: <img src={sparkle_icon} className="w-5 h-5" />,
        text: "Perfect Match automation",
      },
      { icon: <ThumbsUp />, text: "Insights and Feedback" },
      { icon: <ChartNoAxesCombined />, text: "Labour Market Insights" },
      { icon: <LockKeyhole />, text: "Exclusive Employer Resources" },
      { icon: <MessageCircleMore />, text: "Live chat support" },
    ],
  };

  const renderSubscriptionStatus = () => {
    let statusText = "";
    let planName = "";

    switch (subscriptionPlan) {
      case "freeTrial":
        statusText = "You're subscribed to the";
        planName = "Free Trial";
        break;
      case "monthlyPlan":
        statusText = "You're subscribed to the";
        planName = "Monthly Plan";
        break;
      case "yearlyPlan":
        statusText = "You're subscribed to the";
        planName = "Yearly Plan";
        break;
    }

    return (
      <div className="text-center mb-8">
        <p className="text-[#F5F5F7] text-sm">{statusText}</p>
        <p className="text-[#F5722E] font-semibold text-[26px]">{planName}</p>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-2">
        <h2 className="text-[#F5F5F7] text-2xl font-normal mb-3">
          ✦ Subscription Plans
        </h2>
        <p className="text-[#F8F8FF] text-sm">
          Select the perfect plan for your needs: get started with our $5
          monthly plan for easy access to all essential features, or save more
          with our $55 yearly plan, offering full access to premium content and
          exclusive benefits throughout the year
        </p>
      </div>

      <div className="h-9">
        {subscriptionPlan !== "freeTrial" && (
          <div className="flex justify-end mb-2">
            <SubscriptionDialog />
          </div>
        )}
      </div>

      {renderSubscriptionStatus()}

      <div className="grid md:grid-cols-2 gap-4 md:gap-0 justify-items-center group">
        <SubscriptionCard
          title="Yearly Plan"
          description="Maximize your reach, save more, and hire the best talent faster"
          features={features.yearly}
          isHighlighted={true}
          buttonText={
            subscriptionPlan === "monthlyPlan" ? "Upgrade Today" : "Upgrade Now"
          }
          isCurrentPlan={subscriptionPlan === "yearlyPlan"}
        />
        <SubscriptionCard
          title="Monthly Plan"
          description="Maximize your reach, save more, and hire the best talent faster"
          features={features.monthly}
          isHighlighted={false}
          buttonText={
            subscriptionPlan === "yearlyPlan"
              ? "Switch to Monthly (Less Value)"
              : "Upgrade Now"
          }
          isCurrentPlan={subscriptionPlan === "monthlyPlan"}
        />
      </div>
    </div>
  );
};

export { SubscriptionSettings };

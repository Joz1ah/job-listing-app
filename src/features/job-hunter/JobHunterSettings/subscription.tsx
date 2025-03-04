import React, { useState } from "react";
import { Button } from "components";
import { useJobHunterContext } from "components";
import { SubscriptionDialog } from "./alerts/SubscriptionDialog";
import sparkle_icon from "assets/images/sparkle-icon.png";
import star_icon from "assets/images/star-subscription-icon.svg?url";
import { PaymentStep } from "components";
import trophy_icon from "assets/subscription-plan-icons/trophy-orange.svg?url";
import calender_icon from "assets/subscription-plan-icons/calendar-orange.svg?url";
import line_graph_icon from "assets/subscription-plan-icons/line-graph-orange.svg?url";
import like_icon from "assets/subscription-plan-icons/like-orange.svg?url";
import infinity_icon from "assets/subscription-plan-icons/infinity-orange.svg?url";
import lock_icon from "assets/subscription-plan-icons/lock-orange.svg?url";
import message_icon from "assets/subscription-plan-icons/message-orange.svg?url";

import { ExpiredSubModal } from "components";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeatures {
  yearly: Feature[];
  monthly: Feature[];
}

interface SuccessStepProps {
  onBack: () => void;
  planType: "yearly" | "monthly" | null;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ planType }) => {
  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <img src={star_icon} alt="star" />

      <h2 className="text-[#F5722E] text-[26px] font-normal mb-2">
        {planType === "yearly"
          ? "Welcome to a Year of Savings!"
          : "You're All Set for Monthly Access!"}
      </h2>

      <p className="text-[#F5F5F7] text-[15px] font-light text-center mb-8">
        {planType === "yearly"
          ? "You've unlocked a whole year of exclusive benefits and\ncost savings. Let's get to work!"
          : "Enjoy flexibility and exclusive tools to achieve your goals—one month at a time"}
      </p>

      <div className="flex flex-col space-y-3 items-center w-full">
        <Button
          className="bg-[#F5722E] text-[13px] hover:bg-[#F5722E]/90 text-white rounded p-0 w-[140px]"
          onClick={() => (window.location.href = "/dashboard/feed")}
        >
          Go To Job Feed
        </Button>
        <Button
          variant="outline"
          className="border-[#F5722E] bg-transparent text-[#F5722E] hover:bg-[#F5722E] hover:text-white rounded p-0 w-[140px]"
          onClick={() =>
            (window.location.href = "/dashboard/account-settings/subscription")
          }
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

const SubscriptionSettings: React.FC = () => {
  const { subscriptionPlan } = useJobHunterContext();
  type Step = "plans" | "payment" | "success";
  const [currentStep, setCurrentStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly" | null>(
    null,
  );
  const [isModalOpen] = useState(false);

  const features: PlanFeatures = {
    yearly: [
      {
        icon: <img src={infinity_icon} className="w-5 h-5" />,
        text: "Unlimited interview Invites",
      },
      {
        icon: <img src={calender_icon} className=" w-5 h-5" />,
        text: "Up to 5 Job Listings",
      },
      {
        icon: <img src={sparkle_icon} className="w-5 h-5" />,
        text: "Perfect Match automation",
      },
      {
        icon: <img src={like_icon} className="w-5 h-5" />,
        text: "Insights and Feedback",
      },
      {
        icon: <img src={line_graph_icon} className="w-5 h-5" />,
        text: "Labour Market Insights",
      },
      {
        icon: <img src={lock_icon} className="w-5 h-5" />,
        text: "Exclusive Employer Resources",
      },
      { icon: <img src={message_icon} />, text: "Live chat support" },
    ],
    monthly: [
      {
        icon: <img src={calender_icon} className=" w-5 h-5" />,
        text: "Up to 5 Job Listings",
      },
      {
        icon: <img src={infinity_icon} className="w-5 h-5" />,
        text: "Unlimited interviews",
      },
      {
        icon: <img src={sparkle_icon} className="w-5 h-5" />,
        text: "Perfect Match automation",
      },
      {
        icon: <img src={like_icon} className="w-5 h-5" />,
        text: "Ratings and Feedback",
      },
      {
        icon: <img src={line_graph_icon} className="w-5 h-5" />,
        text: "Labour Market Insights",
      },
      {
        icon: <img src={lock_icon} className="w-5 h-5" />,
        text: "Exclusive Employer Resources",
      },
      {
        icon: <img src={message_icon} className="w-5 h-5" />,
        text: "Live chat support",
      },
    ],
  };

  // Update PaymentStep to include onSuccess prop
  const handlePaymentSuccess = () => {
    setCurrentStep("success");
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setCurrentStep("plans");
  };

  if (currentStep === "success") {
    return <SuccessStep onBack={handleBackToPlans} planType={selectedPlan} />;
  }

  if (currentStep === "payment" && selectedPlan) {
    return (
      <div className="w-full">
        <div className="mb-2">
          <h2 className="flex text-[#F5F5F7] text-2xl font-normal mb-3 items-center">
            <span className="text-3xl mr-2">✦</span> Your Subscription
          </h2>
          <p className="text-[#F8F8FF] text-[13px]">
            Select the perfect plan for your needs: get started with our $5
            monthly plan for easy access to all essential features, or save more
            with our $55 yearly plan, offering full access to premium content
            and exclusive benefits throughout the year
          </p>
        </div>
        <PaymentStep
          planType={selectedPlan}
          features={features[selectedPlan]}
          onSuccess={handlePaymentSuccess}
          onBack={handleBackToPlans}
        />
      </div>
    );
  }

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
      <ExpiredSubModal open={isModalOpen} userType="job-hunter" />
      <div className="mb-2">
        <h2 className="flex text-[#F5F5F7] text-2xl font-normal mb-3 items-center">
          <span className="text-3xl mr-2">✦</span> Your Subscription
        </h2>
        <p className="text-[#F8F8FF] text-[13px]">
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
          onSelect={() => {
            setSelectedPlan("yearly");
            setCurrentStep("payment");
          }}
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
          onSelect={() => {
            setSelectedPlan("monthly");
            setCurrentStep("payment");
          }}
        />
      </div>
    </div>
  );
};

interface SubscriptionCardProps {
  title: string;
  description: string;
  features: Feature[];
  isHighlighted?: boolean;
  buttonText: string;
  isCurrentPlan?: boolean;
  onSelect: () => void;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  description,
  features,
  isHighlighted = false,
  buttonText,
  isCurrentPlan = false,
  onSelect,
}) => {
  const { subscriptionPlan } = useJobHunterContext();

  // Determine if button should be disabled (when trying to downgrade from yearly to monthly)
  const isDisabled =
    subscriptionPlan === "yearlyPlan" && title === "Monthly Plan";

  // Determine if button should be hidden
  const hideButton =
    (isCurrentPlan &&
      subscriptionPlan === "monthlyPlan" &&
      title === "Monthly Plan") ||
    (isCurrentPlan &&
      subscriptionPlan === "yearlyPlan" &&
      title === "Yearly Plan");

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
      {isHighlighted && (
        <div className="mb-2 flex gap-1">
          <img src={trophy_icon} className="w-5 h-5" />
          <span className="text-[#F5722E] text-sm font-semibold italic">
            Best Value
          </span>
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
      <div className="flex-grow flex flex-col justify-center">
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
        {!hideButton && (
          <Button
            onClick={!isCurrentPlan && !isDisabled ? onSelect : undefined}
            disabled={isDisabled}
            className={`w-full md:w-[300px] h-8 py-2 px-4 rounded-[2px] ${
              isDisabled
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : isHighlighted
                  ? "bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7]"
                  : "border bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7]"
            }`}
          >
            {isCurrentPlan
              ? "Feature Unavailable"
              : isDisabled
                ? "Feature Unavailable"
                : buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export { SubscriptionSettings };

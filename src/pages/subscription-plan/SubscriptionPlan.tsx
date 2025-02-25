import { FC } from "react";
import { Button } from "components";
import {
  ThumbsUp,
  ChartNoAxesCombined,
  LockKeyhole,
  MessageCircleMore,
  Trophy,
  //Gift,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import sparkle_icon from "assets/images/sparkle-icon.png";
import { DefaultLayout } from "layouts";
import { useAuth } from "contexts/AuthContext/AuthContext";
import styles from "./subscriptionPlan.module.scss";
import subscription_card from "assets/card-orange.svg?url";

interface PlanFeature {
  icon: React.ReactNode;
  text: string;
}

interface PlanProps {
  title: string;
  price: string;
  period: string;
  features: PlanFeature[];
  bestValue?: boolean;
}

const PlanCard: FC<PlanProps> = ({
  title,
  price,
  period,
  features,
  bestValue,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartNow = () => {
    if (isAuthenticated) {
      navigate("/dashboard/account-settings/subscription");
    } else {
      navigate("#", {
        state: {
          openModal: true,
          modalType: "SIGNUP_SELECT_USER_TYPE",
        },
      });
    }
  };

  const allFeatures = features;

  return (
    <div
      className={`w-full md:w-[640px] md:h-[220px] ${bestValue ? "bg-[#F5F5F7BF]" : "bg-[#F5F5F7BF]"} shadow-[0_4px_8px_rgba(0,_0,_0,_0.2),_0_-4px_8px_rgba(0,_0,_0,_0.05)] px-6 py-4 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_2px_rgba(245,114,46,0.6)] mb-8 rounded-none`}
    >
      {/* Single row with two columns */}
      <div className="flex justify-between h-full">
        {/* Left column */}
        <div className="flex flex-col justify-start">
          {bestValue && (
            <div className="flex items-center gap-1 mb-2">
              <Trophy size={16} className="text-[#F5722E]" />
              <span className="text-[#F5722E] text-sm italic font-bold">
                Best Value
              </span>
            </div>
          )}
          {title === "Free Trial" ? (
            <div className="mb-2">
              <span className="text-[#F5722E] text-2xl font-bold">
                Free Trial
              </span>
              <div
                className={`text-xl font-bold ${bestValue ? "text-[#F5F5F7]" : "text-[#263238]"} mt-1`}
              >
                for 3 days only
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-[#F5722E] text-2xl font-bold">
                ${price}
              </span>
              <span className={`text-[#F5722E] text-2xl font-bold`}>
                {period}
              </span>
              {bestValue && (
                <span className="text-gray-400 text-2xl ml-2 line-through">
                  $60
                </span>
              )}
            </div>
          )}
          {price !== "0" && (
            <h3 className={`text-[#263238] text-xl font-semibold mb-2`}>
              {title}
            </h3>
          )}
          <p className={`text-[#263238] text-[15px] mb-2`}>
            Maximize your reach, save more,
            <br />
            and hire the best talent faster
          </p>
          <Button
            className="w-32 h-8 bg-[#F5722E] text-[#F5F5F7] py-1 px-4 rounded-md hover:bg-[#F5722E]/90 text-[15px] font-medium"
            onClick={handleStartNow}
          >
            Start Now
          </Button>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-center">
          <div className="flex flex-col gap-2">
            {allFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#F5722E]">{feature.icon}</span>
                <span className={`text-[#263238] text-sm`}>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlan: FC = () => {
  const features = [
    {
      icon: <img src={sparkle_icon} className="w-[22px] h-[22px]" />,
      text: "Perfect Match automation",
    },
    { icon: <ThumbsUp size={22} />, text: "Insights and Feedback" },
    { icon: <ChartNoAxesCombined size={22} />, text: "Analytics Dashboard" },
    { icon: <LockKeyhole size={22} />, text: "Exclusive Employer Resources" },
    { icon: <MessageCircleMore size={22} />, text: "Live chat support" },
  ];
  const featuresFreeTrial = [
    {
      icon: <img src={sparkle_icon} className="w-[22px] h-[22px]" />,
      text: "Perfect Match automation",
    },
    { icon: <MessageCircleMore size={22} />, text: "Live chat support" },
    {
      icon: <img src={subscription_card} />,
      text: "No credit or debit card required",
    },
  ];

  return (
    <DefaultLayout>
      <div
        className={`${styles["subscription-plan-container"]} pb-10 md:pt-10`}
      >
        <div className=" mx-auto px-4">
          <div className="space-y-6 pt-4">
            <PlanCard
              title="Yearly Plan"
              price="55"
              period="/year"
              features={features}
              bestValue={true}
            />
            <PlanCard
              title="Monthly Plan"
              price="5"
              period="/ month"
              features={features}
            />
            <PlanCard
              title="Free Trial"
              price="0"
              period="for 3 days only"
              features={featuresFreeTrial}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export { SubscriptionPlan };

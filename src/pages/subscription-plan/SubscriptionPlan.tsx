import { FC } from "react";
import { Button } from "components";
import { useNavigate } from "react-router-dom";
import sparkle_icon from "assets/images/sparkle-icon.png";
import { DefaultLayout } from "layouts";
import { useAuth } from "contexts/AuthContext/AuthContext";
import styles from "./subscriptionPlan.module.scss";
import subscription_card from "assets/card-orange.svg?url";
import { PageMeta } from "components";

import trophy_icon from "assets/subscription-plan-icons/trophy-orange.svg?url";
import handshake_icon from "assets/subscription-plan-icons/handshake-orange.svg?url";
import calender_icon from "assets/subscription-plan-icons/calendar-orange.svg?url";
import line_graph_icon from "assets/subscription-plan-icons/line-graph-orange.svg?url";
import like_icon from "assets/subscription-plan-icons/like-orange.svg?url";
import message_icon from "assets/subscription-plan-icons/message-orange.svg?url";

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
  isFree?: boolean;
  transactionFee?: boolean;
  originalPrice?: string;
}

const PlanCard: FC<PlanProps> = ({
  title,
  price,
  period,
  features,
  bestValue,
  isFree,
  transactionFee,
  originalPrice,
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

  return (
    <div
      className={`w-full md:w-[640px] md:h-[220px] bg-white shadow-[0_4px_8px_rgba(0,_0,_0,_0.1)] px-4 sm:px-6 md:px-10 py-4 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_2px_rgba(245,114,46,0.6)] rounded-md`}
    >
      {/* Single row with two columns */}
      <div className="flex flex-col md:flex-row md:justify-between h-full">
        {/* Left column */}
        <div className="flex flex-col justify-start mb-6 md:mb-0">
          {bestValue && (
            <div className="flex items-center gap-1 mb-1">
              <img src={trophy_icon} className="text-[#F5722E] w-4 h-4" />
              <span className="text-[#F5722E] text-sm italic font-bold">
                Best Value
              </span>
            </div>
          )}

          {isFree ? (
            <>
              <h3 className="text-[#F5722E] text-2xl font-bold mb-1">
                FREEMIUM
              </h3>
              <p className="text-gray-500 text-sm mb-3">enjoy with zero fees</p>
            </>
          ) : (
            <>
              <div className="flex flex-wrap items-baseline gap-1 mb-1">
                <span className="text-[#F5722E] text-2xl font-bold">
                  CAD ${price}
                </span>
                <span className="text-[#F5722E] text-xl font-bold">
                  {period}
                </span>
                {bestValue && originalPrice && (
                  <span className="text-gray-400 text-lg ml-2 line-through">
                    ${originalPrice}
                  </span>
                )}
              </div>
              {transactionFee && (
                <p className="text-gray-500 text-sm mb-1">+ transaction fee</p>
              )}
            </>
          )}

          <h3 className="text-gray-800 text-xl font-semibold mb-3">{title}</h3>

          <Button
            className="w-32 h-10 bg-[#F5722E] text-white py-1 px-4 rounded-md hover:bg-[#F5722E]/90 text-base font-medium"
            onClick={handleStartNow}
          >
            Start Now
          </Button>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-1">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#F5722E] min-w-5 flex-shrink-0">{feature.icon}</span>
                <span className="text-gray-700 text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionPlan: FC = () => {
  const { user } = useAuth();
  const userType = user?.data?.user?.type;
  const isEmployer = userType === "employer";

  const yearlyFeatures = [
    {
      icon: (
        <img
          src={isEmployer ? handshake_icon : calender_icon}
          className="w-5 h-5"
        />
      ),
      text: isEmployer
        ? "Send 3 interview Invites per month"
        : "Send 3 interview Invites per month",
    },
    ...(isEmployer
      ? [
          {
            icon: <img src={calender_icon} className="w-5 h-5" />,
            text: "Create 3 job listings per month",
          },
        ]
      : []),
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
      icon: <img src={message_icon} className="w-5 h-5" />,
      text: "Live chat support",
    },
  ];

  const monthlyFeatures = [
    {
      icon: (
        <img
          src={isEmployer ? handshake_icon : calender_icon}
          className="w-5 h-5"
        />
      ),
      text: isEmployer
        ? "Send 3 interview Invites per month"
        : "Send 3 interview Invites per month",
    },
    ...(isEmployer
      ? [
          {
            icon: <img src={calender_icon} className="w-5 h-5" />,
            text: "Create 3 job listings per month",
          },
        ]
      : []),
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
      icon: <img src={message_icon} className="w-5 h-5" />,
      text: "Live chat support",
    },
  ];

  const freeFeatures = [
    {
      icon: <img src={sparkle_icon} className="w-5 h-5" />,
      text: "Perfect Match automation",
    },
    {
      icon: <img src={message_icon} className="w-5 h-5" />,
      text: "Live chat support",
    },
    {
      icon: <img src={subscription_card} className="w-5 h-5" />,
      text: "No credit or debit card required",
    },
  ];

  return (
    <>
      <PageMeta
        title="Subscription Plans"
        description="Akaza is a modern job marketplace with a new concept. No resume, No endless scrolling, you just choose your Perfect Match!"
      />
      <DefaultLayout>
        <div
          className={`${styles["subscription-plan-container"]} pb-10 md:pt-10`}
        >
          <div className="max-w-full mx-auto px-4">
            <div className="space-y-6 pt-4 flex flex-col items-center">
              <PlanCard
                title="Yearly Plan"
                price={isEmployer ? "550" : "55"}
                period="/year"
                features={yearlyFeatures}
                bestValue={true}
                transactionFee={true}
                originalPrice={isEmployer ? "600" : "60"}
              />
              <PlanCard
                title="Monthly Plan"
                price={isEmployer ? "50" : "5"}
                period="/month"
                features={monthlyFeatures}
                transactionFee={true}
              />
              <PlanCard
                title=""
                price="0"
                period=""
                features={freeFeatures}
                isFree={true}
              />
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export { SubscriptionPlan };
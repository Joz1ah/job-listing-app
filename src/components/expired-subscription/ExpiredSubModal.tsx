import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "components";
import { Button } from "components";
import { NavLink } from "react-router-dom";
import { PaymentStep } from "./PaymentStep";
import sparkle_icon from "assets/images/sparkle-icon.png";
import trophy_icon from "assets/subscription-plan-icons/trophy-orange.svg?url";
import calender_icon from "assets/subscription-plan-icons/calendar-orange.svg?url";
import line_graph_icon from "assets/subscription-plan-icons/line-graph-orange.svg?url";
import like_icon from "assets/subscription-plan-icons/like-orange.svg?url";
import infinity_icon from "assets/subscription-plan-icons/infinity-orange.svg?url";
import lock_icon from "assets/subscription-plan-icons/lock-orange.svg?url";
import message_icon from "assets/subscription-plan-icons/message-orange.svg?url";
import { ROUTE_CONSTANTS } from "constants/routeConstants";

type UserType = "employer" | "job-hunter";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeatures {
  yearly: Feature[];
  monthly: Feature[];
}

interface ExpiredSubModalProps {
  open: boolean;
  userType: UserType;
  isSubscriptionExpired?: boolean;
}

type Step = "plans" | "payment" | "success";
type PlanType = "yearly" | "monthly";

const getFeatures = (userType: UserType): PlanFeatures => ({
  yearly: [
    ...(userType === "employer"
      ? [
          {
            icon: <img src={infinity_icon} className="w-5 h-5" />,
            text: "Unlimited Interview Invites",
          },
          {
            icon: <img src={calender_icon} className="w-5 h-5" />,
            text: "Up to 5 Job Listings",
          },
        ]
      : [
          {
            icon: <img src={calender_icon} className="w-5 h-5" />,
            text: "Send up to 3 Interview Invites",
          },
        ]),
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
      text:
        userType === "employer"
          ? "Exclusive Employer Resources"
          : "Exclusive Resources",
    },
    {
      icon: <img src={message_icon} className="w-5 h-5" />,
      text: "Live chat support",
    },
  ],
  monthly: [
    ...(userType === "employer"
      ? [
          {
            icon: <img src={infinity_icon} className="w-5 h-5" />,
            text: "Unlimited Interview Invites",
          },
          {
            icon: <img src={calender_icon} className="w-5 h-5" />,
            text: "Up to 5 Job Listings",
          },
        ]
      : [
          {
            icon: <img src={calender_icon} className="w-5 h-5" />,
            text: "Send up to 3 Interview Invites",
          },
        ]),
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
      text:
        userType === "employer"
          ? "Exclusive Employer Resources"
          : "Exclusive Resources",
    },
    {
      icon: <img src={message_icon} className="w-5 h-5" />,
      text: "Live chat support",
    },
  ],
});

const ExpiredSubModal: React.FC<ExpiredSubModalProps> = ({
  open,
  userType,
  isSubscriptionExpired = false,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const features = getFeatures(userType);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (open) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Add styles to body to prevent scrolling
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Cleanup function to restore scrolling when modal closes
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);

  const onBack = () => {
    setCurrentStep("plans");
    setSelectedPlan(null);
  };

  const handlePaymentSuccess = () => {
    setCurrentStep("success");
  };

  const renderPlansStep = (): JSX.Element => (
    <div className="w-full">
      <div className="text-center mb-4 bg-[#F9E2CE] p-2">
        <h3 className="text-[#F5722E] text-xl font-extrabold mb-2">
          {isSubscriptionExpired
            ? "Your Subscription has expired"
            : "Your Free Trial has expired"}
        </h3>
        <p className="text-[#263238] text-[13px] md:text-[15px]">
          To continue enjoying access to{" "}
          {userType === "employer" ? "job listings" : "job opportunities"} and
          features,
        </p>
        <p className="text-[#263238] text-[13px] md:text-[15px]">
          please choose a subscription
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 justify-items-center">
        {/* Yearly Plan Card */}
        <div className="w-full md:w-[325px] p-2 sm:p-4 rounded bg-[#263238] shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-300 ease-in-out hover:scale-105 flex flex-col">
          <div className="flex flex-col flex-grow">
            <div className="flex gap-1 mb-2 sm:mb-4">
              <img src={trophy_icon} className="w-5 h-5" />
              <span className="text-[#F5722E] text-xs sm:text-sm italic font-bold">
                Best Value
              </span>
            </div>

            <h3 className="text-lg sm:text-xl text-center text-[#F5722E] font-semibold mb-2 sm:mb-4">
              Yearly Plan
            </h3>

            <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-[#F5F5F7] text-center">
              {userType === "employer"
                ? "Maximize your reach, save more, and hire the best talent faster"
                : "Get access to more opportunities and boost your career growth"}
            </p>

            <div className="space-y-2 sm:space-y-4 flex-grow">
              {features.yearly.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[#F5722E] flex-shrink-0">
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      size: 16,
                      className: "stroke-current",
                    })}
                  </span>
                  <span className="text-[11px] sm:text-[13px] text-[#F5F5F7]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <Button
              onClick={() => {
                setSelectedPlan("yearly");
                setCurrentStep("payment");
              }}
              className="w-full h-8 bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7] rounded-[2px]"
            >
              Upgrade Today
            </Button>
          </div>
        </div>

        {/* Monthly Plan Card */}
        <div className="w-full md:w-[325px] p-2 sm:p-6 rounded bg-[#F9E2CE] shadow-md transition-all duration-300 ease-in-out hover:scale-105 flex flex-col">
          <div className="flex flex-col flex-grow">
            <h3 className="text-lg sm:text-xl text-center text-[#F5722E] font-semibold mb-2 sm:mb-4">
              Monthly Plan
            </h3>

            <p className="text-xs sm:text-sm mb-4 sm:mb-6 text-[#263238] text-center">
              {userType === "employer"
                ? "Maximize your reach, save more, and hire the best talent faster"
                : "Get access to more opportunities and boost your career growth"}
            </p>

            <div className="space-y-2 sm:space-y-4 flex-grow">
              {features.monthly.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[#F5722E] flex-shrink-0">
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      size: 16,
                      className: "stroke-current",
                    })}
                  </span>
                  <span className="text-[11px] sm:text-[13px] text-[#263238]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 sm:mt-6">
              <Button
                onClick={() => {
                  setSelectedPlan("monthly");
                  setCurrentStep("payment");
                }}
                className="w-full h-8 border bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7] rounded-[2px]"
              >
                Upgrade Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = (): JSX.Element => (
    <div
      className={`w-full ${
        selectedPlan === "monthly" ? "bg-[#F9E2CE]" : "bg-[#2D3A41]"
      } px-2 md:px-4 py-2`}
    >
      {selectedPlan && (
        <PaymentStep
          planType={selectedPlan}
          onBack={onBack}
          features={features[selectedPlan]}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );

  const renderSuccessStep = (): JSX.Element => (
    <div
      className={`w-full h-auto flex flex-col items-center justify-center ${
        selectedPlan === "monthly" ? "bg-[#F9E2CE]" : "bg-[#2D3A41]"
      } p-4`}
    >
      <h2 className="text-[#F5722E] text-[26px] font-normal mb-2">
        Great News: You're All Set!
      </h2>

      <p
        className={`text-[15px] font-light text-center ${
          selectedPlan === "monthly" ? "text-[#263238]" : "text-[#F5F5F7]"
        }`}
      >
        Akaza is your gateway to flexible work opportunities.
      </p>
      <p
        className={`text-[15px] font-light text-center mb-8 ${
          selectedPlan === "monthly" ? "text-[#263238]" : "text-[#F5F5F7]"
        }`}
      >
        Click below to begin exploring!
      </p>

      <div className="flex flex-col space-y-3 items-center w-full">
        {userType === "employer" && (
          <NavLink to={ROUTE_CONSTANTS.JOB_LISTING}>
            <Button className="bg-[#F5722E] text-sm hover:bg-[#F5722E]/80 text-white rounded w-36 px-0">
              Create Job Listing
            </Button>
          </NavLink>
        )}

        <a
          href={ROUTE_CONSTANTS.DASHBOARD}
          onClick={() => {
            window.location.href = ROUTE_CONSTANTS.DASHBOARD;
          }}
        >
          <Button
            variant="outline"
            className="border-[#F5722E] bg-transparent text-[#F5722E] hover:bg-[#F5722E] hover:text-white rounded w-36 px-0"
          >
            Go to Job Feed
          </Button>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Custom overlay that starts below the header */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          style={{ top: isMobile ? "56px" : "72px" }} // Adjust based on mobile/desktop header height
        />
      )}

      <Dialog open={open} onOpenChange={() => {}} modal={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Expired Modal</DialogTitle>
        </DialogHeader>
        <DialogContent
          className="w-[90%] sm:w-[85%] md:w-[770px] max-w-5xl bg-[#F5722ECC] border-none p-2 sm:p-4 [&>button]:hidden mx-auto rounded z-50 fixed"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Slightly higher than center
            maxHeight: "calc(100vh - 150px)",
            height: "auto", // Auto height to adapt to content
            overflowY: "auto",
            // Ensure minimum distance from header
            marginTop: isMobile
              ? `max(30px, calc(56px - 5vh))` // On mobile: at least 30px below the 56px header
              : `max(20px, calc(72px - 4vh))`, // On desktop: at least 30px below the 72px header
          }}
        >
          {currentStep === "plans" && renderPlansStep()}
          {currentStep === "payment" && renderPaymentStep()}
          {currentStep === "success" && renderSuccessStep()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export { ExpiredSubModal };

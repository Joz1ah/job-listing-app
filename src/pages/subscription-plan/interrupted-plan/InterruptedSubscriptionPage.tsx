import React, { useState, useEffect } from "react";
import {
  //Trophy,
  ArrowLeft,
} from "lucide-react";
import { DefaultLayout } from "layouts";
import { Button } from "components";
import sparkle_icon_green from "assets/images/sparkle-icon-green.svg?url";
import sparkle_icon from "assets/images/sparkle-icon.png";
import { useUpdateFreeTrialStatusMutation } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import SubscriptionSuccessModal from "./SubscriptionSuccessModal";
import { FreeTrialConfirmationModal } from "./FreeTrialConfirmationModal";
import { FreeTrialSuccessModal } from "./FreeTrialSuccessModal";
import { useErrorModal } from "contexts/ErrorModalContext/ErrorModalContext";
import { usePaymentCreateMutation } from "api/akaza/akazaAPI";
import { InterruptedPaymentForm } from "./InterruptedPaymentForm";
import card_icon from "assets/subscription-plan-icons/card.svg?url";
import calender_icon from "assets/subscription-plan-icons/calendar.svg?url";
import line_graph_icon from "assets/subscription-plan-icons/linegraph.svg?url";
import like_icon from "assets/subscription-plan-icons/thumbsup.svg?url";
import handshake_icon from "assets/subscription-plan-icons/handshake.svg?url";
import message_icon from "assets/subscription-plan-icons/chat.svg?url";
import calender_icon_orange from "assets/subscription-plan-icons/calendar-orange.svg?url";
import line_graph_icon_orange from "assets/subscription-plan-icons/line-graph-orange.svg?url";
import like_icon_orange from "assets/subscription-plan-icons/like-orange.svg?url";
import handshake_icon_orange from "assets/subscription-plan-icons/handshake-orange.svg?url";
import message_icon_orange from "assets/subscription-plan-icons/message-orange.svg?url";
import {
  createAuthNetTokenizer,
  createAuthnetPaymentSecureData,
} from "services/authnet/authnetService";

type PlanProps = {
  type: string;
  price: number;
  features: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  isHighlighted?: boolean;
  subtext: string;
  buttonText: string;
};

const PricingCard: React.FC<
  PlanProps & { onSelect?: () => void; hideButton?: boolean }
> = ({
  type,
  price,
  features,
  isHighlighted,
  subtext,
  buttonText,
  onSelect,
  hideButton = false,
}) => (
  <div
    className={`w-[360px] h-[515px] p-6 rounded-lg bg-white transition-all duration-300 ease-in-out relative flex flex-col hover:scale-105 ${
      isHighlighted ? "shadow-[0_0_60px_rgba(249,115,22,0.8)]" : ""
    }`}
  >
    <div className="text-center">
      {/* {isHighlighted && (
        <div className="absolute -top-1 mt-4 left-3 flex items-center gap-1 ">
          <Trophy size={16} className="text-[#F5722E]" />
          <span className="text-[#F5722E] text-xs font-bold italic">
            Best Value
          </span>
        </div>
      )} */}
      <div className="inline-block px-4 py-1 rounded-full w-auto border border-[#F5722E] text-[#F5722E] mb-4 font-bold text-2xl">
        {type}
      </div>
      <div className="flex justify-center items-baseline gap-0 mb-1">
        <span className="text-2xl text-[#F5722E]">CAD $</span>
        <span className="text-5xl font-bold text-[#F5722E] leading-none">
          {price}
        </span>
        <span className="text-2xl text-[#F5722E]">.00</span>
      </div>
      <p className="text-xs text-[#263238] mb-8">
        {subtext === "3 days free trial" ? (
          <>
            <span className="text-[#F5722E]">3 days</span> free trial
          </>
        ) : (
          subtext
        )}
      </p>
    </div>

    <div className="flex-grow flex flex-col justify-center items-center">
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-[#4BAF66] min-w-[20px]">
              {React.cloneElement(feature.icon as React.ReactElement, {
                size: 18,
                className: "stroke-current",
              })}
            </span>
            <span className="text-[13px] text-[#263238] font-normal">
              {feature.text}
            </span>
          </div>
        ))}
      </div>
    </div>

    {!hideButton && (
      <button
        className="w-full py-3 rounded bg-[#FFF5F0] text-[#F5722E] hover:bg-[#F5722E] hover:text-white transition-colors text-sm mt-4"
        onClick={onSelect}
      >
        {buttonText}
      </button>
    )}
  </div>
);

interface PaymentStepProps {
  plan: {
    type: string;
    price: number;
    features: Array<{
      icon: React.ReactNode;
      text: string;
    }>;
    isHighlighted?: boolean;
    subtext: string;
    buttonText: string;
  };
  onBack: () => void;
  onSuccess: () => void;
}

interface AcceptJsResponse {
  messages: {
    resultCode: string;
    message: Array<{ text: string }>;
  };
  opaqueData: {
    dataValue: string;
  };
}

declare global {
  interface Window {
    Accept: {
      dispatchData: (
        data: any,
        callback: (response: AcceptJsResponse) => void,
      ) => void;
    };
  }
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  plan,
  onBack,
  onSuccess,
}) => {
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useErrorModal();
  const { user } = useAuth();
  const isEmployer = user?.data?.user?.type === "employer";

  useEffect(() => {
    createAuthNetTokenizer();
  }, []);

  const handleCombinedFormSubmit = async (values: any) => {
    setIsLoading(true);

    const { user } = useAuth();
    const isEmployer = user?.data?.user?.type === "employer";
    
    const baseAmount = plan.type === "Monthly" 
      ? (isEmployer ? 50 : 5) 
      : (isEmployer ? 550 : 55);
    
    const transactionFee = baseAmount * 0.096;
    const subtotal = baseAmount + transactionFee;
    const tax =
      values.country?.toLowerCase() === "canada" ? subtotal * 0.13 : 0;
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const secureData = createAuthnetPaymentSecureData({
      cardNumber: values.cardNumber,
      month: values.expiryDate.split("/")[0],
      year: values.expiryDate.split("/")[1],
      cardCode: values.cvv,
    });

    window.Accept.dispatchData(
      secureData,
      async (response: AcceptJsResponse) => {
        if (response.messages.resultCode === "Ok") {
          try {
            await paymentSubmit({
              provider: "authnet",
              plan: plan.type,
              amount: totalAmount,
              paymentMethodId: response.opaqueData.dataValue,
              daysTrial: 0,
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              address: values.address,
              city: values.city,
              state: values.state,
              zip: values.zipCode,
              country: values.country,
            }).unwrap();

            setIsLoading(false);
            onSuccess();
          } catch (err: any) {
            showError(err?.data?.errors, err?.data?.message);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
          showError("Payment Error", response.messages.message[0].text);
        }
      },
    );
  };

  return (
    <div className="min-h-screen bg-[#242625] p-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-[#F5722E] mb-6"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back to Plans</span>
        </button>
  
        <div className="text-left max-w-3xl mx-auto mb-8">
          {plan.type === "FREEMIUM" ? (
            <>
              <h1 className="text-3xl text-[#F5722E] mb-1">
                Get Started with a FreeSubscription – No Cost, Just Benefits!
              </h1>
              <p className="text-[#F8F8FF] text-sm mt-2">
                Start your FREEMIUM today and gain full access to all our features, allowing you to explore everything we offer with no commitment or charges for the first 3 days. Completely risk-free!
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl text-[#F5722E] mb-1">
                {plan.type === "Yearly" ? "Great Choice!" : "Unlock More"}
              </h1>
              <h2 className="text-xl text-[#F5722E] mb-2">
                {plan.type === "Yearly"
                  ? "Unlock Full Access Now!"
                  : "with a Simple Subscription."}
              </h2>
              <p className="text-[#F8F8FF] text-sm">
                {plan.type === "Yearly"
                  ? `We are thrilled to have you as part of our community! Your decision to unlock full access to our yearly plan for CAD ${isEmployer ? '$550' : '$55'} marks the start of a new beginning to provide exceptional service and improve our offerings.`
                  : `We're excited to welcome you to our community! By subscribing to our monthly plan, you're taking a step towards unlocking our service and continually enhance our offerings. Your support means so much to us!`}
              </p>
            </>
          )}
        </div>
  
        <div className="h-[3px] bg-[#F5722E] mt-4 mb-10" />
  
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <PricingCard {...plan} hideButton={true} />
  
          <div className="w-full md:w-[743px] h-auto md:h-[580px] bg-[#2D3A41] px-4 pt-1 pb-4 rounded flex justify-center">
            <InterruptedPaymentForm
              planType={plan.type.toLowerCase() as "monthly" | "yearly"}
              onSubmit={handleCombinedFormSubmit}
              isSubmitting={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface Feature {
  icon: React.ReactNode;
  text: string;
}

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
  isCurrentPlan = false,
  onSelect,
}) => {
  return (
    <div
      className={`w-[325px] h-[400px] p-4 rounded transition-all duration-300 ease-in-out flex flex-col hover:scale-105 ${
        isHighlighted
          ? "bg-[#263238] shadow-[0_0_15px_rgba(249,115,22,0.4)]"
          : "bg-[#F5F5F7BF]/75"
      }`}
    >
      {/* {isHighlighted && (
          <div className="mb-2 flex gap-1">
            <Trophy size={20} className="text-[#F5722E]" />
            <span className="text-[#F5722E] text-sm">Best Value</span>
          </div>
        )} */}

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
        <Button
          onClick={!isCurrentPlan ? onSelect : undefined}
          className={`w-full md:w-[300px] h-8 py-2 px-4 rounded-[2px] ${
            isHighlighted
              ? "bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7]"
              : "border bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7]"
          }`}
        >
          Choose Plan
        </Button>
      </div>
    </div>
  );
};

interface FreeTrialProps {
  onBack: () => void;
  onSelectPlan: (plan: any) => void; // This will trigger navigation to PaymentStep
}

const FreeTrial: React.FC<FreeTrialProps> = ({ onBack, onSelectPlan }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updateFreeTrialStatus] = useUpdateFreeTrialStatusMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isEmployer = user?.data?.user?.type === "employer";
  
  // Set base prices based on user type
  const yearlyPrice = isEmployer ? 550 : 55;
  const monthlyPrice = isEmployer ? 50 : 5;

  const freeFeatures = [
    {
      icon: <img src={sparkle_icon_green} className="w-4 h-4" alt="sparkle" />,
      text: "Perfect Match automation",
    },
    {
      icon: <img src={message_icon} className="w-5 h-5" />,
      text: "Live chat support",
    },
    {
      icon: <img src={card_icon} className="w-5 h-5" />,
      text: "No credit or debit card required",
    },
  ];

  const yearlyFeatures = [
    ...(isEmployer
      ? [
          {
            icon: <img src={handshake_icon_orange} className="w-5 h-5" />,
            text: "Send 3 interview Invites per month",
          },
          {
            icon: <img src={calender_icon_orange} className="w-5 h-5" />,
            text: "Create 3 job listings per month",
          },
        ]
      : [
          {
            icon: <img src={calender_icon_orange} className="w-5 h-5" />,
            text: "Send 3 interview Invites per month",
          },
        ]),
    {
      icon: <img src={sparkle_icon} className="w-4 h-4" alt="sparkle" />,
      text: "Perfect Match automation",
    },
    {
      icon: <img src={like_icon_orange} className="w-5 h-5" />,
      text: "Insights and Feedback",
    },
    {
      icon: <img src={line_graph_icon_orange} />,
      text: "Labour Market Insights",
    },
    { icon: <img src={message_icon_orange} />, text: "Live chat support" },
  ];

  const monthlyFeatures = [
    ...(isEmployer
      ? [
          {
            icon: <img src={handshake_icon_orange} className="w-5 h-5" />,
            text: "Send 3 interview Invites per month",
          },
          {
            icon: <img src={calender_icon_orange} className="w-5 h-5" />,
            text: "Create 3 job listings per month",
          },
        ]
      : [
          {
            icon: <img src={calender_icon_orange} className="w-5 h-5" />,
            text: "Send 3 interview Invites per month",
          },
        ]),
    {
      icon: <img src={sparkle_icon} className="w-4 h-4" alt="sparkle" />,
      text: "Perfect Match automation",
    },
    {
      icon: <img src={like_icon_orange} className="w-5 h-5" />,
      text: "Insights and Feedback",
    },
    {
      icon: <img src={line_graph_icon_orange} />,
      text: "Labour Market Insights",
    },
    { icon: <img src={message_icon_orange} />, text: "Live chat support" },
  ];

  const handleStartFreeTrial = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmFreeTrial = async () => {
    setIsLoading(true);
    try {
      await updateFreeTrialStatus({}).unwrap();
      setShowConfirmationModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error updating free trial status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionCardSelect = (type: "Yearly" | "Monthly") => {
    const selectedPlan = {
      type,
      price: type === "Yearly" ? yearlyPrice : monthlyPrice,
      features: type === "Yearly" ? yearlyFeatures : monthlyFeatures,
      isHighlighted: type === "Yearly",
      subtext:
        type === "Yearly"
          ? `+ transaction fee`
          : `+ transaction fee`,
      buttonText: "Choose Plan",
    };
    onSelectPlan(selectedPlan);
  };

  return (
    <div className="min-h-screen bg-[#242625] p-0 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-[#F5722E] mb-6"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back</span>
        </button>

        <div className="text-left max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl text-[#F5722E] mb-1">
            Get Started with a Free Subscription – No Cost, Just Benefits!
          </h1>
          <p className="text-[#F8F8FF] text-sm mt-2">
            Start your free trial today and gain full access to all our
            features, allowing you to explore everything we offer with no
            commitment or charges for the first 3 days. Completely risk-free!
          </p>
        </div>

        <div className="h-[3px] bg-[#F5722E] mt-4 mb-10" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <div className="w-[360px] flex-shrink-0">
            <PricingCard
              type="FREEMIUM"
              price={0}
              subtext="3 days free trial"
              features={freeFeatures}
              buttonText="Start FREEMIUM"
              hideButton={true}
            />
          </div>

          <div className="w-full xl:min-w-[745px] h-auto xl:h-[515px] bg-[#2D3A41] flex flex-col items-center p-4">
            <h2 className="text-2xl text-[#F5722E] mb-2 font-medium text-center">
              Choose the Best Plan for Ultimate Access and Benefits!
            </h2>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full place-items-center">
              <SubscriptionCard
                title="Yearly Plan"
                description="Maximize your reach, save more, and hire the best talent faster"
                features={yearlyFeatures}
                isHighlighted={true}
                buttonText="Choose Plan"
                onSelect={() => handleSubscriptionCardSelect("Yearly")}
              />
              <SubscriptionCard
                title="Monthly Plan"
                description="Maximize your reach, save more, and hire the best talent faster"
                features={monthlyFeatures}
                isHighlighted={false}
                buttonText="Choose Plan"
                onSelect={() => handleSubscriptionCardSelect("Monthly")}
              />
            </div>

            <Button
              variant="link"
              className="text-[#F5722E] text-md mt-4"
              onClick={handleStartFreeTrial}
            >
              Continue to FREEMIUM
            </Button>
          </div>
        </div>

        <FreeTrialConfirmationModal
          isOpen={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
          onConfirm={handleConfirmFreeTrial}
          isLoading={isLoading}
        />

        <FreeTrialSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            window.location.href = "/dashboard";
          }}
        />
      </div>
    </div>
  );
};

const InterruptedSubscriptionPage: React.FC = () => {
  const [step, setStep] = useState<"plans" | "payment" | "free-trial">("plans");
  const [selectedPlan, setSelectedPlan] = useState<PlanProps | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user } = useAuth();
  const isEmployer = user?.data?.user?.type === "employer";
  
  // Set base prices based on user type
  const yearlyPrice = isEmployer ? 550 : 55;
  const monthlyPrice = isEmployer ? 50 : 5;

  const plans: PlanProps[] = [
    {
      type: "Yearly",
      price: yearlyPrice,
      subtext: `+ transaction fee`,
      buttonText: "Choose Plan",
      features: [
        ...(isEmployer
          ? [
              {
                icon: <img src={handshake_icon} className="w-5 h-5" />,
                text: "Send 3 interview Invites per month",
              },
              {
                icon: <img src={calender_icon} className="w-5 h-5" />,
                text: "Create 3 job listings per month",
              },
            ]
          : [
              {
                icon: <img src={calender_icon} className="w-5 h-5" />,
                text: "Send 3 interview Invites per month",
              },
            ]),
        {
          icon: <img src={sparkle_icon_green} className="w-4 h-4" />,
          text: "Perfect Match automation",
        },
        {
          icon: <img src={like_icon} className="w-5 h-5" />,
          text: "Insights and Feedback",
        },
        { icon: <img src={line_graph_icon} />, text: "Labour Market Insights" },
        { icon: <img src={message_icon} />, text: "Live chat support" },
      ],
      isHighlighted: true,
    },
    {
      type: "Monthly",
      price: monthlyPrice,
      subtext: `+ transaction fee`,
      buttonText: "Choose Plan",
      features: [
        ...(isEmployer
          ? [
              {
                icon: <img src={handshake_icon} className="w-5 h-5" />,
                text: "Send 3 interview Invites per month",
              },
              {
                icon: <img src={calender_icon} className="w-5 h-5" />,
                text: "Create 3 job listings per month",
              },
            ]
          : [
              {
                icon: <img src={calender_icon} className="w-5 h-5" />,
                text: "Send 3 interview Invites per month",
              },
            ]),
        {
          icon: <img src={sparkle_icon_green} className="w-4 h-4" />,
          text: "Perfect Match automation",
        },
        {
          icon: <img src={like_icon} className="w-5 h-5" />,
          text: "Insights and Feedback",
        },
        { icon: <img src={line_graph_icon} />, text: "Labour Market Insights" },
        { icon: <img src={message_icon} />, text: "Live chat support" },
      ],
    },
    {
      type: "FREEMIUM",
      price: 0,
      subtext: "3 days free trial",
      buttonText: "Start FREEMIUM",
      features: [
        {
          icon: <img src={sparkle_icon_green} className="w-4 h-4" />,
          text: "Perfect Match automation",
        },
        {
          icon: <img src={message_icon} className="w-5 h-5" />,
          text: "Live chat support",
        },
        {
          icon: <img src={card_icon} className="w-5 h-5" />,
          text: "No credit or debit card required",
        },
      ],
    },
  ];

  const handlePlanSelect = (plan: PlanProps) => {
    setSelectedPlan(plan);
    if (plan.type === "FREEMIUM") {
      setStep("free-trial");
    } else {
      setStep("payment");
    }
  };

  const handleBack = () => {
    setStep("plans");
    setSelectedPlan(null);
  };

  const handlePaymentSuccess = () => {
    setShowSuccessModal(true);
  };

  const renderContent = () => {
    switch (step) {
      case "payment":
        return (
          selectedPlan && (
            <PaymentStep
              plan={selectedPlan}
              onBack={handleBack}
              onSuccess={handlePaymentSuccess}
            />
          )
        );
      case "free-trial":
        return (
          <FreeTrial onBack={handleBack} onSelectPlan={handlePlanSelect} />
        );
      default:
        return (
          <>
            <div className="text-left max-w-3xl mx-auto mb-8">
              <h1 className="text-3xl text-[#F5722E] mb-1">Welcome Back!</h1>
              <h2 className="text-xl text-[#F5722E] mb-2">
                Let's pick up where you left off
              </h2>
              <p className="text-[#F8F8FF] text-sm">
                Your sign-up isn't complete yet. Finish setting up your account
                by selecting a subscription plan to get started.
              </p>
            </div>
            <div className="h-[3px] bg-[#F5722E] mt-4 mb-10" />
            <div className="flex flex-wrap justify-center gap-6">
              {plans.map((plan, index) => (
                <PricingCard
                  key={index}
                  {...plan}
                  onSelect={() => handlePlanSelect(plan)}
                />
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <DefaultLayout backgroundColor="#242625">
      <div className="min-h-screen bg-[#242625] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">{renderContent()}</div>
      </div>
      {selectedPlan && (
        <SubscriptionSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          type={selectedPlan.type}
        />
      )}
    </DefaultLayout>
  );
};

export { InterruptedSubscriptionPage };
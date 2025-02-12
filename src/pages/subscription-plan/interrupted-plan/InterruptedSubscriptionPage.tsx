import React, { useState } from "react";
import {
  Gift,
  CalendarCheck,
  ThumbsUp,
  ChartNoAxesCombined,
  LockKeyhole,
  MessageCircleMore,
  Trophy,
  ArrowLeft,
  Infinity,
} from "lucide-react";
import { DefaultLayout } from "layouts";
import { InputField } from "components";
import { Input } from "components";
import { Button } from "components";
import sparkle_icon_green from "assets/images/sparkle-icon-green.svg?url";
import sparkle_icon from "assets/images/sparkle-icon.png";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import { useUpdateFreeTrialStatusMutation } from "api/akaza/akazaAPI";
import { useAuth } from "contexts/AuthContext/AuthContext";
import SubscriptionSuccessModal from "./SubscriptionSuccessModal";
import { FreeTrialConfirmationModal } from "./FreeTrialConfirmationModal";
import { FreeTrialSuccessModal } from "./FreeTrialSuccessModal";

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

const PricingCard: React.FC<PlanProps & { onSelect?: () => void; hideButton?: boolean }> = ({
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
      {isHighlighted && (
        <div className="absolute -top-1 mt-4 left-3 flex items-center gap-1 ">
          <Trophy size={16} className="text-[#F5722E]" />
          <span className="text-[#F5722E] text-xs font-bold italic">
            Best Value
          </span>
        </div>
      )}
      <div className="inline-block px-4 py-1 rounded-full w-[124px] border border-[#F5722E] text-[#F5722E] mb-4 font-bold text-2xl">
        {type}
      </div>
      <div className="flex justify-center items-baseline gap-0 mb-1">
        <span className="text-2xl text-[#F5722E]">$</span>
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
  plan: PlanProps;
  onBack: () => void;
  onSuccess: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  plan,
  onBack,
  onSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      // Simulating payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSuccess();
    } catch (error) {
      console.error('Payment processing failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#242625] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-[#F5722E] mb-6"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back to Plans</span>
        </button>

        <div className="text-left max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl text-[#F5722E] mb-1">
            {plan.type === "Yearly" ? "Great Choice!" : "Unlock More"}
          </h1>
          <h2 className="text-xl text-[#F5722E] mb-2">
            {plan.type === "Yearly" ? "Unlock Full Access Now!" : "with a Simple Subscription."}
          </h2>
          <p className="text-[#F8F8FF] text-sm">
            {plan.type === "Yearly" 
              ? "We are thrilled to have you as part of our community! Your decision to unlock full access to our yearly plan for $55 marks the start of a new beginning to provide exceptional service and improve our offerings."
              : "We're excited to welcome you to our community! By subscribing to our monthly plan, you're taking a step towards unlocking our service and continually enhance our offerings. Your support means so much to us!"}
          </p>
        </div>

        <div className="h-[3px] bg-[#F5722E] mt-4 mb-10" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
          <PricingCard {...plan} hideButton={true}/>

          <div className="w-full md:w-[743px] h-[514px] bg-[#2D3A41] p-6 rounded flex justify-center">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 w-full md:w-[350px]"
            >
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  <img src={visa_icon} alt="Visa" />
                  <img src={amex_icon} alt="American Express" />
                  <img src={mastercard_icon} alt="Mastercard" />
                  <img src={discover_icon} alt="Discover" />
                </div>
              </div>

              <div>
                <InputField label="Card Holder Name" variant="primary">
                  <Input
                    id="cardName"
                    className="bg-transparent border-[#F5F5F7] text-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    placeholder="Enter card holder name"
                  />
                </InputField>
              </div>

              <div>
                <InputField label="Card Number" variant="primary">
                  <Input
                    id="cardNumber"
                    className="bg-transparent border-[#F5F5F7] text-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                    placeholder="Enter card number"
                  />
                </InputField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <InputField label="Expiry Date" variant="primary">
                    <Input
                      id="expiryDate"
                      className="bg-transparent border-[#F5F5F7] text-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                      placeholder="XX/XX"
                    />
                  </InputField>
                </div>
                <div>
                  <InputField label="CVV" variant="primary">
                    <Input
                      id="cvv"
                      className="bg-transparent border-[#F5F5F7] text-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                      placeholder="XXX"
                    />
                  </InputField>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full bg-[#F5722E] hover:bg-[#F5722E]/90 text-white h-10 rounded"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Payment Procesing" : "Pay & Upgrade"}
                </Button>

                <div className="flex flex-col items-start">
                  <div className="flex items-center">
                    <LockKeyhole className="text-[#4BAF66]" size={11} />
                    <a className="text-[#4BAF66] text-[9px] underline ml-2">
                      Security & Policy
                    </a>
                  </div>
                  <p className="text-[10px] text-[#F5F5F7]">
                    We maintain industry-standard physical, technical, and
                    administrative measures to safeguard your personal information
                  </p>
                </div>
              </div>
            </form>
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
}

const FreeTrial: React.FC<FreeTrialProps> = ({onBack}) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [updateFreeTrialStatus] = useUpdateFreeTrialStatusMutation();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const isEmployer = user?.data?.user?.type === 'employer';

  const freeFeatures = [
    {
      icon: <img src={sparkle_icon_green} className="w-4 h-4" alt="sparkle" />,
      text: "Perfect Match automation",
    },
    { icon: <ThumbsUp />, text: "Insights and Feedback" },
    { icon: <LockKeyhole />, text: "Exclusive resources" },
  ];

  const yearlyFeatures = [
    { icon: <Gift />, text: "PLUS ONE MONTH FREE" },
    ...(isEmployer 
      ? [
          { icon: <Infinity />, text: "Unlimited Interview Invites" },
          { icon: <CalendarCheck />, text: "Up to 5 Job Listings" },
        ]
      : [
          { icon: <CalendarCheck />, text: "Send up to 3 Interview Invites" },
        ]
    ),
    {
      icon: <img src={sparkle_icon} className="w-4 h-4" alt="sparkle" />,
      text: "Perfect Match automation",
    },
    { icon: <ThumbsUp />, text: "Insights and Feedback" },
    { icon: <ChartNoAxesCombined />, text: "Labour Market Insights" },
    { icon: <LockKeyhole />, text: "Exclusive resources" },
    { icon: <MessageCircleMore />, text: "Live chat support" },
  ];

  const monthlyFeatures = [
    ...(isEmployer 
      ? [
          { icon: <Infinity />, text: "Unlimited Interview Invites" },
          { icon: <CalendarCheck />, text: "Up to 5 Job Listings" },
        ]
      : [
          { icon: <CalendarCheck />, text: "Send up to 3 Interview Invites" },
        ]
    ),
    {
      icon: <img src={sparkle_icon} className="w-4 h-4" alt="sparkle" />,
      text: "Perfect Match automation",
    },
    { icon: <ThumbsUp />, text: "Insights and Feedback" },
    { icon: <ChartNoAxesCombined />, text: "Labour Market Insights" },
    { icon: <LockKeyhole />, text: "Exclusive resources" },
    { icon: <MessageCircleMore />, text: "Live chat support" },
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
      console.error('Error updating free trial status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#242625] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
      <button
          onClick={onBack}
          className="flex items-center text-[#F5722E] mb-6"
        >
          <ArrowLeft size={20} />
          <span className="ml-2">Back to Plans</span>
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
              type="Free"
              price={0}
              subtext="3 days free trial"
              features={freeFeatures}
              buttonText="Start Free Trial"
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
                onSelect={() => {}}
              />
              <SubscriptionCard
                title="Monthly Plan"
                description="Maximize your reach, save more, and hire the best talent faster"
                features={monthlyFeatures}
                isHighlighted={false}
                buttonText="Choose Plan"
                onSelect={() => {}}
              />
            </div>

            <Button 
              variant="link" 
              className="text-[#F5722E] text-md mt-4"
              onClick={handleStartFreeTrial}
            >
              Continue to Free Trial
            </Button>

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
                window.location.href = '/dashboard';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InterruptedSubscriptionPage: React.FC = () => {
  const [step, setStep] = useState<"plans" | "payment" | "free-trial">("plans");
  const [selectedPlan, setSelectedPlan] = useState<PlanProps | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user } = useAuth();
  const isEmployer = user?.data?.user?.type === 'employer';

  const plans: PlanProps[] = [
    {
      type: "Yearly",
      price: 55,
      subtext: "+ transaction fees",
      buttonText: "Choose Plan",
      features: [
        { icon: <Gift />, text: "PLUS ONE MONTH FREE" },
        ...(isEmployer 
          ? [
              { icon: <Infinity />, text: "Unlimited Interview Invites" },
              { icon: <CalendarCheck />, text: "Up to 5 Job Listings" },
            ]
          : [
              { icon: <CalendarCheck />, text: "Send up to 3 Interview Invites" },
            ]
        ),
        {
          icon: <img src={sparkle_icon_green} className="w-4 h-4" />,
          text: "Perfect Match automation",
        },
        { icon: <ThumbsUp />, text: "Insights and Feedback" },
        { icon: <ChartNoAxesCombined />, text: "Labour Market Insights" },
        { icon: <LockKeyhole />, text: "Exclusive resources" },
        { icon: <MessageCircleMore />, text: "Live chat support" },
      ],
      isHighlighted: true,
    },
    {
      type: "Monthly",
      price: 5,
      subtext: "flexible monthly access",
      buttonText: "Choose Plan",
      features: [
        ...(isEmployer 
          ? [
              { icon: <Infinity />, text: "Unlimited Interview Invites" },
              { icon: <CalendarCheck />, text: "Up to 5 Job Listings" },
            ]
          : [
              { icon: <CalendarCheck />, text: "Send up to 3 Interview Invites" },
            ]
        ),
        {
          icon: <img src={sparkle_icon_green} className="w-4 h-4" />,
          text: "Perfect Match automation",
        },
        { icon: <ThumbsUp />, text: "Insights and Feedback" },
        { icon: <ChartNoAxesCombined />, text: "Labour Market Insights" },
        { icon: <LockKeyhole />, text: "Exclusive resources" },
        { icon: <MessageCircleMore />, text: "Live chat support" },
      ],
    },
    {
      type: "Free",
      price: 0,
      subtext: "3 days free trial",
      buttonText: "Start Free Trial",
      features: [
        {
          icon: <img src={sparkle_icon_green} className="w-4 h-4" />,
          text: "Perfect Match automation",
        },
        { icon: <ThumbsUp />, text: "Insights and Feedback" },
        { icon: <LockKeyhole />, text: "Exclusive resources" },
      ],
    },
  ];

  const handlePlanSelect = (plan: PlanProps) => {
    setSelectedPlan(plan);
    if (plan.type === "Free") {
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
        return <FreeTrial onBack={handleBack}/>;
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
      <div className="min-h-screen bg-[#242625] p-8">
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

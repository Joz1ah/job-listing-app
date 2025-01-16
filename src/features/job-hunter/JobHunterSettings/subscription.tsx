import React, { useState } from 'react';
import {
  Gift,
  CalendarCheck,
  ThumbsUp,
  ChartNoAxesCombined,
  LockKeyhole,
  MessageCircleMore,
  Trophy,
  Infinity,
  ArrowLeft,
} from 'lucide-react';
import { Button } from 'components';
import { Input } from 'components';
import { InputField } from 'components';
import { useJobHunterContext } from 'components';
import { SubscriptionDialog } from './alerts/SubscriptionDialog';
import sparkle_icon from "assets/images/sparkle-icon.png";
import star_icon from "assets/images/star-subscription-icon.svg?url"

import visa_icon from 'assets/credit-card-icons/cc_visa.svg?url';
import amex_icon from 'assets/credit-card-icons/cc_american-express.svg?url';
import mastercard_icon from 'assets/credit-card-icons/cc_mastercard.svg?url';
import discover_icon from 'assets/credit-card-icons/cc_discover.svg?url';

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeatures {
  yearly: Feature[];
  monthly: Feature[];
}

interface PaymentStepProps {
  planType: 'yearly' | 'monthly';
  onBack: () => void;
  features: Feature[];
  onSuccess: () => void;
}

const PaymentStep: React.FC<PaymentStepProps> = ({ 
  planType, 
  onBack, 
  features,
  onSuccess 
}) => {
  return (
    <div className="w-full">
      <div className="mb-2">
        <button 
          onClick={onBack}
          className="flex items-center text-[#F5F5F7] hover:text-[#F5722E] mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </button>
        <h2 className="text-[#F5F5F7] text-2xl font-normal mb-3">
          ✦ Your Subscription
        </h2>
        <p className="text-[#F8F8FF] text-sm mb-6">
        Select the perfect plan for your needs: get started with our $5 monthly plan for easy access to all essential features, or save more with our $55 yearly plan, offering full access to premium content and exclusive benefits throughout the year        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl mx-8">
        {/* Left column - Plan details */}
        <div className='mb-8 md:mb-0'>
          <div className="flex items-center gap-2 mb-4">
            <img src={sparkle_icon} alt="Logo" className="w-6 h-6" />
            <span className="text-[#F5722E] font-semibold">
              {planType === 'yearly' ? 'Yearly Plan' : 'Monthly Plan'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-[32px] font-semibold text-[#F5722E]">
              ${planType === 'yearly' ? '55' : '5'}
            </span>
            <span className="text-base text-[#F5F5F7]">/{planType === 'yearly' ? 'year' : 'month'}</span>
            <span className="text-sm text-[#F5F5F7]/70">+ transaction fee</span>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-[#F5722E]">
                  {React.cloneElement(feature.icon as React.ReactElement, {
                    size: 18,
                    className: "stroke-current",
                  })}
                </span>
                <span className="text-[#F5F5F7] text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column - Payment form */}
        <div className="space-y-8 ">
          <div className="flex justify-center">
            <div className="flex gap-2">
              <img src={visa_icon} alt="Visa" />
              <img src={amex_icon} alt="American Express" />
              <img src={mastercard_icon} alt="Mastercard" />
              <img src={discover_icon} alt="Discover" />
            </div>
          </div>

          <div className="space-y-6">
            <div>

              <InputField
              label='Card Holder Name'
              variant='primary'
              >
              <Input 
                id="cardName" 
                className="bg-transparent border-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                placeholder="Enter card holder name"
              />
              </InputField>
            </div>

            <div>
              <InputField
              label='Card Number'
              variant='primary'
              >
              <Input 
                id="cardNumber" 
                className="bg-transparent border-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                placeholder="Enter card number"
              />
              </InputField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
              <InputField
              label='Expiry Date'
              variant='primary'
              >
                <Input 
                  id="expiryDate" 
                  className="bg-transparent border-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                  placeholder="XX/XX"
                />
                </InputField>
              </div>
              <div>
              <InputField
              label='CVV'
              variant='primary'
              >
                <Input 
                  id="cvv" 
                  className="bg-transparent border-[#F5F5F7] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                  placeholder="XXX"
                />
                </InputField>
              </div>
            </div>
            </div>
            <div className='space-y-3'>
            <Button 
              onClick={onSuccess}
              className="w-full bg-[#AEADAD] hover:bg-[#AEADAD]/90 text-white h-10 rounded"
            >
              Confirm and Pay
            </Button>

            <div className="flex flex-col items-start">
            <div className="flex items-center">
              <LockKeyhole className='text-[#4BAF66]' size={11}/>
                <a className='text-[#4BAF66] text-[9px] underline ml-2'>Security & Policy</a>
            </div>
                <p className="text-[10px] text-[#F5F5F7]">
                  We maintain industry-standard physical, technical, and administrative measures to safeguard your personal information
                </p>
            </div>
            </div>
        </div>
      </div>
      

    </div>
  );
};

interface SuccessStepProps {
  onGoToJob: () => void;
  onBack: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ onGoToJob, onBack }) => {
  return (
    <div className="w-full h-[calc(100vh-200px)] flex flex-col items-center justify-center">
      <img src={star_icon} alt="star" />
      
      <h2 className="text-[#F5722E] text-[26px] font-normal mb-2">
        Welcome to a Year of Savings!
      </h2>
      
      <p className="text-[#F5F5F7] text-[15px] font-light text-center mb-8">
        You've unlocked a whole year of exclusive benefits and<br />
        cost savings. Let's get to work!
      </p>
      
      <div className="flex flex-col space-y-3 items-center w-full">
        <Button 
          onClick={onGoToJob}
          className="bg-[#F5722E] text-[13px] hover:bg-[#F5722E]/90 text-white rounded p-0 w-[140px]"
        >
          Go To Job Feed
        </Button>
        
        <Button 
          onClick={onBack}
          variant="outline"
          className="border-[#F5722E] bg-transparent text-[#F5722E] hover:bg-[#F5722E] hover:text-white rounded p-0 w-[140px]"
        >
          Go back
        </Button>
      </div>
    </div>
  );
};

const SubscriptionSettings: React.FC = () => {
  const { subscriptionPlan } = useJobHunterContext();
  type Step = 'plans' | 'payment' | 'success';
  const [currentStep, setCurrentStep] = useState<Step>('plans');
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly' | null>(null);


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

  // Update PaymentStep to include onSuccess prop
  const handlePaymentSuccess = () => {
    setCurrentStep('success');
  };

  const handleGoToJob = () => {
    // Implement navigation to job post
    console.log('Navigate to job post');
  };

  const handleBackToPlans = () => {
    setSelectedPlan(null);
    setCurrentStep('plans');
  };

  if (currentStep === 'success') {
    return (
      <SuccessStep 
        onGoToJob={handleGoToJob}
        onBack={handleBackToPlans}
      />
    );
  }

  if (currentStep === 'payment' && selectedPlan) {
    return (
      <PaymentStep 
        planType={selectedPlan}
        onBack={handleBackToPlans}
        features={features[selectedPlan]}
        onSuccess={handlePaymentSuccess}
      />
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
          onSelect={() => {
            setSelectedPlan('yearly');
            setCurrentStep('payment');
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
            setSelectedPlan('monthly');
            setCurrentStep('payment');
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
          onClick={!isCurrentPlan ? onSelect : undefined}
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

export { SubscriptionSettings };
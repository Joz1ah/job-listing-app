import React, { useState } from "react";
import {
  Gift,
  CalendarCheck,
  ThumbsUp,
  ChartNoAxesCombined,
  LockKeyhole,
  MessageCircleMore,
  Trophy,
  ChevronLeft
} from "lucide-react";
import { Dialog, DialogContent } from "components";
import { Button } from "components";
import { Input } from "components";
import { InputField } from "components";
import { NavLink } from 'react-router-dom';

import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";
import companyLogoLight from "images/company-logo-light.svg?url";
import companyLogoDark from "images/company-logo-dark.svg?url";

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeatures {
  yearly: Feature[];
  monthly: Feature[];
}

interface ExpiredSubModalJobHunterProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "plans" | "payment" | "success";
type PlanType = "yearly" | "monthly";

const ExpiredSubModalJobHunter: React.FC<ExpiredSubModalJobHunterProps> = ({
  open,
  onOpenChange,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("plans");
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  const features: PlanFeatures = {
    yearly: [
      { icon: <Gift />, text: "PLUS ONE MONTH FREE" },
      { icon: <CalendarCheck />, text: "Send up to 3 interview Invites" },
      { icon: <ThumbsUp />, text: "Perfect Match automation" },
      { icon: <ChartNoAxesCombined />, text: "Insights and Feedback" },
      { icon: <LockKeyhole />, text: "Labour Market Insights" },
      { icon: <MessageCircleMore />, text: "Exclusive Resources" },
      { icon: <MessageCircleMore />, text: "Live chat support" },
    ],
    monthly: [
      { icon: <CalendarCheck />, text: "Send up to 3 interview Invites" },
      { icon: <ThumbsUp />, text: "Perfect Match automation" },
      { icon: <ChartNoAxesCombined />, text: "Insights and Feedback" },
      { icon: <LockKeyhole />, text: "Labour Market Insights" },
      { icon: <MessageCircleMore />, text: "ExclusiveResources" },
      { icon: <MessageCircleMore />, text: "Live chat support" },
    ],
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when modal is closed
    setCurrentStep("plans");
    setSelectedPlan(null);
  };

  const onBack = () => {
    setCurrentStep("plans");
    setSelectedPlan(null);  // Optionally reset the selected plan
  };

  const renderPlansStep = (): JSX.Element => (
    <div className="w-full">
      <div className="text-center mb-4 bg-[#F9E2CE] p-2">
        <h3 className="text-[#F5722E] text-xl font-extrabold mb-2">
          Your Free Trial has expired
        </h3>
        <p className="text-[#263238] text-[15px]">
          To continue enjoying access to job listings and features,
        </p>
        <p className="text-[#263238] text-[15px]">
          please choose a subscription
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-2 md:gap-0 justify-items-center group">
        <div className="md:w-[325px] h-[400px] p-4 rounded bg-[#263238] shadow-[0_0_15px_rgba(249,115,22,0.4)] transition-all duration-300 ease-in-out hover:scale-105">
          <div className="flex-1">
            <div className="flex gap-1">
              <Trophy size={20} className="text-[#F5722E]" />
              <span className="text-[#F5722E] text-sm italic font-bold">
                Best Value
              </span>
            </div>

            <h3 className="text-xl flex justify-center text-[#F5722E] font-semibold mb-2">
              Yearly Plan
            </h3>

            <p className="text-sm mb-2 text-[#F5F5F7] flex justify-center">
              Maximize your reach, save more, and hire the best talent faster
            </p>

            <div className="space-y-2 mb-2">
              {features.yearly.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[#F5722E]">
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      size: 20,
                      className: "stroke-current",
                    })}
                  </span>
                  <span className="text-[13px] text-[#F5F5F7]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => {
                setSelectedPlan("yearly");
                setCurrentStep("payment");
              }}
              className="w-full md:w-[300px] h-8 bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7] rounded-[2px]"
            >
              Upgrade Today
            </Button>
          </div>
        </div>

        <div className="md:w-[325px] h-[400px] p-4 rounded bg-[#F9E2CE] transition-all duration-300 ease-in-out hover:scale-105">
          <div className="flex-1">
            <h3 className="text-xl flex justify-center text-[#F5722E] font-semibold mb-2">
              Monthly Plan
            </h3>

            <p className="text-sm mb-2 text-[#263238]">
              Maximize your reach, save more, and hire the best talent faster
            </p>

            <div className="space-y-2 mb-2">
              {features.monthly.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[#F5722E]">
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      size: 20,
                      className: "stroke-current",
                    })}
                  </span>
                  <span className="text-[13px] text-[#263238]">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => {
                setSelectedPlan("monthly");
                setCurrentStep("payment");
              }}
              className="w-full md:w-[300px] h-8 border bg-transparent border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-[#F5F5F7] rounded-[2px]"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentStep = (): JSX.Element => (
    <div className={`w-full ${selectedPlan === 'monthly' ? 'bg-[#F9E2CE]' : 'bg-[#2D3A41]'} px-4 py-2`}>
      <div>
        <div className="mb-2">
        <button 
          onClick={onBack}
          className={`flex items-center text-${selectedPlan === 'yearly' ? '[#F5F5F7]' : '[#F5722E]'} text-[11px] bg-transparent pr-1 rounded-md border border-${selectedPlan === 'yearly' ? '[#F5F5F7]' : '[#F5722E]'} mb-1`}

        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1">Back To Plans</span>
        </button>
          <img src={selectedPlan === 'monthly' ? companyLogoDark : companyLogoLight} className="w-[80px] h-[25px] -ml-1 mb-1" />
          <div className="flex flex-row gap-1 mb-2">
            <span className="text-[#F5722E] italic font-bold text-xs">
              Best Value
            </span>
            <Trophy className="w-4 h-4 text-[#F5722E]" />
          </div>
        </div>
  
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#F5722E] font-semibold text-[22px]">
            {selectedPlan === "yearly" ? "Yearly Plan" : "Monthly Plan"}
          </span>
        </div>
  
        <p className={`text-[13px] font-light ${selectedPlan === 'monthly' ? 'text-[#263238]' : 'text-[#F5F5F7]'} mb-2`}>
          Maximize your reach, save more, and hire the best talent faster
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-5xl gap-2 mr-2">
        <div className="mb-8 md:mb-0">
          <div className="flex flex-col pb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-[32px] font-extrabold text-[#F5722E]">
                ${selectedPlan === "yearly" ? "55" : "5"}
              </span>
              <span className="text-xl font-bold text-[#F5722E]">
                /{selectedPlan === "yearly" ? "year" : "month"}
              </span>
            </div>
            <span className={`text-[13px] ${selectedPlan === 'monthly' ? 'text-[#263238]' : 'text-[#F5F5F7]'} -mt-2 font-extralight`}>
              + transaction fee
            </span>
          </div>
  
          <div className="space-y-4">
            {selectedPlan &&
              features[selectedPlan].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[#F5722E]">
                    {React.cloneElement(feature.icon as React.ReactElement, {
                      size: 18,
                      className: "stroke-current",
                    })}
                  </span>
                  <span className={`${selectedPlan === 'monthly' ? 'text-[#263238]' : 'text-[#F5F5F7]'} text-sm`}>
                    {feature.text}
                  </span>
                </div>
              ))}
          </div>
        </div>
  
        <div>
          <div className="flex justify-center">
            <div className="flex gap-2">
              <img src={visa_icon} alt="Visa" />
              <img src={amex_icon} alt="American Express" />
              <img src={mastercard_icon} alt="Mastercard" />
              <img src={discover_icon} alt="Discover" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <InputField label="Card Holder Name" variant={selectedPlan === 'yearly' ? 'primary' : 'payment'}>
                <Input
                  id="cardName"
                  className={`bg-transparent ${selectedPlan === 'monthly' ? 'border-[#263238] placeholder:text-[#263238] text-[#263238]' : 'border-[#F5F5F7] placeholder:text-[#F5F5F7] text-[#F5F5F7]'} h-[56px] border-2 focus:border-[#F5722E]`}
                  placeholder="Enter card holder name"
                />
              </InputField>
            </div>
  
            <div>
              <InputField label="Card Number" variant={selectedPlan === 'yearly' ? 'primary' : 'payment'}>
                <Input
                  id="cardNumber"
                  className={`bg-transparent ${selectedPlan === 'monthly' ? 'border-[#263238] placeholder:text-[#263238] text-[#263238]' : 'border-[#F5F5F7] placeholder:text-[#F5F5F7] text-[#F5F5F7]'} h-[56px] border-2 focus:border-[#F5722E]`}
                  placeholder="Enter card number"
                />
              </InputField>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <div>
                <InputField label="Expiry Date" variant={selectedPlan === 'yearly' ? 'primary' : 'payment'}>
                  <Input
                    id="expiryDate"
                    className={`bg-transparent ${selectedPlan === 'monthly' ? 'border-[#263238] placeholder:text-[#263238] text-[#263238]' : 'border-[#F5F5F7] placeholder:text-[#F5F5F7] text-[#F5F5F7]'} h-[56px] border-2 focus:border-[#F5722E]`}
                    placeholder="XX/XX"
                  />
                </InputField>
              </div>
              <div>
                <InputField label="CVV" variant={selectedPlan === 'yearly' ? 'primary' : 'payment'}>
                  <Input
                    id="cvv"
                    className={`bg-transparent ${selectedPlan === 'monthly' ? 'border-[#263238] placeholder:text-[#263238] text-[#263238]' : 'border-[#F5F5F7] placeholder:text-[#F5F5F7] text-[#F5F5F7]'} h-[56px] border-2 focus:border-[#F5722E]`}
                    placeholder="XXX"
                  />
                </InputField>
              </div>
            </div>
          </div>
  
          <div className="space-y-3 mt-4">
            <Button
              onClick={() => setCurrentStep("success")}
              className="w-full bg-[#AEADAD] hover:bg-[#AEADAD]/90 text-white h-10 rounded text-[15px]"
            >
              Pay & Upgrade
            </Button>
  
            <div className="flex flex-col items-start">
              <div className="flex items-center">
                <LockKeyhole className="text-[#4BAF66]" size={11} />
                <a className="text-[#4BAF66] text-[9px] underline ml-2">
                  Security & Policy
                </a>
              </div>
              <p className={`text-[10px] ${selectedPlan === 'monthly' ? 'text-[#263238]' : 'text-[#F5F5F7]'}`}>
                We maintain industry-standard physical, technical, and
                administrative measures to safeguard your personal information
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSuccessStep = (): JSX.Element => (
    <div className={`w-full h-auto flex flex-col items-center justify-center ${selectedPlan === 'monthly' ? 'bg-[#F9E2CE]' : 'bg-[#2D3A41]'}`}>
      <h2 className="text-[#F5722E] text-[26px] font-normal mb-2">
        Great News: You're All Set!
      </h2>

      <p className={`text-[15px] font-light text-center ${selectedPlan === 'monthly' ? 'text-[#263238]' : 'text-[#F5F5F7]'}`}>
        Akaza is your gateway to flexible work opportunities.
      </p>
      <p className={`text-[15px] font-light text-center mb-8 ${selectedPlan === 'monthly' ? 'text-[#263238]' : 'text-[#F5F5F7]'}`}>
        Click below to begin exploring!
      </p>

      <div className="flex flex-col space-y-3 items-center w-full">
        <NavLink to="/dashboard/job-listing">
          <Button
            onClick={handleClose}
            className="bg-[#F5722E] text-sm hover:bg-[#F5722E]/80 text-white rounded w-36 px-0"
          >
            Create Job Listing
          </Button>
        </NavLink>

        <NavLink to="/dashboard/feed">
          <Button
            variant="outline"
            className="border-[#F5722E] bg-transparent text-[#F5722E] hover:bg-[#F5722E] hover:text-white rounded w-36 px-0"
          >
            Go to Job Feed
          </Button>
        </NavLink>
      </div>
    </div>
);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full md:w-[770px] md:h-[590px] max-w-5xl bg-[#F5722ECC] border-none p-4 [&>button]:hidden">
        {currentStep === "plans" && renderPlansStep()}
        {currentStep === "payment" && renderPaymentStep()}
        {currentStep === "success" && renderSuccessStep()}
      </DialogContent>
    </Dialog>
  );
};

export { ExpiredSubModalJobHunter };

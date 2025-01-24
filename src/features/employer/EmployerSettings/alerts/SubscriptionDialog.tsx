import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components";
import { Button } from "components";
import {
  CalendarCheck,
  Infinity,
  ThumbsUp,
  ChartNoAxesCombined,
  LockKeyhole,
  MessageCircleMore,
} from "lucide-react";

import sparkle_icon from "assets/images/sparkle-icon.png";
import { useNavigate } from 'react-router-dom';

interface CustomAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface Benefit {
  icon: React.ReactNode;
  text: string;
}

const CustomAccordion: React.FC<CustomAccordionProps> = ({ 
  isOpen, 
  onToggle, 
  children 
}) => {
  return (
    <div>
      <div
        onClick={onToggle}
        className="cursor-pointer"
      >
        <p className="text-white py-4 hover:underline text-xs">
          Cancel Subscription
        </p>
      </div>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const SubscriptionDialog: React.FC = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
    const navigate = useNavigate();
  
  const benefits: Benefit[] = [
    { icon: <CalendarCheck className="w-5 h-5" />, text: 'Hire with Ease' },
    { icon: <Infinity className="w-5 h-5" />, text: 'Unlimited Interviews' },
    { icon: <img src={sparkle_icon} alt="sparkle" className="w-5 h-5" />, text: 'Perfect Match automation' },
    { icon: <ThumbsUp className="w-5 h-5" />, text: 'Insights and Feedback' },
    { icon: <ChartNoAxesCombined className="w-5 h-5" />, text: 'Labour Market Insights' },
    { icon: <LockKeyhole className="w-5 h-5" />, text: 'Exclusive Employer Resources' },
    { icon: <MessageCircleMore className="w-5 h-5" />, text: 'Live chat support' }
  ];

  const handleToggleAccordion = (): void => {
    setIsAccordionOpen(!isAccordionOpen);
  };

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open) {
      setIsAccordionOpen(false);
    }
  };

  const handleContactUs = (): void => {
    // Handle contact us logic
    navigate('/contact-us');
  };

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-[90px] h-[26px] bg-[#F5722E] text-[#F5F5F7] hover:bg-[#F5722E]/90">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#263238] border-none max-w-md p-6 [&_button>svg]:text-white">
        <DialogHeader className="relative">
          <DialogTitle asChild>
            <div className="mb-4">
              <p className="text-[#F5F5F7] text-[15px] font-normal mb-2">You're subscribed to the</p>
              <p className="text-[#F5722E] font-semibold text-[26px]">Monthly Plan</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-[#F5F5F7] text-sm">Renewal Date: January 25, 2025</p>

          <div>
            <p className="text-[#F5722E] text-sm mb-2">Your Benefits:</p>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-[#F5722E]">
                    {benefit.icon}
                  </span>
                  <span className="text-[#F5F5F7] text-sm">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <CustomAccordion 
            isOpen={isAccordionOpen}
            onToggle={handleToggleAccordion}
          >
            <div className="space-y-4">
              <p className="text-[#F5F5F7] text-xs leading-relaxed">
                We hate to see you go! Before you make your final decision, we'd love to 
                help. Let's chat and see if there's a better way we can support you.
              </p>
              <div className="flex justify-center">
                <Button 
                  className="w-full bg-[#F5722E] hover:bg-[#F5722E]/90 text-[#F5F5F7] h-8 rounded-[2px]"
                  onClick={handleContactUs}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </CustomAccordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SubscriptionDialog };
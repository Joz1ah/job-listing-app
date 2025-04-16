import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "components";
import { Button } from "components";

// Removed Lucide icon imports
// import {
//   CalendarCheck,
//   Infinity,
//   ThumbsUp,
//   ChartNoAxesCombined,
//   MessageCircleMore,
// } from "lucide-react";

// Using all the imported SVGs
import calender_icon from "assets/subscription-plan-icons/calendar-orange.svg?url";
import line_graph_icon from "assets/subscription-plan-icons/line-graph-orange.svg?url";
import like_icon from "assets/subscription-plan-icons/like-orange.svg?url";
import handshake_icon from "assets/subscription-plan-icons/handshake-orange.svg?url";
import message_icon from "assets/subscription-plan-icons/message-orange.svg?url";

import sparkle_icon from "assets/images/sparkle-icon.png";
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext/AuthContext';

interface CustomAccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

interface Subscription {
  id: number;
  status: string;
  plan: string;
  startDate: string;
  endDate: string | null;
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
  const [renewalDate, setRenewalDate] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user data from auth context
  
  useEffect(() => {
    if (user && user.data && user.data.user && user.data.user.subscriptions && user.data.user.subscriptions.length > 0) {
      // Find active subscription
      const activeSubscription = user.data.user.subscriptions.find((sub: Subscription) => sub.status === "active");
      
      if (activeSubscription && activeSubscription.startDate) {
        // Parse the start date and calculate the renewal date
        const startDate = new Date(activeSubscription.startDate);
        const renewalDateObj = new Date(startDate);
        
        // Check subscription plan type and set appropriate renewal date
        if (activeSubscription.plan === "Monthly") {
          renewalDateObj.setMonth(renewalDateObj.getMonth() + 1);
        } else if (activeSubscription.plan === "Yearly") {
          renewalDateObj.setFullYear(renewalDateObj.getFullYear() + 1);
        }
        
        // Format the date for display
        setRenewalDate(renewalDateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }));
      }
    }
  }, [user]);
  
  const benefits: Benefit[] = [
    // Replaced Lucide icons with imported SVG images
    { icon: <img src={handshake_icon} alt="infinity" className="w-5 h-5" />, text: 'Send 3 interview Invites per month' },
    { icon: <img src={calender_icon} alt="calendar" className="w-5 h-5" />, text: 'Create 3 job listings per month' }, 
    { icon: <img src={sparkle_icon} alt="sparkle" className="w-5 h-5" />, text: 'Perfect Match automation' },
    { icon: <img src={like_icon} alt="thumbs up" className="w-5 h-5" />, text: 'Insights and Feedback' },
    { icon: <img src={line_graph_icon} alt="chart" className="w-5 h-5" />, text: 'Labour Market Insights' },
    { icon: <img src={message_icon} alt="message" className="w-5 h-5" />, text: 'Live chat support' }
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
              <p className="text-[#F5722E] font-semibold text-[26px]">
                {user?.data?.user?.subscriptions?.[0]?.plan || "Subscription"} Plan
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-[#F5F5F7] text-sm">Renewal Date: {renewalDate || "Loading..."}</p>

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
import React from 'react';
import { 
  Gift, 
  Mail, 
  Target, 
  ThumbsUp, 
  TrendingUp, 
  FileText, 
  MessageCircle,
  Star,
  Trophy
} from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  text: string;
}

interface PlanFeatures {
  yearly: Feature[];
  monthly: Feature[];
}

interface SubscriptionCardProps {
  title: string;
  description: string;
  features: Feature[];
  isHighlighted?: boolean;
  buttonText: string;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  description,
  features,
  isHighlighted = false,
  buttonText
}) => {
  return (
    <div 
      className={`px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 ${
        isHighlighted 
          ? 'bg-[#263238] shadow-[0_0_15px_rgba(249,115,22,0.4)]' 
          : 'bg-[#F5F5F7BF]/75'
      }`}
    >
      {isHighlighted && (
        <div className="mb-2 flex gap-1">
          <Trophy size={20} className='text-[#F5722E]'/>
          <span className="text-[#F5722E] text-sm">Best Value</span>
        </div>
      )}
      
      <h3 className="text-2xl flex justify-center text-[#F5722E] font-bold mb-2">
        {title}
      </h3>
      
      <p className={`text-sm mb-6 ${
        isHighlighted ? 'text-[#F5F5F7]' : 'text-[#263238]'
      }`}>
        {description}
      </p>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <span className="text-[#F5722E]">
              {React.cloneElement(feature.icon as React.ReactElement, { 
                size: 20,
                className: "stroke-current"
              })}
            </span>
            <span className={`text-sm ${
              isHighlighted ? 'text-[#F5F5F7]' : 'text-[#263238]'
            }`}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>

      <button 
        className={`w-full mt-6 py-2 px-4 rounded transition-colors duration-200 ${
          isHighlighted 
            ? 'bg-[#F5722E] hover:bg-orange-600 text-white' 
            : 'border border-[#F5722E] text-[#F5722E] hover:bg-[#F5722E] hover:text-white'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

const SubscriptionSettings: React.FC = () => {
  const features: PlanFeatures = {
    yearly: [
      { icon: <Gift />, text: 'PLUS ONE MONTH FREE' },
      { icon: <Mail />, text: 'Send up to 3 interview invites' },
      { icon: <Target />, text: 'Perfect Match automation' },
      { icon: <ThumbsUp />, text: 'Insights and Feedback' },
      { icon: <TrendingUp />, text: 'Labour Market Insights' },
      { icon: <FileText />, text: 'Exclusive resources' },
      { icon: <MessageCircle />, text: 'Live chat support' }
    ],
    monthly: [
      { icon: <Mail />, text: 'Send up to 3 interview invites' },
      { icon: <Target />, text: 'Perfect Match automation' },
      { icon: <ThumbsUp />, text: 'Insights and Feedback' },
      { icon: <TrendingUp />, text: 'Labour Market Insights' },
      { icon: <FileText />, text: 'Exclusive resources' },
      { icon: <MessageCircle />, text: 'Live chat support' }
    ]
  };

  return (
    <div className="w-full">
        <div className="mb-6">
          <h2 className="text-white text-2xl font-normal mb-3">
            <Star className="inline-block mr-2 stroke-current" size={24} /> 
            Subscription Plans
          </h2>
          <p className="text-gray-400 text-sm">
            Select the perfect plan for your needs: get started with our $5 monthly plan for easy access to all essential features, or save more with our $55 yearly plan, offering full access to premium content and exclusive benefits throughout the year
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-[#F5F5F7] text-sm">You're subscribed to the</p>
          <p className="text-[#F5722E] font-bold text-2xl">Free Trial</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <SubscriptionCard
            title="Yearly Plan"
            description="Maximize your reach, save more, and hire the best talent faster"
            features={features.yearly}
            isHighlighted={true}
            buttonText="Upgrade Now"
          />
          <SubscriptionCard
            title="Monthly Plan"
            description="Maximize your reach, save more, and hire the best talent faster"
            features={features.monthly}
            isHighlighted={false}
            buttonText="Upgrade Now"
          />
        </div>
    </div>
  );
};

export { SubscriptionSettings }
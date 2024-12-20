import { FC } from "react";
import { Button } from "components";
import { ThumbsUp, ChartNoAxesCombined, LockKeyhole, MessageCircleMore, Trophy } from "lucide-react";
import sparkle_icon from 'assets/images/sparkle-icon.png'

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
  return (
    <div
      className={`w-full ${bestValue ? "bg-[#2D3A41]" : "bg-[#F5F5F7BF]"} rounded-lg px-4 py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_2px_rgba(245,114,46,0.6)] mb-6`}
    >
      {/* Single row with two columns */}
      <div className="flex justify-between h-full">
        {/* Left column */}
        <div className="flex flex-col justify-end relative">
          <div className="h-[20px]">
            {bestValue && (
              <span className="text-[#F5722E] text-sm mb-1 absolute top-0 flex items-center gap-1">
                <Trophy size={16}/> Best Value
              </span>
            )}
          </div>
          <div className="flex items-baseline mb-1">
            <span className="text-[#F5722E] text-2xl font-bold">${price}</span>
            <span
              className={`${bestValue ? "text-[#F5F5F7]" : "text-[#263238]"} ml-1`}
            >
              {period}
            </span>
          </div>
          <h3
            className={`${bestValue ? "text-[#F5F5F7]" : "text-[#263238]"} text-lg font-semibold mb-1`}
          >
            {title}
          </h3>
          <p
            className={`${bestValue ? "text-[#F5F5F7]" : "text-[#263238]"} text-sm mb-1`}
          >
            Maximize your reach, save more,
            <br />
            and hire the best talent faster
          </p>
          <Button className="w-32 h-8 text-[15px] bg-[#F5722E] text-[#F5F5F7] py-1 rounded hover:bg-[#F5722E]/90">
            Start Now
          </Button>
        </div>

        {/* Right column */}
        <div className="flex flex-col justify-end relative">
          {bestValue && (
            <span className="text-[#F5F5F7] text-sm mb-2 absolute top-0">
              PLUS ONE MONTH FREE
            </span>
          )}
          <div className="flex flex-col gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-[#F5722E]">{feature.icon}</span>
                <span
                  className={`${bestValue ? "text-[#F5F5F7]" : "text-[#263238]"} text-sm`}
                >
                  {feature.text}
                </span>
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
    { icon: <img src={sparkle_icon} className="w-4 h-4" />, text: "Perfect Match automation" },
    { icon: <ThumbsUp size={16} />, text: "Insights and Feedback" },
    { icon: <ChartNoAxesCombined size={16} />, text: "Analytics Dashboard" },
    { icon: <LockKeyhole size={16} />, text: "Exclusive Employer Resources" },
    { icon: <MessageCircleMore size={16} />, text: "Live chat support" },
  ];

  return (
    <div className="bg-[#242625] min-h-screen md:pt-20">
      <div className="max-w-3xl mx-auto px-4">
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
            period="/per month"
            features={features}
          />
          <PlanCard
            title="Free Trial"
            price="0"
            period="for 3 days only"
            features={features}
          />
        </div>
      </div>
    </div>
  );
};

export { SubscriptionPlan };
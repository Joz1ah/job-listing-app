import { FC } from "react";
import discoverCard from "images/discover-card.svg?url";
import { Tooltip, Button } from "components";
import { Info } from "lucide-react";
import { useEmployerContext } from "components";
import rocketIcon from "images/rocket-subscribe.svg?url";
import { Link } from "react-router-dom";

const BillingSettings: FC = () => {
  const { subscriptionPlan } = useEmployerContext();

  const editTooltip =
    subscriptionPlan === "freeTrial"
      ? "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!"
      : "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!";

  const manageTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante imperdiet congue parturient euismod nec suspendisse.";

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="flex flex-col min-h-full w-full">
        <div className="flex-1">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-white text-2xl font-normal mb-3">
                Billing & Information
              </h2>
              <p className="text-white text-[15px] font-light">
                The card details below are the ones currently used for your
                subscription.
              </p>
            </div>
          </div>

          {/* Free Trial Content */}
          {/* Edit Button Section */}
          <div className="flex justify-end gap-2 mr-6">
            <Button className="px-3 py-1.5 rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
              Edit
            </Button>
            <Tooltip content={editTooltip}>
              <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center justify-center mt-16">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <img src={rocketIcon} alt="Rocket" className="w-12 h-12" />
            </div>

            <h3 className="text-[#F5722E] text-xl font-medium mb-4">
              Take the next step—subscribe and explore!
            </h3>

            <p className="text-white text-center mb-6 max-w-md">
              It appears that you are not currently subscribed. Subscribing will
              give you access to exclusive features, updates, and benefits.
            </p>

            <p className="text-white text-center mb-8">
              Consider subscribing to make the most of your experience!
            </p>

            <button className="px-4 py-2 bg-[#F5722E] text-white rounded text-sm hover:bg-orange-600 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full">
      {/* Content Section */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-white text-2xl font-normal mb-3">
              Billing & Information
            </h2>
            <p className="text-white text-[15px] font-light">
              The card details below are the ones currently used for your
              subscription.
            </p>
          </div>
        </div>

        {/* Edit Button Section */}
        <div className="flex justify-end gap-2 mr-6">
          <Button className="px-3 py-1.5 rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
            Edit
          </Button>
          <Tooltip content={editTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
          </Tooltip>
        </div>

        {/* Card Section - Centered */}
        <div className="flex justify-center w-full mb-8 mt-4">
          <div className="relative w-[360px]">
            <img
              src={discoverCard}
              alt="Discover Card"
              className="w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Subscription Management Section */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white text-sm">Manage Your Subscription</span>
          <Tooltip content={manageTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
          </Tooltip>
        </div>

        <Link
          to="/employer/account-settings/subscription"
          className="inline-block"
        >
          {" "}
          <Button className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { BillingSettings };

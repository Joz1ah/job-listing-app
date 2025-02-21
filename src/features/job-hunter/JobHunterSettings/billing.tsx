import { FC } from "react";
import discoverCard from "images/discover-card.svg?url";
import { Tooltip, Button } from "components";
import { Info } from "lucide-react";
import { useJobHunterContext } from "components";
import rocketIcon from "images/rocket-subscribe.svg?url";
import { Link } from "react-router-dom";

const BillingSettings: FC = () => {
  const { subscriptionPlan } = useJobHunterContext();

  const editTooltip =
    subscriptionPlan === "freeTrial"
      ? "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!"
      : "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!";

  const manageTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante imperdiet congue parturient euismod nec suspendisse.";

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="flex flex-col min-h-full w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="max-w-3xl mb-4 sm:mb-0">
              <h2 className="text-white text-xl sm:text-2xl font-normal mb-3">
                Billing & Information
              </h2>
              <p className="text-white text-sm sm:text-[15px] font-light">
                The card details below are the ones currently used for your
                subscription.
              </p>
            </div>
          </div>

          {/* Free Trial Content */}
          {/* Edit Button Section */}
          <div className="flex justify-end gap-2 mb-6 px-4 sm:px-6">
            <Button className="px-3 py-1.5 rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
              Edit
            </Button>
            <Tooltip content={editTooltip}>
              <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center justify-center mt-8 sm:mt-16 px-4 sm:px-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <img
                src={rocketIcon}
                alt="Rocket"
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>

            <h3 className="text-[#F5722E] text-lg sm:text-xl font-medium mb-4 text-center">
              Take the next step—subscribe and explore!
            </h3>

            <p className="text-white text-center mb-6 max-w-md px-4 sm:px-0">
              It appears that you are not currently subscribed. Subscribing will
              give you access to exclusive features, updates, and benefits.
            </p>

            <p className="text-white text-center mb-8">
              Consider subscribing to make the most of your experience!
            </p>

            <Link to="/dashboard/account-settings/subscription">
              <button className="w-full sm:w-auto px-6 py-2 bg-[#F5722E] text-white rounded text-sm hover:bg-orange-600 transition-colors">
                Subscribe Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Content Section */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div className="max-w-3xl mb-4 sm:mb-0">
            <h2 className="text-white text-xl sm:text-2xl font-normal mb-3">
              Billing & Information
            </h2>
            <p className="text-white text-sm sm:text-[15px] font-light">
              The card details below are the ones currently used for your
              subscription.
            </p>
          </div>
        </div>

        {/* Edit Button Section */}
        <div className="flex justify-end gap-2 mb-6 px-4 sm:px-6">
          <Button className="px-3 py-1.5 rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
            Edit
          </Button>
          {/* <Tooltip content={editTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
          </Tooltip> */}
        </div>

        {/* Card Section - Centered */}
        <div className="flex justify-center w-full mb-8 mt-4 px-4 sm:px-0">
          <div className="w-full max-w-sm sm:max-w-md">
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
            <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
          </Tooltip>
        </div>

        <Link
          to="/dashboard/account-settings/subscription"
          className="inline-block w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { BillingSettings };

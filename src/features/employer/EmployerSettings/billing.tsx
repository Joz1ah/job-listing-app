import { FC } from "react";
import discoverCard from "images/discover-card.svg?url";
import { Tooltip } from "components";
import { Info } from "lucide-react";

const BillingSettings: FC = () => {
  const editTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante  imperdiet congue parturient euismod nec suspendisse.";
  const manageTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante  imperdiet congue parturient euismod nec suspendisse.";

  return (
    <div className="w-full">
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
        <button className="px-3 py-1.5 rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
          Edit
        </button>
        <Tooltip content={editTooltip}>
          <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
        </Tooltip>
      </div>

      {/* Card Section - Centered */}
      <div className="flex justify-center w-full g mb-8 mt-4">
        <div className="relative w-[360px]">
          <img
            src={discoverCard}
            alt="Discover Card"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>

      {/* Subscription Management Section */}
      <div className="mt-auto">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white text-sm">Manage Your Subscription</span>
          <Tooltip content={manageTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
          </Tooltip>
        </div>

        <button className="px-4 py-2 bg-[#F5722E] text-white rounded text-sm hover:bg-orange-600 transition-colors">
          Manage
        </button>
      </div>
    </div>
  );
};

export { BillingSettings };
import { FC } from "react";
import masterCard from "images/master.svg?url";
import visaCard from "images/visa.svg?url";
import { Tooltip } from "components";
import { Info } from "lucide-react";

const BillingSettings: FC = () => {
  const editTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante  imperdiet congue parturient euismod nec suspendisse.";
  const manageTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante  imperdiet congue parturient euismod nec suspendisse.";

  return (
    <div className="w-full">
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

      <div className="flex justify-end gap-2 mr-6">
        <button className="px-3 py-1.5 rounded bg-[#979797]/50 text-white text-sm hover:bg-[#979797]/70 transition-colors">
          Edit
        </button>
        <Tooltip content={editTooltip}>
          <Info className="w-3 h-3 text-[#2D3A41] fill-white mb-2" />
        </Tooltip>
      </div>

      {/* Centered Cards */}
      <div className="flex flex-col items-center space-y-6 mb-8 mt-4">
        {/* MasterCard */}
        <div className="relative w-[360px]">
          <img
            src={masterCard}
            alt="Mastercard"
            className="w-full h-auto rounded-2xl"
          />
        </div>

        {/* Visa Card */}
        <div className="relative w-[360px]">
          <img
            src={visaCard}
            alt="Visa card"
            className="w-full h-auto rounded-2xl"
          />
        </div>
      </div>

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
  );
};

export { BillingSettings };

import { memo, ReactNode } from "react";
import { PLAN_SELECTION_ITEMS } from "store/user/user.types";

const PriceTag = ({
  handler,
  label,
  selectedPlan,
  text1,
  text2,
  icon,
  planRef,
}: {
  handler: () => void;
  selectedPlan: PLAN_SELECTION_ITEMS | undefined;
  text1: string;
  text2: string;
  label: string | ReactNode;
  icon: string;
  planRef: PLAN_SELECTION_ITEMS;
}) => {
  return (
    <div
      onClick={handler}
      className={`relative flex justify-between p-4 w-full shadow-md rounded-lg cursor-pointer ${
        selectedPlan === planRef ? "" : "border border-gray-300"
      }`}
    >
      {selectedPlan === planRef && (
        <div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FFC9AD] via-[#F5722E] to-[#8F431B] p-[4px]"
          style={{
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        ></div>
      )}
      <div className="flex flex-col justify-start">
        <div className="text-lg font-semibold md:text-base text-[#F5722E]">
          {label}
        </div>
        <div className="text-sm text-[#263238] md:text-xs">{text1}</div>
        <div className="text-sm text-[#263238] md:text-xs">{text2}</div>
      </div>
      <div className="flex items-center h-full">
        <img src={icon} alt="Unchecked" className="w-6 h-6" />
      </div>
    </div>
  );
};

export default memo(PriceTag);

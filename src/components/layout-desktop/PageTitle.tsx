import { FC } from "react";
import { BadgeCheck, Building, Info } from "lucide-react";

const PageTitle : FC = () => {
    return (
        <div className="mb-8 md:mb-12">
          <div>
            <div className="flex flex-col items-start">
              <div className="flex items-center text-2xl md:text-3xl text-white font-normal">
                <span>ABC Incorporated</span>
                <BadgeCheck
                  className="fill-[#F5722E] text-[#263238]"
                  size={28}
                />
              </div>
            </div>
            <div className="flex flex-col items-start mt-2 space-y-2">
              <div className="flex items-center space-x-2 text-[11px] font-light text-white">
                <Building className="fill-[#D6D6D6] text-[#263238]" size={14} />
                <span className="text-[15px]">
                  Germany, South Africa and China
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start mt-2">
              <div className="flex items-center space-x-1 text-[11px] font-light text-white">
                <span className="border-2 border-dotted border-orange-500 text-white text-[15px] px-2 py-2 border-opacity-70">
                  Your Job Hunter post interview appear here
                </span>
                <Info className="fill-[#D6D6D6] text-[#263238] size={13} mb-4" />
              </div>
            </div>
          </div>
        </div>
    )
}

export { PageTitle }
import React from "react";
import { MapPin, Globe, X } from "lucide-react";
import { Button } from "components";

interface FormData {
  businessName: string;
  industryName: string;
  yearFounded: string;
  companyWebsite: string;
  country: string;
  companyOverview: string;
}

interface EmployerProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onConfirm: () => Promise<void>;
}

const EmployerProfilePreview: React.FC<EmployerProfilePreviewProps> = ({
  isOpen,
  formData,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          aria-label="Close preview"
        >
          <X size={20} />
        </button>

        <div className="p-6 pt-10 space-y-6">
          <div className="space-y-4">
            <h2 className="text-[17px] font-bold text-[#263238] break-words">
              {formData.businessName}
            </h2>

            <div className="flex items-start gap-2">
              <MapPin className="text-[#F5722E] flex-shrink-0 mt-1" size={26} />
              <span className="text-[#263238] text-[17px] break-words">
                Based in {formData.country}
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-[#263238] text-[17px] break-words">
                {formData.yearFounded}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[#263238] text-[17px] break-words">
                {formData.industryName}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Globe className="text-[#F5722E] flex-shrink-0 mt-1" size={26} />
              <a
                href={formData.companyWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5722E] underline text-[17px] break-all hover:text-orange-600"
              >
                {formData.companyWebsite}
              </a>
            </div>

            <div className="space-y-2">
              <p className="text-[#263238] text-[17px]">Company overview</p>
              <div className="w-full p-4 text-[#263238] text-[14px] border border-[#AEADAD] rounded-lg max-h-48 overflow-y-auto">
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {formData.companyOverview}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button
              onClick={onConfirm}
              className="w-full md:w-auto h-[27px] px-6 py-2 bg-[#F5722E] text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Go To Job Feed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { EmployerProfilePreview };
import React from 'react';
import { Building2, Mail, Phone, Calendar, MapPin, Globe, X } from 'lucide-react';
import { Card, CardFooter } from 'components';
import { Button } from 'components';
import { selectOptions, FormData } from 'mockData/employer-profile-options';

interface EmployerProfilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  onConfirm: () => void;
}

const EmployerProfilePreview: React.FC<EmployerProfilePreviewProps> = ({
  isOpen,
  formData,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const getLabel = (
    value: string,
    optionType: keyof typeof selectOptions
  ): string => {
    const option = selectOptions[optionType].find((opt) => opt.value === value);
    return option?.label || value;
  };

  const formatAddress = () => {
    const parts = [
      formData.unitAndBldg,
      formData.streetAddress,
      formData.city,
      formData.state,
      formData.postalCode,
      getLabel(formData.country, 'country')
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex flex-col items-center overflow-y-auto p-4 pt-8">
      <Card className="bg-white w-full md:w-[760px] min-h-[600px] md:min-h-[825px] relative mt-12">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="p-4 md:p-8 space-y-3">
          {/* Company Name and Industry */}
          <div>
            <h2 className="text-lg md:text-[17px] font-semibold text-[#263238]">
              {formData.businessName}
            </h2>
            <div className="flex items-center gap-2 text-sm md:text-[17px] mt-1">
              <Building2 size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">
                {getLabel(formData.industry, 'industry')}
              </span>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <Calendar size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">
                Founded in {formData.yearFounded}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <Globe size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">
                {formData.companyWebsite}
              </span>
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-[17px] font-semibold text-[#263238]">
              Company Representative
            </h3>
            <p className="text-sm md:text-[17px] text-[#263238]">
              {formData.firstName} {formData.lastName}
            </p>
            <p className="text-sm md:text-[17px] text-[#263238] italic">
              {formData.position}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <Mail size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.emailAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <Phone size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-[17px]">
              <MapPin size={16} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formatAddress()}</span>
            </div>
          </div>

          {/* Company Overview */}
          <div className="space-y-2">
            <h3 className="text-sm md:text-[17px] font-semibold text-[#263238]">
              Company Overview
            </h3>
            <div className="w-full p-3 md:p-4 text-xs md:text-sm border border-gray-200 rounded-md min-h-[120px]">
              {formData.companyOverview}
            </div>
          </div>

          <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-start p-4 md:p-8 bg-transparent">
            <Button
              onClick={onConfirm}
              className="bg-[#F5722E] text-white hover:bg-orange-600 px-6 md:px-8 py-2"
            >
              Go To Job Feed
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export { EmployerProfilePreview };
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

  // Helper function to get label from value
  const getLabel = (
    value: string,
    optionType: keyof typeof selectOptions
  ): string => {
    const option = selectOptions[optionType].find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Format address
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex flex-col items-center overflow-y-auto pt-20">
      <div className="flex items-center flex-wrap text-white text-base mb-2 p-4">
        <span>Preview of your company profile</span>
      </div>

      <Card className="bg-white w-[400px] min-h-[700px] relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="p-6 space-y-4">
          {/* Company Name and Industry */}
          <div>
            <h2 className="text-sm font-semibold text-[#263238]">
              {formData.businessName}
            </h2>
            <div className="flex items-center gap-2 text-[13px] mt-1">
              <Building2 size={14} className="text-[#F5722E]" />
              <span className="text-[#263238]">
                {getLabel(formData.industry, 'industry')}
              </span>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px]">
              <Calendar size={14} className="text-[#F5722E]" />
              <span className="text-[#263238]">
                Founded in {formData.yearFounded}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <Globe size={14} className="text-[#F5722E]" />
              <span className="text-[#263238]">
                {formData.companyWebsite}
              </span>
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-2 pt-2">
            <h3 className="text-[13px] font-semibold text-[#263238]">
              Company Representative
            </h3>
            <p className="text-[13px] text-[#263238]">
              {formData.firstName} {formData.lastName}
            </p>
            <p className="text-[13px] text-[#263238] italic">
              {formData.position}
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[13px]">
              <Mail size={14} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.emailAddress}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <Phone size={14} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formData.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <MapPin size={14} className="text-[#F5722E]" />
              <span className="text-[#263238]">{formatAddress()}</span>
            </div>
          </div>

          {/* Company Overview */}
          <div className="space-y-2 pt-2">
            <h3 className="text-[13px] font-semibold text-[#263238]">
              Company Overview
            </h3>
            <p className="text-[13px] text-[#263238] whitespace-pre-wrap">
              {formData.companyOverview}
            </p>
          </div>

          <CardFooter className="absolute bottom-0 left-0 right-0 flex justify-end p-4 bg-transparent">
            <Button
              onClick={onConfirm}
              className="bg-[#F5722E] text-white hover:bg-orange-600 h-[27px] min-w-[133px]"
            >
              Confirm Profile
            </Button>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export { EmployerProfilePreview };
import React, { FC, useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from "lib/utils";

interface IndustryDropdownProps {
  onValueChange: (id: string, name: string) => void;
  className?: string;
  error?: boolean;
  onBlur?: () => void;
}

interface Industry {
  id: string;
  name: string;
}

// Mock industry data
const MOCK_INDUSTRIES: Industry[] = [
  { id: '1', name: 'Accounting' },
  { id: '2', name: 'Airlines/Aviation' },
  { id: '3', name: 'Alternative Dispute Resolution' },
  { id: '4', name: 'Alternative Medicine' },
  { id: '5', name: 'Animation' },
  { id: '6', name: 'Apparel & Fashion' },
  { id: '7', name: 'Architecture & Planning' },
  { id: '8', name: 'Arts and Crafts' },
  { id: '9', name: 'Automotive' },
  { id: '10', name: 'Aviation & Aerospace' },
  { id: '11', name: 'Banking' },
  { id: '12', name: 'Biotechnology' },
  { id: '13', name: 'Broadcast Media' },
  { id: '14', name: 'Building Materials' },
  { id: '15', name: 'Business Supplies and Equipment' },
  { id: '16', name: 'Capital Markets' },
  { id: '17', name: 'Chemicals' },
  { id: '18', name: 'Civic & Social Organization' },
  { id: '19', name: 'Civil Engineering' },
  { id: '20', name: 'Commercial Real Estate' },
  { id: '21', name: 'Computer & Network Security' },
  { id: '22', name: 'Computer Games' },
  { id: '23', name: 'Computer Hardware' },
  { id: '24', name: 'Computer Networking' },
  { id: '25', name: 'Computer Software' },
  { id: '26', name: 'Construction' },
  { id: '27', name: 'Consumer Electronics' },
  { id: '28', name: 'Consumer Goods' },
  { id: '29', name: 'Consumer Services' },
  { id: '30', name: 'Cosmetics' },
  { id: '31', name: 'Dairy' },
  { id: '32', name: 'Defense & Space' },
  { id: '33', name: 'Design' },
  { id: '34', name: 'E-Learning' },
  { id: '35', name: 'Education Management' },
  { id: '36', name: 'Electrical/Electronic Manufacturing' },
  { id: '37', name: 'Entertainment' },
  { id: '38', name: 'Environmental Services' },
  { id: '39', name: 'Events Services' },
  { id: '40', name: 'Executive Office' },
  { id: '41', name: 'Facilities Services' },
  { id: '42', name: 'Farming' },
  { id: '43', name: 'Financial Services' },
  { id: '44', name: 'Fine Art' },
  { id: '45', name: 'Fishery' },
  { id: '46', name: 'Food & Beverages' },
  { id: '47', name: 'Food Production' },
  { id: '48', name: 'Fund-Raising' },
  { id: '49', name: 'Furniture' },
  { id: '50', name: 'Gambling & Casinos' },
  { id: '51', name: 'Glass, Ceramics & Concrete' },
  { id: '52', name: 'Government Administration' },
  { id: '53', name: 'Government Relations' },
  { id: '54', name: 'Graphic Design' },
  { id: '55', name: 'Health, Wellness and Fitness' },
  { id: '56', name: 'Higher Education' },
  { id: '57', name: 'Hospital & Health Care' },
  { id: '58', name: 'Hospitality' },
  { id: '59', name: 'Human Resources' },
  { id: '60', name: 'Import and Export' },
  { id: '61', name: 'Individual & Family Services' },
  { id: '62', name: 'Industrial Automation' },
  { id: '63', name: 'Information Services' },
  { id: '64', name: 'Information Technology and Services' },
  { id: '65', name: 'Insurance' },
  { id: '66', name: 'International Affairs' },
  { id: '67', name: 'International Trade and Development' },
  { id: '68', name: 'Internet' },
  { id: '69', name: 'Investment Banking' },
  { id: '70', name: 'Investment Management' },
  { id: '71', name: 'Judiciary' },
  { id: '72', name: 'Law Enforcement' },
  { id: '73', name: 'Law Practice' },
  { id: '74', name: 'Legal Services' },
  { id: '75', name: 'Legislative Office' },
  { id: '76', name: 'Leisure, Travel & Tourism' },
  { id: '77', name: 'Libraries' },
  { id: '78', name: 'Logistics and Supply Chain' },
  { id: '79', name: 'Luxury Goods & Jewelry' },
  { id: '80', name: 'Machinery' },
  { id: '81', name: 'Management Consulting' },
  { id: '82', name: 'Maritime' },
  { id: '83', name: 'Market Research' },
  { id: '84', name: 'Marketing and Advertising' },
  { id: '85', name: 'Mechanical or Industrial Engineering' },
  { id: '86', name: 'Media Production' },
  { id: '87', name: 'Medical Devices' },
  { id: '88', name: 'Medical Practice' },
  { id: '89', name: 'Mental Health Care' },
  { id: '90', name: 'Military' },
  { id: '91', name: 'Mining & Metals' },
  { id: '92', name: 'Motion Pictures and Film' },
  { id: '93', name: 'Museums and Institutions' },
  { id: '94', name: 'Music' },
  { id: '95', name: 'Nanotechnology' },
  { id: '96', name: 'Newspapers' },
  { id: '97', name: 'Non-Profit Organization Management' },
  { id: '98', name: 'Oil & Energy' },
  { id: '99', name: 'Online Media' },
  { id: '100', name: 'Outsourcing/Offshoring' },
  { id: '101', name: 'Package/Freight Delivery' },
  { id: '102', name: 'Packaging and Containers' },
  { id: '103', name: 'Paper & Forest Products' },
  { id: '104', name: 'Performing Arts' },
  { id: '105', name: 'Pharmaceuticals' },
  { id: '106', name: 'Philanthropy' },
  { id: '107', name: 'Photography' },
  { id: '108', name: 'Plastics' },
  { id: '109', name: 'Political Organization' },
  { id: '110', name: 'Primary/Secondary Education' },
  { id: '111', name: 'Printing' },
  { id: '112', name: 'Professional Training & Coaching' },
  { id: '113', name: 'Program Development' },
  { id: '114', name: 'Public Policy' },
  { id: '115', name: 'Public Relations and Communications' },
  { id: '116', name: 'Public Safety' },
  { id: '117', name: 'Publishing' },
  { id: '118', name: 'Railroad Manufacture' },
  { id: '119', name: 'Ranching' },
  { id: '120', name: 'Real Estate' },
  { id: '121', name: 'Recreational Facilities and Services' },
  { id: '122', name: 'Religious Institutions' },
  { id: '123', name: 'Renewables & Environment' },
  { id: '124', name: 'Research' },
  { id: '125', name: 'Restaurants' },
  { id: '126', name: 'Retail' },
  { id: '127', name: 'Security and Investigations' },
  { id: '128', name: 'Semiconductors' },
  { id: '129', name: 'Shipbuilding' },
  { id: '130', name: 'Sporting Goods' },
  { id: '131', name: 'Sports' },
  { id: '132', name: 'Staffing and Recruiting' },
  { id: '133', name: 'Supermarkets' },
  { id: '134', name: 'Telecommunications' },
  { id: '135', name: 'Textiles' },
  { id: '136', name: 'Think Tanks' },
  { id: '137', name: 'Tobacco' },
  { id: '138', name: 'Translation and Localization' },
  { id: '139', name: 'Transportation/Trucking/Railroad' },
  { id: '140', name: 'Utilities' },
  { id: '141', name: 'Venture Capital & Private Equity' },
  { id: '142', name: 'Veterinary' },
  { id: '143', name: 'Warehousing' },
  { id: '144', name: 'Wholesale' },
  { id: '145', name: 'Wine and Spirits' },
  { id: '146', name: 'Wireless' },
  { id: '147', name: 'Writing and Editing' },
].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

const capitalizeFirstLetter = (str: string) => {
  return str.trim().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const IndustryDropdown: FC<IndustryDropdownProps> = ({ 
  onValueChange, 
  className,
  error,
  onBlur
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [touched, setTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use mock industries data
  const industries = MOCK_INDUSTRIES;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (touched) {
          onBlur?.();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [touched, onBlur]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelectIndustry = (industry: Industry) => {
    setSelectedIndustry(industry);
    onValueChange(industry.id, industry.name);
    setIsOpen(false);
    setTouched(true);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button" // Prevent form submission
        onClick={handleClick}
        onBlur={() => {
          if (touched) {
            onBlur?.();
          }
        }}
        className={cn(
          "w-full px-4 h-[56px] bg-transparent border-2 rounded-md",
          "flex items-center justify-between",
          "focus:outline-none",
          "text-left",
          error ? "border-red-500" : "border-[#AEADAD] focus:border-[#F5722E]",
          className
        )}
      >
        <span className={selectedIndustry ? "text-[#F5F5F7]" : "text-[#AEADAD]"}>
          {selectedIndustry ? capitalizeFirstLetter(selectedIndustry.name) : "Select industry..."}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#AEADAD]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#AEADAD]" />
        )}
      </button>
      
      {isOpen && industries.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-[#F5F5F7] border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            {industries.map((industry: Industry) => (
              <li
                key={industry.id}
                onClick={() => handleSelectIndustry(industry)}
                className={cn(
                  "px-4 py-2 cursor-pointer transition-colors",
                  "hover:bg-[#F5722E] hover:text-white",
                  selectedIndustry?.id === industry.id 
                    ? "bg-[#F5722E] text-white" 
                    : "text-[#263238]"
                )}
              >
                {capitalizeFirstLetter(industry.name)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { IndustryDropdown as IndustrySearch };
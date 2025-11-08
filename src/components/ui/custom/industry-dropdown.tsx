import React, { FC, useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useSearchIndustryQuery } from 'api';
import { cn } from "lib/utils";

interface IndustryDropdownProps {
  onValueChange: (value: string) => void;
  className?: string;
  error?: boolean;
  onBlur?: () => void;
}

interface Industry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

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

  // Fetch all industries
  const { data: response } = useSearchIndustryQuery({
    query: "",  // Empty query to get all industries
    limit: 1000  // Increased limit to get more options
  });

  // Extract and sort industries alphabetically by name
  const industries = response?.data ? 
    [...response.data].sort((a: Industry, b: Industry) => 
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    ) 
    : [];

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
    onValueChange(industry.id);
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
        <span className={selectedIndustry ? "text-[#263238]" : "text-[#AEADAD]"}>
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

export { IndustryDropdown };
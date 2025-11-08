import React, { FC, useState, useRef, useEffect } from 'react';
import { useSearchIndustryQuery } from 'api';
import { Input } from "components";
import { cn } from "lib/utils";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IndustrySearchProps {
  onValueChange: (industryId: string, industryName: string) => void;
  className?: string;
  initialIndustryName?: string;
  initialIndustryId?: string;
}

interface Industry {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const capitalizeFirstLetter = (str: string) => {
  return str?.trim().split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

const IndustrySearch: FC<IndustrySearchProps> = ({ 
  onValueChange, 
  className,
  initialIndustryName = '',
  initialIndustryId = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);

  // Set initial values
  useEffect(() => {
    if (isInitialMount.current && initialIndustryName) {
      const capitalized = capitalizeFirstLetter(initialIndustryName);
      setSelectedName(capitalized);
      setSearchQuery(capitalized);
      if (initialIndustryId) {
        onValueChange(initialIndustryId, initialIndustryName);
      }
      isInitialMount.current = false;
    }
  }, [initialIndustryName, initialIndustryId, onValueChange]);

  // Fetch suggestions
  const { data: response } = useSearchIndustryQuery({
    query: selectedName === '' ? 'a' : (searchQuery || selectedName),
    limit: 5
  }, {
    skip: !showSuggestions
  });

  const industries = response || [];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSelectedName(query);
    setShowSuggestions(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSearchQuery(query);
    }, 300);
    
    if (!query) {
      onValueChange('', '');
    }
  };

  const handleSelectIndustry = (industry: Industry) => {
    const capitalizedName = capitalizeFirstLetter(industry.name);
    onValueChange(industry.id, capitalizedName);
    setSelectedName(capitalizedName);
    setSearchQuery(capitalizedName);
    setShowSuggestions(false);
  };

  const toggleDropdown = () => {
    const newShowSuggestions = !showSuggestions;
    setShowSuggestions(newShowSuggestions);
    if (newShowSuggestions && selectedName) {
      setSearchQuery(selectedName);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          value={selectedName}
          onChange={handleInputChange}
          onFocus={() => {
            setShowSuggestions(true);
            if (selectedName) {
              setSearchQuery(selectedName);
            }
          }}
          placeholder="Select an Industry"
          className={cn(
            "bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] pl-3 pr-8 placeholder:text-[#AEADAD]",
            className
          )}
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className="absolute right-2 p-1 rounded-full transition-colors"
        >
          {showSuggestions ? (
            <ChevronUp className="text-[#AEADAD]" size={16} />
          ) : (
            <ChevronDown className="text-[#AEADAD]" size={16} />
          )}
        </button>
      </div>
      
      {showSuggestions && (
        <div className="absolute left-0 right-0 mt-1 bg-[#F5F5F7] p-0 border-none rounded-none shadow-lg z-50">
          <ul className="p-0">
            {industries.length > 0 ? (
              industries.map((industry: Industry) => (
                <li
                  key={industry.id}
                  onClick={() => handleSelectIndustry(industry)}
                  className={cn(
                    "rounded-none flex items-center pl-3 h-[55px] hover:bg-[#F5722E] hover:text-white cursor-pointer transition-colors",
                    capitalizeFirstLetter(industry.name) === selectedName
                      ? "bg-[#F5722E] text-white"
                      : "text-[#263238]"
                  )}
                >
                    {capitalizeFirstLetter(industry.name)}
                </li>
              ))
            ) : (
              <li className="rounded-none flex items-center pl-3  h-[55px] text-gray-500">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export { IndustrySearch };
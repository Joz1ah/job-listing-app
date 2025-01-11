import React, { FC, useState, useRef, useEffect } from 'react';
import { useSearchIndustryQuery } from 'api/akaza/akazaAPI';
import { Input } from "components";
import { cn } from "lib/utils";

interface IndustrySearchProps {
  onValueChange: (value: string) => void;
  className?: string;
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

const IndustrySearch: FC<IndustrySearchProps> = ({ 
  onValueChange, 
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedName, setSelectedName] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch industry options based on search query
  const { data: response } = useSearchIndustryQuery({
    query: searchQuery,
    limit: 5
  }, {
    skip: !searchQuery
  });

  const industries = response || [];

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedName(query);
    setShowSuggestions(true);
    
    if (!query) {
      onValueChange('');
    }
  };

  const handleSelectIndustry = (industry: Industry) => {
    onValueChange(industry.id);
    setSelectedName(capitalizeFirstLetter(industry.name));
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        value={selectedName}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search industry..."
        className={cn(
          "bg-transparent border-[#AEADAD] h-[56px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]",
          className
        )}
      />
      
      {showSuggestions && searchQuery && industries.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-[#F5F5F7] border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            {industries.map((industry: Industry) => (
              <li
                key={industry.id}
                onClick={() => handleSelectIndustry(industry)}
                className="text-[#263238] px-4 py-2 hover:bg-[#F5722E] hover:text-white cursor-pointer transition-colors"
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

export { IndustrySearch };
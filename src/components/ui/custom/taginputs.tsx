import React, { useState, useRef, useEffect, useMemo, useCallback} from 'react';
import { cn } from "lib/utils";
import { Input } from "components";
import { Label } from "components";
import { ScrollArea } from "components";
import { useSearchCoreQuery, useSearchInterPersonalQuery, useSearchCertificationQuery } from 'api/akaza/akazaAPI';
import { KeywordMappingContext } from 'contexts/KeyWordMappingContext';
import { useContext } from 'react';

interface Option {
  label: string;
  value: string;
}

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
  className?: string;
  tagClassName?: string;
  placeholder?: string;
  maxTags?: number;
  searchKeys?: string[];
  suggestionTitle?: string;
  disabled?: boolean;
  alternateColors?: {
    firstColor?: string;
    secondColor?: string;
  };
  maxTagLength?: number;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Fixed: Remove comma and add proper type
}

interface Skill {
  id: string;
  keyword: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const TagInputs: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  options,
  className,
  tagClassName = "bg-blue-500",
  placeholder = "Type to search...",
  maxTags = 5,
  searchKeys = ['label'],
  suggestionTitle = "Select Option",
  disabled,
  alternateColors,
  maxTagLength = 12,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();

  const remainingTags = maxTags - value.length;

  const filteredOptions = options.filter(option => {
    // Don't show already selected values
    if (value.includes(option.value)) return false;
    
    // Only filter if there's input
    if (inputValue) {
      return searchKeys.some(key => 
        option[key as keyof Option]
          .toString()
          .toLowerCase()
          .includes(inputValue.toLowerCase())
      );
    }
    
    // Return false if no input to show no suggestions
    return false;
  });

  // Helper function to get label from ID
  const getLabel = (keyword: string): string => {
    return capitalizeFirstLetter(keyword);
  };

  useEffect(() => {
    if (showSuggestions && filteredOptions.length > 0) {
      setFocusedIndex(0);
    }
  }, [showSuggestions, filteredOptions.length]);

  const handleSelect = (selectedId: string) => {
    if (!value.includes(selectedId) && value.length < maxTags) {
      const newTags = [...value, selectedId];
      onChange(newTags);
      setInputValue("");
      setShowSuggestions(false);
      setFocusedIndex(0);
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true); // Always show suggestions panel
    onInputChange?.(e);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true); // Show suggestions when input is focused
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      e.preventDefault();
      const newTags = value.slice(0, -1);
      onChange(newTags);
    } else if (showSuggestions && filteredOptions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          const element = suggestionsRef.current?.querySelector(`li:nth-child(${focusedIndex + 2})`);
          element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev);
          const prevElement = suggestionsRef.current?.querySelector(`li:nth-child(${focusedIndex})`);
          prevElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(filteredOptions[focusedIndex].value);
          break;
        case 'Tab':
          // Only prevent default if we have suggestions visible
          if (showSuggestions && filteredOptions.length > 0) {
            e.preventDefault();
            handleSelect(filteredOptions[focusedIndex].value);
          }
          // Otherwise, let the tab event proceed normally
          break;
        case 'Escape':
          setShowSuggestions(false);
          setFocusedIndex(0);
          break;
      }
    } else if (e.key === 'Enter' && inputValue) {
      // Show tooltip when invalid input is entered
      e.preventDefault();
      setShowTooltip(true);
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(false);
      }, 3000);
      setInputValue(""); // Clear input on invalid entry
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, index) => index !== indexToRemove);
    onChange(newTags);
    inputRef.current?.focus();
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setFocusedIndex(0);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        className={cn(
          "bg-transparent border-2 border-[#AEADAD] rounded-[10px] min-h-[36px] overflow-hidden group",
          "focus-within:border-[#F5722E]",
          "transition-all duration-200 ease-in-out",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="flex flex-wrap items-center mt-0.5 mb-2">
        {value.map((id, index) => {
            const displayLabel = getLabel(id);
            const truncatedLabel = truncateText(displayLabel, maxTagLength);
            
            return (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center px-2 text-[12px] text-white font-semibold rounded-[2px] shrink-0 ml-1 mt-1",
                  "h-[30px]",
                  "transition-all duration-200",
                  alternateColors 
                    ? `bg-[${index % 2 === 0 ? alternateColors.firstColor : alternateColors.secondColor}]`
                    : tagClassName,
                  disabled ? "cursor-not-allowed" : "cursor-pointer hover:opacity-80"
                )}
                onClick={() => !disabled && removeTag(index)}
                title={displayLabel}
              >
                <span>{truncatedLabel}</span>
              </div>
            );
          })}
          <div className="flex-1 min-w-[120px] flex items-center">
            <Input
              ref={inputRef}
              type="text" 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              disabled={disabled || remainingTags === 0}
              placeholder={value.length === 0 ? placeholder : ""}
              className="w-full h-7 py-0 mt-1.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-[#AEADAD] disabled:cursor-not-allowed disabled:opacity-50"
            />

            {showTooltip && (
              <div 
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-[#2D3A41] text-xs rounded shadow-lg whitespace-nowrap z-50"
              >
                Invalid tag entered. Please try again.
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-white"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showSuggestions && remainingTags > 0 && inputValue && (
        <div 
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 bg-white border-none shadow-lg z-50 text-black"
        >
          <Label className="px-2 py-1.5 text-xs font-normal text-gray-500">
            {suggestionTitle}
          </Label>
          <ScrollArea className="h-[180px]">
            <ul className="py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={cn(
                      "px-2 py-2 cursor-pointer transition-all ease-in-out duration-500",
                      index === focusedIndex ? "bg-[#F5722E] text-white" : "hover:bg-[#F5722E] hover:text-white"
                    )}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-2 py-2 text-gray-500">No results found</li>
              )}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const CoreSkillsTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { addMappings } = useContext(KeywordMappingContext);
  
  const { data: searchResults } = useSearchCoreQuery({
    query: searchQuery,
    limit: 5
  }, {
    skip: !searchQuery
  });

  useEffect(() => {
    if (searchResults) {
      const mappings = searchResults.map((skill: Skill) => ({
        keyword: skill.keyword,
        id: skill.id
      }));
      addMappings(mappings);
    }
  }, [searchResults, addMappings]);

  const options = useMemo(() => 
    searchResults?.map((skill: Skill) => ({
      label: capitalizeFirstLetter(skill.keyword),
      value: skill.keyword
    })) || [],
    [searchResults]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      value={props.value}
      onChange={props.onChange}
      options={options}
      maxTags={5}
      suggestionTitle="Select Core Skills"
      placeholder={props.placeholder || "Type to search core skills"}
      onInputChange={handleSearch}
    />
  );
};

const InterpersonalSkillsTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { addMappings } = useContext(KeywordMappingContext);
  
  const { data: searchResults } = useSearchInterPersonalQuery({
    query: searchQuery,
    limit: 5
  }, {
    skip: !searchQuery
  });

  useEffect(() => {
    if (searchResults) {
      const mappings = searchResults.map((skill: Skill) => ({
        keyword: skill.keyword,
        id: skill.id
      }));
      addMappings(mappings);
    }
  }, [searchResults, addMappings]);

  const options = useMemo(() => 
    searchResults?.map((skill: Skill) => ({
      label: capitalizeFirstLetter(skill.keyword),
      value: skill.keyword
    })) || [],
    [searchResults]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      value={props.value}
      onChange={props.onChange}
      options={options}
      maxTags={5}
      suggestionTitle="Select Interpersonal Skills"
      placeholder={props.placeholder || "Type to search interpersonal skills"}
      onInputChange={handleSearch}
    />
  );
};

const LanguageTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const languages = [
    { label: "Arabic", value: "Arabic" },
    { label: "Bengali", value: "Bengali" },
    { label: "Chinese (Cantonese)", value: "Chinese (Cantonese)" },
    { label: "Chinese (Mandarin)", value: "Chinese (Mandarin)" },
    { label: "Dutch", value: "Dutch" },
    { label: "English", value: "English" },
    { label: "Finnish", value: "Finnish" },
    { label: "French", value: "French" },
    { label: "German", value: "German" },
    { label: "Hindi", value: "Hindi" },
    { label: "Italian", value: "Italian" },
    { label: "Japanese", value: "Japanese" },
    { label: "Korean", value: "Korean" },
    { label: "Malay", value: "Malay" },
    { label: "Polish", value: "Polish" },
    { label: "Portuguese", value: "Portuguese" },
    { label: "Russian", value: "Russian" },
    { label: "Spanish", value: "Spanish" },
    { label: "Swedish", value: "Swedish" },
    { label: "Tagalog", value: "Tagalog" },
    { label: "Thai", value: "Thai" },
    { label: "Turkish", value: "Turkish" },
    { label: "Vietnamese", value: "Vietnamese" }
  ];

  return (
    <TagInputs
      {...props}
      options={languages}
      maxTags={4}
      suggestionTitle="Select Language"
    />
  );
};

const CertificationTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { addMappings } = useContext(KeywordMappingContext);
  
  const { data: searchResults } = useSearchCertificationQuery({
    query: searchQuery,
    limit: 5
  }, {
    skip: !searchQuery
  });

  useEffect(() => {
    if (searchResults) {
      const mappings = searchResults.map((skill: Skill) => ({
        keyword: skill.keyword,
        id: skill.id
      }));
      addMappings(mappings);
    }
  }, [searchResults, addMappings]);

  const options = useMemo(() => 
    searchResults?.map((skill: Skill) => ({
      label: capitalizeFirstLetter(skill.keyword),
      value: skill.keyword
    })) || [],
    [searchResults]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      value={props.value}
      onChange={props.onChange}
      options={options}
      maxTags={3}
      suggestionTitle="Select Certifications"
      placeholder={props.placeholder || "Type to search certifications"}
      onInputChange={handleSearch}
      maxTagLength={10}
    />
  );
};

export { TagInputs, CoreSkillsTagInput, InterpersonalSkillsTagInput, LanguageTagInput, CertificationTagInput };
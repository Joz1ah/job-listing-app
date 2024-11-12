import React, { useState, useRef, useEffect } from 'react';
import { cn } from "lib/utils";
import { Input } from "components";
import { Label } from "components";

interface LanguageTagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  tagClassName?: string;
  placeholder?: string;
  maxTags?: number;
}

const languages = [
  {value: "en", label: "English"  },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const;

const LanguageTagInput: React.FC<LanguageTagInputProps> = ({
  value = [],
  onChange,
  className,
  tagClassName = "bg-orange-500",
  placeholder = "Type to search languages",
  maxTags = 4
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingTags = maxTags - value.length;
  const filteredLanguages = languages.filter(lang => 
    lang.label.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.includes(lang.value)  
  );

  useEffect(() => {
    if (showSuggestions && filteredLanguages.length > 0) {
      setFocusedIndex(0);
    }
  }, [showSuggestions, filteredLanguages.length]);

  const handleSelect = (selectedValue: string) => {
    const selectedLanguage = languages.find(lang => lang.value === selectedValue);
    
    if (selectedLanguage && !value.includes(selectedLanguage.value) && value.length < maxTags) {
      const newTags = [...value, selectedLanguage.value];
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
    setShowSuggestions(newValue.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      e.preventDefault();
      const newTags = value.slice(0, -1);
      onChange(newTags);
    } else if (showSuggestions && filteredLanguages.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % filteredLanguages.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev - 1 + filteredLanguages.length) % filteredLanguages.length);
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(filteredLanguages[focusedIndex].value);
          break;
        case 'Escape':
          setShowSuggestions(false);
          setFocusedIndex(0);
          break;
      }
    }
  };

  const handleMouseEnter = (index: number) => {
    setFocusedIndex(index);
  };

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

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        className={cn(
          "bg-transparent border-2 border-[#AEADAD] rounded-md min-h-[56px] p-1",
          "focus-within:border-orange-500",
          "transition-all duration-200 ease-in-out",
          className
        )}
      >
        <div className="flex flex-wrap items-center mt-0.5 mb-2">
          {value.map((tag, index) => (
            <div
              key={index}
              onClick={() => removeTag(index)}
              className={cn(
                "inline-flex items-center px-2 text-[12px] text-white font-semibold cursor-pointer transition-colors rounded-[2px] shrink-0 ml-1 mt-1",
                "h-[30px]",
                tagClassName
              )}
            >
              {languages.find(lang => lang.value === tag)?.label || tag}
            </div>
          ))}
          <div className="flex-1 min-w-[120px] flex items-center">
            <Input
              ref={inputRef}
              type="text" 
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={remainingTags === 0}
              placeholder={placeholder}
              className="w-full h-7 py-0 mt-1.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-white disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {showSuggestions && filteredLanguages.length > 0 && remainingTags > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 bg-white text-balance border rounded-md shadow-lg z-50 text-black"
        >
          <Label className="px-2 py-1.5 text-xs font-normal text-gray-500">Select Language</Label>
          <ul className="py-1 max-h-60 overflow-auto">
            {filteredLanguages.map((language, index) => (
              <li
                key={language.value}
                onClick={() => handleSelect(language.value)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={cn(
                  "px-2 py-2 cursor-pointer transition-all ease-in-out duration-500",
                  index === focusedIndex ? "bg-[#BF532C] text-white" : "hover:bg-[#BF532C] hover:text-white"
                )}
              >
                {language.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { LanguageTagInput };
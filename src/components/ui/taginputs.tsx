import React, { useState, useRef, useEffect } from 'react';
import { cn } from "lib/utils";
import { Input } from "components";
import { Label } from "components";
import { ScrollArea } from "components";

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
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remainingTags = maxTags - value.length;

  const filteredOptions = options.filter(option => {
    if (value.includes(option.value)) return false;
    
    return searchKeys.some(key => 
      option[key as keyof Option]
        .toString()
        .toLowerCase()
        .includes(inputValue.toLowerCase())
    );
  });

  useEffect(() => {
    if (showSuggestions && filteredOptions.length > 0) {
      setFocusedIndex(0);
    }
  }, [showSuggestions, filteredOptions.length]);

  const handleSelect = (selectedValue: string) => {
    const selectedOption = options.find(opt => opt.value === selectedValue);
    
    if (selectedOption && !value.includes(selectedOption.value) && value.length < maxTags) {
      const newTags = [...value, selectedOption.value];
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
    } else if (showSuggestions && filteredOptions.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % filteredOptions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length);
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(filteredOptions[focusedIndex].value);
          break;
        case 'Escape':
          setShowSuggestions(false);
          setFocusedIndex(0);
          break;
      }
    }
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div 
        className={cn(
          "bg-transparent border-2 border-[#AEADAD] rounded-md min-h-[56px] overflow-hidden",
          "focus-within:border-orange-500",
          "transition-all duration-200 ease-in-out",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <div className="flex flex-wrap items-center mt-0.5 mb-2">
          {value.map((tag, index) => {
            const tagLabel = options.find(opt => opt.value === tag)?.label || tag;
            const truncatedLabel = truncateText(tagLabel, maxTagLength);
            
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
                title={tagLabel} // Show full text on hover
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
              disabled={disabled || remainingTags === 0}
              placeholder={value.length === 0 ? placeholder : ""}
              className="w-full h-7 py-0 mt-1.5 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent placeholder:text-white disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>
      </div>
      
      {showSuggestions && filteredOptions.length > 0 && remainingTags > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50 text-black"
        >
          <Label className="px-2 py-1.5 text-xs font-normal text-gray-500">
            {suggestionTitle}
          </Label>
          <ScrollArea className="h-[180px]">
            <ul className="py-1">
              {filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setFocusedIndex(index)}
                  className={cn(
                    "px-2 py-2 cursor-pointer transition-all ease-in-out duration-500",
                    index === focusedIndex ? "bg-orange-500 text-white" : "hover:bg-orange-500 hover:text-white"
                  )}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

const CoreSkillsTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const coreSkills = [
    // Technical/Hard Skills
    { label: "HTML", value: "html" },
    { label: "CSS", value: "css" },
    { label: "Bootstrap", value: "bootstrap" },
    { label: "Tailwind CSS", value: "tailwind-css" },
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
    { label: "React", value: "react" },
    { label: "Node.js", value: "nodejs" },
    { label: "SQL", value: "sql" },
    { label: "Data Analysis", value: "data-analysis" },
    { label: "Project Management", value: "project-management" },
    { label: "DevOps", value: "devops" },
    { label: "UI/UX Design", value: "uiux-design" },
    { label: "Machine Learning", value: "machine-learning" },
    { label: "Cloud Computing", value: "cloud-computing" },
    { label: "Agile Methodologies", value: "agile" },
    { label: "Quality Assurance", value: "qa" },
    { label: "Digital Marketing", value: "digital-marketing" },
    { label: "Content Writing", value: "content-writing" }
  ];

  return (
    <TagInputs
      {...props}
      options={coreSkills}
      maxTags={5}
      suggestionTitle="Select Core Skills"
      placeholder={props.placeholder || "Type to search core skills"}
    />
  );
};

const InterpersonalSkillsTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const interpersonalSkills = [
    // Soft/Interpersonal Skills
    { label: "Communication", value: "communication" },
    { label: "Leadership", value: "leadership" },
    { label: "Team Collaboration", value: "team-collaboration" },
    { label: "Problem Solving", value: "problem-solving" },
    { label: "Critical Thinking", value: "critical-thinking" },
    { label: "Adaptability", value: "adaptability" },
    { label: "Time Management", value: "time-management" },
    { label: "Emotional Intelligence", value: "emotional-intelligence" },
    { label: "Conflict Resolution", value: "conflict-resolution" },
    { label: "Active Listening", value: "active-listening" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Mentoring", value: "mentoring" },
    { label: "Public Speaking", value: "public-speaking" },
    { label: "Decision Making", value: "decision-making" },
    { label: "Cultural Awareness", value: "cultural-awareness" }
  ];

  return (
    <TagInputs
      {...props}
      options={interpersonalSkills}
      maxTags={5}
      suggestionTitle="Select Interpersonal Skills"
      placeholder={props.placeholder || "Type to search interpersonal skills"}
    />
  );
};

const LanguageTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const languages = [
    { label: "Arabic", value: "ar" },
    { label: "Bengali", value: "bn" },
    { label: "Chinese (Cantonese)", value: "zh-hk" },
    { label: "Chinese (Mandarin)", value: "zh" },
    { label: "Dutch", value: "nl" },
    { label: "English", value: "en" },
    { label: "Finnish", value: "fi" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Hindi", value: "hi" },
    { label: "Italian", value: "it" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Malay", value: "ms" },
    { label: "Polish", value: "pl" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Spanish", value: "es" },
    { label: "Swedish", value: "sv" },
    { label: "Tagalog", value: "tl" },
    { label: "Thai", value: "th" },
    { label: "Turkish", value: "tr" },
    { label: "Vietnamese", value: "vi" }
  ];

  return (
    <TagInputs
      {...props}
      options={languages}
      maxTags={3}
      suggestionTitle="Select Language"
      placeholder={props.placeholder || "Type to search languages"}
    />
  );
};

const CertificationTagInput: React.FC<Omit<TagInputProps, 'options'>> = (props) => {
  const certifications = [
    // Technical Certifications
    { label: "AWS Certified Solutions Architect", value: "aws-solutions-architect" },
    { label: "CompTIA A+", value: "comptia-a-plus" },
    { label: "CompTIA Network+", value: "comptia-network-plus" },
    { label: "CompTIA Security+", value: "comptia-security-plus" },
    { label: "Cisco CCNA", value: "cisco-ccna" },
    { label: "Cisco CCNP", value: "cisco-ccnp" },
    { label: "Microsoft Azure Administrator", value: "azure-administrator" },
    { label: "Google Cloud Professional", value: "google-cloud-professional" },
    
    // Project Management
    { label: "Project Management Professional (PMP)", value: "pmp" },
    { label: "PRINCE2 Practitioner", value: "prince2-practitioner" },
    { label: "Scrum Master", value: "scrum-master" },
    { label: "PMI Agile Certified Practitioner", value: "pmi-acp" },
    
    // Security
    { label: "Certified Information Systems Security Professional (CISSP)", value: "cissp" },
    { label: "Certified Ethical Hacker (CEH)", value: "ceh" },
    { label: "GIAC Security Essentials (GSEC)", value: "gsec" },
    
    // Development
    { label: "Oracle Certified Professional Java", value: "oracle-java" },
    { label: "Microsoft Certified: Azure Developer", value: "azure-developer" },
    { label: "Kubernetes Administrator (CKA)", value: "kubernetes-cka" },
    { label: "Terraform Associate", value: "terraform-associate" },
    
    // Data & AI
    { label: "Google Data Analytics Professional", value: "google-data-analytics" },
    { label: "AWS Machine Learning Specialty", value: "aws-ml-specialty" },
    { label: "TensorFlow Developer Certificate", value: "tensorflow-developer" },
    { label: "Microsoft Azure AI Engineer", value: "azure-ai-engineer" }
  ];

  return (
    <TagInputs
      {...props}
      options={certifications}
      maxTags={3}
      suggestionTitle="Select Certifications"
      placeholder={props.placeholder || "Type to search certifications"}
    />
  );
};

export { TagInputs, CoreSkillsTagInput, InterpersonalSkillsTagInput, LanguageTagInput, CertificationTagInput };
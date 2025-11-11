import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const TagInputs: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  options,
  className,
  tagClassName = "bg-blue-500",
  placeholder = "Type to search...",
  maxTags = 5,
  searchKeys = ["label"],
  suggestionTitle = "Select Option",
  disabled,
  alternateColors,
  onInputChange,
  error = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout>();
  const measurementDivRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const remainingTags = maxTags - value.length;

  const measureTextWidth = useCallback((text: string): number => {
    if (!measurementDivRef.current) return 0;
    measurementDivRef.current.textContent = text;
    return measurementDivRef.current.getBoundingClientRect().width;
  }, []);

  // Set up resize observer to track container width changes
  useEffect(() => {
    if (!tagsContainerRef.current) return;

    resizeObserverRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserverRef.current.observe(tagsContainerRef.current);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  // Update getAvailableWidth to use the state
  const getAvailableWidth = useCallback(() => {
    return containerWidth;
  }, [containerWidth]);

  const shouldTruncateTag = useCallback(
    (tagWidth: number): boolean => {
      const availableWidth = getAvailableWidth();
      return tagWidth > availableWidth;
    },
    [getAvailableWidth],
  );

  const truncateText = useCallback(
    (text: string): string => {
      const tagWidth = measureTextWidth(text) + 48; // Add padding and margins
      if (!shouldTruncateTag(tagWidth)) return text;

      let truncatedText = text;
      while (
        truncatedText.length > 3 &&
        shouldTruncateTag(measureTextWidth(truncatedText + "...") + 48)
      ) {
        truncatedText = truncatedText.slice(0, -1);
      }
      return truncatedText.length < text.length ? truncatedText + "..." : text;
    },
    [measureTextWidth, shouldTruncateTag],
  );

  // Helper function to get label from ID
  const getLabel = (keyword: string): string => {
    return capitalizeFirstLetter(keyword);
  };

  const filteredOptions = options.filter((option) => {
    // Don't show already selected values
    if (
      value.some(
        (selectedValue) =>
          selectedValue.toLowerCase() === option.value.toLowerCase(),
      )
    )
      return false;

    // Only filter if there's input
    if (inputValue) {
      return searchKeys.some((key) =>
        option[key as keyof Option]
          .toString()
          .toLowerCase()
          .includes(inputValue.toLowerCase()),
      );
    }

    // Return false if no input to show no suggestions
    return false;
  });

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
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      e.preventDefault();
      const newTags = value.slice(0, -1);
      onChange(newTags);
    } else if (showSuggestions && filteredOptions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev,
          );
          const element = suggestionsRef.current?.querySelector(
            `li:nth-child(${focusedIndex + 2})`,
          );
          element?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          const prevElement = suggestionsRef.current?.querySelector(
            `li:nth-child(${focusedIndex})`,
          );
          prevElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          break;
        case "Enter":
          e.preventDefault();
          handleSelect(filteredOptions[focusedIndex].value);
          break;
        case "Tab":
          // Only prevent default if we have suggestions visible
          if (showSuggestions && filteredOptions.length > 0) {
            e.preventDefault();
            handleSelect(filteredOptions[focusedIndex].value);
          }
          // Otherwise, let the tab event proceed normally
          break;
        case "Escape":
          setShowSuggestions(false);
          setFocusedIndex(0);
          break;
      }
    } else if (e.key === "Enter" && inputValue) {
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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
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
        ref={measurementDivRef}
        className="absolute invisible whitespace-nowrap text-[12px] font-semibold"
        aria-hidden="true"
      />

      <div
        className={cn(
          "bg-transparent border-2 rounded-[10px] min-h-[36px] overflow-hidden group",
          error ? "border-red-500" : "border-[#AEADAD]",
          !error && "focus-within:border-[#F5722E]",
          "transition-all duration-200 ease-in-out",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <div
          ref={tagsContainerRef}
          className="flex flex-wrap items-center mt-0.5 mb-2"
        >
          {value.map((id, index) => {
            const displayLabel = getLabel(id);
            // Truncation will be recalculated whenever containerWidth changes
            const truncatedLabel = truncateText(displayLabel);

            return (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center px-2 text-[12px] text-white font-semibold rounded-[2px] shrink-0 ml-1 mt-1",
                  "h-[30px]",
                  "transition-all duration-200",
                  alternateColors
                    ? `bg-[${index % 2 === 0 ? alternateColors.secondColor : alternateColors.firstColor}]`
                    : tagClassName,
                  disabled
                    ? "cursor-not-allowed"
                    : "cursor-pointer hover:opacity-80",
                )}
                onClick={() => !disabled && removeTag(index)}
                title={displayLabel}
              >
                <span>{truncatedLabel}</span>
              </div>
            );
          })}
          <div
            className={cn(
              "inline-flex items-center",
              // Force new line in these cases:
              // 1. When showing suggestions (for dropdown) OR
              // 2. When we have tags AND not enough space
              (showSuggestions && inputValue) ||
                (value.length > 0 && getAvailableWidth() < 120)
                ? "basis-auto"
                : "flex-1",
            )}
          >
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
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-white text-[#2D3A41] text-xs rounded shadow-lg whitespace-nowrap z-50">
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
                      index === focusedIndex
                        ? "bg-[#F5722E] text-white"
                        : "hover:bg-[#F5722E] hover:text-white",
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

// ============================================================================
// MOCK DATA
// ============================================================================

const MOCK_CORE_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin",
  "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask", "Spring Boot", "Laravel",
  "HTML", "CSS", "SASS", "LESS", "Bootstrap", "Tailwind CSS", "Material UI", "Ant Design",
  "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Firebase", "Oracle", "SQLite",
  "Git", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "GitLab CI", "Travis CI",
  "AWS", "Azure", "Google Cloud", "Heroku", "DigitalOcean", "Vercel", "Netlify",
  "REST API", "GraphQL", "WebSocket", "gRPC", "SOAP", "Microservices", "Serverless",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy",
  "Data Analysis", "Data Visualization", "Tableau", "Power BI", "Excel", "SPSS",
  "Agile", "Scrum", "Kanban", "JIRA", "Trello", "Asana", "Monday.com",
  "Testing", "Jest", "Mocha", "Cypress", "Selenium", "JUnit", "PyTest",
  "DevOps", "CI/CD", "Linux", "Bash", "Shell Scripting", "Terraform", "Ansible",
  "Security", "OAuth", "JWT", "SSL/TLS", "Encryption", "Penetration Testing",
  "Mobile Development", "React Native", "Flutter", "Ionic", "Xamarin",
  "UI/UX Design", "Figma", "Sketch", "Adobe XD", "InVision", "Zeplin",
  "Project Management", "MS Project", "Confluence", "Notion", "Slack",
  "Blockchain", "Ethereum", "Solidity", "Smart Contracts", "Web3",
  "Game Development", "Unity", "Unreal Engine", "C++", "3D Modeling",
].sort();

const MOCK_INTERPERSONAL_SKILLS = [
  "Communication", "Leadership", "Teamwork", "Problem Solving", "Critical Thinking",
  "Time Management", "Adaptability", "Creativity", "Emotional Intelligence", "Conflict Resolution",
  "Negotiation", "Active Listening", "Empathy", "Patience", "Flexibility",
  "Decision Making", "Collaboration", "Networking", "Mentoring", "Coaching",
  "Presentation Skills", "Public Speaking", "Persuasion", "Influence", "Motivation",
  "Strategic Thinking", "Analytical Thinking", "Attention to Detail", "Organization",
  "Work Ethic", "Professionalism", "Self-Motivation", "Accountability", "Initiative",
  "Customer Service", "Client Relations", "Interpersonal Skills", "Cultural Awareness",
  "Stress Management", "Resilience", "Positive Attitude", "Open-Mindedness",
  "Diplomacy", "Trustworthiness", "Reliability", "Punctuality", "Multitasking",
].sort();

const MOCK_LANGUAGES = [
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
  { label: "Vietnamese", value: "Vietnamese" },
];

const MOCK_CERTIFICATIONS = [
  "AWS Certified Solutions Architect", "AWS Certified Developer", "AWS Certified SysOps Administrator",
  "Microsoft Certified: Azure Administrator", "Microsoft Certified: Azure Developer", "Microsoft Certified: Azure Solutions Architect",
  "Google Cloud Professional Cloud Architect", "Google Cloud Professional Data Engineer", "Google Cloud Associate Cloud Engineer",
  "Certified Kubernetes Administrator (CKA)", "Certified Kubernetes Application Developer (CKAD)",
  "CompTIA A+", "CompTIA Network+", "CompTIA Security+", "CompTIA Linux+",
  "Cisco CCNA", "Cisco CCNP", "Cisco CCIE",
  "Certified Information Systems Security Professional (CISSP)", "Certified Ethical Hacker (CEH)", "Certified Information Security Manager (CISM)",
  "PMP (Project Management Professional)", "PRINCE2", "Certified ScrumMaster (CSM)", "Certified Scrum Product Owner (CSPO)",
  "ITIL Foundation", "ITIL Expert", "COBIT",
  "Oracle Certified Professional", "Oracle Certified Associate", "MySQL Database Administrator",
  "Red Hat Certified System Administrator (RHCSA)", "Red Hat Certified Engineer (RHCE)",
  "Salesforce Certified Administrator", "Salesforce Certified Developer", "Salesforce Certified Architect",
  "Adobe Certified Expert (ACE)", "Adobe Certified Professional",
  "Google Analytics Individual Qualification", "HubSpot Inbound Certification",
  "Six Sigma Green Belt", "Six Sigma Black Belt", "Lean Six Sigma",
  "CFA (Chartered Financial Analyst)", "CPA (Certified Public Accountant)", "ACCA (Association of Chartered Certified Accountants)",
  "Certified Data Scientist", "Certified Machine Learning Specialist", "TensorFlow Developer Certificate",
  "Certified Information Systems Auditor (CISA)", "Certified in Risk and Information Systems Control (CRISC)",
].sort();

// ============================================================================
// SPECIALIZED TAG INPUT COMPONENTS WITH MOCK DATA
// ============================================================================

const CoreSkillsTagInput: React.FC<Omit<TagInputProps, "options">> = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter mock skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery) return [];
    
    return MOCK_CORE_SKILLS
      .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 20) // Limit to 20 results
      .map(skill => ({
        label: skill,
        value: skill,
      }));
  }, [searchQuery]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      value={props.value}
      onChange={props.onChange}
      options={filteredSkills}
      maxTags={5}
      suggestionTitle="Select Core Skills"
      placeholder={props.placeholder || "Type to search core skills"}
      onInputChange={handleSearch}
    />
  );
};

const InterpersonalSkillsTagInput: React.FC<Omit<TagInputProps, "options">> = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter mock skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery) return [];
    
    return MOCK_INTERPERSONAL_SKILLS
      .filter(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 20) // Limit to 20 results
      .map(skill => ({
        label: skill,
        value: skill,
      }));
  }, [searchQuery]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      value={props.value}
      onChange={props.onChange}
      options={filteredSkills}
      maxTags={5}
      suggestionTitle="Select Interpersonal Skills"
      placeholder={props.placeholder || "Type to search interpersonal skills"}
      onInputChange={handleSearch}
    />
  );
};

const LanguageTagInput: React.FC<Omit<TagInputProps, "options">> = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter languages based on search query
  const filteredLanguages = useMemo(() => {
    if (!searchQuery) return [];

    return MOCK_LANGUAGES.filter((lang) =>
      lang.label.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      options={filteredLanguages}
      maxTags={4}
      suggestionTitle="Select Language"
      onInputChange={handleSearch}
      placeholder={props.placeholder || "Type to search languages"}
    />
  );
};

const CertificationTagInput: React.FC<Omit<TagInputProps, "options">> = (props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter mock certifications based on search query
  const filteredCertifications = useMemo(() => {
    if (!searchQuery) return [];
    
    return MOCK_CERTIFICATIONS
      .filter(cert => cert.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 20) // Limit to 20 results
      .map(cert => ({
        label: cert,
        value: cert,
      }));
  }, [searchQuery]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <TagInputs
      {...props}
      value={props.value}
      onChange={props.onChange}
      options={filteredCertifications}
      maxTags={3}
      suggestionTitle="Select Certifications"
      placeholder={props.placeholder || "Type to search certifications"}
      onInputChange={handleSearch}
    />
  );
};

export {
  TagInputs,
  CoreSkillsTagInput,
  InterpersonalSkillsTagInput,
  LanguageTagInput,
  CertificationTagInput,
};
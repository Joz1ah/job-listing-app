interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptions {
  employmentType: SelectOption[];
  salaryRange: SelectOption[];
  yearsOfExperience: SelectOption[];
  education: SelectOption[];
  country: SelectOption[];
  languages: SelectOption[];
  coreSkills: SelectOption[];
}

export const selectOptions: SelectOptions = {
  employmentType: [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract only" },
  ],
  salaryRange: [
    { value: "nego", label: "Negotiable" },
    { value: "0-30", label: "$0 - $30,000" },
    { value: "31-50", label: "$31,000 - $50,000" },
    { value: "51-70", label: "$51,000 - $70,000" },
    { value: "71-100", label: "$71,000 - $100,000" },
    { value: "100-120", label: "$100,000 - $120,000" },
    { value: "121+", label: "$121,000 or more" },
  ],
  yearsOfExperience: [
    { value: "noExp", label: "No experience" },
    { value: "-1", label: "under a year" },
    { value: "1-3", label: "1-3 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "5-10", label: "5-10 years" },
    { value: "10+", label: "10+ years" },
  ],
  education: [
    { value: "bachelors", label: "Bachelor's Degree" },
    { value: "high-school", label: "High School Diploma" },
    { value: "masters", label: "Master's Degree" },
    { value: "associate", label: "Associate Degree" },
    { value: "professional", label: "Professional Certification only" },
    { value: "techvoc", label: "Vocational/Technical Training only" },
    { value: "phd", label: "Doctorate/PhD" },
    { value: "inc", label: "Incomplete College Degree" },
  ],
  country: [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "gb", label: "United Kingdom" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
    { value: "sg", label: "Singapore" },
    { value: "ae", label: "United Arab Emirates" },
    { value: "in", label: "India" },
    { value: "ph", label: "Philippines" },
    { value: "cn", label: "China" },
  ],

  languages: [
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
    { label: "Vietnamese", value: "vi" },
  ],
  coreSkills: [
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
    { label: "Content Writing", value: "content-writing" },
  ],
};

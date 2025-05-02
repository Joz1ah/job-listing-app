export interface FormData {
  firstName: string;
  lastName: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  languages: string[];
  country: string;
  certifications: string[];
  linkedIn?: string;
}

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
    { value: "Negotiable", label: "Negotiable" },
    { value: "$0 - $30,000", label: "$0 - $30,000" },
    { value: "$31,000 - $50,000", label: "$31,000 - $50,000" },
    { value: "$51,000 - $70,000", label: "$51,000 - $70,000" },
    { value: "$71,000 - $100,000", label: "$71,000 - $100,000" },
    { value: "$100,000 - $120,000", label: "$100,000 - $120,000" },
    { value: "$121,000 or more", label: "$121,000 or more" },
  ],
  yearsOfExperience : [
    { value: "No experience", label: "No experience" },
    { value: "under a year", label: "under a year" },
    { value: "1-3 years", label: "1-3 years" },
    { value: "3-5 years", label: "3-5 years" },
    { value: "5-10 years", label: "5-10 years" },
    { value: "10+ years", label: "10+ years" },
],

  education : [
    { value: "Bachelor's Degree", label: "Bachelor's Degree" },
    { value: "High School Diploma", label: "High School Diploma" },
    { value: "Master's Degree", label: "Master's Degree" },
    { value: "Associate Degree", label: "Associate Degree" },
    { value: "Professional Certification only", label: "Professional Certification only" },
    { value: "Vocational/Technical Training only", label: "Vocational/Technical Training only" },
    { value: "Doctorate/PhD", label: "Doctorate/PhD" },
    { value: "Incomplete College Degree", label: "Incomplete College Degree" },
],
  country: [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Australia", label: "Australia" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "Japan", label: "Japan" },
    { value: "Singapore", label: "Singapore" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "India", label: "India" },
    { value: "Philippines", label: "Philippines" },
    { value: "China", label: "China" },
  ],

  languages : [
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

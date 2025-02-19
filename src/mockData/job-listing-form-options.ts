export interface FormData {
  jobTitle: string;
  employmentType: string[];
  salaryRange: string;
  yearsOfExperience: string;
  jobDescription: string;
  priorityIndicator: string;
  coreSkills: string[];
  interpersonalSkills: string[];
  education: string;
  location: string;
  languages: string[];
  certifications: string[];
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
  priorityIndicator: SelectOption[];
  coreSkills: SelectOption[];
  interpersonalSkills: SelectOption[];
  certifications: SelectOption[];
  languages: SelectOption[];
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
  interpersonalSkills: [
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
    { label: "Cultural Awareness", value: "cultural-awareness" },
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
  certifications: [
    {
      label: "AWS Certified Solutions Architect",
      value: "aws-solutions-architect",
    },
    { label: "CompTIA A+", value: "comptia-a-plus" },
    { label: "CompTIA Network+", value: "comptia-network-plus" },
    { label: "CompTIA Security+", value: "comptia-security-plus" },
    { label: "Cisco CCNA", value: "cisco-ccna" },
    { label: "Cisco CCNP", value: "cisco-ccnp" },
    { label: "Microsoft Azure Administrator", value: "azure-administrator" },
    {
      label: "Google Cloud Professional",
      value: "google-cloud-professional",
    },
    { label: "Project Management Professional (PMP)", value: "pmp" },
    { label: "PRINCE2 Practitioner", value: "prince2-practitioner" },
    { label: "Scrum Master", value: "scrum-master" },
    { label: "PMI Agile Certified Practitioner", value: "pmi-acp" },
    {
      label: "Certified Information Systems Security Professional (CISSP)",
      value: "cissp",
    },
    { label: "Certified Ethical Hacker (CEH)", value: "ceh" },
    { label: "GIAC Security Essentials (GSEC)", value: "gsec" },
    { label: "Oracle Certified Professional Java", value: "oracle-java" },
    {
      label: "Microsoft Certified: Azure Developer",
      value: "azure-developer",
    },
    { label: "Kubernetes Administrator (CKA)", value: "kubernetes-cka" },
    { label: "Terraform Associate", value: "terraform-associate" },
    {
      label: "Google Data Analytics Professional",
      value: "google-data-analytics",
    },
    { label: "AWS Machine Learning Specialty", value: "aws-ml-specialty" },
    {
      label: "TensorFlow Developer Certificate",
      value: "tensorflow-developer",
    },
    { label: "Microsoft Azure AI Engineer", value: "azure-ai-engineer" },
  ],
  priorityIndicator: [
    { value: "Location", label: "Location" },
    { value: "Salary", label: "Salary" },
    { value: "Language", label: "Language" },
    { value: "None", label: "None" },
  ],
};

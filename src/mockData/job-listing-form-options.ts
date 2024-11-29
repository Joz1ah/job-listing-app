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
  }
  
  export const selectOptions: SelectOptions = {
    employmentType: [
      { value: "full-time", label: "Full Time" },
      { value: "part-time", label: "Part Time" },
      { value: "contract", label: "Contract only" },
    ],
    
    salaryRange: [
      { value: "negotiable", label: "Negotiable" },
      { value: "0-30", label: "$0 - $30,000" },
      { value: "31-50", label: "$31,000 - $50,000" },
      { value: "51-70", label: "$51,000 - $70,000" },
      { value: "71-100", label: "$71,000 - $100,000" },
      { value: "101-120", label: "$101,000 - $120,000" },
      { value: "121-plus", label: "$121,000 or more" },
    ],
  
    yearsOfExperience: [
      { value: "no-exp", label: "No experience" },
      { value: "less-than-1", label: "Under a year" },
      { value: "1-3-years", label: "1-3 years" },
      { value: "3-5-years", label: "3-5 years" },
      { value: "5-10-years", label: "5-10 years" },
      { value: "10-plus-years", label: "10+ years" },
    ],
    
    education: [
      { value: "bachelors-degree", label: "Bachelor's Degree" },
      { value: "high-school-diploma", label: "High School Diploma" },
      { value: "masters-degree", label: "Master's Degree" },
      { value: "associate-degree", label: "Associate Degree" },
      { value: "professional-certification", label: "Professional Certification only" },
      { value: "vocational-training", label: "Vocational/Technical Training only" },
      { value: "phd-doctorate", label: "Doctorate/PhD" },
      { value: "incomplete-college", label: "Incomplete College Degree" },
    ],
    
    priorityIndicator: [
      { value: "location", label: "Location" },
      { value: "salary", label: "Salary" },
      { value: "language", label: "Language" },
      { value: "none", label: "None" },
    ],
  };
  
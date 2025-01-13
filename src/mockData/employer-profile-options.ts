interface SelectOption {
    value: string;
    label: string;
  }
  
  interface SelectOptions {
    country: SelectOption[];
    industry: SelectOption[];
  }

  export interface FormData {
    businessName: string;
    firstName: string;
    lastName: string;
    position: string;
    industry: string;
    emailAddress: string;
    mobileNumber: string;
    companyWebsite: string;
    yearFounded: string;
    unitAndBldg: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
    companyOverview: string;
    employmentType: string[];
  }

export const selectOptions: SelectOptions = {
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
    industry: [
      { value: "1", label: "Accounting and Finance" },
      { value: "2", label: "Architecture and Interior Design" },
      { value: "3", label: "Automotive and Engineering" },
      { value: "4", label: "Blockchain and Cryptocurrency" },
      { value: "6", label: "Compliance and Regulatory Affairs" },
      { value: "7", label: "Consulting" },
      { value: "8", label: "Creative Arts" },
      { value: "9", label: "Customer Service and Support" },
      { value: "10", label: "Data Entry and Administrative Work" },
      { value: "11", label: "E-Commerce" },
      { value: "12", label: "Education and Tutoring" },
      { value: "13", label: "Executive Roles" },
      { value: "14", label: "Family and Child Services" },
      { value: "15", label: "Travel" },
      { value: "16", label: "Web/Software Development" },
    ]
  };
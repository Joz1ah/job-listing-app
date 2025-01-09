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
    industry: [
      { value: "1", label: "Accounting and Finance" },
      { value: "2", label: "Architecture and Interior Design" },
      { value: "3", label: "Automotive and Engineering" },
      { value: "4", label: "Blockchain and Cryptocurrency" },
      /* { value: "compliance-regulatory", label: "Compliance and Regulatory Affairs" },
      { value: "consulting", label: "Consulting" },
      { value: "creative-arts", label: "Creative Arts" },
      { value: "customer-service-support", label: "Customer Service and Support" },
      { value: "data-entry-admin", label: "Data Entry and Administrative Work" },
      { value: "ecommerce", label: "E-Commerce" },
      { value: "education-tutoring", label: "Education and Tutoring" },
      { value: "executive-roles", label: "Executive Roles" },
      { value: "family-child-services", label: "Family and Child Services" },
      { value: "travel", label: "Travel" },
      { value: "web-software-development", label: "Web/Software Development" }, */
    ]
  };
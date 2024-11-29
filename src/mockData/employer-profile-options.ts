interface SelectOption {
    value: string;
    label: string;
  }
  
  interface SelectOptions {
    country: SelectOption[];
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
  };
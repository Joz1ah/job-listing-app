interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  position: string;
  company: string;
  location: string;
  description: string;
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
  salaryExpectation: string;
}

export const perfectMatch: Match[] = [
  {
    position: "Software Engineer",
    company: "Fintech Solutions Ltd",
    location: "United Kingdom",
    description:
      "Looking for a passionate engineer to help build our next-generation financial platform using modern web technologies.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "Git", isMatch: true },
    ],
    appliedAgo: "3 days ago",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$51,000-$70,000",
  },
  {
    position: "Senior Frontend Engineer",
    company: "TechStack Inc",
    location: "Canada",
    description:
      "Join our rapidly growing team to build scalable web applications and mentor junior developers.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "TypeScript", isMatch: true },
    ],
    appliedAgo: "1 week ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
  },
  {
    position: "Frontend Developer",
    company: "Digital Innovation GmbH",
    location: "Germany",
    description:
      "Help shape the future of our digital products with modern JavaScript frameworks and cutting-edge technologies.",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "Vue.js", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
    ],
    appliedAgo: "4 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time", "Part Time", "Contract only"],
    salaryExpectation: "$51,000-$70,000",
  },
  {
    position: "Full Stack Developer",
    company: "CloudScale Systems",
    location: "Netherlands",
    description:
      "Join our innovative team building cloud-native applications with focus on user experience and scalability.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "Node.js", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
    ],
    appliedAgo: "2 days ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$65,000-$85,000",
  },
  {
    position: "UI Developer",
    company: "CreativeWeb Solutions",
    location: "Sweden",
    description:
      "Create engaging user interfaces for our client's digital products using modern frontend technologies.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "Figma", isMatch: true },
    ],
    appliedAgo: "5 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$55,000-$75,000",
  },
  {
    position: "Frontend Application Developer",
    company: "HealthTech Innovations",
    location: "Denmark",
    description:
      "Develop modern healthcare applications with focus on accessibility and user experience.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "TypeScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
    ],
    appliedAgo: "1 week ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$60,000-$80,000",
  },
  {
    position: "React Developer",
    company: "EcoTech Solutions",
    location: "Norway",
    description:
      "Build sustainable technology solutions using React and modern web technologies.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "Redux", isMatch: true },
    ],
    appliedAgo: "3 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$58,000-$78,000",
  },
  {
    position: "Frontend Engineer",
    company: "AI Solutions Corp",
    location: "Finland",
    description:
      "Create intuitive interfaces for our AI-powered applications using modern frontend frameworks.",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "TypeScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
    ],
    appliedAgo: "6 days ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$62,000-$82,000",
  },
  {
    position: "Full Stack Developer",
    company: "GreenTech Innovations",
    location: "Germany",
    description:
      "Develop scalable web applications and collaborate across teams to drive sustainable tech solutions.",
    skills: [
      { name: "Node.js", isMatch: true },
      { name: "React", isMatch: true },
      { name: "Express", isMatch: true },
      { name: "MongoDB", isMatch: true },
      { name: "TypeScript", isMatch: true },
    ],
    appliedAgo: "1 week ago",
    experience: "3-5years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$70,000-$90,000",
  },
  {
    position: "Backend Developer",
    company: "DataFlex Technologies",
    location: "USA",
    description:
      "Optimize backend processes and develop robust APIs for our enterprise data solutions.",
    skills: [
      { name: "Python", isMatch: true },
      { name: "Django", isMatch: true },
      { name: "PostgreSQL", isMatch: true },
      { name: "Docker", isMatch: true },
      { name: "AWS", isMatch: true },
    ],
    appliedAgo: "2 days ago",
    experience: "4-6years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$85,000-$105,000",
  },
  {
    position: "Mobile App Developer",
    company: "HealthFirst",
    location: "Canada",
    description:
      "Design and implement mobile applications for our healthcare platform, ensuring smooth user experiences.",
    skills: [
      { name: "React Native", isMatch: true },
      { name: "iOS", isMatch: true },
      { name: "Android", isMatch: true },
      { name: "Kotlin", isMatch: true },
      { name: "Firebase", isMatch: true },
    ],
    appliedAgo: "3 weeks ago",
    experience: "2-4years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$60,000-$78,000",
  },
  {
    position: "DevOps Engineer",
    company: "CloudOps Systems",
    location: "Netherlands",
    description:
      "Automate deployment pipelines and maintain cloud infrastructure to ensure optimal performance and reliability.",
    skills: [
      { name: "AWS", isMatch: true },
      { name: "Terraform", isMatch: true },
      { name: "Kubernetes", isMatch: true },
      { name: "Jenkins", isMatch: true },
      { name: "Docker", isMatch: true },
    ],
    appliedAgo: "5 days ago",
    experience: "3-5years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$80,000-$100,000",
  },
  {
    position: "UI/UX Designer",
    company: "BrightSpace Studios",
    location: "Australia",
    description:
      "Craft engaging user experiences for our diverse range of digital products with a focus on user-centered design.",
    skills: [
      { name: "Figma", isMatch: true },
      { name: "Sketch", isMatch: true },
      { name: "Adobe XD", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
    ],
    appliedAgo: "2 weeks ago",
    experience: "1-3years",
    lookingFor: ["Part Time"],
    salaryExpectation: "$55,000-$70,000",
  },
];

export const others: Match[] = [
  {
    position: "Lead Software Engineer",
    company: "InnovateTech Solutions",
    location: "USA",
    description:
      "Lead our engineering team in building next-generation enterprise applications with modern tech stack.",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "GraphQL", isMatch: true },
      { name: "TypeScript", isMatch: true },
      { name: "REST API", isMatch: true },
    ],
    appliedAgo: "2 days ago",
    experience: "5-10years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$100,000-$120,000",
  },
  {
    position: "Backend Engineer",
    company: "DataFlow Systems",
    location: "USA",
    description:
      "Join our backend team to build robust and scalable APIs that power our enterprise solutions.",
    skills: [
      { name: "Express", isMatch: true },
      { name: "MongoDB", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "Docker", isMatch: true },
      { name: "REST API", isMatch: true },
    ],
    appliedAgo: "5 days ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$71,000-$100,000",
  },
  {
    position: "DevOps Engineer",
    company: "CloudInfra Solutions",
    location: "USA",
    description:
      "Manage and optimize our cloud infrastructure while implementing CI/CD pipelines.",
    skills: [
      { name: "Docker", isMatch: true },
      { name: "AWS", isMatch: true },
      { name: "Terraform", isMatch: true },
      { name: "Linux", isMatch: true },
      { name: "Bash", isMatch: true },
    ],
    appliedAgo: "1 week ago",
    experience: "4-6years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$90,000-$110,000",
  },
  {
    position: "Mobile Developer",
    company: "AppWorks Mobile",
    location: "USA",
    description:
      "Create cross-platform mobile applications using React Native and modern mobile technologies.",
    skills: [
      { name: "React Native", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "Redux", isMatch: true },
      { name: "REST API", isMatch: true },
      { name: "Mobile UI", isMatch: true },
    ],
    appliedAgo: "3 days ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$75,000-$95,000",
  },
  {
    position: "Data Engineer",
    company: "DataScience Corp",
    location: "USA",
    description:
      "Build and maintain data pipelines and infrastructure for our machine learning platforms.",
    skills: [
      { name: "SQL", isMatch: true },
      { name: "AWS", isMatch: true },
      { name: "Docker", isMatch: true },
      { name: "ETL", isMatch: true },
      { name: "Python", isMatch: false },
    ],
    appliedAgo: "4 days ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$85,000-$105,000",
  },
  {
    position: "QA Automation Engineer",
    company: "TechGuard",
    location: "Ireland",
    description:
      "Develop and maintain automated test scripts to ensure high-quality releases for our SaaS products.",
    skills: [
      { name: "Selenium", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "Jest", isMatch: true },
      { name: "Python", isMatch: true },
      { name: "Postman", isMatch: true },
    ],
    appliedAgo: "1 month ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$65,000-$85,000",
  },
  {
    position: "Product Manager",
    company: "FinEdge Corp",
    location: "USA",
    description:
      "Lead product development cycles, define product vision, and collaborate with cross-functional teams to deliver exceptional FinTech solutions.",
    skills: [
      { name: "Agile Methodologies", isMatch: true },
      { name: "Product Strategy", isMatch: true },
      { name: "Market Research", isMatch: true },
      { name: "Roadmapping", isMatch: true },
      { name: "Confluence", isMatch: true },
    ],
    appliedAgo: "3 days ago",
    experience: "5-7years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$120,000-$150,000",
  },
  {
    position: "Data Scientist",
    company: "Insight Analytics",
    location: "Singapore",
    description:
      "Analyze complex datasets to provide actionable insights, leveraging machine learning models to optimize business decisions.",
    skills: [
      { name: "Python", isMatch: true },
      { name: "Machine Learning", isMatch: true },
      { name: "TensorFlow", isMatch: true },
      { name: "SQL", isMatch: true },
      { name: "Pandas", isMatch: true },
    ],
    appliedAgo: "2 weeks ago",
    experience: "3-5years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$90,000-$120,000",
  },
  {
    position: "IT Support Specialist",
    company: "Global IT Solutions",
    location: "UAE",
    description:
      "Provide technical support, troubleshoot hardware and software issues, and ensure seamless IT operations.",
    skills: [
      { name: "Windows Server", isMatch: true },
      { name: "Active Directory", isMatch: true },
      { name: "Networking", isMatch: true },
      { name: "Office 365", isMatch: true },
      { name: "Linux", isMatch: false },
    ],
    appliedAgo: "1 week ago",
    experience: "1-3years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$45,000-$60,000",
  },
  {
    position: "Marketing Specialist",
    company: "BrightWave Media",
    location: "USA",
    description:
      "Drive marketing campaigns, optimize digital presence, and analyze metrics to enhance brand awareness.",
    skills: [
      { name: "SEO", isMatch: true },
      { name: "Google Analytics", isMatch: true },
      { name: "Content Marketing", isMatch: true },
      { name: "Social Media", isMatch: true },
      { name: "PPC", isMatch: false },
    ],
    appliedAgo: "4 days ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$55,000-$75,000",
  },
];

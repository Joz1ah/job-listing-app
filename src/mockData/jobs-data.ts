export interface Match {
  employerId: number;
  position: string;
  company: string;
  location: string;
  coreSkills: string[];
  posted: string;
  experience: string;
  description: string;
  lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
  salaryExpectation: string;
  language?: string[];
  interpersonalSkills?: string[];
  certificates?: string[];
  isNew?: boolean;
}

export const perfectMatch: Match[] = [
  {
    employerId: 1,
    position: "Software Engineer",
    company: "Fintech Solutions Ltd",
    location: "Philippines",
    description:
      "Looking for a passionate engineer to help build our next-generation financial platform using modern web technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    posted: "1 day",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$51,000-$70,000",
    interpersonalSkills: ["Communication", "Team Collaboration", "Problem-solving"],
    certificates: ["None required"],
    isNew: true
  },
  {
    employerId: 2,
    position: "Senior Frontend Engineer",
    company: "TechStack Inc",
    location: "Canada",
    description:
      "Join our rapidly growing team to build scalable web applications and mentor junior developers.",
    coreSkills: ["Quality Assurance", "JavaScript", "Machine Learning", "Product Management", "TypeScript"],
    posted: "1 day",
    experience: "3 - 5 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    interpersonalSkills: ["Leadership", "Mentoring", "Communication", "Team Management"],
    certificates: ["None required"],
    isNew: true
  },
  {
    employerId: 3,
    position: "Frontend Developer",
    company: "Digital Innovation GmbH",
    location: "Germany",
    description:
      "Help shape the future of our digital products with modern JavaScript frameworks and cutting-edge technologies.",
    coreSkills: ["JavaScript", "React", "Vue.js", "CSS", "HTML"],
    posted: "1 day",
    experience: "1 - 3 years",
    lookingFor: ["Full Time", "Part Time", "Contract only"],
    salaryExpectation: "$51,000-$70,000",
    interpersonalSkills: ["Communication", "Adaptability", "Problem-solving"],
    certificates: ["None required"],
    isNew: true
  },
  {
    employerId: 4,
    position: "Full Stack Developer",
    company: "CloudScale Systems",
    location: "Netherlands",
    description:
      "Join our innovative team building cloud-native applications with focus on user experience and scalability.",
    coreSkills: ["React", "JavaScript", "Node.js", "CSS", "HTML"],
    posted: "2 days",
    experience: "2 - 4 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$65,000-$85,000",
    interpersonalSkills: ["Communication", "Problem-solving", "Time Management"],
    certificates: ["AWS Certified Developer - Associate"],
    isNew: false
  },
  {
    employerId: 5,
    position: "UI Developer",
    company: "CreativeWeb Solutions",
    location: "Sweden",
    description:
      "Create engaging user interfaces for our client's digital products using modern frontend technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Figma"],
    posted: "3 days",
    experience: "1 - 3 years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$55,000-$75,000",
    interpersonalSkills: ["Client Communication", "Creativity", "Team Collaboration"],
    certificates: ["None required"],
    isNew: false
  },
  {
    employerId: 6,
    position: "Frontend Application Developer",
    company: "HealthTech Innovations",
    location: "Denmark",
    description:
      "Develop modern healthcare applications with focus on accessibility and user experience.",
    coreSkills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
    posted: "4 days",
    experience: "2 - 4 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$60,000-$80,000",
    interpersonalSkills: ["Communication", "Empathy", "Attention to Detail"],
    certificates: ["HIPAA Compliance Certification"],
    isNew: false
  },
  {
    employerId: 7,
    position: "React Developer",
    company: "EcoTech Solutions",
    location: "Norway",
    description:
      "Build sustainable technology solutions using React and modern web technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
    posted: "4 days",
    experience: "1 - 3years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$58,000-$78,000",
    interpersonalSkills: ["Communication", "Environmental Awareness", "Team Collaboration"],
    certificates: ["None required"],
    isNew: false
  },
  {
    employerId: 8,
    position: "Frontend Engineer",
    company: "AI Solutions Corp",
    location: "Finland",
    description:
      "Create intuitive interfaces for our AI-powered applications using modern frontend frameworks.",
    coreSkills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
    posted: "5 days",
    experience: "2 - 4 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$62,000-$82,000",
    interpersonalSkills: ["Problem-solving", "Analytical Thinking", "Communication"],
    certificates: ["None required"],
    isNew: false
  },
  {
    employerId: 9,
    position: "Full Stack Developer",
    company: "GreenTech Innovations",
    location: "Germany",
    description:
      "Develop scalable web applications and collaborate across teams to drive sustainable tech solutions.",
    coreSkills: ["Node.js", "React", "Express", "MongoDB", "TypeScript"],
    posted: "1 week",
    experience: "3 - 5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$70,000-$90,000",
    interpersonalSkills: ["Cross-team Collaboration", "Communication", "Project Management"],
    certificates: ["None required"],
    isNew: false
  },
  {
    employerId: 10,
    position: "Backend Developer",
    company: "DataFlex Technologies",
    location: "USA",
    description:
      "Optimize backend processes and develop robust APIs for our enterprise data solutions.",
    coreSkills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
    posted: "1 week",
    experience: "4 - 6 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$85,000-$105,000",
    interpersonalSkills: ["Problem-solving", "Communication", "Technical Leadership"],
    certificates: ["AWS Certified Solutions Architect"],
    isNew: false
  },
];

export const others: Match[] = [
  {
    employerId: 11,
    position: "Lead Software Engineer",
    company: "InnovateTech Solutions",
    location: "USA",
    description:
      "Lead our engineering team in building next-generation enterprise applications with modern tech stack.",
    coreSkills: ["JavaScript", "React", "GraphQL", "TypeScript", "REST API"],
    posted: "1 day",
    experience: "5 - 10 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$100,000-$120,000",
    interpersonalSkills: ["Leadership", "Team Management", "Strategic Thinking", "Communication"],
    certificates: ["None required"],
    isNew: true
  },
  {
    employerId: 12,
    position: "DevOps Engineer",
    company: "CloudScale Solutions",
    location: "USA",
    description:
      "Drive our cloud infrastructure and CI/CD pipelines while implementing best practices for scalability and security.",
    coreSkills: ["AWS", "Kubernetes", "Jenkins", "Terraform", "Python"],
    posted: "2 days",
    experience: "4 - 7 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$95,000-$115,000",
    interpersonalSkills: ["Infrastructure Planning", "Automation", "Cross-team Collaboration"],
    certificates: ["AWS Certified DevOps Engineer"],
    isNew: false
  },
  {
    employerId: 13,
    position: "Frontend Developer",
    company: "PixelPerfect Digital",
    location: "USA",
    description:
      "Create stunning, responsive web applications with a focus on user experience and modern design principles.",
    coreSkills: ["React", "Vue.js", "CSS3", "Webpack", "Jest"],
    posted: "3 days",
    experience: "2 - 4 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$80,000-$95,000",
    interpersonalSkills: ["UI/UX Sensibility", "Creative Problem-solving", "Attention to Detail"],
    certificates: ["None required"],
    isNew: false
  },
  {
    employerId: 14,
    position: "Machine Learning Engineer",
    company: "AI Innovations Corp",
    location: "USA",
    description:
      "Develop and deploy machine learning models for real-world applications in computer vision and NLP.",
    coreSkills: ["Python", "TensorFlow", "PyTorch", "scikit-learn", "Docker"],
    posted: "4 days",
    experience: "3 - 6 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$110,000-$130,000",
    interpersonalSkills: ["Research Aptitude", "Data Analysis", "Project Management"],
    certificates: ["Machine Learning Certification preferred"],
    isNew: false
  },
  {
    employerId: 15,
    position: "Full Stack Developer",
    company: "TechFusion Global",
    location: "USA",
    description:
      "Build and maintain full-stack applications using modern JavaScript frameworks and cloud services.",
    coreSkills: ["Node.js", "React", "PostgreSQL", "Redis", "AWS"],
    posted: "1 week",
    experience: "3 - 5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$85,000-$105,000",
    interpersonalSkills: ["Full-stack Architecture", "Agile Methodology", "Technical Documentation"],
    certificates: ["None required"],
    isNew: false
  },
];
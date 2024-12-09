export interface Match {
  position: string;
  company: string;
  location: string;
  coreSkills: string[];
  appliedAgo: string;
  experience: string;
  description: string;
  lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
  salaryExpectation: string;
  language?: string[];
  interpersonalSkills?: string[];
  certificates?: string[];
}

export const perfectMatch: Match[] = [
  {
    position: "Software Engineer",
    company: "Fintech Solutions Ltd",
    location: "United Kingdom",
    description:
      "Looking for a passionate engineer to help build our next-generation financial platform using modern web technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    appliedAgo: "3 days ago",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$51,000-$70,000",
    interpersonalSkills: ["Communication", "Team Collaboration", "Problem-solving"],
    certificates: ["None required"]
  },
  {
    position: "Senior Frontend Engineer",
    company: "TechStack Inc",
    location: "Canada",
    description:
      "Join our rapidly growing team to build scalable web applications and mentor junior developers.",
    coreSkills: ["Quality Assurance", "JavaScript", "Machine Learning", "Product Management", "TypeScript"],
    appliedAgo: "1 week ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    interpersonalSkills: ["Leadership", "Mentoring", "Communication", "Team Management"],
    certificates: ["None required"]
  },
  {
    position: "Frontend Developer",
    company: "Digital Innovation GmbH",
    location: "Germany",
    description:
      "Help shape the future of our digital products with modern JavaScript frameworks and cutting-edge technologies.",
    coreSkills: ["JavaScript", "React", "Vue.js", "CSS", "HTML"],
    appliedAgo: "4 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time", "Part Time", "Contract only"],
    salaryExpectation: "$51,000-$70,000",
    interpersonalSkills: ["Communication", "Adaptability", "Problem-solving"],
    certificates: ["None required"]
  },
  {
    position: "Full Stack Developer",
    company: "CloudScale Systems",
    location: "Netherlands",
    description:
      "Join our innovative team building cloud-native applications with focus on user experience and scalability.",
    coreSkills: ["React", "JavaScript", "Node.js", "CSS", "HTML"],
    appliedAgo: "2 days ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$65,000-$85,000",
    interpersonalSkills: ["Communication", "Problem-solving", "Time Management"],
    certificates: ["AWS Certified Developer - Associate"]
  },
  {
    position: "UI Developer",
    company: "CreativeWeb Solutions",
    location: "Sweden",
    description:
      "Create engaging user interfaces for our client's digital products using modern frontend technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Figma"],
    appliedAgo: "5 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$55,000-$75,000",
    interpersonalSkills: ["Client Communication", "Creativity", "Team Collaboration"],
    certificates: ["None required"]
  },
  {
    position: "Frontend Application Developer",
    company: "HealthTech Innovations",
    location: "Denmark",
    description:
      "Develop modern healthcare applications with focus on accessibility and user experience.",
    coreSkills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
    appliedAgo: "1 week ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$60,000-$80,000",
    interpersonalSkills: ["Communication", "Empathy", "Attention to Detail"],
    certificates: ["HIPAA Compliance Certification"]
  },
  {
    position: "React Developer",
    company: "EcoTech Solutions",
    location: "Norway",
    description:
      "Build sustainable technology solutions using React and modern web technologies.",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Redux"],
    appliedAgo: "3 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$58,000-$78,000",
    interpersonalSkills: ["Communication", "Environmental Awareness", "Team Collaboration"],
    certificates: ["None required"]
  },
  {
    position: "Frontend Engineer",
    company: "AI Solutions Corp",
    location: "Finland",
    description:
      "Create intuitive interfaces for our AI-powered applications using modern frontend frameworks.",
    coreSkills: ["React", "JavaScript", "TypeScript", "CSS", "HTML"],
    appliedAgo: "6 days ago",
    experience: "2-4years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$62,000-$82,000",
    interpersonalSkills: ["Problem-solving", "Analytical Thinking", "Communication"],
    certificates: ["None required"]
  },
  {
    position: "Full Stack Developer",
    company: "GreenTech Innovations",
    location: "Germany",
    description:
      "Develop scalable web applications and collaborate across teams to drive sustainable tech solutions.",
    coreSkills: ["Node.js", "React", "Express", "MongoDB", "TypeScript"],
    appliedAgo: "1 week ago",
    experience: "3-5years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$70,000-$90,000",
    interpersonalSkills: ["Cross-team Collaboration", "Communication", "Project Management"],
    certificates: ["None required"]
  },
  {
    position: "Backend Developer",
    company: "DataFlex Technologies",
    location: "USA",
    description:
      "Optimize backend processes and develop robust APIs for our enterprise data solutions.",
    coreSkills: ["Python", "Django", "PostgreSQL", "Docker", "AWS"],
    appliedAgo: "2 days ago",
    experience: "4-6years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$85,000-$105,000",
    interpersonalSkills: ["Problem-solving", "Communication", "Technical Leadership"],
    certificates: ["AWS Certified Solutions Architect"]
  },
];

export const others: Match[] = [
  {
    position: "Lead Software Engineer",
    company: "InnovateTech Solutions",
    location: "USA",
    description:
      "Lead our engineering team in building next-generation enterprise applications with modern tech stack.",
    coreSkills: ["JavaScript", "React", "GraphQL", "TypeScript", "REST API"],
    appliedAgo: "2 days ago",
    experience: "5-10years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$100,000-$120,000",
    interpersonalSkills: ["Leadership", "Team Management", "Strategic Thinking", "Communication"],
    certificates: ["None required"]
  },
  {
    position: "Backend Engineer",
    company: "DataFlow Systems",
    location: "USA",
    description:
      "Join our backend team to build robust and scalable APIs that power our enterprise solutions.",
    coreSkills: ["Express", "MongoDB", "JavaScript", "Docker", "REST API"],
    appliedAgo: "5 days ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$71,000-$100,000",
    interpersonalSkills: ["Problem-solving", "Communication", "Team Collaboration"],
    certificates: ["None required"]
  },
];
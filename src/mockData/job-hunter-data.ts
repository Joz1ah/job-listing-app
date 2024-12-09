export interface Match {
  name: string;
  location: string;
  position: string;
  education: string;
  coreSkills: string[];
  appliedAgo: string;
  experience: string;
  lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
  salaryExpectation: string;
  language: string[];
  interpersonalSkills?: string[];
  certificates?: string[];
}

export const perfectMatch: Match[] = [
  {
    name: "Olivia Davis",
    location: "United Kingdom",
    position: "Junior Front End Developer",
    education: "Bachelor's Degree",
    coreSkills: ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
    appliedAgo: "3 days ago",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time", "Contract only"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English"],
    interpersonalSkills: ["Team Collaboration", "Adaptability", "Problem Solving"],
    certificates: ["Certified JavaScript Developer", "Certified JavaScript Developer"]
  },
  {
    name: "Mason Green",
    location: "Canada",
    position: "Frontend Engineer",
    education: "Master's Degree",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
    appliedAgo: "1 week ago",
    experience: "3-5 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English", "French"],
    interpersonalSkills: ["Communication", "Time Management", "Critical Thinking"],
    certificates: ["AWS Certified Developer", "TypeScript Mastery"]
  },
  {
    name: "Ava Martinez",
    location: "Germany",
    position: "Junior JavaScript Developer",
    education: "Bachelor's Degree",
    coreSkills: ["JavaScript", "React", "Vue.js", "CSS", "HTML"],
    appliedAgo: "4 days ago",
    experience: "1-3 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English", "Spanish"],
    interpersonalSkills: ["Creativity", "Empathy", "Conflict Resolution"],
    certificates: ["Certified Vue.js Developer"]
  },
  {
    name: "Ethan Clark",
    location: "United States of America",
    position: "Frontend Developer",
    education: "Master's Degree",
    coreSkills: ["React", "JavaScript", "SCSS", "Responsive Design", "Git"],
    appliedAgo: "5 days ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"],
    interpersonalSkills: ["Leadership", "Emotional Intelligence", "Negotiation"],
    certificates: ["Google UX Design Professional Certificate"]
  },
  {
    name: "Sophia Brown",
    location: "Australia",
    position: "UI Developer",
    education: "Bachelor's Degree",
    coreSkills: ["React", "JavaScript", "CSS", "Tailwind CSS", "HTML"],
    appliedAgo: "6 days ago",
    experience: "1-3 years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English"],
    interpersonalSkills: ["Team Collaboration", "Flexibility", "Persuasion"],
    certificates: ["Certified UI/UX Designer"]
  },
  {
    name: "James Wilson",
    location: "United States of America",
    position: "React Developer",
    education: "Master's Degree",
    coreSkills: ["React", "JavaScript", "Redux", "TypeScript", "CSS"],
    appliedAgo: "2 weeks ago",
    experience: "5-10 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$100,000-$120,000",
    language: ["English"],
    interpersonalSkills: ["Decision Making", "Strategic Thinking", "Innovation"],
    certificates: ["React Professional Developer"]
  },
  {
    name: "Lucas Evans",
    location: "Spain",
    position: "Junior Web Developer",
    education: "Associate Degree",
    coreSkills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    appliedAgo: "3 weeks ago",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "negotiable",
    language: ["English", "Spanish"],
    interpersonalSkills: ["Time Management", "Problem Solving", "Empathy"],
    certificates: ["Full Stack Web Development Certificates"]
  },
  {
    name: "Isabella Hill",
    location: "France",
    position: "Junior Front End Developer",
    education: "Bachelor's Degree",
    coreSkills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    appliedAgo: "1 month ago",
    experience: "1-3 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English", "French"],
    interpersonalSkills: ["Adaptability", "Conflict Resolution", "Leadership"],
    certificates: ["Certified React Developer"]
  },
  {
    name: "Liam Parker",
    location: "Canada",
    position: "Full Stack Developer",
    education: "Master's Degree",
    coreSkills: ["React", "Node.js", "Express", "MongoDB", "Git"],
    appliedAgo: "2 weeks ago",
    experience: "3-5 years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$75,000-$90,000",
    language: ["English"],
    interpersonalSkills: ["Creativity", "Strategic Thinking", "Emotional Intelligence"],
    certificates: ["Full Stack Developer Professional Certificate"]
  },
  {
    name: "Sophia Martinez",
    location: "Spain",
    position: "UI/UX Designer",
    education: "Bachelor's Degree",
    coreSkills: ["Figma", "Sketch", "Adobe XD", "CSS", "HTML"],
    appliedAgo: "3 days ago",
    experience: "1-3 years",
    lookingFor: ["Part Time", "Contract only"],
    salaryExpectation: "$45,000-$55,000",
    language: ["Spanish", "English"],
    interpersonalSkills: ["Flexibility", "Empathy", "Persuasion"],
    certificates: ["Certified UI/UX Designer"]
  }
];

export const others: Match[] = [
  {
    name: "Lily Thompson",
    location: "United States of America",
    position: "Full Stack Developer",
    education: "Master's Degree",
    coreSkills: ["JavaScript", "React", "GraphQL", "MongoDB", "TypeScript"],
    appliedAgo: "2 days ago",
    experience: "5-10 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$100,000-$120,000",
    language: ["English"],
    interpersonalSkills: ["Problem Solving", "Team Collaboration", "Adaptability"],
    certificates: ["Full Stack Professional Developer"]
  },
  {
    name: "Jack Baker",
    location: "United States of America",
    position: "Backend Developer",
    education: "Bachelor's Degree",
    coreSkills: ["Express", "MongoDB", "JavaScript", "Docker", "REST API"],
    appliedAgo: "5 days ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"],
    interpersonalSkills: ["Critical Thinking", "Time Management", "Creativity"],
    certificates: ["Certified Backend Developer"]
  },
  {
    name: "Emma Johnson",
    location: "Ireland",
    position: "Software Engineer",
    education: "Master's Degree",
    coreSkills: ["JavaScript", "React", "GraphQL", "CSS", "MySQL"],
    appliedAgo: "1 week ago",
    experience: "3-5 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"],
    interpersonalSkills: ["Leadership", "Decision Making", "Strategic Thinking"],
    certificates: ["Certified Software Engineer"]
  },
  {
    name: "Noah Lee",
    location: "South Korea",
    position: "Frontend Engineer",
    education: "Bachelor's Degree",
    coreSkills: ["JavaScript", "React", "CSS", "HTML", "TypeScript"],
    appliedAgo: "2 weeks ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"],
    interpersonalSkills: ["Communication", "Emotional Intelligence", "Flexibility"],
    certificates: ["Frontend Developer Certificates"]
  },
  {
    name: "Amelia Roberts",
    location: "Japan",
    position: "Junior Software Developer",
    education: "Associate Degree",
    coreSkills: ["JavaScript", "React", "HTML", "CSS", "Git"],
    appliedAgo: "3 weeks ago",
    experience: "1-3 years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "Negotiable",
    language: ["English"],
    interpersonalSkills: ["Conflict Resolution", "Creativity", "Adaptability"],
    certificates: ["Certified Junior Developer"]
  },
  {
    name: "Amelia Brown",
    location: "Australia",
    position: "Data Analyst",
    education: "Bachelor's Degree",
    coreSkills: ["Python", "SQL", "Tableau", "Excel", "Git"],
    appliedAgo: "4 days ago",
    experience: "1-3 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$50,000-$65,000",
    language: ["English"],
    interpersonalSkills: ["Attention to Detail", "Analytical Thinking", "Problem Solving"],
    certificates: ["Data Analytics Professional Certificate"]
  },
  {
    name: "Lucas Nguyen",
    location: "Vietnam",
    position: "Front End Developer",
    education: "Bachelor's Degree",
    coreSkills: ["Vue.js", "JavaScript", "CSS", "HTML", "TypeScript"],
    appliedAgo: "3 weeks ago",
    experience: "3-5 years",
    lookingFor: ["Part Time", "Contract only"],
    salaryExpectation: "$40,000-$55,000",
    language: ["Vietnamese", "English"],
    interpersonalSkills: ["Empathy", "Adaptability", "Creativity"],
    certificates: ["Certified Vue.js Developer"]
  },
  {
    name: "Mia Patel",
    location: "India",
    position: "Cloud Engineer",
    education: "Master's Degree",
    coreSkills: ["AWS", "Docker", "Kubernetes", "Terraform", "Linux"],
    appliedAgo: "1 month ago",
    experience: "5-7 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$70,000-$85,000",
    language: ["English", "Hindi"],
    interpersonalSkills: ["Problem Solving", "Leadership", "Strategic Thinking"],
    certificates: ["AWS Certified Solutions Architect"]
  },
  {
    name: "Ethan Kim",
    location: "United States of America",
    position: "Machine Learning Engineer",
    education: "Doctorate/PhD",
    coreSkills: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL"],
    appliedAgo: "2 months ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$110,000-$130,000",
    language: ["English", "Korean"],
    interpersonalSkills: ["Analytical Thinking", "Decision Making", "Innovation"],
    certificates: ["Certified Machine Learning Specialist"]
  },
  {
    name: "Ava Davies",
    location: "United Kingdom",
    position: "Cybersecurity Specialist",
    education: "Master's Degree",
    coreSkills: ["Penetration Testing", "Network Security", "Ethical Hacking", "Linux", "Python"],
    appliedAgo: "2 weeks ago",
    experience: "5-7 years",
    lookingFor: ["Contract only"],
    salaryExpectation: "$90,000-$110,000",
    language: ["English"],
    interpersonalSkills: ["Critical Thinking", "Problem Solving", "Leadership"],
    certificates: ["Certified Ethical Hacker"]
  }
];
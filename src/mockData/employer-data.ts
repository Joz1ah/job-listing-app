interface Skill {
  name: string;
  isMatch: boolean;
}

interface Match {
  name: string;
  location: string;
  job: string;
  skills: Skill[];
  appliedAgo: string;
  experience: string;
  lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
  salaryExpectation: string;
  language: string[];
}

export const perfectMatch: Match[] = [
  {
    name: "Olivia Davis",
    location: "United Kingdom",
    job: "Junior Front End Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "3 days ago",
    experience: "under a year",
    lookingFor: ["Full Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English"]
  },
  {
    name: "Mason Green",
    location: "Canada",
    job: "Frontend Engineer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "TypeScript", isMatch: true }
    ],
    appliedAgo: "1 week ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English", "French"]
  },
  {
    name: "Ava Martinez",
    location: "Germany",
    job: "Junior JavaScript Developer",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "Vue.js", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true }
    ],
    appliedAgo: "4 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English", "Spanish"]
  },
  {
    name: "Ethan Clark",
    location: "United States of America",
    job: "Frontend Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "SCSS", isMatch: true },
      { name: "Responsive Design", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "5 days ago",
    experience: "3-5years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"]
  },
  {
    name: "Sophia Brown",
    location: "Australia",
    job: "UI Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "Tailwind CSS", isMatch: true },
      { name: "HTML", isMatch: true }
    ],
    appliedAgo: "6 days ago",
    experience: "1-3years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English"]
  },
  {
    name: "James Wilson",
    location: "United States of America",
    job: "React Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "Redux", isMatch: true },
      { name: "TypeScript", isMatch: true },
      { name: "CSS", isMatch: true }
    ],
    appliedAgo: "2 weeks ago",
    experience: "5-10years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$100,000-$120,000",
    language: ["English"]
  },
  {
    name: "Lucas Evans",
    location: "Spain",
    job: "Junior Web Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "3 weeks ago",
    experience: "under a year",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "negotiable",
    language: ["English", "Spanish"]
  },
  {
    name: "Isabella Hill",
    location: "France",
    job: "Junior Front End Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "1 month ago",
    experience: "1-3years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$51,000-$70,000",
    language: ["English", "French"]
  },
  {
    name: "Liam Parker",
    location: "Canada",
    job: "Full Stack Developer",
    skills: [
      { name: "React", isMatch: true },
      { name: "Node.js", isMatch: true },
      { name: "Express", isMatch: true },
      { name: "MongoDB", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "2 weeks ago",
    experience: "3-5years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$75,000-$90,000",
    language: ["English"]
  },
  {
    name: "Sophia Martinez",
    location: "Spain",
    job: "UI/UX Designer",
    skills: [
      { name: "Figma", isMatch: true },
      { name: "Sketch", isMatch: true },
      { name: "Adobe XD", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true }
    ],
    appliedAgo: "3 days ago",
    experience: "1-3years",
    lookingFor: ["Part Time", "Contract only"],
    salaryExpectation: "$45,000-$55,000",
    language: ["Spanish", "English"]
  },
  {
    name: "Oliver Johnson",
    location: "United States of America",
    job: "Backend Developer",
    skills: [
      { name: "Node.js", isMatch: true },
      { name: "Python", isMatch: true },
      { name: "Django", isMatch: true },
      { name: "PostgreSQL", isMatch: true },
      { name: "Docker", isMatch: true }
    ],
    appliedAgo: "1 week ago",
    experience: "5-7years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$100,000-$120,000",
    language: ["English"]
  },
  {
    name: "Emma Lee",
    location: "South Korea",
    job: "Mobile App Developer",
    skills: [
      { name: "React Native", isMatch: true },
      { name: "Flutter", isMatch: true },
      { name: "Kotlin", isMatch: true },
      { name: "Java", isMatch: true },
      { name: "Redux", isMatch: true }
    ],
    appliedAgo: "2 months ago",
    experience: "3-5years",
    lookingFor: ["Contract only"],
    salaryExpectation: "$60,000-$80,000",
    language: ["Korean", "English"]
  },
  {
    name: "Noah Williams",
    location: "Germany",
    job: "DevOps Engineer",
    skills: [
      { name: "AWS", isMatch: true },
      { name: "Terraform", isMatch: true },
      { name: "Docker", isMatch: true },
      { name: "Kubernetes", isMatch: true },
      { name: "Jenkins", isMatch: true }
    ],
    appliedAgo: "5 days ago",
    experience: "5-7years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "$85,000-$100,000",
    language: ["German", "English"]
  }
];

export const others: Match[] = [
  {
    name: "Lily Thompson",
    location: "United States of America",
    job: "Full Stack Developer",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "GraphQL", isMatch: true },
      { name: "MongoDB", isMatch: true },
      { name: "TypeScript", isMatch: true }
    ],
    appliedAgo: "2 days ago",
    experience: "5-10 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$100,000-$120,000",
    language: ["English"]
  },
  {
    name: "Jack Baker",
    location: "United States of America",
    job: "Backend Developer",
    skills: [
      { name: "Express", isMatch: true },
      { name: "MongoDB", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "Docker", isMatch: true },
      { name: "REST API", isMatch: true }
    ],
    appliedAgo: "5 days ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"]
  },
  {
    name: "Emma Johnson",
    location: "Ireland",
    job: "Software Engineer",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "GraphQL", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "MySQL", isMatch: true }
    ],
    appliedAgo: "1 week ago",
    experience: "3-5 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"]
  },
  {
    name: "Noah Lee",
    location: "South Korea",
    job: "Frontend Engineer",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "TypeScript", isMatch: true }
    ],
    appliedAgo: "2 weeks ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$71,000-$100,000",
    language: ["English"]
  },
  {
    name: "Amelia Roberts",
    location: "Japan",
    job: "Junior Software Developer",
    skills: [
      { name: "JavaScript", isMatch: true },
      { name: "React", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "3 weeks ago",
    experience: "1-3 years",
    lookingFor: ["Full Time", "Part Time"],
    salaryExpectation: "Negotiable",
    language: ["English"]
  },
  {
    name: "Amelia Brown",
    location: "Australia",
    job: "Data Analyst",
    skills: [
      { name: "Python", isMatch: true },
      { name: "SQL", isMatch: true },
      { name: "Tableau", isMatch: true },
      { name: "Excel", isMatch: true },
      { name: "Git", isMatch: true }
    ],
    appliedAgo: "4 days ago",
    experience: "1-3 years",
    lookingFor: ["Full Time", "Contract only"],
    salaryExpectation: "$50,000-$65,000",
    language: ["English"]
  },
  {
    name: "Lucas Nguyen",
    location: "Vietnam",
    job: "Front End Developer",
    skills: [
      { name: "Vue.js", isMatch: true },
      { name: "JavaScript", isMatch: true },
      { name: "CSS", isMatch: true },
      { name: "HTML", isMatch: true },
      { name: "TypeScript", isMatch: true }
    ],
    appliedAgo: "3 weeks ago",
    experience: "3-5 years",
    lookingFor: ["Part Time", "Part Time"],
    salaryExpectation: "$40,000-$55,000",
    language: ["Vietnamese", "English"]
  },
  {
    name: "Mia Patel",
    location: "India",
    job: "Cloud Engineer",
    skills: [
      { name: "AWS", isMatch: true },
      { name: "Docker", isMatch: true },
      { name: "Kubernetes", isMatch: true },
      { name: "Terraform", isMatch: true },
      { name: "Linux", isMatch: true }
    ],
    appliedAgo: "1 month ago",
    experience: "5-7 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$70,000-$85,000",
    language: ["English", "Hindi"]
  },
  {
    name: "Ethan Kim",
    location: "United States of America",
    job: "Machine Learning Engineer",
    skills: [
      { name: "Python", isMatch: true },
      { name: "TensorFlow", isMatch: true },
      { name: "PyTorch", isMatch: true },
      { name: "Scikit-learn", isMatch: true },
      { name: "SQL", isMatch: true }
    ],
    appliedAgo: "2 months ago",
    experience: "3-5 years",
    lookingFor: ["Full Time"],
    salaryExpectation: "$110,000-$130,000",
    language: ["English", "Korean"]
  },
  {
    name: "Ava Davies",
    location: "United Kingdom",
    job: "Cybersecurity Specialist",
    skills: [
      { name: "Penetration Testing", isMatch: true },
      { name: "Network Security", isMatch: true },
      { name: "Ethical Hacking", isMatch: true },
      { name: "Linux", isMatch: true },
      { name: "Python", isMatch: true }
    ],
    appliedAgo: "2 weeks ago",
    experience: "5-7 years",
    lookingFor: ["Contract only"],
    salaryExpectation: "$90,000-$110,000",
    language: ["English"]
  }
];
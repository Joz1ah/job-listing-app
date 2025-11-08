// mockData/perfect-match-data.ts

// Employer Match type (for applicants)
export interface EmployerMatch {
    id: number;
    firstName: string;
    lastName: string;
    country?: string;
    posted: string;
    location?: string;
    coreSkills: string[];
    experience: string;
    lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
    salaryExpectation: string;
    language: string[];
    isNew?: boolean;
}

// Job Hunter Match type (for job listings)
export interface JobMatch {
    employerId: number;
    position: string;
    company: string;
    country?: string;
    location?: string;
    coreSkills: string[];
    posted: string;
    experience: string;
    lookingFor: ("Full Time" | "Part Time" | "Contract only")[];
    salaryExpectation: string;
    isNew?: boolean;
}

// Sample data for employer view (applicants)
export const employerMatches: EmployerMatch[] = [
    {
        id: 1,
        firstName: "Olivia",
        lastName: "Davis",
        location: "Philippines",
        coreSkills: ["React", "JavaScript", "HTML", "CSS", "Bootstrap"],
        posted: "1 hour",
        experience: "under a year",
        lookingFor: ["Full Time", "Part Time"],
        salaryExpectation: "$51,000-$70,000",
        language: ["English"],
        isNew: true
    },
    {
        id: 2,
        firstName: "Mason",
        lastName: "Green",
        location: "Canada",
        coreSkills: ["React", "JavaScript", "CSS", "HTML", "TypeScript"],
        posted: "1 hour",
        experience: "3 - 5 years",
        lookingFor: ["Full Time", "Contract only"],
        salaryExpectation: "$71,000-$100,000",
        language: ["English", "French"],
        isNew: true
    },
    {
        id: 3,
        firstName: "Emma",
        lastName: "Lopez",
        location: "United States",
        coreSkills: ["Python", "Django", "APIs", "SQL"],
        posted: "2 hours",
        experience: "1 - 3 years",
        lookingFor: ["Part Time", "Contract only"],
        salaryExpectation: "$41,000-$60,000",
        language: ["English", "Spanish"],
        isNew: false
    },
    {
        id: 4,
        firstName: "Liam",
        lastName: "Brown",
        location: "Australia",
        coreSkills: ["Java", "Spring Boot", "Kubernetes", "Microservices"],
        posted: "3 hours",
        experience: "5+ years",
        lookingFor: ["Full Time"],
        salaryExpectation: "$101,000-$130,000",
        language: ["English"],
        isNew: true
    },
    {
        id: 5,
        firstName: "Sophia",
        lastName: "Martinez",
        location: "United Kingdom",
        coreSkills: ["Node.js", "React", "TypeScript", "GraphQL"],
        posted: "30 minutes",
        experience: "3 - 5 years",
        lookingFor: ["Full Time", "Part Time"],
        salaryExpectation: "$81,000-$100,000",
        language: ["English"],
        isNew: false
    }
];

// Sample data for job hunter view (job listings)
export const jobMatches: JobMatch[] = [
    {
        employerId: 1,
        position: "Software Engineer",
        company: "Fintech Solutions Ltd",
        location: "Philippines",
        coreSkills: ["React", "JavaScript", "CSS", "HTML", "Git"],
        posted: "1 hour",
        experience: "under a year",
        lookingFor: ["Full Time", "Part Time"],
        salaryExpectation: "$51,000-$70,000",
        isNew: true
    },
    {
        employerId: 2,
        position: "Senior Frontend Engineer",
        company: "TechStack Inc",
        location: "Canada",
        coreSkills: ["Quality Assurance", "JavaScript", "Machine Learning", "Product Management", "TypeScript"],
        posted: "1 hour",
        experience: "3 - 5 years",
        lookingFor: ["Full Time", "Contract only"],
        salaryExpectation: "$71,000-$100,000",
        isNew: true
    },
    {
        employerId: 3,
        position: "Backend Developer",
        company: "DataFlow Systems",
        location: "United States",
        coreSkills: ["Python", "Flask", "SQL", "AWS", "Docker"],
        posted: "2 hours",
        experience: "1 - 3 years",
        lookingFor: ["Full Time"],
        salaryExpectation: "$61,000-$80,000",
        isNew: false
    },
    {
        employerId: 4,
        position: "Java Developer",
        company: "Code Solutions AU",
        location: "Australia",
        coreSkills: ["Java", "Spring Boot", "Kubernetes", "Microservices", "Agile"],
        posted: "3 hours",
        experience: "5+ years",
        lookingFor: ["Full Time"],
        salaryExpectation: "$101,000-$130,000",
        isNew: true
    },
    {
        employerId: 5,
        position: "Full Stack Developer",
        company: "Tech Innovators UK",
        location: "United Kingdom",
        coreSkills: ["React", "Node.js", "TypeScript", "GraphQL", "MongoDB"],
        posted: "30 minutes",
        experience: "3 - 5 years",
        lookingFor: ["Full Time", "Part Time"],
        salaryExpectation: "$81,000-$100,000",
        isNew: false
    }
];

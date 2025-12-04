// server.js (Node.js/Express Backend API)

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// --- MIDDLEWARE ---
// Use body-parser to parse JSON bodies from incoming requests
app.use(bodyParser.json());

// Enable CORS: Allows your index.html (running on the browser) to talk to the Node.js server
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all domains
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// --- DUMMY DATA STORE (In a real app, this would connect to a database like MongoDB) ---
const candidateDatabase = [
    {
        name: "Alexander Reed",
        title: "Principal Full Stack Architect",
        skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "Kubernetes", "Microservices", "PostgreSQL", "GraphQL", "CI/CD", "Serverless"],
        experience: "9 years",
        location: "Remote (New York, NY)",
        summary: "Principal Engineer specializing in architecting and scaling enterprise-level applications. Led digital transformation at a Series D startup, focusing on performance, security, and developer efficiency. **Proven leadership in remote, high-growth startup environments.**",
        email: "alexander.reed@email.com",
        phone: "+1 (555) 111-2222",
        linkedin: "linkedin.com/in/alexanderreed",
        education: "MS Computer Science - MIT",
        projects: [
            "Led the transition of a monolithic application to a **Microservices Architecture** on Kubernetes, resulting in a 40% cost reduction and 75% faster deployment cycle.",
            "Developed a real-time data streaming pipeline using Kafka and Node.js, supporting 2M active users daily.",
            "Mentored a team of 8 senior and mid-level engineers, fostering a strong culture of code quality and technical ownership."
        ],
        certifications: ["AWS Certified Solutions Architect - Professional", "Certified Kubernetes Administrator (CKA)"],
        availability: "Negotiable (4-6 weeks notice)",
        expectedSalary: "$160K - $190K"
    },
    {
        name: "Sarah Chen",
        title: "Senior Full Stack Developer",
        skills: ["React", "Node.js", "MongoDB", "TypeScript", "AWS", "Docker", "RESTful APIs", "Agile"],
        experience: "5 years",
        location: "San Francisco, CA",
        summary: "Passionate developer with startup experience, led teams of 4 developers. Focused on clean code and user-centric design.",
        email: "sarah.chen@email.com",
        phone: "+1 (555) 123-4567",
        linkedin: "linkedin.com/in/sarahchen",
        education: "BS Computer Science - Stanford University",
        projects: [
            "Led development of e-commerce platform serving 100K users.",
            "Built microservices architecture reducing load time by 60%.",
            "Mentored 5 junior developers in modern React practices."
        ],
        certifications: ["AWS Certified Developer", "MongoDB Professional"],
        availability: "Available immediately",
        expectedSalary: "$120K - $150K"
    },
    {
        name: "Rajesh Kumar",
        title: "Full Stack Engineer",
        skills: ["React", "Express", "PostgreSQL", "JavaScript", "Git", "RESTful APIs", "Webpack"],
        experience: "3 years",
        location: "Bangalore, India",
        summary: "Fast learner who thrives in agile environments, contributed to 10+ projects.",
        email: "rajesh.kumar@email.com",
        phone: "+91 98765 43210",
        linkedin: "linkedin.com/in/rajeshkumar",
        education: "B.Tech Computer Engineering - IIT Delhi",
        projects: [
            "Developed real-time chat application with 50K concurrent users.",
            "Optimized database queries reducing response time by 40%.",
            "Implemented CI/CD pipeline for faster deployments."
        ],
        certifications: ["JavaScript Advanced Certification"],
        availability: "2 weeks notice",
        expectedSalary: "$60K - $80K"
    },
    {
        name: "Emily Johnson",
        title: "Software Developer",
        skills: ["Vue.js", "Node.js", "MySQL", "Python", "REST APIs", "AWS"],
        experience: "4 years",
        location: "Austin, TX",
        summary: "Full stack developer with strong problem-solving skills and database expertise.",
        email: "emily.j@email.com",
        phone: "+1 (555) 987-6543",
        linkedin: "linkedin.com/in/emilyjohnson",
        education: "MS Software Engineering - University of Texas",
        projects: [
            "Created data visualization dashboard used by 200+ analysts.",
            "Built RESTful APIs handling 1M requests daily.",
            "Redesigned database schema improving performance by 35%."
        ],
        certifications: ["Python Data Science Certification"],
        availability: "Available immediately",
        expectedSalary: "$95K - $120K"
    },
    {
        name: "Michael Park",
        title: "Backend Developer",
        skills: ["Node.js", "Express", "MongoDB", "Redis", "Microservices", "Docker", "Kubernetes", "System Design"],
        experience: "6 years",
        location: "Seattle, WA",
        summary: "Specialized in scalable backend systems and API design. Experience with high-traffic applications.",
        email: "michael.park@email.com",
        phone: "+1 (555) 456-7890",
        linkedin: "linkedin.com/in/michaelpark",
        education: "BS Computer Science - University of Washington",
        projects: [
            "Architected microservices for 5M user platform.",
            "Reduced API response time from 500ms to 50ms.",
            "Implemented Redis caching strategy saving $50K/year."
        ],
        certifications: ["Certified Kubernetes Administrator", "System Design Expert"],
        availability: "1 month notice",
        expectedSalary: "$130K - $160K"
    }
];

// --- BACKEND LOGIC FUNCTIONS (Moved from script.js) ---

function extractSkills(text) {
    const commonSkills = [
        'React', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Java', 'Go',
        'MongoDB', 'PostgreSQL', 'MySQL', 'DynamoDB', 'Redis',
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform',
        'Vue.js', 'Angular', 'Express', 'Redux', 'RESTful APIs', 'GraphQL',
        'Microservices', 'System Design', 'Agile', 'Serverless', 'Webpack', 'Kafka'
    ];
    
    const found = [];
    const lowerText = text.toLowerCase();
    
    commonSkills.forEach(skill => {
        if (lowerText.includes(skill.toLowerCase())) {
            found.push(skill);
        }
    });
    
    return found.length > 0 ? found : ['Full Stack Development', 'Cloud Computing', 'Problem Solving'];
}

function extractContext(text) {
    const lowerText = text.toLowerCase();
    let context = [];
    
    if (lowerText.includes('senior') || lowerText.includes('lead') || lowerText.includes('architect') || lowerText.includes('principal') || lowerText.includes('7+ years')) {
        context.push('Senior Leadership Role');
    }
    if (lowerText.includes('startup') || lowerText.includes('fast-paced') || lowerText.includes('high-growth')) {
        context.push('Startup / High-Growth Environment');
    }
    if (lowerText.includes('remote') || lowerText.includes('distributed')) {
        context.push('Remote-First Work');
    }
    if (lowerText.includes('microservices') || lowerText.includes('scale') || lowerText.includes('high-availability')) {
        context.push('Scalability & Architecture Focus');
    }
    
    return context.length > 0 ? context : ['Professional Environment'];
}

function rankCandidates(jobDescription, extractedSkills, jobContext) {
    const BASE_SCORE = 10;
    
    return candidateDatabase.map(candidate => {
        let score = BASE_SCORE;
        let matchedSkills = [];
        let scoreBreakdown = {
            skillMatch: 0,
            experienceMatch: 0,
            contextMatch: 0,
            projectRelevance: 0
        };
        
        // 1. Calculate Skill Match (Max: 50 points)
        extractedSkills.forEach(reqSkill => {
            const isCriticalSkill = ['Kubernetes', 'Microservices', 'GraphQL', 'CI/CD', 'System Design'].includes(reqSkill);
            const skillWeight = isCriticalSkill ? 6 : 4; 

            candidate.skills.forEach(candSkill => {
                if (candSkill.toLowerCase() === reqSkill.toLowerCase()) {
                    scoreBreakdown.skillMatch += skillWeight;
                    if (!matchedSkills.includes(candSkill)) {
                        matchedSkills.push(candSkill);
                    }
                }
            });
        });
        scoreBreakdown.skillMatch = Math.min(scoreBreakdown.skillMatch, 50);

        // 2. Experience Match (Max: 20 points)
        const yearsMatch = candidate.experience.match(/(\d+)/);
        const yearsRequired = jobContext.includes('Senior Leadership Role') ? 7 : 5; 

        if (yearsMatch) {
            const years = parseInt(yearsMatch[0]);
            if (years >= yearsRequired + 2) scoreBreakdown.experienceMatch = 20;
            else if (years >= yearsRequired) scoreBreakdown.experienceMatch = 17;
            else if (years >= 5) scoreBreakdown.experienceMatch = 10;
            else if (years >= 3) scoreBreakdown.experienceMatch = 5;
            else scoreBreakdown.experienceMatch = 2;
        }

        // 3. Context Match (Max: 10 points)
        jobContext.forEach(ctx => {
            if (ctx === 'Startup / High-Growth Environment' && 
                candidate.summary.toLowerCase().includes('startup')) {
                scoreBreakdown.contextMatch += 4;
            }
            if (ctx === 'Senior Leadership Role' && 
                (candidate.title.toLowerCase().includes('senior') || candidate.title.toLowerCase().includes('principal') || candidate.title.toLowerCase().includes('architect'))) {
                scoreBreakdown.contextMatch += 4;
            }
            if (ctx === 'Scalability & Architecture Focus' &&
                (candidate.summary.toLowerCase().includes('architect') || candidate.projects.join(' ').toLowerCase().includes('microservices'))) {
                scoreBreakdown.contextMatch += 4;
            }
        });
        scoreBreakdown.contextMatch = Math.min(scoreBreakdown.contextMatch, 10);
        
        // 4. Project Relevance & Certs (Max: 10 points)
        scoreBreakdown.projectRelevance = Math.min((candidate.projects.length * 2) + (candidate.certifications.length * 1), 10);
        
        score = BASE_SCORE + scoreBreakdown.skillMatch + scoreBreakdown.experienceMatch + 
                scoreBreakdown.contextMatch + scoreBreakdown.projectRelevance;
        
        return {
            ...candidate,
            score: Math.min(Math.round(score), 100),
            matchedSkills,
            scoreBreakdown
        };
    }).sort((a, b) => b.score - a.score);
}


// --- API ROUTES ---

// Endpoint for job description analysis
app.post('/api/analyze', (req, res) => {
    // Simulate a network delay for a more realistic feel
    setTimeout(() => {
        const jobDescription = req.body.jobDescription;
        
        // Run the logic moved from the frontend
        const extractedSkills = extractSkills(jobDescription);
        const jobContext = extractContext(jobDescription);

        res.json({
            success: true,
            extractedSkills: extractedSkills,
            jobContext: jobContext
        });
    }, 1500); 
});

// Endpoint for candidate matching
app.post('/api/match', (req, res) => {
    // Simulate a network delay for a more realistic feel
    setTimeout(() => {
        const { jobDescription, extractedSkills, jobContext } = req.body;
        
        // Run the secure, complex ranking logic
        const matchedCandidates = rankCandidates(jobDescription, extractedSkills, jobContext);

        res.json({
            success: true,
            candidates: matchedCandidates
        });
    }, 2000); 
});


// --- SERVER START ---
app.listen(port, () => {
    console.log(`✅ Backend API is running on http://localhost:${port}`);
    console.log(`🚀 Open index.html in your browser and connect to the API.`);
});
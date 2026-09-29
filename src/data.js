// Portfolio profile, experience, projects, and skills.
export const profile = {
  name: "Mohammed Shaheem Abdul Salam",
  shortName: "Mohammed Shaheem",
  role: "AI & Machine Learning Engineer",
  email: "ashaheem32@gmail.com",
  github: "https://github.com/ashaheem32",
  linkedin: "https://www.linkedin.com/in/shaheem32",
  resume: `${process.env.PUBLIC_URL}/assets/Mohammed_Shaheem_CV.pdf`,
  portrait: `${process.env.PUBLIC_URL}/assets/shaheem.png`,
};

// Experience aligned with LinkedIn and the supplied UAE résumé.
export const experience = [
  {
    id: "atyuttama",
    company: "Atyuttama Enterprises LLP",
    role: "AI Engineer",
    employmentType: "Full-time",
    location: "Hyderabad, Telangana, India · Hybrid",
    startDate: "2025-08",
    startLabel: "Aug 2025",
    endDate: "2026-09",
    endLabel: "Sep 2026",
    icon: "code",
    headline: "AI engineering with Python, RAG, and NLP.",
    highlights: [
      "Contributed to AI engineering projects using Python, retrieval-augmented generation (RAG), and natural language processing (NLP).",
      "Collaborated with colleagues to understand requirements, solve technical problems, and adapt to changing tools and project needs.",
    ],
    skills: [
      "Python",
      "Artificial Intelligence",
      "Retrieval-Augmented Generation",
      "Natural Language Processing",
    ],
  },
  {
    id: "outlier",
    company: "Outlier",
    role: "AI Trainer | LLM Evaluation & RLHF",
    employmentType: "Freelance",
    location: "Remote",
    startDate: "2024-08",
    startLabel: "Aug 2024",
    endDate: "2025-12",
    endLabel: "Dec 2025",
    icon: "spark",
    headline: "Turning human insight into stronger model performance.",
    highlights: [
      "Completed 1,000+ LLM evaluation and reinforcement learning from human feedback (RLHF) tasks across code generation, reasoning, and prompt optimization.",
      "Reviewed Python and backend engineering outputs for correctness, groundedness, and code quality using structured evaluation criteria.",
      "Maintained consistent 4–5 star quality ratings across AI and software engineering evaluation projects.",
    ],
    stats: [
      { value: "1,000", suffix: "+", label: "LLM evaluation & RLHF tasks" },
      { value: "4–5", suffix: "★", label: "Consistent quality ratings" },
    ],
  },
];

export const featuredProjects = [
  {
    title: "Nearme AI",
    description:
      "AI-driven local search and recommendation system to help users discover nearby places",
    technologies: ["JavaScript"],
    github: "https://github.com/ashaheem32/Nearme_Ai.git",
    live: "https://www.nearmeai.app/",
    image: "nearmeai.png",
    category: "AI · Local discovery",
    theme: "nearby",
    imageAlt: "Nearme AI local discovery concept with a map and nearby places",
  },
  {
    title: "Chat Seeker",
    description:
      "AI-powered chat analysis dashboard that turns any chat export into deep insights on emotion, vocabulary, conflicts, love languages, and overall communication health.",
    technologies: ["Next.js", "FastAPI", "Claude AI", "pgvector"],
    github: "https://github.com/ashaheem32/Chat_seeker.git",
    image: "chatseeker.png",
    category: "AI · Communication insights",
    theme: "chat",
    imageAlt:
      "Chat Seeker dashboard showing sentiment, emotional balance, and communication insights",
  },
  {
    title: "JurisGPT",
    description:
      "A retrieval-augmented legal research assistant that answers questions on Indian startup and corporate law with citations grounded in the actual statutes and case law it retrieves.",
    technologies: ["Next.js", "FastAPI", "ChromaDB", "RAG"],
    github: "https://github.com/Bruhadev45/Juris-GPT.git",
    image: "jurisgpt.svg",
    category: "Legal tech · RAG",
    theme: "legal",
    imageAlt:
      "JurisGPT illustration of the scales of justice connected to cited legal sources",
  },
];

export const otherProjects = [
  {
    title: "Lead Pilot",
    description:
      "LeadPilot AI is an AI-powered platform that automates B2B lead generation, enrichment, and outreach using a multi-agent system.",
    technologies: ["React", "RAG", "Multi-Agent System"],
    github: "https://github.com/ashaheem32/Lead_Pilot_AI.git",
    live: "https://lead-pilot-jet.vercel.app/",
    category: "AI automation",
  },
  {
    title: "Maternity Weight Prediction",
    description:
      "Predicting newborn weight using maternal and pregnancy features through data analysis and machine learning.",
    technologies: ["Python", "Machine Learning"],
    github: "https://github.com/ashaheem32/Maternity-Weight-Prediction.git",
    category: "Machine learning",
  },
  {
    title: "AI-Based Credit Card Application Approval System",
    description:
      "To develop a predictive model that automates credit card approval using machine learning techniques.",
    technologies: ["Python", "Machine Learning"],
    github:
      "https://github.com/ashaheem32/AI-Based-Credit-Card-Application-Approval-System.git",
    category: "Predictive modeling",
  },
  {
    title: "Utley Architecture",
    description:
      "A boutique architecture firm specializing in residential and commercial design.",
    technologies: ["Astro", "React", "Tailwind CSS"],
    github: "https://github.com/ashaheem32/Utley-Architecture.git",
    live: "https://utley-architecture.vercel.app",
    category: "Web development",
  },
  {
    title: "AI-Based Hand Gesture Mouse Control Using Computer Vision",
    description:
      "Developed a real-time AI system using MediaPipe and OpenCV to control the mouse with hand gestures.",
    technologies: ["Python", "OpenCV", "MediaPipe"],
    github:
      "https://github.com/ashaheem32/AI-Based-Hand-Gesture-Mouse-Control-Using-Computer-Vision.git",
    category: "Computer vision",
  },
  {
    title: "Store Intelligence",
    description:
      "Real-time retail store intelligence system — an end-to-end pipeline from raw CCTV footage to a live analytics API. Detects visitors, tracks movement, computes conversion rates, and alerts on operational anomalies in real time.",
    technologies: ["Python", "YOLOv8", "ByteTrack", "FastAPI"],
    github: "https://github.com/ashaheem32/Store_Intelligence.git",
    category: "Computer vision",
  },
];

export const expertise = [
  {
    title: "LLMs & intelligent systems",
    description:
      "LLM evaluation, prompt optimization, and model behavior analysis. Building retrieval-augmented applications and multi-agent systems, with hands-on experience in Reinforcement Learning with Human Feedback (RLHF).",
    tools: [
      "RAG",
      "LangChain",
      "OpenAI API",
      "Claude AI",
      "ChromaDB",
      "pgvector",
    ],
  },
  {
    title: "Machine learning & data",
    description:
      "Data-driven systems, algorithm design, and predictive modeling — from maternal health analysis to automated credit card application assessment.",
    tools: ["Python", "SQL", "MySQL", "TensorFlow", "Scikit-learn"],
  },
  {
    title: "Computer vision",
    description:
      "Real-time visual systems for gesture recognition, visitor detection, movement tracking, and retail analytics.",
    tools: ["OpenCV", "MediaPipe", "YOLOv8", "ByteTrack"],
  },
  {
    title: "Full-stack development",
    description:
      "Bringing AI applications to life through interactive dashboards, responsive websites, and application APIs.",
    tools: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "FastAPI",
      "Astro",
      "Tailwind CSS",
    ],
  },
];

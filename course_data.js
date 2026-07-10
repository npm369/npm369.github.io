const lessonSet = (chapter, count = 5) => [
  `${chapter}: Concept Map`,
  `${chapter}: Core Theory`,
  `${chapter}: NCERT / Source Examples`,
  `${chapter}: Practice Problems`,
  `${chapter}: Revision & PYQs`,
  `${chapter}: Advanced Application`,
  `${chapter}: Test Strategy`,
  `${chapter}: Doubt Clinic`
].slice(0, count);

const subject = (icon, chapters, count = 5) => ({
  icon,
  chapters: Object.fromEntries(chapters.map(chapter => [chapter, lessonSet(chapter, count)]))
});

const course = (title, description, style, subjects, extra = {}) => ({
  title,
  description,
  badges: extra.badges || ["🎥 Chapter-wise Videos", "📝 Tests", "📱 Responsive Layout"],
  style,
  subjects,
  mockTitle: extra.mockTitle || `${title} Mock Tests`,
  finalTitle: extra.finalTitle || `${title} Final Test`
});

const cbseCommon = {
  English: subject("📖", ["Reading Comprehension", "Grammar Essentials", "Vocabulary Builder", "Writing Skills", "Literature Reader"]),
  Hindi: subject("📝", ["अपठित गद्यांश", "व्याकरण", "कहानी", "कविता", "रचनात्मक लेखन"]),
  "Computer/IT": subject("💻", ["Computer Basics", "Digital Citizenship", "Scratch / Block Coding", "Office Tools", "Internet Safety"]),
  "General Knowledge": subject("🌐", ["India & The World", "Science Around Us", "Sports & Culture", "Current Awareness", "Life Skills"])
};

const cbseClass = (level, colors) => course(
  `CBSE Class ${level}`,
  `A complete Class ${level} learning path with age-appropriate explanations, chapter videos, practice tests, mock tests, and a final readiness test.`,
  colors,
  {
    Mathematics: subject("🔢", level <= 2 ? ["Numbers", "Addition", "Subtraction", "Shapes", "Measurement", "Time & Money", "Patterns"] : level <= 5 ? ["Large Numbers", "Operations", "Fractions", "Decimals", "Geometry", "Measurement", "Data Handling", "Patterns"] : ["Integers", "Fractions & Decimals", "Algebra", "Geometry", "Mensuration", "Data Handling", "Ratio & Proportion", "Practical Mathematics"]),
    [level <= 5 ? "EVS" : "Science"]: subject("🔬", level <= 5 ? ["My Family", "Plants Around Us", "Animals Around Us", "Food & Health", "Water", "Shelter", "Travel & Communication", "Our Earth"] : ["Food", "Materials", "Living World", "Motion & Measurement", "Electricity", "Light", "Natural Resources", "Environment"]),
    "Social Studies": subject("🗺️", level <= 5 ? ["My Neighbourhood", "Festivals", "Our Helpers", "Transport", "Our Country"] : ["History", "Geography", "Civics", "Economics Basics", "Map Skills"]),
    ...cbseCommon
  },
  { badges: ["🎒 CBSE Foundation", "📘 Chapter Tests", "🎯 Skill Practice"], finalTitle: `Class ${level} Final Assessment` }
);

window.COURSE_PAGES = {
  class1: cbseClass(1, { gradient: "linear-gradient(135deg,#0f766e,#2563eb 60%,#f59e0b)", accent: "#14b8a6", accent2: "#2563eb", accent3: "#f59e0b" }),
  class2: cbseClass(2, { gradient: "linear-gradient(135deg,#7c2d12,#db2777 60%,#06b6d4)", accent: "#f97316", accent2: "#db2777", accent3: "#06b6d4" }),
  class3: cbseClass(3, { gradient: "linear-gradient(135deg,#365314,#ca8a04 60%,#ef4444)", accent: "#84cc16", accent2: "#ca8a04", accent3: "#ef4444" }),
  class4: cbseClass(4, { gradient: "linear-gradient(135deg,#1d4ed8,#9333ea 60%,#22c55e)", accent: "#2563eb", accent2: "#9333ea", accent3: "#22c55e" }),
  class5: cbseClass(5, { gradient: "linear-gradient(135deg,#6d28d9,#0891b2 60%,#f97316)", accent: "#8b5cf6", accent2: "#0891b2", accent3: "#f97316" }),
  class6: cbseClass(6, { gradient: "linear-gradient(135deg,#be123c,#ea580c 60%,#2563eb)", accent: "#e11d48", accent2: "#ea580c", accent3: "#2563eb" }),
  class7: cbseClass(7, { gradient: "linear-gradient(135deg,#0369a1,#16a34a 60%,#f59e0b)", accent: "#0284c7", accent2: "#16a34a", accent3: "#f59e0b" }),
  class8: cbseClass(8, { gradient: "linear-gradient(135deg,#047857,#7c3aed 60%,#14b8a6)", accent: "#059669", accent2: "#7c3aed", accent3: "#14b8a6" }),

  class9: course("CBSE Class 9", "Complete CBSE Class 9 coverage for Mathematics, Science, English, Hindi, Social Science, and IT with structured videos and tests.", { gradient: "linear-gradient(135deg,#0f172a,#2563eb 58%,#f97316)", accent: "#2563eb", accent2: "#f97316", accent3: "#22d3ee" }, {
    Mathematics: subject("📐", ["Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid Geometry", "Lines and Angles", "Triangles", "Quadrilaterals", "Circles", "Heron Formula", "Surface Areas and Volumes", "Statistics"], 6),
    Science: subject("🔬", ["Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of the Atom", "The Fundamental Unit of Life", "Tissues", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", "Improvement in Food Resources"], 6),
    English: subject("📖", ["Beehive Prose", "Beehive Poems", "Moments Supplementary Reader", "Grammar", "Writing Skills", "Reading Comprehension"]),
    Hindi: subject("✍️", ["क्षितिज गद्य", "क्षितिज काव्य", "कृतिका", "व्याकरण", "लेखन कौशल"]),
    "Social Science": subject("🌍", ["The French Revolution", "Socialism in Europe", "Nazism and the Rise of Hitler", "India Size and Location", "Physical Features of India", "Drainage", "Climate", "Democratic Politics", "Constitutional Design", "Electoral Politics", "Economics: The Story of Village Palampur", "Poverty as a Challenge"]),
    IT: subject("💻", ["Communication Skills", "Self Management Skills", "ICT Skills", "Entrepreneurial Skills", "Green Skills", "Digital Documentation", "Electronic Spreadsheet", "Database Management"])
  }, { badges: ["📚 CBSE Chapters", "🧪 Practice Tests", "🏆 Final Revision"], finalTitle: "Class 9 Final Mastery Test" }),

  class10: course("Class 10 Board Course", "Board-focused Class 10 preparation with complete CBSE chapters, chapter videos, tests, mock papers, and final revision.", { gradient: "linear-gradient(135deg,#1e3a8a,#5b21b6 60%,#0891b2)", accent: "#2563eb", accent2: "#7c3aed", accent3: "#06b6d4" }, {
    Mathematics: subject("📐", ["Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Applications of Trigonometry", "Circles", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"], 6),
    Science: subject("🔬", ["Chemical Reactions and Equations", "Acids Bases and Salts", "Metals and Non-metals", "Carbon and Its Compounds", "Life Processes", "Control and Coordination", "How do Organisms Reproduce", "Heredity", "Light Reflection and Refraction", "Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"], 6),
    "Social Science": subject("🌍", ["Nationalism in Europe", "Nationalism in India", "Making of a Global World", "Print Culture", "Resources and Development", "Forest and Wildlife Resources", "Water Resources", "Agriculture", "Minerals and Energy Resources", "Manufacturing Industries", "Lifelines of National Economy", "Power Sharing", "Federalism", "Gender Religion and Caste", "Political Parties", "Outcomes of Democracy", "Development", "Sectors of Indian Economy", "Money and Credit", "Globalisation and the Indian Economy"]),
    English: subject("📖", ["First Flight Prose", "First Flight Poems", "Footprints Without Feet", "Grammar", "Writing Skills", "Reading Skills"]),
    Hindi: subject("📝", ["क्षितिज गद्य", "क्षितिज काव्य", "कृतिका", "व्याकरण", "लेखन कौशल"]),
    IT: subject("💻", ["Digital Documentation Advanced", "Electronic Spreadsheet Advanced", "Database Management", "Web Applications", "Cyber Safety"])
  }, { finalTitle: "Class 10 Board Final Test" }),

  class11: course("CBSE Class 11", "Choose your Class 11 CBSE stream once, then study the complete NCERT-aligned subject set for Science, Commerce, or Humanities.", { gradient: "linear-gradient(135deg,#064e3b,#2563eb 55%,#a855f7)", accent: "#10b981", accent2: "#2563eb", accent3: "#a855f7" }, {
    Physics: subject("⚛️", ["Units and Measurements", "Motion in a Straight Line", "Motion in a Plane", "Laws of Motion", "Work Energy and Power", "System of Particles and Rotational Motion", "Gravitation", "Mechanical Properties of Solids", "Mechanical Properties of Fluids", "Thermal Properties of Matter", "Thermodynamics", "Kinetic Theory", "Oscillations", "Waves"], 6),
    Chemistry: subject("🧪", ["Some Basic Concepts of Chemistry", "Structure of Atom", "Classification of Elements", "Chemical Bonding and Molecular Structure", "Chemical Thermodynamics", "Equilibrium", "Redox Reactions", "Organic Chemistry Basic Principles", "Hydrocarbons"], 6),
    Mathematics: subject("📐", ["Sets", "Relations and Functions", "Trigonometric Functions", "Complex Numbers and Quadratic Equations", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Introduction to Three Dimensional Geometry", "Limits and Derivatives", "Statistics", "Probability"], 6),
    English: subject("📖", ["Hornbill Prose", "Hornbill Poems", "Snapshots", "Reading Comprehension", "Writing Skills", "Grammar and Note Making"]),
    "Physical Education": subject("🏃", ["Changing Trends in Physical Education", "Olympic Value Education", "Yoga", "Physical Fitness Wellness and Lifestyle", "Test Measurement and Evaluation", "Anatomy Physiology", "Psychology and Sports", "Training and Doping"]),
    "Computer Science": subject("💻", ["Computer Systems and Organisation", "Encoding Schemes", "Python Fundamentals", "Flow of Control", "Functions", "Strings", "Lists and Tuples", "Dictionaries", "Cyber Safety", "Society Law and Ethics"], 6)
  }, { badges: ["📘 NCERT Complete", "🎓 Stream Selection", "🧠 Deep Practice"], finalTitle: "Class 11 Final Test" }),

  class12: course("CBSE Class 12", "Choose your Class 12 CBSE stream once, then prepare with the complete board-focused subject set for Science, Commerce, or Humanities.", { gradient: "linear-gradient(135deg,#7f1d1d,#1d4ed8 55%,#f59e0b)", accent: "#ef4444", accent2: "#2563eb", accent3: "#f59e0b" }, {
    Physics: subject("⚡", ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"], 6),
    Chemistry: subject("🧪", ["Solutions", "Electrochemistry", "Chemical Kinetics", "d and f Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols Phenols and Ethers", "Aldehydes Ketones and Carboxylic Acids", "Amines", "Biomolecules"], 6),
    Mathematics: subject("📐", ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Application of Integrals", "Differential Equations", "Vector Algebra", "Three Dimensional Geometry", "Linear Programming", "Probability"], 6),
    English: subject("📖", ["Flamingo Prose", "Flamingo Poems", "Vistas", "Reading Comprehension", "Writing Skills", "Literary Revision"]),
    "Computer Science": subject("💻", ["Python Revision Tour", "Functions and Recursion", "Data Structures", "File Handling", "Exception Handling", "Database Concepts", "SQL Queries", "Computer Networks", "Societal Impacts"], 6),
    "Physical Education": subject("🏅", ["Management of Sporting Events", "Children and Women in Sports", "Yoga as Preventive Measure", "Physical Education and Sports for CWSN", "Sports and Nutrition", "Test and Measurement", "Physiology and Injuries", "Biomechanics and Sports", "Psychology and Sports", "Training in Sports"])
  }, { badges: ["🏆 Board Ready", "🎓 Stream Selection", "🎯 Mock Practice"], finalTitle: "Class 12 Final Test" }),

  jee: course("JEE Main Complete Course", "JEE Main preparation arranged by Physics, Chemistry, and Mathematics topic families with concept videos, PYQ practice, and full mocks.", { gradient: "linear-gradient(135deg,#111827,#dc2626 52%,#facc15)", accent: "#dc2626", accent2: "#facc15", accent3: "#38bdf8" }, {
    Physics: subject("⚛️", ["Mechanics", "Units Dimensions and Errors", "Kinematics", "Laws of Motion", "Work Power Energy", "Centre of Mass", "Rotational Motion", "Gravitation", "Properties of Matter", "SHM", "Waves", "Thermodynamics", "Kinetic Theory", "Electrostatics", "Current Electricity", "Magnetism", "EMI and AC", "Optics", "Modern Physics", "Semiconductors"], 6),
    Chemistry: subject("🧪", ["Physical Chemistry: Mole Concept", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Chemical Equilibrium", "Ionic Equilibrium", "Redox and Electrochemistry", "Chemical Kinetics", "Solutions", "Organic Chemistry: GOC", "Hydrocarbons", "Haloalkanes and Haloarenes", "Alcohols Phenols Ethers", "Carbonyl Compounds", "Amines", "Inorganic: Periodic Table", "Coordination Compounds", "p Block and d f Block", "Metallurgy"], 6),
    Mathematics: subject("📐", ["Algebra", "Sets Relations Functions", "Quadratic Equations", "Sequences and Series", "Binomial Theorem", "Matrices and Determinants", "Permutation and Combination", "Probability", "Trigonometry", "Coordinate Geometry", "Straight Lines", "Circles", "Parabola Ellipse Hyperbola", "Calculus: Limits Continuity Differentiability", "Application of Derivatives", "Indefinite and Definite Integration", "Differential Equations", "Vectors", "3D Geometry", "Mathematical Reasoning"], 6)
  }, { badges: ["⚡ JEE Main", "🧪 PYQ Practice", "📈 Rank Booster"], mockTitle: "JEE Main Mock Tests", finalTitle: "JEE Main Final Grand Test" }),

  neet: course("NEET Complete Course", "NCERT-first NEET preparation for Physics, Chemistry, Botany, and Zoology with high-yield lessons and medical entrance mocks.", { gradient: "linear-gradient(135deg,#14532d,#0f766e 55%,#84cc16)", accent: "#22c55e", accent2: "#0f766e", accent3: "#84cc16" }, {
    Physics: subject("⚛️", ["Physical World and Measurement", "Kinematics", "Laws of Motion", "Work Energy Power", "Rotational Motion", "Gravitation", "Properties of Solids and Fluids", "Thermodynamics", "Oscillations and Waves", "Electrostatics", "Current Electricity", "Magnetic Effects", "EMI and AC", "Optics", "Modern Physics", "Semiconductors"], 6),
    Chemistry: subject("🧪", ["Mole Concept", "Atomic Structure", "Chemical Bonding", "Thermodynamics", "Equilibrium", "Redox Reactions", "Solutions", "Electrochemistry", "Chemical Kinetics", "Organic Basics", "Hydrocarbons", "Haloalkanes and Haloarenes", "Alcohols Phenols Ethers", "Carbonyl Compounds", "Amines", "Biomolecules", "Periodic Table", "Coordination Compounds", "p Block", "d and f Block"], 6),
    Botany: subject("🌱", ["Plant Kingdom", "Morphology of Flowering Plants", "Anatomy of Flowering Plants", "Cell Biology", "Photosynthesis", "Respiration in Plants", "Plant Growth and Development", "Sexual Reproduction in Flowering Plants", "Genetics", "Biotechnology", "Ecology"], 6),
    Zoology: subject("🧬", ["Animal Kingdom", "Structural Organisation in Animals", "Human Physiology", "Digestion and Absorption", "Breathing and Exchange of Gases", "Body Fluids and Circulation", "Excretory Products", "Locomotion and Movement", "Neural Control", "Chemical Coordination", "Human Reproduction", "Reproductive Health", "Evolution", "Human Health and Disease"], 6)
  }, { badges: ["🩺 NEET Focus", "🌱 Botany + Zoology", "🎯 NCERT Line-by-line"], mockTitle: "NEET Full Syllabus Mock Tests", finalTitle: "NEET Final Grand Test" }),

  cuet: course("CUET Complete Preparation", "CUET preparation organized into language, domain subjects, general test, reasoning, quantitative aptitude, and exam-speed practice.", { gradient: "linear-gradient(135deg,#312e81,#7c3aed 55%,#22d3ee)", accent: "#7c3aed", accent2: "#22d3ee", accent3: "#f59e0b" }, {
    English: subject("📖", ["Reading Comprehension", "Vocabulary", "Grammar", "Verbal Ability", "Writing Accuracy"]),
    "General Test": subject("🧠", ["General Knowledge", "Current Affairs", "Numerical Ability", "Logical Reasoning", "Data Interpretation"]),
    Mathematics: subject("📐", ["Algebra", "Calculus", "Coordinate Geometry", "Probability", "Statistics"]),
    Economics: subject("💹", ["Microeconomics", "Macroeconomics", "Indian Economy", "Government Budget", "Balance of Payments"]),
    "Business Studies": subject("🏢", ["Nature of Management", "Principles of Management", "Business Environment", "Marketing", "Financial Management"]),
    Accountancy: subject("🧾", ["Partnership Accounts", "Company Accounts", "Financial Statements", "Cash Flow Statement", "Accounting Ratios"])
  }, { mockTitle: "CUET Sectional Mock Tests", finalTitle: "CUET Final Test" }),

  ca_foundation: course("CA Foundation Complete Course", "ICAI-aligned CA Foundation course covering Accounting, Business Laws, Quantitative Aptitude, Business Economics, and BCK.", { gradient: "linear-gradient(135deg,#0f172a,#0ea5e9 55%,#f97316)", accent: "#0ea5e9", accent2: "#f97316", accent3: "#22c55e" }, {
    Accounting: subject("🧾", ["Accounting Principles", "Journal Ledger and Trial Balance", "Depreciation", "Bills of Exchange", "Final Accounts", "Partnership Accounts", "Company Accounts"], 6),
    "Business Laws": subject("⚖️", ["Indian Contract Act", "Sale of Goods Act", "Partnership Act", "LLP Act", "Companies Act"], 6),
    "Quantitative Aptitude": subject("📐", ["Ratio Proportion Indices", "Equations", "Time Value of Money", "Permutations and Combinations", "Statistics", "Probability", "Logical Reasoning"], 6),
    "Business Economics": subject("💹", ["Nature and Scope of Economics", "Theory of Demand and Supply", "Production and Cost", "Price Determination", "Business Cycles"], 6),
    BCK: subject("🏢", ["Business and Commercial Knowledge", "Business Environment", "Government Policies", "Organizations Facilitating Business", "Common Business Terminology"])
  }, { mockTitle: "CA Foundation Mock Tests", finalTitle: "CA Foundation Final Test" }),

  upsc: course("UPSC Foundation Course", "A complete UPSC foundation path for Prelims and Mains with GS subjects, CSAT, ethics, current affairs, and answer-writing practice.", { gradient: "linear-gradient(135deg,#422006,#1f2937 55%,#0d9488)", accent: "#d97706", accent2: "#0d9488", accent3: "#38bdf8" }, {
    History: subject("🏺", ["Ancient India", "Medieval India", "Modern India", "World History", "Art and Culture"]),
    Geography: subject("🗺️", ["Physical Geography", "Indian Geography", "World Geography", "Human Geography", "Map Practice"]),
    Polity: subject("⚖️", ["Constitution", "Parliament", "Executive", "Judiciary", "Federalism", "Local Governance"]),
    Economics: subject("💹", ["Basic Economics", "Growth and Development", "Fiscal Policy", "Monetary Policy", "External Sector", "Budget and Survey"]),
    Environment: subject("🌿", ["Ecology", "Biodiversity", "Climate Change", "Conservation", "Environmental Acts"]),
    "Science & Technology": subject("🔭", ["Space Technology", "Biotechnology", "IT and Computers", "Defence Technology", "Health Science"]),
    "Current Affairs": subject("📰", ["National Issues", "International Relations", "Government Schemes", "Reports and Indices", "Monthly Revision"]),
    Ethics: subject("🧭", ["Ethics and Human Interface", "Attitude", "Aptitude", "Emotional Intelligence", "Case Studies"]),
    CSAT: subject("🧠", ["Comprehension", "Logical Reasoning", "Numeracy", "Data Interpretation", "Decision Making"])
  }, { mockTitle: "UPSC Prelims Mock Tests", finalTitle: "UPSC Integrated Final Test" })
};

window.COURSE_PAGES.class1_8 = course("CBSE Class 1-8 Bundle", "A complete foundation bundle for Classes 1 to 8 with class-wise learning paths, core CBSE subjects, practice tests, and final assessments.", { gradient: "linear-gradient(135deg,#155e75,#7c3aed 58%,#f97316)", accent: "#0891b2", accent2: "#7c3aed", accent3: "#f97316" }, {
  "Class 1": subject("1️⃣", ["Numbers", "Addition", "Subtraction", "Shapes", "Measurement", "EVS Basics"]),
  "Class 2": subject("2️⃣", ["Numbers", "Operations", "Time & Money", "Grammar", "Plants and Animals", "Stories"]),
  "Class 3": subject("3️⃣", ["Large Numbers", "Fractions", "EVS", "English Reader", "Hindi Reader", "Computer Basics"]),
  "Class 4": subject("4️⃣", ["Multiplication and Division", "Decimals", "Maps", "Science Around Us", "Writing Skills", "Digital Skills"]),
  "Class 5": subject("5️⃣", ["Fractions and Decimals", "Geometry", "Our Earth", "Environment", "Reading Skills", "Internet Safety"]),
  "Class 6": subject("6️⃣", ["Integers", "Basic Science", "History", "Geography", "English Grammar", "Computer Applications"]),
  "Class 7": subject("7️⃣", ["Algebra", "Light and Heat", "Civics", "Medieval History", "Writing Practice", "Digital Citizenship"]),
  "Class 8": subject("8️⃣", ["Rational Numbers", "Force and Pressure", "Modern History", "Resources", "Advanced Grammar", "Intro to Coding"])
}, { badges: ["🎒 Class-wise Bundle", "📘 CBSE Foundation", "🏆 Annual Tests"], mockTitle: "Class 1-8 Foundation Mock Tests", finalTitle: "Class 1-8 Bundle Final Test" });

window.COURSE_PAGES.class1_8.classChoices = {
  "Class 1": { icon: "1️⃣", page: "class1.html", description: "Early numeracy, English, Hindi, EVS, art, and activity-based learning." },
  "Class 2": { icon: "2️⃣", page: "class2.html", description: "Core CBSE foundations with reading, writing, numbers, EVS, and computer basics." },
  "Class 3": { icon: "3️⃣", page: "class3.html", description: "Class 3 subjects with chapter videos, practice tests, and annual revision." },
  "Class 4": { icon: "4️⃣", page: "class4.html", description: "Class 4 CBSE learning path for Mathematics, EVS, languages, and computer skills." },
  "Class 5": { icon: "5️⃣", page: "class5.html", description: "Upper-primary bridge course with complete subject tabs and assessments." },
  "Class 6": { icon: "6️⃣", page: "class6.html", description: "Middle-school Class 6 subjects with Science, Social Science, Mathematics, and languages." },
  "Class 7": { icon: "7️⃣", page: "class7.html", description: "Class 7 CBSE chapters, videos, chapter tests, subject tests, and final practice." },
  "Class 8": { icon: "8️⃣", page: "class8.html", description: "Class 8 foundation for high-school readiness with full CBSE subject coverage." }
};

window.COURSE_PAGES.class11.streams = {
  Science: window.COURSE_PAGES.class11.subjects,
  Commerce: {
    Accountancy: subject("🧾", ["Introduction to Accounting", "Theory Base of Accounting", "Recording of Transactions", "Bank Reconciliation Statement", "Depreciation", "Bills of Exchange", "Trial Balance", "Financial Statements", "Accounts from Incomplete Records", "Computers in Accounting"], 6),
    "Business Studies": subject("🏢", ["Nature and Purpose of Business", "Forms of Business Organisation", "Private Public and Global Enterprises", "Business Services", "Emerging Modes of Business", "Social Responsibility", "Sources of Business Finance", "Small Business", "Internal Trade", "International Business"], 6),
    Economics: subject("💹", ["Introduction to Economics", "Consumer Equilibrium", "Demand", "Producer Behaviour", "Supply", "Forms of Market", "Statistics in Economics", "Collection of Data", "Presentation of Data", "Measures of Central Tendency", "Correlation", "Index Numbers"], 6),
    Mathematics: subject("📐", ["Sets", "Relations and Functions", "Trigonometric Functions", "Linear Inequalities", "Permutations and Combinations", "Binomial Theorem", "Sequences and Series", "Straight Lines", "Conic Sections", "Limits and Derivatives", "Statistics", "Probability"], 6),
    English: subject("📖", ["Hornbill Prose", "Hornbill Poems", "Snapshots", "Reading Comprehension", "Writing Skills", "Grammar and Note Making"]),
    "Physical Education": subject("🏃", ["Changing Trends in Physical Education", "Olympic Value Education", "Yoga", "Physical Fitness Wellness and Lifestyle", "Test Measurement and Evaluation", "Anatomy Physiology", "Psychology and Sports", "Training and Doping"])
  },
  Humanities: {
    History: subject("🏺", ["Writing and City Life", "An Empire Across Three Continents", "Nomadic Empires", "Three Orders", "Changing Cultural Traditions", "Displacing Indigenous Peoples", "Paths to Modernisation"], 6),
    Geography: subject("🗺️", ["Geography as a Discipline", "The Origin and Evolution of Earth", "Interior of the Earth", "Distribution of Oceans and Continents", "Geomorphic Processes", "Landforms", "Composition and Structure of Atmosphere", "World Climate", "Water in the Atmosphere", "Biosphere"], 6),
    "Political Science": subject("⚖️", ["Constitution Why and How", "Rights in the Indian Constitution", "Election and Representation", "Executive", "Legislature", "Judiciary", "Federalism", "Local Governments", "Political Theory", "Freedom and Equality"], 6),
    Economics: subject("💹", ["Introduction to Economics", "Consumer Behaviour", "Producer Behaviour", "Market Equilibrium", "Statistics in Economics", "Collection of Data", "Presentation of Data", "Measures of Central Tendency", "Correlation", "Index Numbers"], 6),
    Sociology: subject("👥", ["Sociology and Society", "Terms Concepts and Their Use", "Understanding Social Institutions", "Culture and Socialisation", "Doing Sociology Research", "Social Structure Stratification and Processes"], 5),
    Psychology: subject("🧠", ["What is Psychology", "Methods of Enquiry", "Human Development", "Sensory and Perceptual Processes", "Learning", "Human Memory", "Thinking", "Motivation and Emotion"], 5),
    English: subject("📖", ["Hornbill Prose", "Hornbill Poems", "Snapshots", "Reading Comprehension", "Writing Skills", "Grammar and Note Making"])
  }
};

window.COURSE_PAGES.class12.streams = {
  Science: window.COURSE_PAGES.class12.subjects,
  Commerce: {
    Accountancy: subject("🧾", ["Accounting for Partnership Firms", "Goodwill", "Change in Profit Sharing Ratio", "Admission of Partner", "Retirement and Death of Partner", "Dissolution of Partnership", "Accounting for Share Capital", "Debentures", "Financial Statements Analysis", "Cash Flow Statement"], 6),
    "Business Studies": subject("🏢", ["Nature and Significance of Management", "Principles of Management", "Business Environment", "Planning", "Organising", "Staffing", "Directing", "Controlling", "Financial Management", "Marketing Management", "Consumer Protection"], 6),
    Economics: subject("💹", ["National Income Accounting", "Money and Banking", "Determination of Income and Employment", "Government Budget", "Balance of Payments", "Indian Economy on the Eve of Independence", "Indian Economy 1950-1990", "Liberalisation Privatisation Globalisation", "Human Capital Formation", "Rural Development", "Environment and Sustainable Development"], 6),
    Mathematics: subject("📐", ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Application of Derivatives", "Integrals", "Differential Equations", "Linear Programming", "Probability"], 6),
    English: subject("📖", ["Flamingo Prose", "Flamingo Poems", "Vistas", "Reading Comprehension", "Writing Skills", "Literary Revision"]),
    "Physical Education": subject("🏅", ["Management of Sporting Events", "Children and Women in Sports", "Yoga as Preventive Measure", "Sports and Nutrition", "Test and Measurement", "Biomechanics and Sports", "Psychology and Sports", "Training in Sports"])
  },
  Humanities: {
    History: subject("🏺", ["Bricks Beads and Bones", "Kings Farmers and Towns", "Kinship Caste and Class", "Thinkers Beliefs and Buildings", "Through the Eyes of Travellers", "Bhakti Sufi Traditions", "An Imperial Capital Vijayanagara", "Peasants Zamindars and the State", "Colonialism and the Countryside", "Rebels and the Raj", "Mahatma Gandhi and the Nationalist Movement", "Framing the Constitution"], 6),
    Geography: subject("🗺️", ["Human Geography", "World Population", "Human Development", "Primary Activities", "Secondary Activities", "Tertiary and Quaternary Activities", "Transport and Communication", "International Trade", "Population Distribution India", "Human Settlements", "Resources and Development", "Planning and Sustainable Development"], 6),
    "Political Science": subject("⚖️", ["The End of Bipolarity", "Contemporary Centres of Power", "Contemporary South Asia", "International Organisations", "Security in the Contemporary World", "Environment and Natural Resources", "Globalisation", "Challenges of Nation Building", "Era of One Party Dominance", "Democratic Resurgence", "Indian Politics Trends"], 6),
    Economics: subject("💹", ["National Income", "Money and Banking", "Income and Employment", "Government Budget", "Balance of Payments", "Indian Economic Development", "Human Capital Formation", "Rural Development", "Employment", "Environment and Sustainable Development"], 6),
    Sociology: subject("👥", ["Indian Society", "Demographic Structure", "Social Institutions", "Market as a Social Institution", "Patterns of Social Inequality", "Cultural Diversity", "Structural Change", "Cultural Change", "Social Movements"], 5),
    Psychology: subject("🧠", ["Variations in Psychological Attributes", "Self and Personality", "Meeting Life Challenges", "Psychological Disorders", "Therapeutic Approaches", "Attitude and Social Cognition", "Social Influence and Group Processes"], 5),
    English: subject("📖", ["Flamingo Prose", "Flamingo Poems", "Vistas", "Reading Comprehension", "Writing Skills", "Literary Revision"])
  }
};

window.COURSE_PAGES.jee_class11 = {
  ...window.COURSE_PAGES.jee,
  title: "JEE Class 11 Foundation",
  description: "Class 11 focused JEE preparation for mechanics, waves, thermodynamics, physical chemistry, organic basics, algebra, trigonometry, and coordinate geometry."
};
window.COURSE_PAGES.jee_class12 = {
  ...window.COURSE_PAGES.jee,
  title: "JEE Class 12 Advanced Course",
  description: "Class 12 focused JEE preparation for electricity, magnetism, optics, modern physics, advanced chemistry, calculus, vectors, and 3D geometry."
};
window.COURSE_PAGES.neet_class11 = {
  ...window.COURSE_PAGES.neet,
  title: "NEET Class 11 Foundation",
  description: "Class 11 NEET foundation with mechanics, thermodynamics, mole concept, chemical bonding, botany, zoology, and human physiology basics."
};
window.COURSE_PAGES.neet_class12 = {
  ...window.COURSE_PAGES.neet,
  title: "NEET Class 12 Revision Course",
  description: "Class 12 NEET preparation with electrostatics, optics, organic chemistry, genetics, biotechnology, ecology, and full mock revision."
};

[
  ["french", "French Language", "🇫🇷", "#1d4ed8", "#ef4444", "#f8fafc", "French from beginner to advanced with grammar, vocabulary, listening, speaking, and DELF-style practice."],
  ["german", "German Language", "🇩🇪", "#111827", "#dc2626", "#facc15", "German from beginner to advanced with grammar, cases, vocabulary, speaking, and exam practice."],
  ["japanese", "Japanese Language", "🇯🇵", "#be123c", "#f8fafc", "#111827", "Japanese from Hiragana and Katakana to grammar, Kanji, conversation, and JLPT-style practice."],
  ["spanish", "Spanish Language", "🇪🇸", "#b91c1c", "#f59e0b", "#7c3aed", "Spanish from everyday basics to advanced grammar, conversation, reading, and exam practice."]
].forEach(([id, title, icon, accent, accent2, accent3, description]) => {
  window.COURSE_PAGES[id] = course(title, description, {
    gradient: `linear-gradient(135deg,${accent},${accent2} 58%,${accent3})`,
    accent,
    accent2,
    accent3
  }, {
    Beginner: subject(icon, ["Pronunciation and Sounds", "Everyday Vocabulary", "Basic Grammar", "Simple Conversations", "Listening Practice", "Beginner Review"]),
    Intermediate: subject("📚", ["Tenses and Structures", "Topic Vocabulary", "Reading Practice", "Speaking Fluency", "Writing Practice", "Intermediate Review"]),
    Advanced: subject("🎓", ["Advanced Grammar", "Debate and Discussion", "Presentation Skills", "Exam Practice", "Cultural Fluency", "Advanced Review"])
  }, {
    badges: ["🗣️ Speaking", "🎧 Listening", "✍️ Practice Tests"],
    mockTitle: `${title} Mock Tests`,
    finalTitle: `${title} Final Fluency Test`
  });
});

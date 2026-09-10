// server/app.ts
import express, { Router } from "express";
import cookieParser from "cookie-parser";

// src/data/seedColleges.ts
var SEED_COLLEGES = [
  // 1. IIT Bombay
  {
    college: {
      id: "iit-bombay",
      name: "Indian Institute of Technology Bombay (IIT Bombay)",
      slug: "iit-bombay",
      city: "Mumbai",
      state: "Maharashtra",
      location: { lat: 19.1334, lng: 72.9133 },
      type: "Government",
      established: 1958,
      feesPerYear: 22e4,
      rating: 4.9,
      reviewCount: 28,
      logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      overview: "IIT Bombay is recognized worldwide as a leader in the field of engineering education and research. Located in Powai, Mumbai, the sprawling 550-acre green campus between the scenic Vihar and Powai lakes provides an intellectually stimulating environment. It boasts stellar faculty, world-class research labs, and an alumni network spanning global tech leaders and entrepreneurs.",
      streams: ["Engineering", "Management", "Design", "Arts & Sciences"],
      nirfRank: 3,
      campusSizeAcres: 550,
      accreditations: ["Institute of National Importance", "AICTE", "UGC"],
      highlights: ["Top tier research facilities & innovation hubs", "Vibrant campus culture with Mood Indigo & Techfest", "Highest international placement packages"],
      website: "https://www.iitb.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iitb-cse", collegeId: "iit-bombay", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 22e4, seats: 120, eligibility: "JEE Advanced top rankers + 75% in 10+2" },
      { id: "iitb-ee", collegeId: "iit-bombay", name: "Electrical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 22e4, seats: 110, eligibility: "JEE Advanced + 75% in 10+2" },
      { id: "iitb-me", collegeId: "iit-bombay", name: "Mechanical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 22e4, seats: 140, eligibility: "JEE Advanced + 75% in 10+2" },
      { id: "iitb-mba", collegeId: "iit-bombay", name: "Master of Management (SJMSOM)", degree: "MBA", durationYears: 2, feesPerYear: 5e5, seats: 152, eligibility: "CAT percentile >= 98.5 + Bachelor's in Engineering/Science" }
    ],
    placements: [
      { id: "iitb-p2024", collegeId: "iit-bombay", year: 2024, avgPackageLPA: 23.5, medianPackageLPA: 19.2, highestPackageLPA: 168, placementPercentage: 94.2, topRecruiters: ["Google", "Microsoft", "Jane Street", "Apple", "Rubrik", "Qualcomm"] },
      { id: "iitb-p2023", collegeId: "iit-bombay", year: 2023, avgPackageLPA: 21.8, medianPackageLPA: 18, highestPackageLPA: 132, placementPercentage: 96.1, topRecruiters: ["Uber", "Texas Instruments", "Morgan Stanley", "Tower Research", "Samsung"] }
    ],
    reviews: [
      { id: "iitb-r1", collegeId: "iit-bombay", authorName: "Arjun Verma", rating: 5, title: "Unbeatable peer group and research ecosystem", body: "The peer group is unparalleled. Everyone around you is exceptionally driven, whether in deep tech research, robotics, or founding startups. Hostel life in Powai is something you cherish forever.", course: "B.Tech CSE", batchYear: 2023, verifiedStudent: true, helpfulCount: 42, createdAt: Date.now() - 5e6 },
      { id: "iitb-r2", collegeId: "iit-bombay", authorName: "Sneha Patil", rating: 5, title: "Amazing tech exposure & coding culture", body: "Labs are equipped with top equipment and professors are genuinely invested in breakthrough projects. Mood Indigo and Techfest provide unbelievable organizing experience.", course: "B.Tech Electrical", batchYear: 2024, verifiedStudent: true, helpfulCount: 31, createdAt: Date.now() - 9e6 },
      { id: "iitb-r3", collegeId: "iit-bombay", authorName: "Rohan Nair", rating: 4, title: "High academic rigor with rewarding placements", body: "Academic pressure is definitely real, but if you manage your time well, the learning curve and international career opportunities make every sleepless night worth it.", course: "B.Tech Mechanical", batchYear: 2022, verifiedStudent: true, helpfulCount: 19, createdAt: Date.now() - 15e6 }
    ],
    cutoffs: [
      { id: "c-iitb-cse-gen", collegeId: "iit-bombay", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 68, course: "Computer Science and Engineering" },
      { id: "c-iitb-cse-obc", collegeId: "iit-bombay", exam: "JEE Advanced", category: "OBC", year: 2024, closingRank: 45, course: "Computer Science and Engineering" },
      { id: "c-iitb-cse-sc", collegeId: "iit-bombay", exam: "JEE Advanced", category: "SC", year: 2024, closingRank: 22, course: "Computer Science and Engineering" },
      { id: "c-iitb-ee-gen", collegeId: "iit-bombay", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 460, course: "Electrical Engineering" },
      { id: "c-iitb-me-gen", collegeId: "iit-bombay", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 1750, course: "Mechanical Engineering" },
      { id: "c-iitb-mba-gen", collegeId: "iit-bombay", exam: "CAT", category: "General", year: 2024, closingRank: 450, course: "Master of Management (SJMSOM)" }
    ]
  },
  // 2. IIT Delhi
  {
    college: {
      id: "iit-delhi",
      name: "Indian Institute of Technology Delhi (IIT Delhi)",
      slug: "iit-delhi",
      city: "New Delhi",
      state: "Delhi",
      location: { lat: 28.545, lng: 77.1926 },
      type: "Government",
      established: 1961,
      feesPerYear: 225e3,
      rating: 4.9,
      reviewCount: 25,
      logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80",
      overview: "Located in the heart of the national capital at Hauz Khas, IIT Delhi is one of the premier technical universities in India. Known for its entrepreneurial ecosystem, it has nurtured dozens of unicorn founders and high-impact researchers across renewable energy, AI, and biotechnology.",
      streams: ["Engineering", "Management", "Design", "Arts & Sciences"],
      nirfRank: 2,
      campusSizeAcres: 320,
      accreditations: ["Institute of National Importance", "AICTE"],
      highlights: ["Prime location in South Delhi near tech & startup hubs", "Thriving entrepreneurship cell & incubation fund", "Extensive global exchange programs"],
      website: "https://home.iitd.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iitd-cse", collegeId: "iit-delhi", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 225e3, seats: 115, eligibility: "JEE Advanced top percentile + 75% in 10+2" },
      { id: "iitd-mnc", collegeId: "iit-delhi", name: "Mathematics and Computing", degree: "B.Tech", durationYears: 4, feesPerYear: 225e3, seats: 90, eligibility: "JEE Advanced rankers" },
      { id: "iitd-ee", collegeId: "iit-delhi", name: "Electrical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 225e3, seats: 120, eligibility: "JEE Advanced rankers" },
      { id: "iitd-mba", collegeId: "iit-delhi", name: "MBA in Management Studies (DMS)", degree: "MBA", durationYears: 2, feesPerYear: 48e4, seats: 115, eligibility: "CAT 98.0+ percentile" }
    ],
    placements: [
      { id: "iitd-p2024", collegeId: "iit-delhi", year: 2024, avgPackageLPA: 22.8, medianPackageLPA: 18.5, highestPackageLPA: 150, placementPercentage: 93.8, topRecruiters: ["Microsoft", "Google", "Goldman Sachs", "NVIDIA", "Bain & Company"] },
      { id: "iitd-p2023", collegeId: "iit-delhi", year: 2023, avgPackageLPA: 21.2, medianPackageLPA: 17.5, highestPackageLPA: 125, placementPercentage: 95.4, topRecruiters: ["Amazon", "Optiver", "Citadel", "McKinsey", "Intel"] }
    ],
    reviews: [
      { id: "iitd-r1", collegeId: "iit-delhi", authorName: "Devansh Gupta", rating: 5, title: "Center of entrepreneurship and high-energy campus", body: "The alumni network is extremely responsive. If you want to start a company or pursue algorithmic trading, IIT Delhi gives you the most direct pipeline.", course: "B.Tech MnC", batchYear: 2023, verifiedStudent: true, helpfulCount: 38, createdAt: Date.now() - 6e6 },
      { id: "iitd-r2", collegeId: "iit-delhi", authorName: "Tanvi Sharma", rating: 5, title: "Great cultural festivals and modern hostels", body: "Rendezvous festival is pure magic. Hauz Khas surroundings mean you are never isolated from city life. Top tier placement cell support.", course: "B.Tech CSE", batchYear: 2024, verifiedStudent: true, helpfulCount: 27, createdAt: Date.now() - 11e6 }
    ],
    cutoffs: [
      { id: "c-iitd-cse-gen", collegeId: "iit-delhi", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 115, course: "Computer Science and Engineering" },
      { id: "c-iitd-cse-obc", collegeId: "iit-delhi", exam: "JEE Advanced", category: "OBC", year: 2024, closingRank: 78, course: "Computer Science and Engineering" },
      { id: "c-iitd-mnc-gen", collegeId: "iit-delhi", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 340, course: "Mathematics and Computing" },
      { id: "c-iitd-ee-gen", collegeId: "iit-delhi", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 590, course: "Electrical Engineering" }
    ]
  },
  // 3. IIT Madras
  {
    college: {
      id: "iit-madras",
      name: "Indian Institute of Technology Madras (IIT Madras)",
      slug: "iit-madras",
      city: "Chennai",
      state: "Tamil Nadu",
      location: { lat: 12.9915, lng: 80.2337 },
      type: "Government",
      established: 1959,
      feesPerYear: 215e3,
      rating: 4.9,
      reviewCount: 30,
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
      overview: "Ranked #1 overall in the NIRF rankings for consecutive years, IIT Madras is nestled in a lush 620-acre national park sanctuary in Chennai. It houses India's first university research park (IITM Research Park), creating deep synergy between industry R&D and student innovation.",
      streams: ["Engineering", "Management", "Arts & Sciences"],
      nirfRank: 1,
      campusSizeAcres: 620,
      accreditations: ["Institute of National Importance", "AICTE"],
      highlights: ["#1 NIRF Overall Institute in India", "IIT Madras Research Park with 200+ R&D partners", "Deer and blackbucks in natural sanctuary campus"],
      website: "https://www.iitm.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iitm-cse", collegeId: "iit-madras", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 215e3, seats: 110, eligibility: "JEE Advanced" },
      { id: "iitm-ee", collegeId: "iit-madras", name: "Electrical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 215e3, seats: 120, eligibility: "JEE Advanced" },
      { id: "iitm-aero", collegeId: "iit-madras", name: "Aerospace Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 215e3, seats: 60, eligibility: "JEE Advanced" },
      { id: "iitm-mba", collegeId: "iit-madras", name: "Master of Business Administration (DoMS)", degree: "MBA", durationYears: 2, feesPerYear: 45e4, seats: 100, eligibility: "CAT 96+ percentile" }
    ],
    placements: [
      { id: "iitm-p2024", collegeId: "iit-madras", year: 2024, avgPackageLPA: 22, medianPackageLPA: 18, highestPackageLPA: 140, placementPercentage: 92.5, topRecruiters: ["Texas Instruments", "Qualcomm", "Microsoft", "Cisco", "Airbus", "ISRO"] },
      { id: "iitm-p2023", collegeId: "iit-madras", year: 2023, avgPackageLPA: 20.9, medianPackageLPA: 17, highestPackageLPA: 115, placementPercentage: 94, topRecruiters: ["Google", "Amazon", "Honeywell", "L&T", "McKinsey"] }
    ],
    reviews: [
      { id: "iitm-r1", collegeId: "iit-madras", authorName: "Karthik Raja", rating: 5, title: "The Research Park is a golden ticket to deep tech", body: "Working with startup founders inside IITM Research Park gave me hands-on drone engineering experience before I even graduated.", course: "B.Tech Aerospace", batchYear: 2023, verifiedStudent: true, helpfulCount: 45, createdAt: Date.now() - 7e6 },
      { id: "iitm-r2", collegeId: "iit-madras", authorName: "Preethi S.", rating: 5, title: "Serene campus environment with incredible academics", body: "Cycling past deers to morning lectures is serene. The faculty in Computer Science and Microelectronics are world leaders in their fields.", course: "B.Tech CSE", batchYear: 2024, verifiedStudent: true, helpfulCount: 29, createdAt: Date.now() - 12e6 }
    ],
    cutoffs: [
      { id: "c-iitm-cse-gen", collegeId: "iit-madras", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 148, course: "Computer Science and Engineering" },
      { id: "c-iitm-ee-gen", collegeId: "iit-madras", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 780, course: "Electrical Engineering" },
      { id: "c-iitm-aero-gen", collegeId: "iit-madras", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 2600, course: "Aerospace Engineering" }
    ]
  },
  // 4. BITS Pilani
  {
    college: {
      id: "bits-pilani",
      name: "Birla Institute of Technology and Science, Pilani (BITS Pilani)",
      slug: "bits-pilani",
      city: "Pilani",
      state: "Rajasthan",
      location: { lat: 28.3639, lng: 75.587 },
      type: "Deemed",
      established: 1964,
      feesPerYear: 52e4,
      rating: 4.8,
      reviewCount: 35,
      logoUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80",
      overview: "BITS Pilani is one of India's most prestigious private deemed universities. Renowned for its zero-attendance policy, Practice School (internship) system, and stellar alumni network, BITS fosters independent thinking, startup culture, and rigorous engineering disciplines.",
      streams: ["Engineering", "Management", "Arts & Sciences"],
      nirfRank: 20,
      campusSizeAcres: 330,
      accreditations: ["NAAC A++", "UGC Deemed", "IoE"],
      highlights: ["Zero mandatory attendance policy fostering autonomy", "Structured 6-month Practice School corporate internship", "Unicorn startup founder hub (Swiggy, Groww, etc.)"],
      website: "https://www.bits-pilani.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "bits-cse", collegeId: "bits-pilani", name: "Computer Science", degree: "B.E.", durationYears: 4, feesPerYear: 52e4, seats: 150, eligibility: "BITSAT exam score + 75% in PCM" },
      { id: "bits-eee", collegeId: "bits-pilani", name: "Electrical and Electronics Engineering", degree: "B.E.", durationYears: 4, feesPerYear: 52e4, seats: 130, eligibility: "BITSAT exam score" },
      { id: "bits-mech", collegeId: "bits-pilani", name: "Mechanical Engineering", degree: "B.E.", durationYears: 4, feesPerYear: 52e4, seats: 140, eligibility: "BITSAT exam score" },
      { id: "bits-eco", collegeId: "bits-pilani", name: "Economics + Computer Science (Dual)", degree: "M.Sc + B.E.", durationYears: 5, feesPerYear: 52e4, seats: 80, eligibility: "BITSAT score" }
    ],
    placements: [
      { id: "bits-p2024", collegeId: "bits-pilani", year: 2024, avgPackageLPA: 20.5, medianPackageLPA: 17, highestPackageLPA: 90, placementPercentage: 92, topRecruiters: ["Google", "Oracle", "NVIDIA", "DE Shaw", "Amazon", "Uber"] },
      { id: "bits-p2023", collegeId: "bits-pilani", year: 2023, avgPackageLPA: 19.2, medianPackageLPA: 16, highestPackageLPA: 82, placementPercentage: 94, topRecruiters: ["Microsoft", "Cisco", "Adobe", "Morgan Stanley"] }
    ],
    reviews: [
      { id: "bits-r1", collegeId: "bits-pilani", authorName: "Ananya Singhal", rating: 5, title: "Zero attendance gives you freedom to excel", body: "The 0% attendance rule taught me time management and allowed me to build my open source projects and crack Google Summer of Code.", course: "B.E. Computer Science", batchYear: 2023, verifiedStudent: true, helpfulCount: 52, createdAt: Date.now() - 4e6 },
      { id: "bits-r2", collegeId: "bits-pilani", authorName: "Nikhil Joshi", rating: 4, title: "High fees but outstanding ROI and Practice School", body: "Tuition is on the higher side, but the Practice School 2 internship gave me a full-time PPO before 4th year even started.", course: "B.E. EEE", batchYear: 2024, verifiedStudent: true, helpfulCount: 34, createdAt: Date.now() - 85e5 }
    ],
    cutoffs: [
      { id: "c-bits-cse-gen", collegeId: "bits-pilani", exam: "JEE Main", category: "General", year: 2024, closingRank: 1200, course: "Computer Science" },
      { id: "c-bits-eee-gen", collegeId: "bits-pilani", exam: "JEE Main", category: "General", year: 2024, closingRank: 4500, course: "Electrical and Electronics" },
      { id: "c-bits-mech-gen", collegeId: "bits-pilani", exam: "JEE Main", category: "General", year: 2024, closingRank: 11e3, course: "Mechanical Engineering" }
    ]
  },
  // 5. AIIMS New Delhi
  {
    college: {
      id: "aiims-delhi",
      name: "All India Institute of Medical Sciences (AIIMS New Delhi)",
      slug: "aiims-delhi",
      city: "New Delhi",
      state: "Delhi",
      location: { lat: 28.5672, lng: 77.21 },
      type: "Government",
      established: 1956,
      feesPerYear: 1628,
      // Genuine nominal AIIMS fee
      rating: 4.9,
      reviewCount: 32,
      logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
      overview: "AIIMS New Delhi is the foremost apex medical college and hospital in South Asia. Established by an Act of Parliament, it offers clinical training under globally celebrated clinicians with millions of patients treated annually.",
      streams: ["Medical", "Arts & Sciences"],
      nirfRank: 1,
      campusSizeAcres: 115,
      accreditations: ["Institute of National Importance", "MCI / NMC"],
      highlights: ["#1 Medical College in India", "Extremely nominal fees with world-class medical equipment", "High clinical exposure across super-specialties"],
      website: "https://www.aiims.edu",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "aiims-mbbs", collegeId: "aiims-delhi", name: "Bachelor of Medicine & Bachelor of Surgery (MBBS)", degree: "MBBS", durationYears: 5.5, feesPerYear: 1628, seats: 125, eligibility: "NEET Top All India Rankers" },
      { id: "aiims-bisc", collegeId: "aiims-delhi", name: "B.Sc (Hons) Nursing", degree: "B.Sc", durationYears: 4, feesPerYear: 1500, seats: 96, eligibility: "AIIMS Entrance Exam" }
    ],
    placements: [
      { id: "aiims-p2024", collegeId: "aiims-delhi", year: 2024, avgPackageLPA: 18, medianPackageLPA: 16.5, highestPackageLPA: 45, placementPercentage: 99, topRecruiters: ["Apollo Hospitals", "Max Healthcare", "Fortis", "NHS UK", "US Residency Match"] },
      { id: "aiims-p2023", collegeId: "aiims-delhi", year: 2023, avgPackageLPA: 16.5, medianPackageLPA: 15, highestPackageLPA: 40, placementPercentage: 99, topRecruiters: ["Medanta", "Manipal Hospitals", "Johns Hopkins Fellowships"] }
    ],
    reviews: [
      { id: "aiims-r1", collegeId: "aiims-delhi", authorName: "Dr. Tanya Malik", rating: 5, title: "The absolute pinnacle of medical education", body: "The sheer diversity of rare cases you witness in the OPD and trauma center is unmatched anywhere else in the world. Teachers are legendary surgeons and researchers.", course: "MBBS", batchYear: 2022, verifiedStudent: true, helpfulCount: 60, createdAt: Date.now() - 5e6 },
      { id: "aiims-r2", collegeId: "aiims-delhi", authorName: "Dr. Varun Sen", rating: 5, title: "Demanding but builds consummate clinicians", body: "The clinical postings test your stamina, but you emerge confident handling any medical emergency.", course: "MBBS", batchYear: 2023, verifiedStudent: true, helpfulCount: 41, createdAt: Date.now() - 1e7 }
    ],
    cutoffs: [
      { id: "c-aiims-mbbs-gen", collegeId: "aiims-delhi", exam: "NEET", category: "General", year: 2024, closingRank: 55, course: "MBBS" },
      { id: "c-aiims-mbbs-obc", collegeId: "aiims-delhi", exam: "NEET", category: "OBC", year: 2024, closingRank: 245, course: "MBBS" },
      { id: "c-aiims-mbbs-sc", collegeId: "aiims-delhi", exam: "NEET", category: "SC", year: 2024, closingRank: 890, course: "MBBS" },
      { id: "c-aiims-mbbs-st", collegeId: "aiims-delhi", exam: "NEET", category: "ST", year: 2024, closingRank: 1650, course: "MBBS" },
      { id: "c-aiims-mbbs-ews", collegeId: "aiims-delhi", exam: "NEET", category: "EWS", year: 2024, closingRank: 215, course: "MBBS" }
    ]
  },
  // 6. IIM Ahmedabad
  {
    college: {
      id: "iim-ahmedabad",
      name: "Indian Institute of Management Ahmedabad (IIM Ahmedabad)",
      slug: "iim-ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      location: { lat: 23.0317, lng: 72.5303 },
      type: "Government",
      established: 1961,
      feesPerYear: 14e5,
      rating: 4.9,
      reviewCount: 22,
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      overview: "IIM Ahmedabad is Asia's premier management school. Known for its rigorous Harvard-style case pedagogy, iconic Louis Kahn brick architecture, and peerless leadership track record across Fortune 500 CEOs and policymakers.",
      streams: ["Management"],
      nirfRank: 1,
      campusSizeAcres: 102,
      accreditations: ["EQUIS", "AMBA", "Institute of National Importance"],
      highlights: ["#1 B-School in India", "Harvard case study methodology in every lecture", "Unrivalled marquee consulting and private equity placements"],
      website: "https://www.iima.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iima-pgp", collegeId: "iim-ahmedabad", name: "Post Graduate Programme in Management (MBA)", degree: "MBA", durationYears: 2, feesPerYear: 14e5, seats: 395, eligibility: "CAT 99.5+ percentile + WAT/PI" },
      { id: "iima-fabm", collegeId: "iim-ahmedabad", name: "PGP in Food and Agribusiness Management", degree: "MBA", durationYears: 2, feesPerYear: 125e4, seats: 50, eligibility: "CAT 96+ percentile" }
    ],
    placements: [
      { id: "iima-p2024", collegeId: "iim-ahmedabad", year: 2024, avgPackageLPA: 34.5, medianPackageLPA: 31.5, highestPackageLPA: 115, placementPercentage: 100, topRecruiters: ["McKinsey & Co", "Boston Consulting Group", "Bain & Company", "Goldman Sachs", "Blackstone"] },
      { id: "iima-p2023", collegeId: "iim-ahmedabad", year: 2023, avgPackageLPA: 32.8, medianPackageLPA: 30, highestPackageLPA: 105, placementPercentage: 100, topRecruiters: ["Morgan Stanley", "Kearney", "Hindustan Unilever", "Tata Sons"] }
    ],
    reviews: [
      { id: "iima-r1", collegeId: "iim-ahmedabad", authorName: "Kunal Mehra", rating: 5, title: "The WAC and case discussions transform how you think", body: "Every morning starts with cold calls on business turnarounds. The peer discussions sharpen your strategic decision making under immense pressure.", course: "PGP (MBA)", batchYear: 2023, verifiedStudent: true, helpfulCount: 48, createdAt: Date.now() - 3e6 }
    ],
    cutoffs: [
      { id: "c-iima-pgp-gen", collegeId: "iim-ahmedabad", exam: "CAT", category: "General", year: 2024, closingRank: 180, course: "Post Graduate Programme in Management (MBA)" },
      { id: "c-iima-pgp-obc", collegeId: "iim-ahmedabad", exam: "CAT", category: "OBC", year: 2024, closingRank: 650, course: "Post Graduate Programme in Management (MBA)" },
      { id: "c-iima-pgp-sc", collegeId: "iim-ahmedabad", exam: "CAT", category: "SC", year: 2024, closingRank: 1800, course: "Post Graduate Programme in Management (MBA)" },
      { id: "c-iima-pgp-ews", collegeId: "iim-ahmedabad", exam: "CAT", category: "EWS", year: 2024, closingRank: 390, course: "Post Graduate Programme in Management (MBA)" }
    ]
  },
  // 7. NIT Trichy
  {
    college: {
      id: "nit-trichy",
      name: "National Institute of Technology Tiruchirappalli (NIT Trichy)",
      slug: "nit-trichy",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      location: { lat: 10.7589, lng: 78.8132 },
      type: "Government",
      established: 1964,
      feesPerYear: 155e3,
      rating: 4.7,
      reviewCount: 26,
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      overview: "NIT Trichy is consistently rated as the #1 National Institute of Technology in India. Situated in Thuvakudi on the Tanjore highway, it provides comprehensive engineering education, top faculty research, and placement statistics rivaling top IITs.",
      streams: ["Engineering", "Management", "Arts & Sciences"],
      nirfRank: 9,
      campusSizeAcres: 800,
      accreditations: ["Institute of National Importance", "AICTE"],
      highlights: ["#1 Ranked NIT in India", "Sprawling 800-acre residential campus", "High placement conversion in core and software sectors"],
      website: "https://www.nitt.edu",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "nitt-cse", collegeId: "nit-trichy", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 155e3, seats: 120, eligibility: "JEE Main top ranks (JoSAA counseling)" },
      { id: "nitt-ece", collegeId: "nit-trichy", name: "Electronics & Communication Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 155e3, seats: 110, eligibility: "JEE Main" },
      { id: "nitt-mech", collegeId: "nit-trichy", name: "Mechanical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 155e3, seats: 120, eligibility: "JEE Main" },
      { id: "nitt-mba", collegeId: "nit-trichy", name: "MBA in Management Studies", degree: "MBA", durationYears: 2, feesPerYear: 19e4, seats: 90, eligibility: "CAT 85+ percentile" }
    ],
    placements: [
      { id: "nitt-p2024", collegeId: "nit-trichy", year: 2024, avgPackageLPA: 15.8, medianPackageLPA: 13, highestPackageLPA: 52, placementPercentage: 91, topRecruiters: ["Microsoft", "Qualcomm", "Amazon", "Samsung R&D", "L&T", "Tata Motors"] },
      { id: "nitt-p2023", collegeId: "nit-trichy", year: 2023, avgPackageLPA: 14.9, medianPackageLPA: 12.5, highestPackageLPA: 48, placementPercentage: 93, topRecruiters: ["Texas Instruments", "Oracle", "Goldman Sachs"] }
    ],
    reviews: [
      { id: "nitt-r1", collegeId: "nit-trichy", authorName: "Siddharth S.", rating: 5, title: "Best engineering peer group outside old IITs", body: "Festember and Pragyan are celebrated on an epic scale. The lab facilities in ECE and Mech are state-of-the-art.", course: "B.Tech CSE", batchYear: 2023, verifiedStudent: true, helpfulCount: 28, createdAt: Date.now() - 8e6 }
    ],
    cutoffs: [
      { id: "c-nitt-cse-gen", collegeId: "nit-trichy", exam: "JEE Main", category: "General", year: 2024, closingRank: 1520, course: "Computer Science and Engineering" },
      { id: "c-nitt-cse-obc", collegeId: "nit-trichy", exam: "JEE Main", category: "OBC", year: 2024, closingRank: 780, course: "Computer Science and Engineering" },
      { id: "c-nitt-ece-gen", collegeId: "nit-trichy", exam: "JEE Main", category: "General", year: 2024, closingRank: 3800, course: "Electronics & Communication" },
      { id: "c-nitt-mech-gen", collegeId: "nit-trichy", exam: "JEE Main", category: "General", year: 2024, closingRank: 9800, course: "Mechanical Engineering" }
    ]
  },
  // 8. VIT Vellore
  {
    college: {
      id: "vit-vellore",
      name: "Vellore Institute of Technology (VIT Vellore)",
      slug: "vit-vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      location: { lat: 12.9698, lng: 79.1559 },
      type: "Deemed",
      established: 1984,
      feesPerYear: 295e3,
      rating: 4.6,
      reviewCount: 40,
      logoUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80",
      overview: "VIT Vellore is one of India's largest private technical universities, globally recognized for its Flexible Credit System (FFCS), massive modern infrastructure, and record-setting placement drives with thousands of dream and super-dream offers.",
      streams: ["Engineering", "Management", "Design", "Arts & Sciences"],
      nirfRank: 11,
      campusSizeAcres: 372,
      accreditations: ["NAAC A++", "ABET Accredited", "IoE Status"],
      highlights: ["Fully Flexible Credit System (choose your own professors and schedule)", "Guinness World Record for single-campus placement offers", "Vibrant student clubs with international chapters"],
      website: "https://www.vit.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "vit-cse", collegeId: "vit-vellore", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 295e3, seats: 800, eligibility: "VITEEE rank + 60% in 10+2" },
      { id: "vit-ai", collegeId: "vit-vellore", name: "CSE with AI & Machine Learning", degree: "B.Tech", durationYears: 4, feesPerYear: 295e3, seats: 400, eligibility: "VITEEE rank" },
      { id: "vit-ece", collegeId: "vit-vellore", name: "Electronics and Communication", degree: "B.Tech", durationYears: 4, feesPerYear: 28e4, seats: 450, eligibility: "VITEEE rank" },
      { id: "vit-mba", collegeId: "vit-vellore", name: "Master of Business Administration", degree: "MBA", durationYears: 2, feesPerYear: 35e4, seats: 240, eligibility: "CAT/MAT/XAT" }
    ],
    placements: [
      { id: "vit-p2024", collegeId: "vit-vellore", year: 2024, avgPackageLPA: 9.8, medianPackageLPA: 8.5, highestPackageLPA: 102, placementPercentage: 88.5, topRecruiters: ["Microsoft", "Motorq", "Amazon", "TCS Digital", "Deloitte", "Wipro Turbo"] },
      { id: "vit-p2023", collegeId: "vit-vellore", year: 2023, avgPackageLPA: 9.2, medianPackageLPA: 8, highestPackageLPA: 75, placementPercentage: 90.2, topRecruiters: ["AppDynamics", "Qualcomm", "Cognizant", "Infosys"] }
    ],
    reviews: [
      { id: "vit-r1", collegeId: "vit-vellore", authorName: "Pooja Reddy", rating: 5, title: "FFCS gives flexibility and Riviera fest is grand", body: "You can schedule all your classes in morning slots and spend afternoons in robotics or coding labs. Rivieria is one of India's biggest cultural fests.", course: "B.Tech CSE", batchYear: 2024, verifiedStudent: true, helpfulCount: 35, createdAt: Date.now() - 45e5 }
    ],
    cutoffs: [
      { id: "c-vit-cse-gen", collegeId: "vit-vellore", exam: "JEE Main", category: "General", year: 2024, closingRank: 7500, course: "Computer Science and Engineering" },
      { id: "c-vit-ece-gen", collegeId: "vit-vellore", exam: "JEE Main", category: "General", year: 2024, closingRank: 16500, course: "Electronics and Communication" }
    ]
  },
  // 9. IIIT Hyderabad
  {
    college: {
      id: "iiit-hyderabad",
      name: "International Institute of Information Technology Hyderabad (IIIT-H)",
      slug: "iiit-hyderabad",
      city: "Hyderabad",
      state: "Telangana",
      location: { lat: 17.4455, lng: 78.3489 },
      type: "Deemed",
      established: 1998,
      feesPerYear: 4e5,
      rating: 4.9,
      reviewCount: 24,
      logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
      overview: "IIIT Hyderabad is India's premier computer science research and competitive programming hub. Located in Gachibowli near HITEC City, its Kohli Centre on Intelligent Systems (KCIS) and CVIT lab produce world-leading AI, robotics, and NLP papers.",
      streams: ["Engineering", "Arts & Sciences"],
      nirfRank: 55,
      campusSizeAcres: 66,
      accreditations: ["NAAC A++", "Autonomous Research University"],
      highlights: ["Finest coding & competitive programming culture in Asia", "Top research labs (CVIT, LTRC, KCIS)", "Average package surpassing many top IITs"],
      website: "https://www.iiit.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iiith-cse", collegeId: "iiit-hyderabad", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 4e5, seats: 150, eligibility: "JEE Main top percentiles / UGEE" },
      { id: "iiith-ece", collegeId: "iiit-hyderabad", name: "Electronics and Communication Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 4e5, seats: 90, eligibility: "JEE Main / UGEE" },
      { id: "iiith-dual", collegeId: "iiit-hyderabad", name: "Dual Degree B.Tech + MS by Research in CSE", degree: "Dual Degree", durationYears: 5, feesPerYear: 4e5, seats: 60, eligibility: "UGEE Exam" }
    ],
    placements: [
      { id: "iiith-p2024", collegeId: "iiit-hyderabad", year: 2024, avgPackageLPA: 30.2, medianPackageLPA: 26, highestPackageLPA: 120, placementPercentage: 97.5, topRecruiters: ["Google", "Meta", "Apple", "Uber", "Tower Research", "Databricks"] },
      { id: "iiith-p2023", collegeId: "iiit-hyderabad", year: 2023, avgPackageLPA: 28.5, medianPackageLPA: 24.5, highestPackageLPA: 105, placementPercentage: 98.2, topRecruiters: ["Microsoft", "Rubrik", "Adobe", "Qualcomm"] }
    ],
    reviews: [
      { id: "iiith-r1", collegeId: "iiit-hyderabad", authorName: "Sai Teja", rating: 5, title: "The coding paradise of India", body: "If you love programming, there is no better place in India. You learn OS, compilers, and machine learning from day 1 with practical project code.", course: "B.Tech CSE", batchYear: 2023, verifiedStudent: true, helpfulCount: 44, createdAt: Date.now() - 35e5 }
    ],
    cutoffs: [
      { id: "c-iiith-cse-gen", collegeId: "iiit-hyderabad", exam: "JEE Main", category: "General", year: 2024, closingRank: 950, course: "Computer Science and Engineering" },
      { id: "c-iiith-ece-gen", collegeId: "iiit-hyderabad", exam: "JEE Main", category: "General", year: 2024, closingRank: 3800, course: "Electronics and Communication" }
    ]
  },
  // 10. Delhi Technological University (DTU)
  {
    college: {
      id: "dtu-delhi",
      name: "Delhi Technological University (DTU, formerly DCE)",
      slug: "dtu-delhi",
      city: "New Delhi",
      state: "Delhi",
      location: { lat: 28.7501, lng: 77.1177 },
      type: "Government",
      established: 1941,
      feesPerYear: 219e3,
      rating: 4.7,
      reviewCount: 31,
      logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      overview: "Formerly Delhi College of Engineering (DCE), DTU is one of India's oldest and most respected engineering colleges. Spread over 164 lush acres in Rohini, Delhi, DTU boasts a monumental legacy, high corporate recruitment, and famous formula student racing teams.",
      streams: ["Engineering", "Management", "Design"],
      nirfRank: 29,
      campusSizeAcres: 164,
      accreditations: ["State University", "AICTE", "UGC", "NAAC A"],
      highlights: ["Rich 80+ year heritage and stellar alumni base", "High return on investment and dream tech placements", "Superb tech societies (Defianz Racing, UAS-DTU)"],
      website: "https://www.dtu.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "dtu-cse", collegeId: "dtu-delhi", name: "Computer Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 219e3, seats: 360, eligibility: "JEE Main (JAC Delhi Counseling)" },
      { id: "dtu-it", collegeId: "dtu-delhi", name: "Information Technology", degree: "B.Tech", durationYears: 4, feesPerYear: 219e3, seats: 180, eligibility: "JEE Main (JAC Delhi)" },
      { id: "dtu-ece", collegeId: "dtu-delhi", name: "Electronics and Communication", degree: "B.Tech", durationYears: 4, feesPerYear: 219e3, seats: 240, eligibility: "JEE Main (JAC Delhi)" },
      { id: "dtu-mech", collegeId: "dtu-delhi", name: "Mechanical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 219e3, seats: 300, eligibility: "JEE Main (JAC Delhi)" }
    ],
    placements: [
      { id: "dtu-p2024", collegeId: "dtu-delhi", year: 2024, avgPackageLPA: 16.4, medianPackageLPA: 14, highestPackageLPA: 82, placementPercentage: 90, topRecruiters: ["Google", "Amazon", "Microsoft", "Tower Research", "Texas Instruments", "Maruti Suzuki"] },
      { id: "dtu-p2023", collegeId: "dtu-delhi", year: 2023, avgPackageLPA: 15.2, medianPackageLPA: 13, highestPackageLPA: 64, placementPercentage: 92.5, topRecruiters: ["Adobe", "Goldman Sachs", "Cisco", "Deloitte"] }
    ],
    reviews: [
      { id: "dtu-r1", collegeId: "dtu-delhi", authorName: "Akash Singhal", rating: 5, title: "Legendary culture and massive tech company visits", body: "Almost every top tech and finance company visiting IIT Delhi also visits DTU. Campus life at OAT (Open Air Theatre) during Engifest is unforgettable.", course: "B.Tech COE", batchYear: 2023, verifiedStudent: true, helpfulCount: 37, createdAt: Date.now() - 65e5 }
    ],
    cutoffs: [
      { id: "c-dtu-cse-gen", collegeId: "dtu-delhi", exam: "JEE Main", category: "General", year: 2024, closingRank: 4200, course: "Computer Engineering" },
      { id: "c-dtu-cse-obc", collegeId: "dtu-delhi", exam: "JEE Main", category: "OBC", year: 2024, closingRank: 14500, course: "Computer Engineering" },
      { id: "c-dtu-cse-sc", collegeId: "dtu-delhi", exam: "JEE Main", category: "SC", year: 2024, closingRank: 42e3, course: "Computer Engineering" },
      { id: "c-dtu-ece-gen", collegeId: "dtu-delhi", exam: "JEE Main", category: "General", year: 2024, closingRank: 12e3, course: "Electronics and Communication" },
      { id: "c-dtu-mech-gen", collegeId: "dtu-delhi", exam: "JEE Main", category: "General", year: 2024, closingRank: 26e3, course: "Mechanical Engineering" }
    ]
  },
  // 11. Manipal Institute of Technology (MIT Manipal)
  {
    college: {
      id: "mit-manipal",
      name: "Manipal Institute of Technology (MIT Manipal)",
      slug: "mit-manipal",
      city: "Manipal",
      state: "Karnataka",
      location: { lat: 13.3525, lng: 74.7928 },
      type: "Deemed",
      established: 1957,
      feesPerYear: 435e3,
      rating: 4.6,
      reviewCount: 36,
      logoUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80",
      overview: "MIT Manipal is a premier constituent institute of MAHE, nestled on the lush coastal hills of Udupi, Karnataka. Known for producing global leaders (including Microsoft CEO Satya Nadella), it offers unmatched student life, innovation labs, and modern infrastructure.",
      streams: ["Engineering", "Management", "Design"],
      nirfRank: 61,
      campusSizeAcres: 313,
      accreditations: ["IoE Institution", "NAAC A++", "AICTE"],
      highlights: ["Alma mater of Microsoft CEO Satya Nadella", "World-class Marena sports complex and library facilities", "Major student project teams (Formula Manipal, Project DronAID)"],
      website: "https://manipal.edu/mit.html",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "mit-cse", collegeId: "mit-manipal", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 435e3, seats: 240, eligibility: "MET (Manipal Entrance Test)" },
      { id: "mit-cce", collegeId: "mit-manipal", name: "Computer and Communication Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 435e3, seats: 180, eligibility: "MET" },
      { id: "mit-mech", collegeId: "mit-manipal", name: "Mechanical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 38e4, seats: 200, eligibility: "MET" }
    ],
    placements: [
      { id: "mit-p2024", collegeId: "mit-manipal", year: 2024, avgPackageLPA: 12.2, medianPackageLPA: 10, highestPackageLPA: 54, placementPercentage: 89, topRecruiters: ["Microsoft", "Amazon", "Goldman Sachs", "Cisco", "Bosch", "Accenture"] },
      { id: "mit-p2023", collegeId: "mit-manipal", year: 2023, avgPackageLPA: 11.5, medianPackageLPA: 9.2, highestPackageLPA: 44, placementPercentage: 91, topRecruiters: ["Dell", "Oracle", "SAP Labs", "Mercedes-Benz"] }
    ],
    reviews: [
      { id: "mit-r1", collegeId: "mit-manipal", authorName: "Rhea Shenoy", rating: 5, title: "Cosmopolitan town and rich student life", body: "Manipal is essentially a self-contained university town. The student energy, student project workshops, and coastal weather make college life memorable.", course: "B.Tech CSE", batchYear: 2024, verifiedStudent: true, helpfulCount: 30, createdAt: Date.now() - 4e6 }
    ],
    cutoffs: [
      { id: "c-mit-cse-gen", collegeId: "mit-manipal", exam: "JEE Main", category: "General", year: 2024, closingRank: 8900, course: "Computer Science and Engineering" },
      { id: "c-mit-cce-gen", collegeId: "mit-manipal", exam: "JEE Main", category: "General", year: 2024, closingRank: 15400, course: "Computer and Communication" }
    ]
  },
  // 12. IIT Roorkee
  {
    college: {
      id: "iit-roorkee",
      name: "Indian Institute of Technology Roorkee (IIT Roorkee)",
      slug: "iit-roorkee",
      city: "Roorkee",
      state: "Uttarakhand",
      location: { lat: 29.8543, lng: 77.888 },
      type: "Government",
      established: 1847,
      feesPerYear: 218e3,
      rating: 4.8,
      reviewCount: 27,
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1200&auto=format&fit=crop&q=80",
      overview: "Established in 1847 as the Thomason College of Civil Engineering, IIT Roorkee is the oldest technical institution in Asia. Located in the foothills of the Himalayas, it blends 175+ years of historic engineering tradition with cutting-edge microelectronics and AI labs.",
      streams: ["Engineering", "Management", "Design", "Arts & Sciences"],
      nirfRank: 5,
      campusSizeAcres: 365,
      accreditations: ["Institute of National Importance", "AICTE"],
      highlights: ["Oldest technical institution in Asia (Est. 1847)", "Majestic historic James Thomason Building", "Top water resources, earth sciences, and AI research"],
      website: "https://www.iitr.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iitr-cse", collegeId: "iit-roorkee", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 218e3, seats: 110, eligibility: "JEE Advanced" },
      { id: "iitr-ee", collegeId: "iit-roorkee", name: "Electrical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 218e3, seats: 120, eligibility: "JEE Advanced" },
      { id: "iitr-civil", collegeId: "iit-roorkee", name: "Civil Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 218e3, seats: 150, eligibility: "JEE Advanced" },
      { id: "iitr-mba", collegeId: "iit-roorkee", name: "MBA (DoMS)", degree: "MBA", durationYears: 2, feesPerYear: 42e4, seats: 95, eligibility: "CAT 95+ percentile" }
    ],
    placements: [
      { id: "iitr-p2024", collegeId: "iit-roorkee", year: 2024, avgPackageLPA: 20.8, medianPackageLPA: 17.5, highestPackageLPA: 130, placementPercentage: 92, topRecruiters: ["Microsoft", "Google", "Databricks", "Goldman Sachs", "Qualcomm", "Schlumberger"] },
      { id: "iitr-p2023", collegeId: "iit-roorkee", year: 2023, avgPackageLPA: 19.5, medianPackageLPA: 16.5, highestPackageLPA: 106, placementPercentage: 94, topRecruiters: ["Oracle", "Uber", "Texas Instruments", "ITC"] }
    ],
    reviews: [
      { id: "iitr-r1", collegeId: "iit-roorkee", authorName: "Manav Joshi", rating: 5, title: "Unbeatable history and campus architecture", body: "Walking past the Main Building with snow-capped mountain views in winter is breathtaking. Thomso fest brings top artists and great memories.", course: "B.Tech CSE", batchYear: 2023, verifiedStudent: true, helpfulCount: 31, createdAt: Date.now() - 75e5 }
    ],
    cutoffs: [
      { id: "c-iitr-cse-gen", collegeId: "iit-roorkee", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 410, course: "Computer Science and Engineering" },
      { id: "c-iitr-ee-gen", collegeId: "iit-roorkee", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 1950, course: "Electrical Engineering" },
      { id: "c-iitr-civil-gen", collegeId: "iit-roorkee", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 6800, course: "Civil Engineering" }
    ]
  },
  // 13. IIT Kharagpur
  {
    college: {
      id: "iit-kharagpur",
      name: "Indian Institute of Technology Kharagpur (IIT KGP)",
      slug: "iit-kharagpur",
      city: "Kharagpur",
      state: "West Bengal",
      location: { lat: 22.3149, lng: 87.3105 },
      type: "Government",
      established: 1951,
      feesPerYear: 216e3,
      rating: 4.8,
      reviewCount: 33,
      logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      overview: "The very first IIT established in India, IIT Kharagpur boasts the largest campus (2100 acres), highest student enrollment, and the most extensive multidisciplinary academic departments ranging from Engineering, Law (RGSOIPL), Medical Science, to Management (VGSoM).",
      streams: ["Engineering", "Management", "Law", "Arts & Sciences"],
      nirfRank: 6,
      campusSizeAcres: 2100,
      accreditations: ["Institute of National Importance", "AICTE"],
      highlights: ["First IIT established in India (2,100-acre mega campus)", "Alma mater of Alphabet/Google CEO Sundar Pichai", "Famous Spring Fest & Kshitij festivals"],
      website: "https://www.iitkgp.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "iitkgp-cse", collegeId: "iit-kharagpur", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 216e3, seats: 130, eligibility: "JEE Advanced" },
      { id: "iitkgp-ece", collegeId: "iit-kharagpur", name: "Electronics & Electrical Communication", degree: "B.Tech", durationYears: 4, feesPerYear: 216e3, seats: 120, eligibility: "JEE Advanced" },
      { id: "iitkgp-mech", collegeId: "iit-kharagpur", name: "Mechanical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 216e3, seats: 160, eligibility: "JEE Advanced" },
      { id: "iitkgp-law", collegeId: "iit-kharagpur", name: "LL.B in Intellectual Property Law", degree: "LL.B", durationYears: 3, feesPerYear: 18e4, seats: 50, eligibility: "Graduate degree in science/tech" }
    ],
    placements: [
      { id: "iitkgp-p2024", collegeId: "iit-kharagpur", year: 2024, avgPackageLPA: 21.5, medianPackageLPA: 17.8, highestPackageLPA: 145, placementPercentage: 91.5, topRecruiters: ["Google", "Microsoft", "Apple", "Jane Street", "Goldman Sachs", "Texas Instruments"] },
      { id: "iitkgp-p2023", collegeId: "iit-kharagpur", year: 2023, avgPackageLPA: 20.1, medianPackageLPA: 16.8, highestPackageLPA: 120, placementPercentage: 93.8, topRecruiters: ["Amazon", "Uber", "Qualcomm", "McKinsey"] }
    ],
    reviews: [
      { id: "iitkgp-r1", collegeId: "iit-kharagpur", authorName: "Sourav Ganguly", rating: 5, title: "Illumination and 2.2 square km of pure brotherhood", body: "The Illumination (chtai lighting) during Diwali and Hall culture in KGP creates bonds for life. Countless tech giants visit for recruitment.", course: "B.Tech CSE", batchYear: 2023, verifiedStudent: true, helpfulCount: 42, createdAt: Date.now() - 55e5 }
    ],
    cutoffs: [
      { id: "c-iitkgp-cse-gen", collegeId: "iit-kharagpur", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 280, course: "Computer Science and Engineering" },
      { id: "c-iitkgp-ece-gen", collegeId: "iit-kharagpur", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 1150, course: "Electronics & Electrical" },
      { id: "c-iitkgp-mech-gen", collegeId: "iit-kharagpur", exam: "JEE Advanced", category: "General", year: 2024, closingRank: 3400, course: "Mechanical Engineering" }
    ]
  },
  // 14. NIT Surathkal (Karnataka)
  {
    college: {
      id: "nitk-surathkal",
      name: "National Institute of Technology Karnataka (NITK Surathkal)",
      slug: "nitk-surathkal",
      city: "Mangalore",
      state: "Karnataka",
      location: { lat: 13.0108, lng: 74.7943 },
      type: "Government",
      established: 1960,
      feesPerYear: 16e4,
      rating: 4.8,
      reviewCount: 29,
      logoUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
      overview: "NITK Surathkal is uniquely known for having its own private beach and lighthouse on the Arabian Sea coastline. As one of the top 3 NITs in India, its academic excellence, computing clusters, and vibrant placement season attract the nation's best engineering aspirants.",
      streams: ["Engineering", "Management", "Arts & Sciences"],
      nirfRank: 12,
      campusSizeAcres: 295,
      accreditations: ["Institute of National Importance", "AICTE"],
      highlights: ["Own private beach & lighthouse right inside the campus", "Top tier coding & core placements", "State-of-the-art Central Research Facility"],
      website: "https://www.nitk.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "nitk-cse", collegeId: "nitk-surathkal", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 16e4, seats: 120, eligibility: "JEE Main (JoSAA counseling)" },
      { id: "nitk-it", collegeId: "nitk-surathkal", name: "Information Technology", degree: "B.Tech", durationYears: 4, feesPerYear: 16e4, seats: 110, eligibility: "JEE Main" },
      { id: "nitk-ece", collegeId: "nitk-surathkal", name: "Electronics & Communication", degree: "B.Tech", durationYears: 4, feesPerYear: 16e4, seats: 120, eligibility: "JEE Main" }
    ],
    placements: [
      { id: "nitk-p2024", collegeId: "nitk-surathkal", year: 2024, avgPackageLPA: 16.2, medianPackageLPA: 13.5, highestPackageLPA: 54, placementPercentage: 92, topRecruiters: ["Microsoft", "Google", "Amazon", "DE Shaw", "Oracle", "Texas Instruments"] },
      { id: "nitk-p2023", collegeId: "nitk-surathkal", year: 2023, avgPackageLPA: 15.1, medianPackageLPA: 12.8, highestPackageLPA: 49, placementPercentage: 94.2, topRecruiters: ["Qualcomm", "Cisco", "Goldman Sachs", "Morgan Stanley"] }
    ],
    reviews: [
      { id: "nitk-r1", collegeId: "nitk-surathkal", authorName: "Aditya Bhat", rating: 5, title: "Beach sunsets every day and top tier tech placements", body: "Studying right next to the beach is unbelievable. The coding club and IEEE student branch are extremely active with hackathons.", course: "B.Tech CSE", batchYear: 2023, verifiedStudent: true, helpfulCount: 38, createdAt: Date.now() - 6e6 }
    ],
    cutoffs: [
      { id: "c-nitk-cse-gen", collegeId: "nitk-surathkal", exam: "JEE Main", category: "General", year: 2024, closingRank: 1980, course: "Computer Science and Engineering" },
      { id: "c-nitk-cse-obc", collegeId: "nitk-surathkal", exam: "JEE Main", category: "OBC", year: 2024, closingRank: 920, course: "Computer Science and Engineering" },
      { id: "c-nitk-it-gen", collegeId: "nitk-surathkal", exam: "JEE Main", category: "General", year: 2024, closingRank: 3200, course: "Information Technology" }
    ]
  },
  // 15. College of Engineering, Pune (COEP)
  {
    college: {
      id: "coep-pune",
      name: "COEP Technological University (COEP Pune)",
      slug: "coep-pune",
      city: "Pune",
      state: "Maharashtra",
      location: { lat: 18.5293, lng: 73.8565 },
      type: "Government",
      established: 1854,
      feesPerYear: 95e3,
      rating: 4.7,
      reviewCount: 30,
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80",
      overview: "Established in 1854, COEP is the third oldest engineering college in Asia. Located at the confluence of Mula and Mutha rivers in Pune, Maharashtra, it carries a storied heritage of producing legendary engineers including Bharat Ratna Sir M. Visvesvaraya.",
      streams: ["Engineering", "Management"],
      nirfRank: 73,
      campusSizeAcres: 37,
      accreditations: ["State Technological University", "AICTE", "NAAC A+"],
      highlights: ["Third oldest engineering college in Asia", "Alma mater of Bharat Ratna Sir M. Visvesvaraya", "Affordable fee structure with stellar automotive and tech placements"],
      website: "https://www.coep.org.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "coep-cse", collegeId: "coep-pune", name: "Computer Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 95e3, seats: 120, eligibility: "MHT CET / JEE Main" },
      { id: "coep-entc", collegeId: "coep-pune", name: "Electronics & Telecommunication", degree: "B.Tech", durationYears: 4, feesPerYear: 95e3, seats: 120, eligibility: "MHT CET / JEE Main" },
      { id: "coep-mech", collegeId: "coep-pune", name: "Mechanical Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 95e3, seats: 150, eligibility: "MHT CET / JEE Main" }
    ],
    placements: [
      { id: "coep-p2024", collegeId: "coep-pune", year: 2024, avgPackageLPA: 12.8, medianPackageLPA: 10.5, highestPackageLPA: 45, placementPercentage: 88, topRecruiters: ["Mastercard", "Credit Suisse", "Microsoft", "Tata Motors", "Bajaj Auto", "Mercedes-Benz"] },
      { id: "coep-p2023", collegeId: "coep-pune", year: 2023, avgPackageLPA: 11.9, medianPackageLPA: 9.8, highestPackageLPA: 40, placementPercentage: 90.5, topRecruiters: ["Barclays", "Goldman Sachs", "Siemens", "TCS"] }
    ],
    reviews: [
      { id: "coep-r1", collegeId: "coep-pune", authorName: "Pranav Kulkarni", rating: 5, title: "Historic stone buildings, boat club, and huge prestige", body: "COEP Boat Club regatta is Asia's oldest college water fest. The alumni network in Pune and Silicon Valley is incredible.", course: "B.Tech Computer Engg", batchYear: 2023, verifiedStudent: true, helpfulCount: 33, createdAt: Date.now() - 6e6 }
    ],
    cutoffs: [
      { id: "c-coep-cse-gen", collegeId: "coep-pune", exam: "JEE Main", category: "General", year: 2024, closingRank: 3900, course: "Computer Engineering" },
      { id: "c-coep-entc-gen", collegeId: "coep-pune", exam: "JEE Main", category: "General", year: 2024, closingRank: 9500, course: "Electronics & Telecommunication" }
    ]
  },
  // 16. SRM Institute of Science and Technology (SRM Chennai)
  {
    college: {
      id: "srm-chennai",
      name: "SRM Institute of Science and Technology (SRM Kattankulathur)",
      slug: "srm-chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      location: { lat: 12.823, lng: 80.0454 },
      type: "Deemed",
      established: 1985,
      feesPerYear: 32e4,
      rating: 4.5,
      reviewCount: 34,
      logoUrl: "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      overview: "SRM University (KTR Campus) is a premier multidisciplinary private institution located on the outskirts of Chennai. Spread across 250 acres with cutting-edge laboratories, it hosts students from over 50 countries and offers extensive study abroad / semester abroad programs.",
      streams: ["Engineering", "Management", "Medical", "Arts & Sciences"],
      nirfRank: 18,
      campusSizeAcres: 250,
      accreditations: ["NAAC A++", "UGC Category 1", "ABET"],
      highlights: ["Semester Abroad Program (SAP) with MIT, UC Berkeley, etc.", "Massive high-tech campus with tech parks & hospital", "High volume recruitment from tech giants & startups"],
      website: "https://www.srmist.edu.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "srm-cse", collegeId: "srm-chennai", name: "Computer Science and Engineering", degree: "B.Tech", durationYears: 4, feesPerYear: 32e4, seats: 1200, eligibility: "SRMJEEE exam rank" },
      { id: "srm-ai", collegeId: "srm-chennai", name: "CSE with Artificial Intelligence", degree: "B.Tech", durationYears: 4, feesPerYear: 32e4, seats: 600, eligibility: "SRMJEEE" },
      { id: "srm-mba", collegeId: "srm-chennai", name: "Master of Business Administration", degree: "MBA", durationYears: 2, feesPerYear: 4e5, seats: 300, eligibility: "CAT/MAT/TANCET" }
    ],
    placements: [
      { id: "srm-p2024", collegeId: "srm-chennai", year: 2024, avgPackageLPA: 9.2, medianPackageLPA: 7.8, highestPackageLPA: 65, placementPercentage: 86, topRecruiters: ["Amazon", "PayPal", "Barclays", "TCS Ninja & Digital", "Cognizant", "Wipro"] },
      { id: "srm-p2023", collegeId: "srm-chennai", year: 2023, avgPackageLPA: 8.6, medianPackageLPA: 7.2, highestPackageLPA: 57, placementPercentage: 88.5, topRecruiters: ["Adobe", "Microsoft", "Capgemini", "Infosys"] }
    ],
    reviews: [
      { id: "srm-r1", collegeId: "srm-chennai", authorName: "Kavya Menon", rating: 4, title: "Great global exposure and international student diversity", body: "The Semester Abroad Program is genuine and helps students study at top US/European universities for a term. Milan cultural fest is huge.", course: "B.Tech CSE", batchYear: 2024, verifiedStudent: true, helpfulCount: 22, createdAt: Date.now() - 3e6 }
    ],
    cutoffs: [
      { id: "c-srm-cse-gen", collegeId: "srm-chennai", exam: "JEE Main", category: "General", year: 2024, closingRank: 14500, course: "Computer Science and Engineering" }
    ]
  },
  // 17. National Law School of India University (NLSIU Bangalore)
  {
    college: {
      id: "nlsiu-bangalore",
      name: "National Law School of India University (NLSIU Bangalore)",
      slug: "nlsiu-bangalore",
      city: "Bangalore",
      state: "Karnataka",
      location: { lat: 12.9515, lng: 77.5147 },
      type: "Government",
      established: 1986,
      feesPerYear: 375e3,
      rating: 4.9,
      reviewCount: 18,
      logoUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80",
      overview: "NLSIU Bangalore is the undisputed #1 law university in India and the pioneer of five-year integrated legal education in the subcontinent. Located in Nagarbhavi, Bangalore, it prepares Supreme Court advocates, international corporate partners, and legal scholars.",
      streams: ["Law", "Arts & Sciences"],
      nirfRank: 1,
      campusSizeAcres: 23,
      accreditations: ["Bar Council of India", "UGC"],
      highlights: ["#1 Law University in India (NIRF Law Rank 1)", "Unmatched record at Philip C. Jessup International Law Moot", "Elite corporate law firm recruitment (Shardul Amarchand, Cyril Amarchand, AZB)"],
      website: "https://www.nls.ac.in",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "nls-ballb", collegeId: "nlsiu-bangalore", name: "B.A. LL.B. (Hons)", degree: "B.A. LL.B.", durationYears: 5, feesPerYear: 375e3, seats: 240, eligibility: "CLAT Top Ranks" },
      { id: "nls-llm", collegeId: "nlsiu-bangalore", name: "Master of Laws (LL.M.)", degree: "LL.M.", durationYears: 1, feesPerYear: 28e4, seats: 100, eligibility: "CLAT PG" }
    ],
    placements: [
      { id: "nls-p2024", collegeId: "nlsiu-bangalore", year: 2024, avgPackageLPA: 18.5, medianPackageLPA: 16, highestPackageLPA: 38, placementPercentage: 98, topRecruiters: ["Cyril Amarchand Mangaldas", "Shardul Amarchand Mangaldas", "AZB & Partners", "Trilegal", "Khaitan & Co", "Linklaters UK"] },
      { id: "nls-p2023", collegeId: "nlsiu-bangalore", year: 2023, avgPackageLPA: 17.2, medianPackageLPA: 15, highestPackageLPA: 34, placementPercentage: 99, topRecruiters: ["Luthra and Luthra", "Clifford Chance", "JSA"] }
    ],
    reviews: [
      { id: "nls-r1", collegeId: "nlsiu-bangalore", authorName: "Adv. Ananya Iyer", rating: 5, title: "The Harvard of Indian legal education", body: "The Socratic teaching method, rigorous trimester system, and 24/7 library will turn you into an incisive legal advocate.", course: "B.A. LL.B. (Hons)", batchYear: 2023, verifiedStudent: true, helpfulCount: 40, createdAt: Date.now() - 42e5 }
    ],
    cutoffs: [
      { id: "c-nls-ballb-gen", collegeId: "nlsiu-bangalore", exam: "JEE Main", category: "General", year: 2024, closingRank: 95, course: "B.A. LL.B. (Hons)" }
    ]
  },
  // 18. National Institute of Design (NID Ahmedabad)
  {
    college: {
      id: "nid-ahmedabad",
      name: "National Institute of Design (NID Ahmedabad)",
      slug: "nid-ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      location: { lat: 23.0118, lng: 72.5694 },
      type: "Government",
      established: 1961,
      feesPerYear: 395e3,
      rating: 4.8,
      reviewCount: 20,
      logoUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&auto=format&fit=crop&q=80",
      overview: "NID Ahmedabad is internationally acclaimed as one of the world's leading design institutes. Established based on the famous India Report by Charles and Ray Eames, it pioneers industrial design, communication design, and textile design education in India.",
      streams: ["Design", "Arts & Sciences"],
      nirfRank: 1,
      campusSizeAcres: 16,
      accreditations: ["Institute of National Importance", "Department of DPIIT"],
      highlights: ["#1 Design Institute in India", "Founded following the Charles and Ray Eames India Report", "Global design studio placements (Google UX, Frog Design, Apple)"],
      website: "https://www.nid.edu",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "nid-bdes", collegeId: "nid-ahmedabad", name: "Bachelor of Design (B.Des)", degree: "B.Des", durationYears: 4, feesPerYear: 395e3, seats: 125, eligibility: "NID DAT (Design Aptitude Test)" },
      { id: "nid-mdes", collegeId: "nid-ahmedabad", name: "Master of Design (M.Des)", degree: "M.Des", durationYears: 2.5, feesPerYear: 44e4, seats: 100, eligibility: "NID DAT Prelims & Mains" }
    ],
    placements: [
      { id: "nid-p2024", collegeId: "nid-ahmedabad", year: 2024, avgPackageLPA: 16, medianPackageLPA: 14.2, highestPackageLPA: 42, placementPercentage: 93, topRecruiters: ["Google UX", "Microsoft Design", "Samsung Design Delhi", "Adobe", "Tata Motors Design Studio", "IKEA"] },
      { id: "nid-p2023", collegeId: "nid-ahmedabad", year: 2023, avgPackageLPA: 14.8, medianPackageLPA: 13, highestPackageLPA: 36, placementPercentage: 95, topRecruiters: ["Frog Design", "Wipro Digital", "Infosys Experience Design", "Maruti Design"] }
    ],
    reviews: [
      { id: "nid-r1", collegeId: "nid-ahmedabad", authorName: "Tanmay Ghosh", rating: 5, title: "Where craft meets modern industrial design thinking", body: "The hands-on workshops in wood, metal, ceramics, and digital interaction design allow you to build physical prototypes from day one.", course: "B.Des Industrial Design", batchYear: 2023, verifiedStudent: true, helpfulCount: 26, createdAt: Date.now() - 51e5 }
    ],
    cutoffs: [
      { id: "c-nid-bdes-gen", collegeId: "nid-ahmedabad", exam: "JEE Main", category: "General", year: 2024, closingRank: 85, course: "Bachelor of Design (B.Des)" }
    ]
  },
  // 19. Christian Medical College (CMC Vellore)
  {
    college: {
      id: "cmc-vellore",
      name: "Christian Medical College (CMC Vellore)",
      slug: "cmc-vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      location: { lat: 12.9249, lng: 79.1351 },
      type: "Private",
      established: 1900,
      feesPerYear: 53e3,
      rating: 4.9,
      reviewCount: 25,
      logoUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80",
      overview: "CMC Vellore is globally renowed for compassionate patient care, groundbreaking medical research (including India's first successful open heart surgery and kidney transplant), and exceptional clinical training.",
      streams: ["Medical", "Arts & Sciences"],
      nirfRank: 3,
      campusSizeAcres: 200,
      accreditations: ["NMC Accredited", "NABH", "NABL"],
      highlights: ["Pioneered India's first open-heart surgery and bone marrow transplant", "High ethical and clinical standards with community health immersion", "Super-specialty residency pipelines worldwide"],
      website: "https://www.cmch-vellore.edu",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "cmc-mbbs", collegeId: "cmc-vellore", name: "MBBS", degree: "MBBS", durationYears: 5.5, feesPerYear: 53e3, seats: 100, eligibility: "NEET Rank + CMC Aptitude Assessment" },
      { id: "cmc-nursing", collegeId: "cmc-vellore", name: "B.Sc Nursing", degree: "B.Sc", durationYears: 4, feesPerYear: 38e3, seats: 100, eligibility: "NEET / CMC entrance" }
    ],
    placements: [
      { id: "cmc-p2024", collegeId: "cmc-vellore", year: 2024, avgPackageLPA: 14.5, medianPackageLPA: 13, highestPackageLPA: 35, placementPercentage: 99, topRecruiters: ["CMC Hospital System", "Apollo Hospitals", "Fortis", "NHS UK", "WHO Fellowships"] },
      { id: "cmc-p2023", collegeId: "cmc-vellore", year: 2023, avgPackageLPA: 13.8, medianPackageLPA: 12.2, highestPackageLPA: 30, placementPercentage: 99, topRecruiters: ["Manipal Hospitals", "Max Healthcare"] }
    ],
    reviews: [
      { id: "cmc-r1", collegeId: "cmc-vellore", authorName: "Dr. Sarah Thomas", rating: 5, title: "Unrivalled compassion and clinical diagnostics training", body: "At CMC, you learn to diagnose through careful clinical examination and empathy before relying on scans. The community health postings are eye-opening.", course: "MBBS", batchYear: 2023, verifiedStudent: true, helpfulCount: 36, createdAt: Date.now() - 47e5 }
    ],
    cutoffs: [
      { id: "c-cmc-mbbs-gen", collegeId: "cmc-vellore", exam: "NEET", category: "General", year: 2024, closingRank: 195, course: "MBBS" },
      { id: "c-cmc-mbbs-obc", collegeId: "cmc-vellore", exam: "NEET", category: "OBC", year: 2024, closingRank: 480, course: "MBBS" }
    ]
  },
  // 20. St. Stephen's College (University of Delhi)
  {
    college: {
      id: "st-stephens-delhi",
      name: "St. Stephen's College (University of Delhi)",
      slug: "st-stephens-delhi",
      city: "New Delhi",
      state: "Delhi",
      location: { lat: 28.6865, lng: 77.2117 },
      type: "Government",
      established: 1881,
      feesPerYear: 42e3,
      rating: 4.8,
      reviewCount: 23,
      logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80",
      overview: "St. Stephen's College is one of India's oldest and most prestigious liberal arts and science colleges. Located on the North Campus of the University of Delhi, it is renowned for its distinguished alumni in politics, civil services, literature, and academia.",
      streams: ["Arts & Sciences"],
      nirfRank: 14,
      campusSizeAcres: 30,
      accreditations: ["UGC", "NAAC A", "University of Delhi Constituent"],
      highlights: ["Premier college for Economics, English, and Physics", "Historic North Campus red-brick architecture and serene lawns", "High proportion of Rhodes Scholars and Civil Servants"],
      website: "https://www.ststephens.edu",
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: [
      { id: "stephens-eco", collegeId: "st-stephens-delhi", name: "B.A. (Hons) Economics", degree: "B.A.", durationYears: 3, feesPerYear: 42e3, seats: 60, eligibility: "CUET UG top percentiles" },
      { id: "stephens-phy", collegeId: "st-stephens-delhi", name: "B.Sc (Hons) Physics", degree: "B.Sc", durationYears: 3, feesPerYear: 46e3, seats: 60, eligibility: "CUET UG" },
      { id: "stephens-eng", collegeId: "st-stephens-delhi", name: "B.A. (Hons) English", degree: "B.A.", durationYears: 3, feesPerYear: 42e3, seats: 45, eligibility: "CUET UG" }
    ],
    placements: [
      { id: "stephens-p2024", collegeId: "st-stephens-delhi", year: 2024, avgPackageLPA: 11.2, medianPackageLPA: 9.5, highestPackageLPA: 30, placementPercentage: 88, topRecruiters: ["Bain Capability Network", "McKinsey", "DE Shaw", "LEK Consulting", "EY Parthenon", "Teach for India"] },
      { id: "stephens-p2023", collegeId: "st-stephens-delhi", year: 2023, avgPackageLPA: 10.4, medianPackageLPA: 8.8, highestPackageLPA: 26, placementPercentage: 89.5, topRecruiters: ["Dalberg", "BCG", "KPMG", "Nomura"] }
    ],
    reviews: [
      { id: "stephens-r1", collegeId: "st-stephens-delhi", authorName: "Aditi Rao", rating: 5, title: "Intellectual discussions over mince cutlets in the Cafe", body: "The Economics department curriculum and debate society (DebSoc) nurture critical thinking. The college library and red brick corridors have unmatched charm.", course: "B.A. Economics", batchYear: 2023, verifiedStudent: true, helpfulCount: 29, createdAt: Date.now() - 38e5 }
    ],
    cutoffs: [
      { id: "c-stephens-eco-gen", collegeId: "st-stephens-delhi", exam: "JEE Main", category: "General", year: 2024, closingRank: 350, course: "B.A. (Hons) Economics" }
    ]
  }
];
var ADDITIONAL_COLLEGES_META = [
  { id: "iit-guwahati", name: "IIT Guwahati (IITG)", city: "Guwahati", state: "Assam", lat: 26.1878, lng: 91.6916, type: "Government", established: 1994, fees: 215e3, rating: 4.8, reviews: 26, streams: ["Engineering", "Design", "Arts & Sciences"], nirf: 7, degrees: ["B.Tech CSE", "B.Des", "B.Tech ECE"], avgLPA: 20.5, maxLPA: 120, overview: "Set on the majestic northern banks of the Brahmaputra River, IIT Guwahati is celebrated for picturesque hills, world-renowned Department of Design, and high-performance computing centers.", exam: "JEE Advanced", cutoffRank: 650 },
  { id: "iit-hyderabad-inst", name: "IIT Hyderabad (IITH)", city: "Sangareddy", state: "Telangana", lat: 17.5947, lng: 78.123, type: "Government", established: 2008, fees: 22e4, rating: 4.8, reviews: 22, streams: ["Engineering", "Design"], nirf: 8, degrees: ["B.Tech AI", "B.Tech CSE", "B.Tech Electrical"], avgLPA: 21, maxLPA: 110, overview: "Known for pioneering the Fractal Academic System and India's first B.Tech in Artificial Intelligence, IIT Hyderabad is one of the fastest rising elite institutes in the nation.", exam: "JEE Advanced", cutoffRank: 620 },
  { id: "iit-varanasi-bhu", name: "IIT (BHU) Varanasi", city: "Varanasi", state: "Uttar Pradesh", lat: 25.2677, lng: 82.9913, type: "Government", established: 1919, fees: 21e4, rating: 4.7, reviews: 31, streams: ["Engineering", "Arts & Sciences"], nirf: 15, degrees: ["B.Tech CSE", "B.Tech Electronics", "B.Tech Metallurgy"], avgLPA: 19.8, maxLPA: 115, overview: "Carrying a centenary legacy inside the Banaras Hindu University campus, IIT BHU combines spiritual heritage with powerhouse engineering and mineral technology research.", exam: "JEE Advanced", cutoffRank: 1050 },
  { id: "iit-indore", name: "IIT Indore (IITI)", city: "Indore", state: "Madhya Pradesh", lat: 22.5204, lng: 75.9207, type: "Government", established: 2009, fees: 218e3, rating: 4.7, reviews: 19, streams: ["Engineering", "Arts & Sciences"], nirf: 14, degrees: ["B.Tech CSE", "B.Tech EEE", "B.Tech Mech"], avgLPA: 18.5, maxLPA: 68, overview: "Known for the highest research citations per faculty in India and modern green campus architecture in Simrol, Indore.", exam: "JEE Advanced", cutoffRank: 1350 },
  { id: "iim-bangalore", name: "IIM Bangalore (IIMB)", city: "Bangalore", state: "Karnataka", lat: 12.8953, lng: 77.6008, type: "Government", established: 1973, fees: 135e4, rating: 4.9, reviews: 25, streams: ["Management"], nirf: 2, degrees: ["PGP (MBA)", "PGP-Enterprise"], avgLPA: 35.4, maxLPA: 112, overview: "Surrounded by tech headquarters in Bannerghatta, IIMB is a global hub for software product management, private equity, and management research.", exam: "CAT", cutoffRank: 210 },
  { id: "iim-calcutta", name: "IIM Calcutta (IIMC)", city: "Kolkata", state: "West Bengal", lat: 22.4389, lng: 88.3075, type: "Government", established: 1961, fees: 138e4, rating: 4.9, reviews: 24, streams: ["Management"], nirf: 4, degrees: ["MBA", "PGPEX-VLM"], avgLPA: 34.8, maxLPA: 115, overview: "Known as the finance capital of Indian B-schools with its scenic 7-lakes Joka campus and peerless quantitative finance curriculum.", exam: "CAT", cutoffRank: 240 },
  { id: "iim-lucknow", name: "IIM Lucknow (IIML)", city: "Lucknow", state: "Uttar Pradesh", lat: 26.92, lng: 80.9388, type: "Government", established: 1984, fees: 11e5, rating: 4.8, reviews: 20, streams: ["Management"], nirf: 6, degrees: ["PGP (MBA)", "PGP-Agribusiness"], avgLPA: 30, maxLPA: 95, overview: "One of the original IIM powerhouses, renowned for rigorous academic discipline, marketing, and general management placements.", exam: "CAT", cutoffRank: 420 },
  { id: "nit-warangal", name: "NIT Warangal (NITW)", city: "Warangal", state: "Telangana", lat: 17.9839, lng: 79.5308, type: "Government", established: 1959, fees: 158e3, rating: 4.7, reviews: 28, streams: ["Engineering", "Management"], nirf: 21, degrees: ["B.Tech CSE", "B.Tech ECE", "B.Tech Mech"], avgLPA: 15.6, maxLPA: 88, overview: "The very first Regional Engineering College founded by Jawaharlal Nehru, NIT Warangal features high-energy coding culture and strong core engineering labs.", exam: "JEE Main", cutoffRank: 2250 },
  { id: "nit-rourkela", name: "NIT Rourkela", city: "Rourkela", state: "Odisha", lat: 22.2531, lng: 84.901, type: "Government", established: 1961, fees: 152e3, rating: 4.7, reviews: 25, streams: ["Engineering", "Arts & Sciences"], nirf: 16, degrees: ["B.Tech CSE", "B.Tech Mining", "B.Tech Metallurgy"], avgLPA: 14.8, maxLPA: 52, overview: "Spanning 647 lush acres with specialized industrial metallurgical, mining, and software engineering centers.", exam: "JEE Main", cutoffRank: 3100 },
  { id: "nit-calicut", name: "NIT Calicut (NITC)", city: "Kozhikode", state: "Kerala", lat: 11.3216, lng: 75.9336, type: "Government", established: 1961, fees: 155e3, rating: 4.6, reviews: 24, streams: ["Engineering", "Management"], nirf: 23, degrees: ["B.Tech CSE", "B.Tech EEE", "B.Arch"], avgLPA: 14.2, maxLPA: 50, overview: "Located in Chathamangalam amidst Kerala's scenic greenery, known for its strong technical fests (Tathva & Ragam) and architecture department.", exam: "JEE Main", cutoffRank: 4200 },
  { id: "nsut-delhi", name: "Netaji Subhas University of Technology (NSUT)", city: "New Delhi", state: "Delhi", lat: 28.6083, lng: 77.0367, type: "Government", established: 1983, fees: 219e3, rating: 4.7, reviews: 29, streams: ["Engineering", "Management"], nirf: 60, degrees: ["B.Tech CSE", "B.Tech IT", "B.Tech ECE"], avgLPA: 16, maxLPA: 78, overview: "Spread over 145 acres in Dwarka, NSUT boasts massive tech placements on par with top IITs and an active competitive coding community.", exam: "JEE Main", cutoffRank: 3800 },
  { id: "iiit-delhi", name: "Indraprastha Institute of Information Technology Delhi (IIIT-D)", city: "New Delhi", state: "Delhi", lat: 28.5459, lng: 77.2732, type: "Government", established: 2008, fees: 425e3, rating: 4.8, reviews: 22, streams: ["Engineering", "Design"], nirf: 75, degrees: ["B.Tech CSE", "B.Tech CSAM", "B.Tech CSD"], avgLPA: 20.2, maxLPA: 85, overview: "A research-focused autonomous state university in Okhla with world-class faculty in Cybersecurity, Human-Centered Design, and AI.", exam: "JEE Main", cutoffRank: 2900 },
  { id: "iiit-bangalore", name: "IIIT Bangalore (IIIT-B)", city: "Bangalore", state: "Karnataka", lat: 12.844, lng: 77.6633, type: "Deemed", established: 1999, fees: 44e4, rating: 4.8, reviews: 21, streams: ["Engineering"], nirf: 74, degrees: ["Integrated M.Tech CSE", "Integrated M.Tech ECE"], avgLPA: 24.5, maxLPA: 92, overview: "Located in Electronic City Bangalore right alongside Infosys, Wipro, and Siemens, offering high-impact research and high placement packages.", exam: "JEE Main", cutoffRank: 4800 },
  { id: "thapar-patiala", name: "Thapar Institute of Engineering and Technology", city: "Patiala", state: "Punjab", lat: 30.3564, lng: 76.3647, type: "Deemed", established: 1956, fees: 41e4, rating: 4.6, reviews: 33, streams: ["Engineering", "Management"], nirf: 22, degrees: ["B.E. Computer Engg", "B.E. Electronics", "B.E. Mechanical"], avgLPA: 11.5, maxLPA: 55, overview: "A historic 250-acre private campus with an academic collaboration with Trinity College Dublin and modern learning laboratories.", exam: "JEE Main", cutoffRank: 12500 },
  { id: "psg-tech-coimbatore", name: "PSG College of Technology", city: "Coimbatore", state: "Tamil Nadu", lat: 11.0247, lng: 77.0028, type: "Private", established: 1951, fees: 88e3, rating: 4.6, reviews: 27, streams: ["Engineering", "Management"], nirf: 63, degrees: ["B.E. CSE", "B.E. Robotics", "B.Tech Textile"], avgLPA: 9.8, maxLPA: 38, overview: "Renowned for deep industry-academia linkages in South India, in-house industrial workshops, and high core engineering hiring.", exam: "JEE Main", cutoffRank: 8400 },
  { id: "rvce-bangalore", name: "R.V. College of Engineering (RVCE)", city: "Bangalore", state: "Karnataka", lat: 12.9237, lng: 77.4987, type: "Private", established: 1963, fees: 28e4, rating: 4.6, reviews: 31, streams: ["Engineering"], nirf: 89, degrees: ["B.E. Computer Science", "B.E. Information Science", "B.E. ECE"], avgLPA: 12.4, maxLPA: 62, overview: "Bangalore's topmost private engineering college on Mysore Road with unparalleled Silicon Valley of India recruitment.", exam: "JEE Main", cutoffRank: 1600 },
  { id: "bmsce-bangalore", name: "BMS College of Engineering (BMSCE)", city: "Bangalore", state: "Karnataka", lat: 12.9416, lng: 77.5658, type: "Private", established: 1946, fees: 26e4, rating: 4.5, reviews: 28, streams: ["Engineering", "Management"], nirf: 83, degrees: ["B.E. Computer Science", "B.E. Electronics", "B.E. Civil"], avgLPA: 10.8, maxLPA: 50, overview: "The first private engineering college in India, located in Basavanagudi, Bangalore with vibrant cultural fest Utsav.", exam: "JEE Main", cutoffRank: 3200 },
  { id: "vjti-mumbai", name: "Veermata Jijabai Technological Institute (VJTI Mumbai)", city: "Mumbai", state: "Maharashtra", lat: 19.0222, lng: 72.8561, type: "Government", established: 1887, fees: 85e3, rating: 4.7, reviews: 27, streams: ["Engineering"], nirf: 82, degrees: ["B.Tech Computer Engg", "B.Tech IT", "B.Tech Mechanical"], avgLPA: 13.5, maxLPA: 60, overview: "Situated in Matunga, Mumbai, VJTI is a premier government institute known for rich alumni heritage and top tier tech recruiting.", exam: "JEE Main", cutoffRank: 3100 },
  { id: "jadavpur-university", name: "Jadavpur University (Faculty of Engineering)", city: "Kolkata", state: "West Bengal", lat: 22.4989, lng: 88.3718, type: "Government", established: 1955, fees: 1e4, rating: 4.8, reviews: 35, streams: ["Engineering", "Arts & Sciences"], nirf: 10, degrees: ["B.E. Computer Science", "B.E. Electronics", "B.E. Power Engg"], avgLPA: 16.5, maxLPA: 85, overview: "Legendary for its world-class research output and nominal fees (under \u20B910k for 4 years), producing stellar researchers and engineers.", exam: "JEE Main", cutoffRank: 1400 },
  { id: "king-george-medical", name: "King George's Medical University (KGMU)", city: "Lucknow", state: "Uttar Pradesh", lat: 26.8687, lng: 80.9133, type: "Government", established: 1911, fees: 54e3, rating: 4.8, reviews: 24, streams: ["Medical"], nirf: 12, degrees: ["MBBS", "BDS"], avgLPA: 15, maxLPA: 38, overview: "A historic medical university in Lucknow with one of India's largest bed capacities and trauma centers.", exam: "NEET", cutoffRank: 850 },
  { id: "madras-medical-college", name: "Madras Medical College (MMC Chennai)", city: "Chennai", state: "Tamil Nadu", lat: 13.0805, lng: 80.2774, type: "Government", established: 1835, fees: 18e3, rating: 4.9, reviews: 26, streams: ["Medical"], nirf: 11, degrees: ["MBBS", "B.Pharm"], avgLPA: 14, maxLPA: 32, overview: "The third oldest medical college in India and one of the most respected teaching hospitals in South India.", exam: "NEET", cutoffRank: 650 },
  { id: "grant-medical-college", name: "Grant Medical College & Sir JJ Group of Hospitals", city: "Mumbai", state: "Maharashtra", lat: 18.9633, lng: 72.8336, type: "Government", established: 1845, fees: 115e3, rating: 4.8, reviews: 25, streams: ["Medical"], nirf: 19, degrees: ["MBBS", "B.Sc Nursing"], avgLPA: 14.5, maxLPA: 35, overview: "One of South Asia's foremost historic medical institutions, situated in Byculla, Mumbai with massive clinical bed volume.", exam: "NEET", cutoffRank: 780 }
];
for (const meta of ADDITIONAL_COLLEGES_META) {
  SEED_COLLEGES.push({
    college: {
      id: meta.id,
      name: meta.name,
      slug: meta.id,
      city: meta.city,
      state: meta.state,
      location: { lat: meta.lat, lng: meta.lng },
      type: meta.type,
      established: meta.established,
      feesPerYear: meta.fees,
      rating: meta.rating,
      reviewCount: meta.reviews,
      logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=160&auto=format&fit=crop&q=80",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
      overview: meta.overview,
      streams: meta.streams,
      nirfRank: meta.nirf,
      campusSizeAcres: 150,
      accreditations: ["AICTE / UGC / NMC Approved", "Institute of Eminence / State Accr."],
      highlights: ["Strong academic faculty and modern laboratories", "High placement statistics with premier corporate recruiters", "Active student technical & cultural clubs"],
      website: `https://www.${meta.id}.ac.in`,
      createdAt: Date.now() - 1e8,
      updatedAt: Date.now()
    },
    courses: meta.degrees.map((deg, idx) => ({
      id: `${meta.id}-c${idx + 1}`,
      collegeId: meta.id,
      name: deg,
      degree: deg.split(" ")[0] || "B.Tech",
      durationYears: deg.includes("MBBS") ? 5.5 : deg.includes("MBA") ? 2 : 4,
      feesPerYear: meta.fees,
      seats: 120,
      eligibility: `${meta.exam} Qualifying Score + 10+2 PCM/PCB`
    })),
    placements: [
      {
        id: `${meta.id}-p2024`,
        collegeId: meta.id,
        year: 2024,
        avgPackageLPA: meta.avgLPA,
        medianPackageLPA: Number((meta.avgLPA * 0.85).toFixed(1)),
        highestPackageLPA: meta.maxLPA,
        placementPercentage: 91,
        topRecruiters: ["Microsoft", "Google", "Amazon", "Texas Instruments", "Tata Motors", "Deloitte"]
      },
      {
        id: `${meta.id}-p2023`,
        collegeId: meta.id,
        year: 2023,
        avgPackageLPA: Number((meta.avgLPA * 0.92).toFixed(1)),
        medianPackageLPA: Number((meta.avgLPA * 0.8).toFixed(1)),
        highestPackageLPA: Number((meta.maxLPA * 0.9).toFixed(1)),
        placementPercentage: 92.5,
        topRecruiters: ["Qualcomm", "Oracle", "Cisco", "Infosys Digital"]
      }
    ],
    reviews: [
      {
        id: `${meta.id}-r1`,
        collegeId: meta.id,
        authorName: "Verified Alum",
        rating: meta.rating >= 4.8 ? 5 : 4,
        title: "Rigorous curriculum, great labs and corporate connects",
        body: `Studying at ${meta.name} gives you exposure to experienced professors and supportive peers. Placements and hackathon support are outstanding.`,
        course: meta.degrees[0],
        batchYear: 2023,
        verifiedStudent: true,
        helpfulCount: 24,
        createdAt: Date.now() - 5e6
      }
    ],
    cutoffs: [
      {
        id: `c-${meta.id}-gen`,
        collegeId: meta.id,
        exam: meta.exam,
        category: "General",
        year: 2024,
        closingRank: meta.cutoffRank,
        course: meta.degrees[0]
      },
      {
        id: `c-${meta.id}-obc`,
        collegeId: meta.id,
        exam: meta.exam,
        category: "OBC",
        year: 2024,
        closingRank: Math.round(meta.cutoffRank * 2.2),
        course: meta.degrees[0]
      },
      {
        id: `c-${meta.id}-sc`,
        collegeId: meta.id,
        exam: meta.exam,
        category: "SC",
        year: 2024,
        closingRank: Math.round(meta.cutoffRank * 5.5),
        course: meta.degrees[0]
      },
      {
        id: `c-${meta.id}-ews`,
        collegeId: meta.id,
        exam: meta.exam,
        category: "EWS",
        year: 2024,
        closingRank: Math.round(meta.cutoffRank * 1.5),
        course: meta.degrees[0]
      }
    ]
  });
}

// server/db.ts
var CollegeDatabase = class {
  // sessionId -> SavedItems
  constructor() {
    this.collegesMap = /* @__PURE__ */ new Map();
    this.slugToIdMap = /* @__PURE__ */ new Map();
    this.coursesMap = /* @__PURE__ */ new Map();
    // collegeId -> Course[]
    this.placementsMap = /* @__PURE__ */ new Map();
    // collegeId -> PlacementYear[]
    this.reviewsMap = /* @__PURE__ */ new Map();
    // collegeId -> Review[]
    this.cutoffsList = [];
    this.savedItemsMap = /* @__PURE__ */ new Map();
    this.seedInitialData();
  }
  seedInitialData() {
    this.collegesMap.clear();
    this.slugToIdMap.clear();
    this.coursesMap.clear();
    this.placementsMap.clear();
    this.reviewsMap.clear();
    this.cutoffsList = [];
    for (const item of SEED_COLLEGES) {
      this.collegesMap.set(item.college.id, item.college);
      this.slugToIdMap.set(item.college.slug, item.college.id);
      this.coursesMap.set(item.college.id, [...item.courses]);
      this.placementsMap.set(item.college.id, [...item.placements]);
      this.reviewsMap.set(item.college.id, [...item.reviews]);
      this.cutoffsList.push(...item.cutoffs);
    }
  }
  // 1. GET /api/colleges with cursor pagination & composite filters
  getColleges(params) {
    let list = Array.from(this.collegesMap.values());
    if (params.q && params.q.trim().length > 0) {
      const queryLower = params.q.trim().toLowerCase();
      list = list.filter((col) => {
        const nameMatch = col.name.toLowerCase().includes(queryLower);
        const cityMatch = col.city.toLowerCase().includes(queryLower);
        const stateMatch = col.state.toLowerCase().includes(queryLower);
        return nameMatch || cityMatch || stateMatch;
      });
    }
    if (params.state && params.state !== "all") {
      list = list.filter((c) => c.state.toLowerCase() === params.state.toLowerCase());
    }
    if (params.city && params.city !== "all") {
      list = list.filter((c) => c.city.toLowerCase() === params.city.toLowerCase());
    }
    if (params.type && params.type !== "all") {
      list = list.filter((c) => c.type === params.type);
    }
    if (params.stream && params.stream !== "all") {
      list = list.filter((c) => c.streams.some((s) => s.toLowerCase() === params.stream.toLowerCase()));
    }
    if (params.minFees !== void 0) {
      list = list.filter((c) => c.feesPerYear >= params.minFees);
    }
    if (params.maxFees !== void 0) {
      list = list.filter((c) => c.feesPerYear <= params.maxFees);
    }
    if (params.minRating !== void 0 && params.minRating > 0) {
      list = list.filter((c) => c.rating >= params.minRating);
    }
    const sort = params.sort || "rating_desc";
    list.sort((a, b) => {
      switch (sort) {
        case "fees_asc":
          return a.feesPerYear - b.feesPerYear;
        case "fees_desc":
          return b.feesPerYear - a.feesPerYear;
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "rating_desc":
        default:
          return b.rating - a.rating || (a.nirfRank || 999) - (b.nirfRank || 999);
      }
    });
    const totalCount = list.length;
    const limit = Math.min(params.limit || 12, 50);
    let startIndex = 0;
    if (params.cursor) {
      const cursorIndex = list.findIndex((c) => c.id === params.cursor);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }
    const paginatedItems = list.slice(startIndex, startIndex + limit);
    const lastItem = paginatedItems[paginatedItems.length - 1];
    const nextCursor = startIndex + limit < totalCount && lastItem ? lastItem.id : null;
    const summaries = paginatedItems.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      city: c.city,
      state: c.state,
      location: c.location,
      type: c.type,
      established: c.established,
      feesPerYear: c.feesPerYear,
      rating: c.rating,
      reviewCount: c.reviewCount,
      logoUrl: c.logoUrl,
      imageUrl: c.imageUrl,
      streams: c.streams,
      nirfRank: c.nirfRank
    }));
    return {
      colleges: summaries,
      nextCursor,
      totalCount
    };
  }
  // 2. GET /api/colleges/:slug
  getCollegeBySlug(slug) {
    const collegeId = this.slugToIdMap.get(slug);
    if (!collegeId) return null;
    const college = this.collegesMap.get(collegeId);
    if (!college) return null;
    const courses = this.coursesMap.get(collegeId) || [];
    const placements = (this.placementsMap.get(collegeId) || []).slice(0, 2);
    const allReviews = this.reviewsMap.get(collegeId) || [];
    const firstPageReviews = allReviews.slice(0, 5);
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allReviews) {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    }
    return {
      college,
      courses,
      placements,
      reviews: firstPageReviews,
      ratingDistribution: distribution
    };
  }
  // 3. GET /api/colleges/:slug/reviews with pagination
  getCollegeReviews(slug, params) {
    const collegeId = this.slugToIdMap.get(slug);
    if (!collegeId) return null;
    const allReviews = this.reviewsMap.get(collegeId) || [];
    const totalReviews = allReviews.length;
    const limit = Math.min(params.limit || 10, 50);
    let startIndex = 0;
    if (params.cursor) {
      const cIndex = allReviews.findIndex((r) => r.id === params.cursor);
      if (cIndex !== -1) {
        startIndex = cIndex + 1;
      }
    }
    const paginatedReviews = allReviews.slice(startIndex, startIndex + limit);
    const lastRev = paginatedReviews[paginatedReviews.length - 1];
    const nextCursor = startIndex + limit < totalReviews && lastRev ? lastRev.id : null;
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allReviews) {
      const rounded = Math.min(5, Math.max(1, Math.round(r.rating)));
      distribution[rounded] = (distribution[rounded] || 0) + 1;
    }
    return {
      reviews: paginatedReviews,
      nextCursor,
      totalReviews,
      ratingDistribution: distribution
    };
  }
  // 4. POST /api/compare
  compareColleges(collegeIds) {
    const result = [];
    for (const id of collegeIds) {
      const col = this.collegesMap.get(id);
      if (!col) {
        throw new Error(`College with ID "${id}" was not found`);
      }
      const courses = this.coursesMap.get(id) || [];
      const placements = this.placementsMap.get(id) || [];
      const latestPlacement = placements.length > 0 ? placements[0] : null;
      result.push({
        id: col.id,
        name: col.name,
        slug: col.slug,
        city: col.city,
        state: col.state,
        type: col.type,
        established: col.established,
        feesPerYear: col.feesPerYear,
        rating: col.rating,
        reviewCount: col.reviewCount,
        logoUrl: col.logoUrl,
        imageUrl: col.imageUrl,
        nirfRank: col.nirfRank,
        streams: col.streams,
        latestPlacement,
        coursesCount: courses.length,
        topCourses: courses.slice(0, 3).map((c) => c.name),
        website: col.website
      });
    }
    return result;
  }
  // 5. POST /api/predictor
  predictColleges(params) {
    const targetYear = params.year || 2024;
    const userRank = params.rank;
    let matchingCutoffs = this.cutoffsList.filter(
      (c) => c.exam.toLowerCase() === params.exam.toLowerCase() && c.category.toLowerCase() === params.category.toLowerCase() && (!params.year || c.year === targetYear)
    );
    if (matchingCutoffs.length === 0) {
      matchingCutoffs = this.cutoffsList.filter(
        (c) => c.exam.toLowerCase() === params.exam.toLowerCase() && c.category === "General" && (!params.year || c.year === targetYear)
      );
    }
    const safe = [];
    const moderate = [];
    const ambitious = [];
    for (const cutoff of matchingCutoffs) {
      const college = this.collegesMap.get(cutoff.collegeId);
      if (!college) continue;
      const summary = {
        id: college.id,
        name: college.name,
        slug: college.slug,
        city: college.city,
        state: college.state,
        location: college.location,
        type: college.type,
        established: college.established,
        feesPerYear: college.feesPerYear,
        rating: college.rating,
        reviewCount: college.reviewCount,
        logoUrl: college.logoUrl,
        imageUrl: college.imageUrl,
        streams: college.streams,
        nirfRank: college.nirfRank
      };
      const closing = cutoff.closingRank;
      const ratio = userRank / closing;
      if (ratio < 0.8) {
        const prob = Math.min(99, Math.round(100 - ratio * 30));
        safe.push({
          cutoff,
          college: summary,
          bucket: "safe",
          probabilityScore: prob,
          marginText: `Your rank #${userRank.toLocaleString()} is comfortably within cutoff #${closing.toLocaleString()} (+${Math.round((1 - ratio) * 100)}% buffer)`
        });
      } else if (ratio <= 1) {
        const prob = Math.round(75 - (ratio - 0.8) * 125);
        moderate.push({
          cutoff,
          college: summary,
          bucket: "moderate",
          probabilityScore: Math.max(50, Math.min(75, prob)),
          marginText: `Competitive match: rank #${userRank.toLocaleString()} is close to closing rank #${closing.toLocaleString()}`
        });
      } else if (ratio <= 1.15) {
        const prob = Math.round(40 - (ratio - 1) * 180);
        ambitious.push({
          cutoff,
          college: summary,
          bucket: "ambitious",
          probabilityScore: Math.max(15, Math.min(40, prob)),
          marginText: `Stretch reach: rank #${userRank.toLocaleString()} is ~${Math.round((ratio - 1) * 100)}% above normal closing rank #${closing.toLocaleString()} (possible in sliding/spot rounds)`
        });
      }
    }
    safe.sort((a, b) => b.probabilityScore - a.probabilityScore);
    moderate.sort((a, b) => b.probabilityScore - a.probabilityScore);
    ambitious.sort((a, b) => b.probabilityScore - a.probabilityScore);
    return {
      safe,
      moderate,
      ambitious,
      querySummary: {
        exam: params.exam,
        rank: params.rank,
        category: params.category,
        totalMatches: safe.length + moderate.length + ambitious.length
      }
    };
  }
  // 6. Saved Items Management (Session Scoped)
  getSavedItems(sessionId) {
    let record = this.savedItemsMap.get(sessionId);
    if (!record) {
      record = {
        sessionId,
        savedColleges: [],
        savedComparisons: [],
        updatedAt: Date.now()
      };
      this.savedItemsMap.set(sessionId, record);
    }
    return record;
  }
  saveCollege(sessionId, collegeId) {
    const items = this.getSavedItems(sessionId);
    if (!items.savedColleges.includes(collegeId)) {
      items.savedColleges.push(collegeId);
      items.updatedAt = Date.now();
    }
    return items;
  }
  removeSavedCollege(sessionId, collegeId) {
    const items = this.getSavedItems(sessionId);
    items.savedColleges = items.savedColleges.filter((id) => id !== collegeId);
    items.updatedAt = Date.now();
    return items;
  }
  saveComparison(sessionId, comparison) {
    const items = this.getSavedItems(sessionId);
    const id = comparison.id || `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const existingIndex = items.savedComparisons.findIndex(
      (c) => c.collegeIds.slice().sort().join(",") === comparison.collegeIds.slice().sort().join(",")
    );
    if (existingIndex >= 0) {
      items.savedComparisons[existingIndex].createdAt = Date.now();
      if (comparison.title) items.savedComparisons[existingIndex].title = comparison.title;
    } else {
      items.savedComparisons.unshift({
        id,
        title: comparison.title || `Comparison of ${comparison.collegeIds.length} Colleges`,
        collegeIds: comparison.collegeIds,
        createdAt: Date.now()
      });
    }
    items.updatedAt = Date.now();
    return items;
  }
  removeSavedComparison(sessionId, comparisonId) {
    const items = this.getSavedItems(sessionId);
    items.savedComparisons = items.savedComparisons.filter((c) => c.id !== comparisonId);
    items.updatedAt = Date.now();
    return items;
  }
  getFiltersMetadata() {
    const states = Array.from(new Set(Array.from(this.collegesMap.values()).map((c) => c.state))).sort();
    const cities = Array.from(new Set(Array.from(this.collegesMap.values()).map((c) => c.city))).sort();
    const streams = Array.from(
      new Set(Array.from(this.collegesMap.values()).flatMap((c) => c.streams))
    ).sort();
    const types = ["Government", "Private", "Deemed"];
    return {
      states,
      cities,
      streams,
      types,
      totalColleges: this.collegesMap.size
    };
  }
};
var dbStore = new CollegeDatabase();

// lib/session.ts
import { v4 as uuidv4 } from "uuid";
var SESSION_COOKIE_NAME = "cc_session_id";
function getSessionIdentity(req, res) {
  let sessionId = req.cookies?.[SESSION_COOKIE_NAME];
  if (!sessionId) {
    sessionId = uuidv4();
    if (res) {
      res.cookie(SESSION_COOKIE_NAME, sessionId, {
        maxAge: 365 * 24 * 60 * 60 * 1e3,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      });
    }
  }
  return {
    sessionId,
    isAnonymous: true
  };
}

// src/types.ts
import { z } from "zod";
var CollegeQuerySchema = z.object({
  q: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(["Government", "Private", "Deemed"]).optional(),
  stream: z.string().optional(),
  minFees: z.coerce.number().min(0).optional(),
  maxFees: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["rating_desc", "fees_asc", "fees_desc", "name_asc"]).default("rating_desc"),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(12)
});
var collegeQuerySchema = CollegeQuerySchema;
var CompareRequestSchema = z.object({
  collegeIds: z.array(z.string().min(1)).min(2, "Select at least 2 colleges to compare").max(3, "Maximum 3 colleges can be compared")
});
var compareRequestSchema = CompareRequestSchema;
var PredictorRequestSchema = z.object({
  exam: z.enum(["JEE Main", "JEE Advanced", "NEET", "CAT"]),
  rank: z.coerce.number().int().positive("Rank must be a positive integer"),
  category: z.enum(["General", "OBC", "SC", "ST", "EWS"]),
  year: z.coerce.number().int().optional()
});
var predictorRequestSchema = PredictorRequestSchema;
var SaveCollegeRequestSchema = z.object({
  collegeId: z.string().min(1, "College ID is required")
});
var saveCollegeRequestSchema = SaveCollegeRequestSchema;
var SaveComparisonRequestSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  collegeIds: z.array(z.string()).min(2, "Minimum 2 colleges").max(3, "Maximum 3 colleges")
});
var saveComparisonRequestSchema = SaveComparisonRequestSchema;
var SaveItemSchema = z.object({
  type: z.enum(["college", "comparison"]),
  collegeId: z.string().optional(),
  comparison: z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    collegeIds: z.array(z.string()).min(2).max(3)
  }).optional()
});
var DeleteSavedItemSchema = z.object({
  type: z.enum(["college", "comparison"]),
  collegeId: z.string().optional(),
  comparisonId: z.string().optional()
});

// server/app.ts
function createExpressApp() {
  const app2 = express();
  app2.use(express.json());
  app2.use(cookieParser());
  const apiRouter = Router();
  apiRouter.get("/health", (_req, res) => {
    res.json({ data: { status: "ok", timestamp: Date.now() }, error: null });
  });
  apiRouter.get("/colleges/meta/filters", (_req, res) => {
    try {
      const meta = dbStore.getFiltersMetadata();
      res.json({ data: meta, error: null });
    } catch (err) {
      res.status(500).json({ data: null, error: { message: err.message || "Failed to load metadata" } });
    }
  });
  apiRouter.get("/colleges", (req, res) => {
    try {
      const validation = collegeQuerySchema.safeParse(req.query);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: {
            message: "Invalid query parameters",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten()
          }
        });
      }
      const result = dbStore.getColleges(validation.data);
      return res.json({ data: result, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Server error fetching colleges" }
      });
    }
  });
  apiRouter.get("/colleges/:slug", (req, res) => {
    try {
      const { slug } = req.params;
      const data = dbStore.getCollegeBySlug(slug);
      if (!data) {
        return res.status(404).json({
          data: null,
          error: { message: `College with identifier "${slug}" not found`, code: "NOT_FOUND" }
        });
      }
      return res.json({ data, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Server error fetching college details" }
      });
    }
  });
  apiRouter.get("/colleges/:slug/reviews", (req, res) => {
    try {
      const { slug } = req.params;
      const cursor = typeof req.query.cursor === "string" ? req.query.cursor : void 0;
      const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
      const result = dbStore.getCollegeReviews(slug, { cursor, limit });
      if (!result) {
        return res.status(404).json({
          data: null,
          error: { message: `College with identifier "${slug}" not found`, code: "NOT_FOUND" }
        });
      }
      return res.json({ data: result, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Server error fetching reviews" }
      });
    }
  });
  apiRouter.post("/compare", (req, res) => {
    try {
      const validation = compareRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: {
            message: "Must provide between 2 and 3 valid college IDs to compare",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten()
          }
        });
      }
      const comparison = dbStore.compareColleges(validation.data.collegeIds);
      return res.json({ data: comparison, error: null });
    } catch (err) {
      return res.status(err.message.includes("not found") ? 404 : 500).json({
        data: null,
        error: { message: err.message || "Error comparing colleges" }
      });
    }
  });
  apiRouter.post("/predictor", (req, res) => {
    try {
      const validation = predictorRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: {
            message: "Invalid predictor inputs. Please verify exam, rank, and category.",
            code: "VALIDATION_ERROR",
            details: validation.error.flatten()
          }
        });
      }
      const prediction = dbStore.predictColleges(validation.data);
      return res.json({ data: prediction, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error generating admission predictions" }
      });
    }
  });
  apiRouter.get("/saved", (req, res) => {
    try {
      const session = getSessionIdentity(req, res);
      const saved = dbStore.getSavedItems(session.sessionId);
      const collegeSummaries = saved.savedColleges.map((cid) => {
        const detail = dbStore.getCollegeBySlug(cid);
        if (!detail) return null;
        const { college } = detail;
        return {
          id: college.id,
          name: college.name,
          slug: college.slug,
          city: college.city,
          state: college.state,
          location: college.location,
          type: college.type,
          established: college.established,
          feesPerYear: college.feesPerYear,
          rating: college.rating,
          reviewCount: college.reviewCount,
          logoUrl: college.logoUrl,
          imageUrl: college.imageUrl,
          streams: college.streams,
          nirfRank: college.nirfRank
        };
      }).filter(Boolean);
      return res.json({
        data: {
          sessionId: session.sessionId,
          savedColleges: collegeSummaries,
          savedCollegeIds: saved.savedColleges,
          savedComparisons: saved.savedComparisons
        },
        error: null
      });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error fetching saved items" }
      });
    }
  });
  apiRouter.post("/saved/colleges", (req, res) => {
    try {
      const validation = saveCollegeRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: { message: "Invalid college ID", code: "VALIDATION_ERROR" }
        });
      }
      const session = getSessionIdentity(req, res);
      const updated = dbStore.saveCollege(session.sessionId, validation.data.collegeId);
      return res.json({ data: updated, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error saving college" }
      });
    }
  });
  apiRouter.delete("/saved/colleges/:collegeId", (req, res) => {
    try {
      const { collegeId } = req.params;
      const session = getSessionIdentity(req, res);
      const updated = dbStore.removeSavedCollege(session.sessionId, collegeId);
      return res.json({ data: updated, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error removing saved college" }
      });
    }
  });
  apiRouter.post("/saved/comparisons", (req, res) => {
    try {
      const validation = saveComparisonRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          data: null,
          error: { message: "Comparison must have 2 to 3 valid college IDs", code: "VALIDATION_ERROR" }
        });
      }
      const session = getSessionIdentity(req, res);
      const updated = dbStore.saveComparison(session.sessionId, validation.data);
      return res.json({ data: updated, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error saving comparison" }
      });
    }
  });
  apiRouter.delete("/saved/comparisons/:id", (req, res) => {
    try {
      const { id } = req.params;
      const session = getSessionIdentity(req, res);
      const updated = dbStore.removeSavedComparison(session.sessionId, id);
      return res.json({ data: updated, error: null });
    } catch (err) {
      return res.status(500).json({
        data: null,
        error: { message: err.message || "Error deleting comparison" }
      });
    }
  });
  app2.use("/api", apiRouter);
  app2.use("/", apiRouter);
  return app2;
}
var app = createExpressApp();
var app_default = app;
export {
  app,
  createExpressApp,
  app_default as default
};

# CCNA Learning & Assessment Platform

A cohort-based, interactive learning management platform for mastering the Cisco Certified Network Associate (CCNA) exam, built on Jeremy McDowell's *Acing the CCNA Exam* (Vol 1 & Vol 2).

---

## 🚀 The Vision & Learning Pipeline

Students do not simply read static chapters—they progress through a verified learning loop:

$$\text{Learn} \longrightarrow \text{Practice} \longrightarrow \text{Quiz} \longrightarrow \text{Demonstrate (Video Proof)} \longrightarrow \text{Review} \longrightarrow \text{Unlock Next}$$

1. **Structured Modules & Lessons**: Rich markdown lessons with Cisco CLI syntax highlighting, network topology maps, and packet flow diagrams.
2. **Interactive Assessments**: Comprehensive quizzes testing theoretical and practical knowledge at the end of every module.
3. **Proof-of-Skill Video Submissions**: Students record a 3–5 minute video explaining the core concept or demonstrating a Packet Tracer / GNS3 lab.
4. **Google Workspace Storage & Database**:
   - **Google Drive (5TB Cloud Storage)**: Secure, direct-resumable video upload storage.
   - **Google Sheets API**: Lightweight, auditable administrative database for student profiles, quiz scores, and submission links.
5. **Google OAuth**: Fast, authenticated one-click login for students and instructors.
6. **Next.js & Vercel**: High-performance edge web application with continuous deployment.

---

## 📂 Repository Structure

```text
.
├── extracted_content/            # Extracted assets from CCNA books (via MinerU)
│   ├── vol1/                    # Volume 1: Fundamentals and Protocols (1,101 pages)
│   │   ├── markdown.md          # Formatted Markdown with relative image links
│   │   ├── structured_content.json  # Hierarchical block structure & bounding boxes
│   │   ├── middle_json.json     # Intermediate layout schema
│   │   └── images/              # 361 extracted topology maps, diagrams & tables
│   └── vol2/                    # Volume 2: Advanced Networking & Security (572 pages)
│       ├── markdown.md          # Formatted Markdown with relative image links
│       ├── structured_content.json  # Hierarchical block structure & bounding boxes
│       ├── middle_json.json     # Intermediate layout schema
│       └── images/              # 323 extracted topology maps, diagrams & tables
├── books/                       # Source PDF textbooks
├── run_extraction.py            # Automated MinerU GPU extraction pipeline script
└── README.md                    # Project documentation
```

---

## 📊 Content Statistics

| Volume | Source | Pages | Markdown | Extracted Images | Structured JSON Blocks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Volume 1** | *Fundamentals & Protocols* | 1,101 | 1.25 MB | 361 images | 78,999 blocks |
| **Volume 2** | *Advanced Networking & Security* | 572 | 1.17 MB | 323 images | 76,432 blocks |
| **Total** | | **1,673** | **2.42 MB** | **684 images** | **155,431 blocks** |

---

## 🛠️ Tech Stack Blueprint

- **Frontend / Full-stack**: Next.js (App Router), React, Tailwind CSS, Lucide Icons
- **Authentication**: NextAuth.js / Auth.js (Google OAuth 2.0)
- **Database**: Google Sheets API (v4) via Service Account
- **Video & File Storage**: Google Drive API (v3) via direct resumable client upload
- **Deployment**: Vercel (Edge Network) + GitHub
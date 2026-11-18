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

---

## ⚡ Interactive Engineering Toolsuite

- **Live Cisco IOS Terminal**: Authentic Catalyst 2960-X & ISR 4331 CLI emulator (`show mac address-table`, `show ip int brief`, `show ip route`).
- **Network Topology & OSPF Visualizer**: Active 802.1Q trunk diagrams and OSPFv2 Area 0 backbone convergence state table.
- **32-Bit Subnet Speed Drill**: Rapid mental math practice for network boundaries, broadcast addresses, and usable host calculations.
- **IPv6 EUI-64 Bit Flipper**: Step-by-step 48-bit MAC splitting, FFFE injection, and 7th-bit Universal/Local inversion.
- **Layer 1 Cabling Lab**: Practical media matching for straight-through, crossover, rollover, serial, and fiber links.


---

## 📚 Engineering Documentation & Study Guides

- **[Cisco IOS Command Quick Reference](docs/ccna-cli-reference.md)**: Command modes, interface provisioning, VLAN switching, and show commands.
- **[IPv4 Subnetting & VLSM Guide](docs/ipv4-subnetting-guide.md)**: The 4-step Magic Number method, CIDR tables, and worked calculations.
- **[VLANs, Trunking & Inter-VLAN Routing](docs/vlan-trunking-routing.md)**: 802.1Q tags, DTP negotiation, Router-on-a-Stick, and Layer 3 SVIs.
- **[Spanning Tree Protocol (STP & RSTP)](docs/spanning-tree-protocol.md)**: Root bridge election, port roles/states, PortFast, and BPDU Guard.
- **[OSPFv2 Routing Protocol Deep Dive](docs/ospf-configuration-guide.md)**: OSPF neighbor state machine, DR/BDR election, and metric calculations.
- **[Access Control Lists (ACLs)](docs/access-control-lists.md)**: Standard and extended ACL syntax, wildcard masks, and interface placement.
- **[Network Address Translation (NAT/PAT)](docs/network-address-translation.md)**: Inside/Outside definitions, static/dynamic NAT, and PAT overload.
- **[Network Automation & APIs](docs/network-automation-apis.md)**: SDN planes, JSON/YAML data encoding, REST APIs, and Ansible playbooks.
- **[Exam Readiness Checklist & Time Protocol](docs/exam-readiness-checklist.md)**: 200-301 CCNA blueprint weights, pace management, and 7-day countdown.
- **[Packet Tracer Lab Matrix & Rubrics](docs/packet-tracer-lab-matrix.md)**: 49-chapter hands-on lab exercises and verification commands.
- **[Platform Architecture Specification](docs/platform-architecture.md)**: Architecture documentation covering Next.js 15, NextAuth, and Cloud Firestore.

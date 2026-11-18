# CCNA Interactive Learning Platform Architecture

The CCNA Learning Platform is a high-performance web application designed for comprehensive mastery of Cisco networking certifications.

---

## 1. System Technology Stack

- **Framework**: Next.js 15 App Router (`src/app`)
- **Runtime & UI**: React 19, TypeScript 5, Tailwind CSS v4
- **Icons & Visuals**: Lucide React, Framer Motion
- **Authentication**: NextAuth.js (v4) with Google OAuth 2.0 provider and session callbacks
- **Database & Persistence**: Google Cloud Firestore (admin SDK & client SDK)
- **Deployment Target**: Vercel Serverless Edge Platform

---

## 2. Architectural Pillars

### I. Flagship Interactive Academy (`/book`, `/chapters/[id]`)
- 49 structured chapters aligned directly with Jeremy McDowell's *Acing the CCNA Exam*.
- Interactive table of contents with scrollspy.
- Dual-pane video companion with split watch-and-read layout.
- Embedded Cisco IOS terminal simulators and live simulation workbenches.

### II. Pearson VUE Practice Exam Simulator (`/exam`)
- 446+ authentic exam questions covering all six blueprint domains.
- Full digital test center experience: Digital Whiteboard scratchpad, live CLI simlet exercises, drag-and-drop matching, and domain breakdown reports.

### III. Engineering Codex & Toolsuite (`/codex`, `/terminal`, `/subnets`)
- Live Cisco IOS CLI terminal simulator with tab completion and error handling.
- Real-time IPv4 subnet and CIDR calculator with binary visualization.
- CAM / MAC Address table simulation engine illustrating frame forwarding and learning logic.

### IV. NOC Cockpit & Admin Center (`/admin`, `/profile`)
- Role-Based Access Control (RBAC) separating student and administrator permissions.
- Cloud Firestore persistence for exam scores, time spent, and chapter completion marks.

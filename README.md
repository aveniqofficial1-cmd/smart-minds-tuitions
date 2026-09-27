# SMART MINDS TUITIONS — Full-Stack Educational Platform

![Smart Minds Tuitions Logo](client/src/assets/logo.png)

> **"Empowering Brighter Futures"**  
> An enterprise-grade, role-based tuition management, educator verification, and institutional coaching center ecosystem engineered to meet the complete functional requirements of the **Smart Minds Tuitions (SMT)** System Requirements Specification (SRS).

---

## 🌟 Executive Overview & Visual Design System

Smart Minds Tuitions bridges the trust and coordination gap between parents seeking verified home/online educators and coaching centers managing institutional batches.

### ✨ Visual Design & Editorial Brand Identity
- **Primary Color Palette**:
  - **Navy Blue (Seal Core & Headers)**: Deep `#050814` and Rich `#0A1128`
  - **Champagne Gold (Accents & Badges)**: Primary Gold `#D4AF37`, Light Gold `#F3E5AB`, Dark Gold `#996515`
  - **Warm Sand & Cream (Editorial Backgrounds)**: Off-White `#FCFBF7`, Warm Neutral `#F4F0EA`, Border Sand `#E2DDD5`
  - **Status Tokens**: Emerald `#059669` (Approved/Success), Amber `#D97706` (Pending/Review), Crimson `#DC2626` (Rejected/Danger), Royal Purple `#7C3AED` (Centers/Accreditation)
- **Typography Pairing**:
  - **Headings**: *Playfair Display* (Editorial luxury serif)
  - **Body & UI**: *Plus Jakarta Sans* (Crisp geometric sans-serif)
- **Visual Assets**: Hand-crafted academic SVG doodles (graduation caps, open textbooks, glowing lightbulbs, compasses, chemistry flasks) and gold trust seals.

---

## 🏛️ Comprehensive Role Architecture & Feature Matrix

The platform is partitioned into **4 fully-isolated, authenticated role portals**:

### 1. 👨‍👩‍👧 Parent & Student Portal (`/parent/*`)
- **Child Profile Management**: Register multiple children with their respective educational boards (CBSE, ICSE, State Board, IB/IGCSE) and grades (Class 1–12).
- **Tuition Lead Dispatch**: Post granular home or online tuition requirements specifying locality, subject requirements, frequency per week, budget range, and preferred schedule.
- **Evaluation Demo Coordination**: View scheduled demo sessions, track demo dates/times, and record binary evaluation feedback (**Accepted** vs **Rejected**).
- **Privacy-Unlocked Direct Contacts**: Permanent access to tutor contact coordinates (phone number, email, and address) automatically unlocked upon demo acceptance and fee activation.
- **Session Attendance Ledger**: Real-time monthly attendance registers showing lesson dates, topics covered, homework assignments, and educator remarks.
- **Monthly Academic Progress Cards**: Detailed monthly evaluations featuring subject scores, conceptual clarity ratings, homework consistency, and tutor recommendations.
- **Real-Time Support Desk**: Instant 2-way messaging channel with Admin for academic counseling.

### 2. 🎓 Educator / Tutor Portal (`/tutor/*`)
- **KYC Verification Onboarding**: Multi-step onboarding uploading Government ID proof (Aadhaar / Passport) and degree qualification certificates with admin review status badges.
- **Lead Discovery & Applications**: Browse real-time student tuition requirements with locality and grade filters. Apply directly for tutoring assignments.
- **Evaluation Demos**: Conduct free evaluation sessions and receive admin-relayed parent decisions.
- **Tuition Operations Hub**: View active assigned tuitions with unlocked parent phone and address coordinates.
- **Class-by-Class Attendance Register**: Log daily lesson records, topics taught, and homework tasks.
- **Monthly Student Progress Generation**: Draft and submit comprehensive monthly progress report cards for parents.
- **Earnings & Financial Ledger**: Self-reported fee collection ledger, total accumulated earnings, and transaction history.
- **Multi-Tuition Subscription Center**: Purchase 3, 6, 9, or 12-month educator passes (₹300 – ₹1200) for unlimited concurrent tuition applications via UPI QR and UTR upload.
- **50% Commission Verification Desk**: Submit one-time 50% first-month commission payment screenshots for accepted demo assignments.

### 3. 🏢 Tuition Center Portal (`/center/*`)
- **Accreditation & Trade License Audit**: Upload institutional registration certificates and trade licenses for super-admin verification.
- **Classes 1–10 Batch Management**: Create and configure academic batches (Class 1 to Class 10), subject faculties, timing schedules, and maximum capacity caps.
- **Student Roster Management**: Enroll students, assign them to batches, and manage guardian contact details.
- **Daily Batch Attendance Registers**: Mark daily attendance (Present, Absent, Late) across all enrolled batch students.
- **Unit Test & Exam Performance Ledgers**: Record periodic test marks, subject averages, and top rankings.
- **Monthly Fee Collection & 1-Click WhatsApp Reminders**: Monitor pending fee dues, update collection status, and dispatch pre-formatted WhatsApp payment reminders to parents in 1 click.
- **Faculty Recruitment Desk**: Request qualified subject tutors and specialized educators directly from Smart Minds Tuitions.

### 4. 👑 Super Admin Control Room (`/admin/*`)
- **System Executive Dashboard**: Global KPI metrics (total requirements, active tuitions, verified tutors, approved centers, platform revenue).
- **Student Lead Matching Desk**: Review incoming parent requirements, audit tutor applications, and dispatch evaluation demos with selected educators.
- **Educator KYC Verification Desk**: Audit government ID cards and degree certificates; approve or reject with custom feedback reasons.
- **Tuition Center Accreditation Desk**: Review coaching center registration documents and activate batch management capabilities.
- **Demo Session Coordination Console**: Relay parent demo evaluations to tutors and initiate formal tuition assignments.
- **50% Commission Desk**: Verify tutor UPI payment screenshots; 1-click approval automatically unlocks contact privacy for parents and tutors.
- **Subscription Approval Desk**: Verify educator multi-tuition pass payments and activate unlimited application privileges.
- **Financial Intelligence Ledger**: Unified ledger tracking all platform revenue streams (commissions + subscriptions) with search, filter, and receipt view.
- **Live Support & Multi-Channel Chat Console**: Centralized real-time messaging hub communicating with parents, tutors, and tuition centers.
- **Immutable Security Audit Trail**: Complete log of all administrative actions, KYC approvals, and financial transactions with timestamp and IP coordinates.

---

## 🔒 Security & Privacy Architecture

1. **Contact Privacy Redaction Layer (`server/src/middleware/contactPrivacy.js`)**:
   - Tutors cannot see parent phone numbers, emails, or residential street addresses while browsing leads or during evaluation demos.
   - Parents cannot see tutor phone numbers or emails until the demo is marked **Accepted** and the formal tuition assignment is approved.
   - Contact details are permanently and securely revealed only on verified assignments.
2. **Protected Document Retrieval (`server/src/routes/documentRoutes.js`)**:
   - Government ID cards, degree certificates, trade licenses, and UPI payment screenshots are stored in private storage and accessible only via authenticated JWT session routes (`/api/documents/:filename`).
3. **Zero-Config Dual Database Engine (`server/src/config/db.js`)**:
   - Connects to local MongoDB instance (`mongodb://localhost:27017/smart_minds_tuitions`).
   - If local MongoDB is unavailable, automatically initializes an embedded `mongodb-memory-server` with instant seed fallback so the app works out-of-the-box with zero setup!

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/your-org/smart-minds-tuitions.git
cd smart-minds-tuitions

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

The repository includes pre-configured `.env` defaults for both server and client:

**`server/.env`**:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart_minds_tuitions
JWT_SECRET=smart_minds_tuitions_super_secret_jwt_key_2026_production
CLIENT_URL=http://localhost:5173
```

**`client/.env`**:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Seed Database with Realistic Data

```bash
cd server
npm run seed
```

### 4. Running the Application

In terminal 1 (Start Backend Server):
```bash
cd server
npm run dev
# Server will start on http://localhost:5000
```

In terminal 2 (Start React Vite Client):
```bash
cd client
npm run dev
# Client will be available at http://localhost:5173
```

---

## 🔑 Pre-Configured Test Accounts (1-Click Login)

The login screen features **1-Click Quick Fill Buttons** for instant evaluation across all 4 roles:

| Role | Email Address | Password | Features / Access |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@smartmindstuitions.com` | `AdminPass@2026!` | Full administrative control, KYC audit, commission & subscription verification, support console |
| **Educator / Tutor (Approved)** | `priya.sharma@tutors.com` | `TutorPass@2026!` | Verified Mathematics & Physics tutor, active tuitions, attendance register, multi-tuition pass |
| **Educator / Tutor (Pending KYC)** | `rahul.verma@tutors.com` | `TutorPass@2026!` | Newly registered tutor awaiting Aadhaar & degree memo verification by Admin |
| **Parent** | `sunita.reddy@parents.com` | `ParentPass@2026!` | Parent of Aarav Reddy (Class 10), posted requirements, scheduled demos, unlocked tutor contact details |
| **Tuition Center** | `apex.academy@centers.com` | `CenterPass@2026!` | Apex Scholars, Class 1-10 batches, daily attendance, fee ledger with WhatsApp reminders |

---

## 📁 Repository Structure

```
smart-minds-tuitions/
├── client/                          # React 18 + Vite + Tailwind CSS Frontend
│   ├── public/                      # Static assets & circular seal logo
│   └── src/
│       ├── assets/                  # Brand images & homepage visual reference
│       ├── components/
│       │   ├── layout/              # Navbar, Footer, DashboardLayout, ProtectedRoute, Notifications
│       │   ├── shared/              # ChatDesk real-time messaging console
│       │   └── ui/                  # Button, Badge, Card, Input, Modal, FileUpload, WhatsAppWidget
│       ├── context/                 # AuthContext & SocketContext
│       ├── pages/
│       │   ├── admin/               # 10 Super Admin Control Room pages
│       │   ├── center/              # 8 Tuition Center Management pages
│       │   ├── parent/              # 8 Parent & Student Portal pages
│       │   ├── tutor/               # 11 Educator & Tuition pages
│       │   ├── About.jsx            # About Smart Minds Tuitions
│       │   ├── Contact.jsx          # Public Inquiries & Contact Form
│       │   ├── ForTutors.jsx        # Educator Benefits & Commission Plans
│       │   ├── Home.jsx             # Editorial Navy/Gold Homepage with doodles & trust metrics
│       │   ├── HowItWorks.jsx       # 4-Step Matching Process & Privacy Guarantee
│       │   ├── Login.jsx            # Authentication with 1-Click Role Quick Fill
│       │   ├── Register.jsx         # Role-based onboarding for Parents, Tutors & Centers
│       │   └── TuitionCenters.jsx   # Institutional Center Partnership Overview
│       ├── services/                # Axios API services for all roles
│       ├── App.jsx                  # Master Router with protected role routes
│       └── index.css                # Tailwind CSS custom themes & animations
│
├── server/                          # Node.js + Express + Socket.IO Backend
│   ├── src/
│   │   ├── config/                  # MongoDB Connection & Dual In-Memory Failover
│   │   ├── controllers/             # Role-based Express controllers
│   │   ├── middleware/              # JWT Auth, RBAC, Privacy Redaction, Multer Uploads
│   │   ├── models/                  # Mongoose Schemas (User, TutorProfile, Center, Demo, etc.)
│   │   ├── routes/                  # Express REST API endpoints
│   │   ├── utils/                   # Database Seed Script & Audit Logger
│   │   └── server.js                # Express & Socket.IO HTTP Server Entrypoint
│   └── package.json
│
├── SmartMindTuitions.pdf            # Original System Requirements Specification (SRS)
├── image/                           # Reference Logo & Homepage Mockup
└── README.md                        # Project Documentation
```

---

## ⚖️ License & Ownership

Developed for **Smart Minds Tuitions**. All rights reserved.
Empowering students and educators through transparent, secure, and personalized academic excellence.

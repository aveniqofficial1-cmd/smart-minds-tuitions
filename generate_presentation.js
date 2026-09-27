/**
 * Smart Minds Tuitions - Polished Client Presentation Generator
 *
 * This is a layout and visual-system revision of the existing 23-slide deck.
 * Content and business meaning are preserved while the presentation is rebuilt
 * on a consistent 16:9 grid with uniform typography, cards, footer, and spacing.
 */

const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Smart Minds Tuitions';
pptx.company = 'Smart Minds Tuitions';
pptx.title = 'Smart Minds Tuitions - Comprehensive Platform Presentation';
pptx.subject = 'Client-ready platform architecture and capability overview';

// -----------------------------------------------------------------------------
// DESIGN SYSTEM
// -----------------------------------------------------------------------------
const C = {
  navyDark: '050814',
  navyBase: '0A1128',
  navyCard: '111C3A',
  navyElevated: '16244C',
  navyBorder: '24345F',
  navyBorderLight: '304777',
  gold: 'D4AF37',
  goldLight: 'F3E5AB',
  goldMuted: 'C5A059',
  white: 'FFFFFF',
  textLight: 'E2E8F0',
  textMuted: '91A0B5',
  blue: '2563EB',
  green: '059669',
  purple: '7C3AED',
  amber: 'D97706',
};

const F = {
  heading: 'Segoe UI',
  body: 'Segoe UI',
};

const LOGO = path.resolve(__dirname, 'image', 'logo.png');
const OUT = path.resolve(__dirname, 'Smart_Minds_Tuitions_Presentation_Polished.pptx');

const GRID = {
  left: 0.8,
  right: 12.53,
  width: 11.73,
  top: 1.85,
  footerLine: 6.95,
};

function addMaster(slide, number, category, title, subtitle) {
  slide.background = { color: C.navyBase };

  slide.addShape(pptx.ShapeType.roundRect, {
    x: GRID.left, y: 0.42, w: 2.65, h: 0.29,
    rectRadius: 0.07,
    fill: { color: C.navyCard },
    line: { color: C.gold, width: 1 },
  });
  slide.addText(category.toUpperCase(), {
    x: GRID.left, y: 0.42, w: 2.65, h: 0.29,
    fontFace: F.body, fontSize: 8.5, bold: true,
    color: C.goldLight, align: 'center', valign: 'middle',
    margin: 0,
  });

  slide.addText(title, {
    x: GRID.left, y: 0.78, w: 10.2, h: 0.5,
    fontFace: F.heading, fontSize: 21, bold: true,
    color: C.white, valign: 'middle', margin: 0,
  });
  slide.addText(subtitle, {
    x: GRID.left, y: 1.32, w: 10.65, h: 0.35,
    fontFace: F.body, fontSize: 10.5,
    color: C.goldLight, valign: 'top', margin: 0,
  });

  slide.addImage({ path: LOGO, x: 11.79, y: 0.43, w: 0.72, h: 0.72 });

  slide.addShape(pptx.ShapeType.line, {
    x: GRID.left, y: GRID.footerLine, w: GRID.width, h: 0,
    line: { color: C.navyBorder, width: 1 },
  });
  slide.addText('SMART MINDS TUITIONS  •  Client Project Presentation  •  Confidential', {
    x: GRID.left, y: 7.02, w: 7.8, h: 0.25,
    fontFace: F.body, fontSize: 8.5, color: C.textMuted,
    margin: 0, valign: 'middle',
  });
  slide.addText(`Slide ${String(number).padStart(2, '0')} of 23`, {
    x: 10.35, y: 7.02, w: 2.18, h: 0.25,
    fontFace: F.body, fontSize: 8.5, color: C.goldMuted,
    margin: 0, align: 'right', valign: 'middle',
  });
}

function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: opts.radius || 0.1,
    fill: { color: opts.fill || C.navyCard },
    line: { color: opts.line || C.navyBorder, width: opts.lineWidth || 1 },
  });
}

function addBulletList(slide, items, x, y, w, h, opts = {}) {
  slide.addText(items.map(item => `• ${item}`).join('\n'), {
    x, y, w, h,
    fontFace: F.body, fontSize: opts.fontSize || 9,
    color: opts.color || C.textLight,
    valign: 'top', margin: opts.margin === undefined ? 0 : opts.margin,
    breakLine: false,
  });
}

function addNumberBadge(slide, number, x, y, size = 0.34) {
  slide.addShape(pptx.ShapeType.ellipse, {
    x, y, w: size, h: size,
    fill: { color: C.gold },
    line: { color: C.gold, width: 0.5 },
  });
  slide.addText(number, {
    x, y, w: size, h: size,
    fontFace: F.body, fontSize: 8, bold: true,
    color: C.navyDark, align: 'center', valign: 'middle', margin: 0,
  });
}

function addFooterOnly(slide, number) {
  slide.addShape(pptx.ShapeType.line, {
    x: GRID.left, y: GRID.footerLine, w: GRID.width, h: 0,
    line: { color: C.navyBorder, width: 1 },
  });
  slide.addText('SMART MINDS TUITIONS  •  Client Project Presentation  •  Confidential', {
    x: GRID.left, y: 7.02, w: 7.8, h: 0.25,
    fontFace: F.body, fontSize: 8.5, color: C.textMuted, margin: 0,
  });
  slide.addText(`Slide ${String(number).padStart(2, '0')} of 23`, {
    x: 10.35, y: 7.02, w: 2.18, h: 0.25,
    fontFace: F.body, fontSize: 8.5, color: C.goldMuted,
    margin: 0, align: 'right',
  });
}

// -----------------------------------------------------------------------------
// 01 — COVER
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };
  addCard(slide, 0.8, 0.62, 11.73, 6.22, { fill: C.navyBase, line: C.gold, lineWidth: 1.5, radius: 0.18 });

  slide.addImage({ path: LOGO, x: 1.3, y: 1.16, w: 1.95, h: 1.95 });
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 3.62, y: 1.2, w: 3.35, h: 0.3, rectRadius: 0.07,
    fill: { color: C.navyCard }, line: { color: C.gold, width: 1 },
  });
  slide.addText('OFFICIAL CLIENT PROPOSAL', {
    x: 3.62, y: 1.2, w: 3.35, h: 0.3,
    fontFace: F.body, fontSize: 8.5, bold: true,
    color: C.goldLight, align: 'center', valign: 'middle', margin: 0,
  });
  slide.addText('SMART MINDS TUITIONS', {
    x: 3.62, y: 1.6, w: 7.4, h: 0.68,
    fontFace: F.heading, fontSize: 28, bold: true,
    color: C.white, valign: 'middle', margin: 0,
  });
  slide.addText('"Connecting Students, Parents & Verified Tutors"', {
    x: 3.62, y: 2.33, w: 7.4, h: 0.35,
    fontFace: F.heading, fontSize: 14, italic: true,
    color: C.gold, margin: 0,
  });
  slide.addText('A secure, admin-governed educational ecosystem engineered to simplify tutor discovery, KYC credential verification, controlled matching, and ongoing tuition operations.', {
    x: 1.3, y: 3.32, w: 10.73, h: 0.66,
    fontFace: F.body, fontSize: 11.5, color: C.textLight,
    margin: 0, valign: 'top',
  });

  const pillars = [
    ['ADMIN-VERIFIED TUTORS', 'Government ID and degree audit before lead matching.'],
    ['MUTUAL PRIVACY DESK', 'No contact leakage before accepted demo confirmation.'],
    ['STRUCTURED DEMO FLOW', 'Free evaluation class with binary parent feedback.'],
    ['COACHING CENTER DESK', 'Class 1–10 batches, attendance and WhatsApp fees.'],
  ];
  pillars.forEach(([title, desc], i) => {
    const x = 1.3 + i * 2.73;
    addCard(slide, x, 4.27, 2.55, 1.78);
    slide.addText(title, {
      x: x + 0.15, y: 4.46, w: 2.25, h: 0.32,
      fontFace: F.heading, fontSize: 9.2, bold: true,
      color: C.gold, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.15, y: 4.86, w: 2.25, h: 0.9,
      fontFace: F.body, fontSize: 8.8, color: C.textLight,
      margin: 0, valign: 'top',
    });
  });
  slide.addText('Platform Architecture & Technical Specification Overview  •  Client Ready Presentation', {
    x: 0.8, y: 6.98, w: 11.73, h: 0.25,
    fontFace: F.body, fontSize: 8.5, color: C.textMuted,
    align: 'center', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 02 — THE VISION
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 2, 'Executive Overview', 'The Vision', 'One platform. Four distinct user roles. One centrally governed tutoring ecosystem.');
  addCard(slide, 0.8, 1.85, 11.73, 0.75, { line: C.gold });
  slide.addText('Smart Minds Tuitions bridges the coordination gap between parents seeking verified educators, qualified tutors looking for sustainable teaching opportunities, and tuition centers managing student batches.', {
    x: 1.02, y: 1.85, w: 11.29, h: 0.75,
    fontFace: F.body, fontSize: 11, color: C.white,
    align: 'center', valign: 'middle', margin: 0,
  });

  const left = [
    ['STUDENT PORTAL', C.blue, 'PARENTS & STUDENTS', 'Access KYC-verified tutors, post home or online requirements, evaluate educators through free trial sessions, and track attendance and monthly report cards.'],
    ['INSTITUTION DESK', C.purple, 'TUITION CENTERS', 'Automate Classes 1–10 batch rosters, daily attendance, test marks, WhatsApp fee reminders, and verified faculty hiring.'],
  ];
  const right = [
    ['TEACHER PORTAL', C.green, 'VERIFIED EDUCATORS', 'Complete KYC verification, browse nearby student leads, submit applications, conduct demos, and manage active student attendance ledgers.'],
    ['SUPER ADMIN', C.amber, 'CENTRAL GOVERNANCE', 'Maintain operational integrity, audit applications, coordinate demos, verify fee submissions, and review financial earnings ledgers.'],
  ];
  [...left.map((item, i) => ({ item, x: 0.8, y: 2.8 + i * 2.0 })), ...right.map((item, i) => ({ item, x: 8.88, y: 2.8 + i * 2.0 }))].forEach(({ item, x, y }) => {
    const [badge, badgeColor, title, desc] = item;
    addCard(slide, x, y, 3.65, 1.85);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2, y: y + 0.15, w: 1.3, h: 0.22, rectRadius: 0.05,
      fill: { color: badgeColor }, line: { color: badgeColor, width: 0.5 },
    });
    slide.addText(badge, {
      x: x + 0.2, y: y + 0.15, w: 1.3, h: 0.22,
      fontFace: F.body, fontSize: 7.3, bold: true, color: C.white,
      align: 'center', valign: 'middle', margin: 0,
    });
    slide.addText(title, {
      x: x + 0.2, y: y + 0.43, w: 3.2, h: 0.3,
      fontFace: F.heading, fontSize: 10.8, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.2, y: y + 0.78, w: 3.25, h: 0.9,
      fontFace: F.body, fontSize: 8.5, color: C.textLight, margin: 0,
    });
  });

  addCard(slide, 4.65, 2.8, 4.03, 3.85, { fill: C.navyElevated, line: C.gold, lineWidth: 1.5 });
  slide.addImage({ path: LOGO, x: 5.97, y: 3.02, w: 1.4, h: 1.4 });
  slide.addText('CENTRAL ADMIN AUTHORITY', {
    x: 4.85, y: 4.48, w: 3.63, h: 0.34,
    fontFace: F.heading, fontSize: 11.3, bold: true,
    color: C.gold, align: 'center', margin: 0,
  });
  slide.addText('• Strict KYC credential verification\n• Private contact redaction engine\n• Admin-relayed demo matching\n• 50% commission and subscription audits\n• Real-time support chat console', {
    x: 4.95, y: 4.92, w: 3.43, h: 1.45,
    fontFace: F.body, fontSize: 8.8, color: C.textLight,
    align: 'center', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 03 — CHALLENGES
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 3, 'Market Challenge', 'Challenges in the Traditional Tuition Process', 'Key friction points faced by parents, educators, and coaching centers in unmanaged environments.');
  const problems = [
    ['01', 'Unverified Tutor Credentials', 'Parents struggle to verify background, educational qualifications, and identity proofs of private home tutors, risking quality and safety.'],
    ['02', 'Uncontrolled Contact Sharing', 'Open directories expose private phone numbers and home addresses prematurely, leading to unsolicited calls, spam, and privacy risks.'],
    ['03', 'Disorganized Demo Evaluations', 'Lack of structured trial classes means parents have no standard way to evaluate teaching compatibility before committing to a tutor.'],
    ['04', 'Fragmented Tutor Discovery', 'Qualified teachers lack a transparent platform to discover genuine student leads filtered by locality, board syllabus, and grade level.'],
    ['05', 'Coaching Center Record Friction', 'Tuition centers rely on manual paper registers to manage Class 1–10 batches, attendance, test marks, and monthly fee dues.'],
    ['06', 'Disputed Commission Settlements', 'Absence of an immutable audit trail for commissions, subscription passes, and fee verification creates operational disputes.'],
  ];
  problems.forEach(([num, title, desc], i) => {
    const x = 0.8 + (i % 3) * 3.98;
    const y = 1.9 + Math.floor(i / 3) * 2.45;
    addCard(slide, x, y, 3.78, 2.25);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2, y: y + 0.2, w: 0.55, h: 0.3, rectRadius: 0.05,
      fill: { color: C.navyDark }, line: { color: C.gold, width: 1 },
    });
    slide.addText(num, {
      x: x + 0.2, y: y + 0.2, w: 0.55, h: 0.3,
      fontFace: F.body, fontSize: 9.5, bold: true, color: C.gold,
      align: 'center', valign: 'middle', margin: 0,
    });
    slide.addText(title, {
      x: x + 0.85, y: y + 0.18, w: 2.72, h: 0.36,
      fontFace: F.heading, fontSize: 11.2, bold: true, color: C.white, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.2, y: y + 0.67, w: 3.38, h: 1.38,
      fontFace: F.body, fontSize: 9.3, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 04 — SOLUTION FLOW
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 4, 'Platform Solution', 'The Smart Minds Tuitions Solution', 'A controlled, admin-moderated marketplace designed for trust, privacy, and operational clarity.');
  addCard(slide, 0.8, 1.85, 11.73, 0.7, { line: C.gold });
  slide.addText('CONTROLLED MARKETPLACE MODEL: All student requirements, tutor applications, demo sessions, and contact coordinates flow through an authenticated Admin Verification & Matching Engine.', {
    x: 1.0, y: 1.85, w: 11.33, h: 0.7,
    fontFace: F.body, fontSize: 10, bold: true, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
  const steps = [
    ['01', 'Requirement Posted', 'Parent specifies syllabus, grade, location and budget.'],
    ['02', 'Admin Review', 'Requirement is validated and published to the verified pool.'],
    ['03', 'Verified Tutor Pool', 'Only KYC-approved educators discover the lead.'],
    ['04', 'Tutor Applications', 'Qualified educators submit structured applications.'],
    ['05', 'Tutor Selection', 'Admin selects the optimal educator candidate.'],
    ['06', 'Demo Scheduled', 'Free trial evaluation class coordinated by Admin.'],
    ['07', 'Parent Decision', 'Binary decision recorded: Accepted or Rejected.'],
    ['08', 'Fee Verification', 'Tutor submits 50% first-month commission proof.'],
    ['09', 'Contacts Unlocked', 'Mutual phone numbers and address are revealed.'],
    ['10', 'Tuition Begins', 'Classes begin with attendance and reports.'],
  ];
  steps.forEach(([num, title, desc], i) => {
    const x = 0.8 + (i % 5) * 2.38;
    const y = 2.75 + Math.floor(i / 5) * 2.0;
    addCard(slide, x, y, 2.22, 1.82, { line: i === 6 || i === 8 ? C.gold : C.navyBorder });
    addNumberBadge(slide, num, x + 0.15, y + 0.15, 0.32);
    slide.addText(title, {
      x: x + 0.53, y: y + 0.12, w: 1.53, h: 0.38,
      fontFace: F.heading, fontSize: 9.3, bold: true, color: C.white, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.15, y: y + 0.59, w: 1.92, h: 1.08,
      fontFace: F.body, fontSize: 8.35, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 05 — FOUR USER EXPERIENCES
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 5, 'Role Architecture', 'One Platform. Four User Experiences.', 'Granular, role-based workflows tailored to parents, educators, centers, and platform administrators.');
  const roles = [
    ['STUDENT PORTAL', C.blue, 'PARENT / STUDENT', ['Multi-child profile registration (CBSE / ICSE)', 'Post home and online tuition requirements', 'Track scheduled evaluation demos', 'Accept or reject demo educators', 'Unlocked tutor contact coordinates', 'Real-time daily attendance registers', 'Monthly academic progress reports', 'Direct support chat with Admin']],
    ['TEACHER PORTAL', C.green, 'EDUCATOR / TUTOR', ['Aadhaar and Degree KYC verification', 'Multi-class and subject teaching profile', 'Browse verified student requirements', 'Apply for assignments and demos', 'Active tuition operations and student details', 'Lesson attendance and topic registers', 'Submit monthly progress cards', 'Multi-Tuition Passes and commission desk']],
    ['INSTITUTION DESK', C.purple, 'TUITION CENTER', ['Trade license and center registration audit', 'Class 1–10 batch creation and capacity caps', 'Student enrollment and batch assignment', 'Daily batch attendance registers', 'Unit test and exam performance ledgers', 'Monthly fee collection status tracking', '1-Click WhatsApp payment reminders', 'Hire verified subject faculty from Admin']],
    ['CONTROL ROOM', C.amber, 'SUPER ADMIN', ['Executive KPI metrics and intelligence', 'Educator KYC document audit', 'Tuition center accreditation review', 'Requirement moderation and lead dispatch', 'Demo coordination and relay', '50% commission proof verification', 'Multi-Tuition Subscription activation', 'Real-time multi-channel support console']],
  ];
  roles.forEach(([badge, badgeColor, title, items], i) => {
    const x = 0.8 + i * 2.98;
    addCard(slide, x, 1.85, 2.8, 4.9);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.15, y: 2.0, w: 1.3, h: 0.22, rectRadius: 0.05,
      fill: { color: badgeColor }, line: { color: badgeColor, width: 0.5 },
    });
    slide.addText(badge, {
      x: x + 0.15, y: 2.0, w: 1.3, h: 0.22,
      fontFace: F.body, fontSize: 7.2, bold: true, color: C.white,
      align: 'center', valign: 'middle', margin: 0,
    });
    slide.addText(title, {
      x: x + 0.15, y: 2.3, w: 2.5, h: 0.33,
      fontFace: F.heading, fontSize: 10.4, bold: true, color: C.gold, margin: 0,
    });
    addBulletList(slide, items, x + 0.15, 2.75, 2.5, 3.72, { fontSize: 8.35 });
  });
}

// -----------------------------------------------------------------------------
// 06 — SEVEN-STEP LIFECYCLE
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 6, 'Operational Lifecycle', 'How It Works — Step-by-Step Lifecycle', 'The standard operational timeline from account onboarding to active tuition delivery.');
  const timeline = [
    ['01', 'REGISTER', 'Parent, Tutor, or Tuition Center creates an account.'],
    ['02', 'VERIFICATION', 'Admin audits Government ID and Degree certificates.'],
    ['03', 'REQUIREMENT', 'Parent specifies subject, grade, locality and schedule.'],
    ['04', 'MATCHING', 'Approved tutors browse leads and submit applications.'],
    ['05', 'DEMO CLASS', 'Admin coordinates a free evaluation trial session.'],
    ['06', 'CONFIRMATION', 'Parent accepts or rejects educator based on demo.'],
    ['07', 'TUITION STARTS', 'Commission paid, contacts unlocked, classes begin.'],
  ];
  timeline.forEach(([num, title, desc], i) => {
    const x = 0.8 + i * 1.7;
    addCard(slide, x, 2.1, 1.55, 4.4, { line: i === 4 || i === 6 ? C.gold : C.navyBorder });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.45, y: 2.36, w: 0.65, h: 0.65,
      fill: { color: C.navyDark }, line: { color: C.gold, width: 1.5 },
    });
    slide.addText(num, {
      x: x + 0.45, y: 2.36, w: 0.65, h: 0.65,
      fontFace: F.heading, fontSize: 12, bold: true, color: C.gold,
      align: 'center', valign: 'middle', margin: 0,
    });
    slide.addText(title, {
      x: x + 0.1, y: 3.2, w: 1.35, h: 0.4,
      fontFace: F.heading, fontSize: 9.3, bold: true, color: C.white,
      align: 'center', margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.1, y: 3.75, w: 1.35, h: 2.15,
      fontFace: F.body, fontSize: 8.35, color: C.textLight,
      align: 'center', margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 07 — PARENT JOURNEY
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 7, 'User Journey', 'Parent & Student Journey', 'A transparent, stress-free experience from tutor discovery to ongoing progress reporting.');
  const journey = [
    ['01', 'Register Account', 'Sign up with verified email and mobile number.'],
    ['02', 'Add Child Profiles', 'Configure student grade (1–12), board (CBSE/ICSE) and school.'],
    ['03', 'Post Requirement', 'Specify subjects, locality, budget and preferred schedule.'],
    ['04', 'Admin Dispatches Lead', 'Requirement is validated and published to verified tutors.'],
    ['05', 'Candidate Assigned', 'Admin matches the best-suited educator for trial.'],
    ['06', 'Attend Demo Session', 'Free trial evaluation class conducted online or at home.'],
    ['07', 'Accept / Reject', 'Parent records binary feedback on the portal.'],
    ['08', 'Full Access & Tuition', 'Tutor contacts revealed; attendance and reports active.'],
  ];
  journey.forEach(([num, title, desc], i) => {
    const x = 0.8 + (i % 4) * 2.98;
    const y = 1.9 + Math.floor(i / 4) * 2.15;
    addCard(slide, x, y, 2.8, 1.95);
    addNumberBadge(slide, num, x + 0.15, y + 0.15, 0.32);
    slide.addText(title, {
      x: x + 0.53, y: y + 0.12, w: 2.12, h: 0.36,
      fontFace: F.heading, fontSize: 10.3, bold: true, color: C.white, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.15, y: y + 0.58, w: 2.48, h: 1.2,
      fontFace: F.body, fontSize: 8.85, color: C.textLight, margin: 0,
    });
  });
  addCard(slide, 0.8, 6.25, 11.73, 0.55, { fill: C.navyDark, line: C.gold });
  slide.addText('PRIVACY GUARANTEE: Parents do not receive unrestricted tutor contact coordinates before formal assignment and accepted demo confirmation.', {
    x: 1.0, y: 6.25, w: 11.33, h: 0.55,
    fontFace: F.body, fontSize: 9.3, bold: true, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 08 — TUTOR JOURNEY AND SUBSCRIPTIONS
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 8, 'Educator Operations', 'Educator Journey & Multi-Tuition Passes', 'Onboarding verified teachers, discovering assignments, and managing multi-tuition tiers.');
  addCard(slide, 0.8, 1.85, 5.75, 4.85);
  slide.addText('EDUCATOR ONBOARDING & LIFECYCLE', {
    x: 1.0, y: 2.05, w: 5.35, h: 0.32,
    fontFace: F.heading, fontSize: 11.4, bold: true, color: C.gold, margin: 0,
  });
  slide.addText([
    '1. Onboarding & KYC: Upload Aadhaar / Passport & Degree Certificates.',
    '2. Agreement Acceptance: Review and accept tutor code of conduct.',
    '3. Admin Audit: Admin approves tutor profile after credential verification.',
    '4. Browse & Apply: Discover nearby student leads filtered by locality.',
    '5. Conduct Demo: Deliver free trial session and await parent decision.',
    '6. 50% Commission Desk: Submit first-month commission proof for active classes.',
    '7. Attendance & Reports: Log class topics, homework, and monthly scores.',
  ].join('\n\n'), {
    x: 1.0, y: 2.5, w: 5.35, h: 3.98,
    fontFace: F.body, fontSize: 8.9, color: C.textLight, margin: 0,
  });

  addCard(slide, 6.78, 1.85, 5.75, 4.85, { line: C.gold });
  slide.addText('MULTI-TUITION SUBSCRIPTION PASSES', {
    x: 7.0, y: 2.05, w: 5.35, h: 0.32,
    fontFace: F.heading, fontSize: 11.4, bold: true, color: C.gold, margin: 0,
  });
  slide.addText('Tutors taking 2 or more concurrent tuitions require an active subscription tier as mandated by the SRS specification:', {
    x: 7.0, y: 2.42, w: 5.35, h: 0.42,
    fontFace: F.body, fontSize: 8.9, color: C.white, margin: 0,
  });
  const tiers = [
    ['3 Months Pass', '₹300', 'Valid for 90 days concurrent lead applications'],
    ['6 Months Pass', '₹600', 'Valid for 180 days concurrent lead applications'],
    ['9 Months Pass', '₹900', 'Valid for 270 days concurrent lead applications'],
    ['12 Months Pass', '₹1200', 'Annual pass for unlimited concurrent tuition applications'],
  ];
  tiers.forEach(([term, fee, desc], i) => {
    const y = 2.96 + i * 0.87;
    addCard(slide, 7.0, y, 5.31, 0.75, { fill: C.navyDark });
    slide.addText(term, {
      x: 7.15, y: y + 0.1, w: 2.85, h: 0.27,
      fontFace: F.heading, fontSize: 9.7, bold: true, color: C.goldLight, margin: 0,
    });
    slide.addText(fee, {
      x: 10.75, y: y + 0.1, w: 1.4, h: 0.27,
      fontFace: F.heading, fontSize: 10.8, bold: true, color: C.green,
      align: 'right', margin: 0,
    });
    slide.addText(desc, {
      x: 7.15, y: y + 0.4, w: 4.95, h: 0.24,
      fontFace: F.body, fontSize: 8.25, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 09 — TUITION CENTER MANAGEMENT
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 9, 'Institutional Module', 'Dedicated Tuition Center Management', 'An enterprise portal enabling coaching centers to automate Classes 1–10 batches, attendance and fees.');
  const modules = [
    ['Classes 1–10 Batch Architecture', 'Create academic batches by grade, assign subject faculty, configure timings, and enforce capacity limits.'],
    ['Student Roster Management', 'Enroll students, assign them to batches, track guardian contacts, and monitor active or inactive status.'],
    ['Daily Batch Attendance Registers', 'Record Present, Absent, and Late statuses across all enrolled batch students with historical logs.'],
    ['Unit Test & Exam Performance', 'Record periodic marks, calculate subject averages, track ranks, and generate parent-facing report cards.'],
    ['Monthly Fee Collection Ledger', 'Track Paid versus Pending status per student with payment method, transaction ID, and dates.'],
    ['1-Click WhatsApp Fee Reminders', 'Trigger pre-formatted WhatsApp payment reminders directly to parent mobile numbers.'],
  ];
  modules.forEach(([title, desc], i) => {
    const x = 0.8 + (i % 3) * 3.98;
    const y = 1.9 + Math.floor(i / 3) * 2.15;
    addCard(slide, x, y, 3.78, 1.95);
    slide.addText(title, {
      x: x + 0.2, y: y + 0.16, w: 3.38, h: 0.35,
      fontFace: F.heading, fontSize: 10.4, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.2, y: y + 0.57, w: 3.38, h: 1.2,
      fontFace: F.body, fontSize: 8.85, color: C.textLight, margin: 0,
    });
  });
  addCard(slide, 0.8, 6.25, 11.73, 0.55, { fill: C.navyDark, line: C.purple });
  slide.addText('FACULTY RECRUITMENT DESK: Tuition centers can submit formal requests to Admin for qualified subject tutors and specialized educators from the verified tutor pool.', {
    x: 1.0, y: 6.25, w: 11.33, h: 0.55,
    fontFace: F.body, fontSize: 9, bold: true, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 10 — ADMIN CONTROL CENTER
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 10, 'Platform Governance', 'Centralized Admin Control Center', 'The single operational authority for verification, matching, assignments, and platform earnings.');
  const desks = [
    ['Executive KPI Dashboard', 'Global platform metrics: requirements, active tuitions, verified tutors, and centers.'],
    ['Educator KYC Audit Desk', 'Review government ID cards and degree memos; approve or reject with recorded feedback.'],
    ['Center Accreditation Desk', 'Audit institutional registration certificates, trade licenses, and director credentials.'],
    ['Lead Matching & Dispatch', 'Review incoming parent requirements and audit tutor applications before selection.'],
    ['Demo Coordination Console', 'Schedule evaluation demos and relay parent confirmation decisions to educators.'],
    ['50% Commission Desk', 'Audit tutor UPI screenshots; approval unlocks mutual contact details.'],
    ['Subscription Approval Desk', 'Verify 3, 6, 9, 12-month pass payments and activate access.'],
    ['Financial Intelligence Ledger', 'Unified ledger tracking platform revenue streams with receipt verification.'],
    ['Multi-Channel Support Chat', 'Real-time WebSocket messaging hub communicating with all four platform roles.'],
    ['Security Audit Trail', 'Immutable log of administrative actions, KYC decisions, and financial events.'],
  ];
  desks.forEach(([title, desc], i) => {
    const x = 0.8 + (i % 2) * 5.98;
    const y = 1.9 + Math.floor(i / 2) * 0.96;
    addCard(slide, x, y, 5.75, 0.84);
    slide.addText(title, {
      x: x + 0.2, y: y + 0.08, w: 5.35, h: 0.27,
      fontFace: F.heading, fontSize: 9.9, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.2, y: y + 0.38, w: 5.35, h: 0.36,
      fontFace: F.body, fontSize: 8.35, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 11 — TRUST AND SECURITY
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 11, 'Security Framework', 'Built Around Trust & Controlled Access', 'Rigorous data privacy, credential verification, and role-based access boundaries.');
  const pillars = [
    ['KYC Document Verification', 'Government ID proofs (Aadhaar / Passport) and degree memos are verified by Admin before tutors can apply.'],
    ['Mutual Contact Redaction', 'Phone numbers, emails, and home addresses stay hidden until demo acceptance and commission verification.'],
    ['Role-Based Access Control', 'JWT authentication and authorization middleware isolate Parent, Tutor, Center, and Admin portals.'],
    ['Protected Document Storage', 'Sensitive KYC documents and transaction screenshots are accessible only via authenticated routes.'],
    ['Password Security Standards', 'Credentials are protected using salted BCrypt password hashing during authentication.'],
    ['Immutable Audit Logging', 'Administrative decisions, KYC approvals, status updates, and financial events are timestamped and logged.'],
  ];
  pillars.forEach(([title, desc], i) => {
    const x = 0.8 + (i % 3) * 3.98;
    const y = 1.9 + Math.floor(i / 3) * 2.45;
    addCard(slide, x, y, 3.78, 2.25);
    slide.addText(title, {
      x: x + 0.2, y: y + 0.18, w: 3.38, h: 0.35,
      fontFace: F.heading, fontSize: 10.8, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.2, y: y + 0.64, w: 3.38, h: 1.4,
      fontFace: F.body, fontSize: 9.2, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 12 — PAYMENT AND COMMISSION
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 12, 'Financial Governance', 'Simple, Transparent Payment Verification', 'Controlled manual UPI verification workflows for tutor subscriptions and first-month commissions.');
  addCard(slide, 0.8, 1.85, 5.75, 4.15);
  slide.addText('TUTOR MULTI-TUITION SUBSCRIPTION', {
    x: 1.0, y: 2.05, w: 5.35, h: 0.32,
    fontFace: F.heading, fontSize: 11.3, bold: true, color: C.gold, margin: 0,
  });
  slide.addText([
    '1. Plan Selection: Tutor selects 3, 6, 9, or 12-month pass (₹300 – ₹1200).',
    '2. External Payment: Makes external UPI payment to Admin QR code.',
    '3. Proof Upload: Submits UTR and payment screenshot.',
    '4. Admin Verification: Admin verifies receipt on Subscription Desk.',
    '5. Activation: Subscription pass is activated for multi-tuition applications.',
  ].join('\n\n'), {
    x: 1.0, y: 2.5, w: 5.35, h: 3.2,
    fontFace: F.body, fontSize: 9.3, color: C.textLight, margin: 0,
  });

  addCard(slide, 6.78, 1.85, 5.75, 4.15);
  slide.addText('50% FIRST-MONTH COMMISSION WORKFLOW', {
    x: 7.0, y: 2.05, w: 5.35, h: 0.32,
    fontFace: F.heading, fontSize: 11.3, bold: true, color: C.gold, margin: 0,
  });
  slide.addText([
    '1. Demo Accepted: Parent marks the assignment Accepted.',
    '2. Direct Payment: Tutor receives first-month tuition fee from parent.',
    '3. 50% Commission: Tutor pays the one-time commission via UPI.',
    '4. Proof Submission: Tutor uploads payment proof and UTR number.',
    '5. Assignment Active: Admin approves; mutual contacts are unlocked.',
  ].join('\n\n'), {
    x: 7.0, y: 2.5, w: 5.35, h: 3.2,
    fontFace: F.body, fontSize: 9.3, color: C.textLight, margin: 0,
  });
  addCard(slide, 0.8, 6.18, 11.73, 0.62, { fill: C.navyDark, line: C.gold });
  slide.addText('IMPORTANT FINANCIAL CLARIFICATION: Regular monthly tuition fee payments between parents and tutors take place outside the platform. The platform manages only tutor subscriptions and first-month commissions.', {
    x: 1.0, y: 6.18, w: 11.33, h: 0.62,
    fontFace: F.body, fontSize: 8.9, bold: true, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 13 — COMMUNICATION CHANNELS
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 13, 'Communication Hub', 'Centralized Communication Channels', 'Two clearly separated communication mediums designed for authenticated users and public inquiries.');
  addCard(slide, 0.8, 1.9, 5.75, 4.85, { line: C.gold });
  slide.addText('CHANNEL 1: REAL-TIME IN-APP CHAT', {
    x: 1.05, y: 2.15, w: 5.25, h: 0.35,
    fontFace: F.heading, fontSize: 11.7, bold: true, color: C.gold, margin: 0,
  });
  slide.addText('• Purpose: Secure, authenticated operational messaging.\n• Technology: Socket.IO WebSockets with JWT handshake verification.\n• Direct Support Channels:\n   – Parent ↔ Admin (Academic counseling and demo feedback)\n   – Tutor ↔ Admin (Lead clarification and commission support)\n   – Tuition Center ↔ Admin (Faculty requests and accreditation)\n• Features: Instant delivery, unread badges, typing indicators, and message history.', {
    x: 1.05, y: 2.68, w: 5.25, h: 3.75,
    fontFace: F.body, fontSize: 9.7, color: C.textLight, margin: 0,
  });
  addCard(slide, 6.78, 1.9, 5.75, 4.85, { line: C.green });
  slide.addText('CHANNEL 2: PUBLIC WHATSAPP INQUIRY', {
    x: 7.05, y: 2.15, w: 5.25, h: 0.35,
    fontFace: F.heading, fontSize: 11.7, bold: true, color: C.green, margin: 0,
  });
  slide.addText('• Purpose: Pre-registration public inquiries and prospective support.\n• Integration: Floating WhatsApp badge on public marketing pages.\n• User Flow:\n   – Prospective parents and tutors click the WhatsApp badge.\n   – Redirects to WhatsApp with a pre-formatted inquiry template.\n   – Connects to the Smart Minds Tuitions official admin desk.\n• Distinction: WhatsApp and In-App Chat remain separate communication channels.', {
    x: 7.05, y: 2.68, w: 5.25, h: 3.75,
    fontFace: F.body, fontSize: 9.7, color: C.textLight, margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 14 — TECHNOLOGY ARCHITECTURE
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 14, 'System Engineering', 'Technology Architecture', 'A modern, modular full-stack stack engineered for reliability, responsiveness, and zero-setup deployment.');
  const layers = [
    ['FRONTEND CLIENT', 'React 18 + Vite + Tailwind CSS', 'Single-page application, Lucide icons, responsive layout, and role-based portal routing.'],
    ['BACKEND API SERVER', 'Node.js + Express.js REST API', 'Modular controllers, RBAC middleware, privacy redaction, and protected document routes.'],
    ['REAL-TIME WEBSOCKETS', 'Socket.IO (v4)', 'Authenticated event gateway for live support messaging, typing indicators, and notifications.'],
    ['DATABASE & DUAL ENGINE', 'MongoDB + In-Memory Fallback', 'Mongoose schemas with automatic zero-config in-memory MongoDB failover for rapid development.'],
    ['SECURITY & ENCRYPTION', 'JWT + BCrypt + Helmet', 'Cryptographic authentication, salted password hashing, NoSQL sanitization, and rate limiting.'],
  ];
  layers.forEach(([label, tech, desc], i) => {
    const y = 1.85 + i * 0.98;
    addCard(slide, 0.8, y, 11.73, 0.85);
    addCard(slide, 1.0, y + 0.15, 2.5, 0.55, { fill: C.navyDark, line: C.gold });
    slide.addText(label, {
      x: 1.0, y: y + 0.15, w: 2.5, h: 0.55,
      fontFace: F.body, fontSize: 8.8, bold: true, color: C.goldLight,
      align: 'center', valign: 'middle', margin: 0,
    });
    slide.addText(tech, {
      x: 3.7, y: y + 0.12, w: 4.2, h: 0.32,
      fontFace: F.heading, fontSize: 11.3, bold: true, color: C.white, margin: 0,
    });
    slide.addText(desc, {
      x: 3.7, y: y + 0.44, w: 8.5, h: 0.3,
      fontFace: F.body, fontSize: 8.8, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 15 — SYSTEM TOPOLOGY
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 15, 'Ecosystem Topology', 'Platform Ecosystem & Security Architecture', 'High-level topology showing authenticated role interfaces and backend service modules.');
  addCard(slide, 0.8, 1.85, 11.73, 4.9, { fill: C.navyDark });
  const portals = [
    ['Parent / Student Portal', 'Protected Route: /parent/*', C.blue, 1.2],
    ['Educator / Tutor Portal', 'Protected Route: /tutor/*', C.green, 4.9],
    ['Tuition Center Desk', 'Protected Route: /center/*', C.purple, 8.6],
  ];
  portals.forEach(([title, route, col, x]) => {
    addCard(slide, x, 2.1, 3.4, 0.9, { line: col });
    slide.addText(title, {
      x, y: 2.15, w: 3.4, h: 0.32,
      fontFace: F.heading, fontSize: 10.3, bold: true, color: C.white,
      align: 'center', margin: 0,
    });
    slide.addText(route, {
      x, y: 2.52, w: 3.4, h: 0.28,
      fontFace: F.body, fontSize: 8.5, color: C.goldLight,
      align: 'center', margin: 0,
    });
  });
  addCard(slide, 2.8, 3.3, 7.73, 1.45, { line: C.gold, lineWidth: 1.5 });
  slide.addText('CENTRAL ADMIN GATEWAY & REST API CONTROLLERS', {
    x: 3.0, y: 3.43, w: 7.33, h: 0.32,
    fontFace: F.heading, fontSize: 10.8, bold: true, color: C.gold,
    align: 'center', margin: 0,
  });
  slide.addText('• KYC Document Audit\n• Lead Dispatch & Matching\n• Demo Coordination', {
    x: 3.2, y: 3.85, w: 3.4, h: 0.8,
    fontFace: F.body, fontSize: 8.8, color: C.textLight, margin: 0,
  });
  slide.addText('• 50% Commission Desk\n• Subscription Pass Manager\n• Socket.IO Live Chat Server', {
    x: 6.8, y: 3.85, w: 3.4, h: 0.8,
    fontFace: F.body, fontSize: 8.8, color: C.textLight, margin: 0,
  });
  addCard(slide, 2.8, 5.05, 7.73, 1.4);
  slide.addText('MONGODB DATABASE & PROTECTED STORAGE LAYER', {
    x: 3.0, y: 5.15, w: 7.33, h: 0.32,
    fontFace: F.heading, fontSize: 10.4, bold: true, color: C.white,
    align: 'center', margin: 0,
  });
  slide.addText('Collections: Users • Profiles • TuitionRequirements • Applications • Demos • Assignments • Attendance • MonthlyReports • Batches • FeeLedgers • Subscriptions • AuditLogs', {
    x: 3.1, y: 5.55, w: 7.13, h: 0.72,
    fontFace: F.body, fontSize: 8.4, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 16 — CAPABILITIES GRID
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 16, 'Feature Matrix', 'Core Platform Capabilities', '16 core functional capabilities engineered to meet the complete SRS specification.');
  const caps = ['Tutor KYC Verification', 'Parent Registration', 'Tuition Requirements', 'Tutor Applications', 'Admin Lead Matching', 'Evaluation Demo Classes', 'Tutor Assignments', 'Lesson Attendance Ledger', 'Monthly Progress Reports', 'Tuition Center Batches', 'Multi-Tuition Passes', '50% Commission Desk', 'Real-Time Admin Chat', 'WhatsApp Reminder Triggers', 'Role-Based Access Control', 'Protected Document Desk'];
  caps.forEach((title, i) => {
    const x = 0.8 + (i % 4) * 2.98;
    const y = 1.9 + Math.floor(i / 4) * 1.2;
    addCard(slide, x, y, 2.8, 1.05);
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.15, y: y + 0.32, w: 0.4, h: 0.4, rectRadius: 0.06,
      fill: { color: C.green }, line: { color: C.green, width: 0.5 },
    });
    slide.addText('✓', {
      x: x + 0.15, y: y + 0.32, w: 0.4, h: 0.4,
      fontFace: F.body, fontSize: 11, bold: true, color: C.white,
      align: 'center', valign: 'middle', margin: 0,
    });
    slide.addText(title, {
      x: x + 0.65, y: y + 0.15, w: 2.02, h: 0.75,
      fontFace: F.heading, fontSize: 9.8, bold: true, color: C.white,
      valign: 'middle', margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 17 — PERSONA DASHBOARDS
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 17, 'Interface Experience', 'Designed per User Persona', 'Contextual dashboards crafted specifically for parents, educators, center directors, and administrators.');
  const personas = [
    ['PARENT DASHBOARD', ['Active Requirements', 'Scheduled Demo Sessions', 'Assigned Tutors', 'Monthly Report Cards']],
    ['EDUCATOR DASHBOARD', ['Nearby Student Leads', 'Submitted Applications', 'Active Tuitions', 'Monthly Attendance Logs']],
    ['TUITION CENTER DESK', ['Class 1–10 Batches', 'Enrolled Student Rosters', 'Daily Attendance Marked', 'Monthly Fee Dues Ledger']],
    ['ADMIN CONTROL ROOM', ['Pending Tutor KYC Audits', '50% Commission Proofs', 'Multi-Tuition Passes', 'Live Support Conversations']],
  ];
  personas.forEach(([role, metrics], i) => {
    const x = 0.8 + (i % 2) * 5.98;
    const y = 1.9 + Math.floor(i / 2) * 2.45;
    addCard(slide, x, y, 5.75, 2.25);
    slide.addText(role, {
      x: x + 0.2, y: y + 0.15, w: 5.35, h: 0.32,
      fontFace: F.heading, fontSize: 11, bold: true, color: C.gold, margin: 0,
    });
    metrics.forEach((metric, j) => {
      const mx = x + 0.2 + (j % 2) * 2.72;
      const my = y + 0.58 + Math.floor(j / 2) * 0.76;
      addCard(slide, mx, my, 2.62, 0.65, { fill: C.navyDark });
      slide.addText(metric, {
        x: mx + 0.1, y: my + 0.08, w: 2.42, h: 0.5,
        fontFace: F.body, fontSize: 8.8, color: C.textLight,
        align: 'center', valign: 'middle', margin: 0,
      });
    });
  });
}

// -----------------------------------------------------------------------------
// 18 — RESPONSIVE ACCESS
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 18, 'Accessibility', 'Accessible Across Devices', 'A responsive web application accessible across desktop monitors, laptops, tablets, and smartphones.');
  const devices = [
    ['Desktop & Laptops', 'Optimized for high-productivity workflows: Admin control room, center batch registers, multi-column lead browsing, and attendance tables.'],
    ['Tablets & iPads', 'Fluid touch navigation for parents reviewing tutor credentials, checking demo dates, and approving monthly reports.'],
    ['Mobile Browsers', 'Instant access on iOS and Android browsers for tutors marking attendance on-the-go and parents receiving reminders.'],
  ];
  devices.forEach(([title, desc], i) => {
    const x = 0.8 + i * 3.98;
    addCard(slide, x, 1.9, 3.78, 3.95);
    slide.addText(title, {
      x: x + 0.2, y: 2.25, w: 3.38, h: 0.38,
      fontFace: F.heading, fontSize: 12.3, bold: true, color: C.gold,
      align: 'center', margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.3, y: 2.9, w: 3.18, h: 2.35,
      fontFace: F.body, fontSize: 9.8, color: C.textLight,
      align: 'center', margin: 0,
    });
  });
  addCard(slide, 0.8, 6.1, 11.73, 0.7, { fill: C.navyDark, line: C.gold });
  slide.addText('ZERO INSTALLATION FRICTION: Built as a modern Single Page Web Application, users require no app store downloads and can log in securely from any standard browser.', {
    x: 1.0, y: 6.1, w: 11.33, h: 0.7,
    fontFace: F.body, fontSize: 9.3, bold: true, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 19 — STAKEHOLDER VALUE
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 19, 'Strategic Impact', 'Value Delivered Across All Stakeholders', 'Delivering safety, operational efficiency, and revenue transparency to every user persona.');
  const values = [
    ['PARENTS & STUDENTS', ['Verified educators with audited IDs and degrees', 'Zero upfront contact leakage or spam', 'Free evaluation demo before commitment', 'Continuous monthly progress and attendance logs']],
    ['QUALIFIED TUTORS', ['Genuine nearby tuition lead discovery', 'Professional credential verification badges', 'Multi-tuition subscription passes for scale', 'Transparent 50% commission verification desk']],
    ['TUITION CENTERS', ['Classes 1–10 batch configuration and caps', 'Paperless attendance and test ledgers', '1-Click WhatsApp payment reminders', 'Faculty hiring from the verified pool']],
    ['PLATFORM OWNERS', ['Total administrative control over matching', 'Multi-stream revenue (commissions + subscriptions)', 'Immutable security and financial audit trail', 'Integrated real-time support chat desk']],
  ];
  values.forEach(([title, items], i) => {
    const x = 0.8 + (i % 2) * 5.98;
    const y = 1.9 + Math.floor(i / 2) * 2.45;
    addCard(slide, x, y, 5.75, 2.25);
    slide.addText(title, {
      x: x + 0.2, y: y + 0.15, w: 5.35, h: 0.32,
      fontFace: F.heading, fontSize: 11, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(items.map(item => `✓  ${item}`).join('\n'), {
      x: x + 0.2, y: y + 0.55, w: 5.35, h: 1.5,
      fontFace: F.body, fontSize: 9, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 20 — CURRENT PRODUCT SCOPE
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 20, 'Deliverables Inventory', 'Current Product Scope', 'A comprehensive inventory of fully engineered and verified deliverables based on the SRS.');
  const groups = [
    ['FRONTEND MODULES', ['Parent & Student Portal (8 Pages)', 'Educator & Tutor Portal (11 Pages)', 'Tuition Center Desk (8 Pages)', 'Super Admin Control Room (10 Pages)', 'Marketing Pages & 1-Click Login']],
    ['BACKEND SERVICES', ['JWT Auth & RBAC Middleware', 'Contact Privacy Redaction Pipeline', 'Protected Document Storage Desk', 'Dual Engine (MongoDB + Memory Failover)', 'Socket.IO Real-Time Chat Server']],
    ['BUSINESS WORKFLOWS', ['Tutor KYC Aadhaar/Degree Audit', 'Lead Posting & Tutor Applications', 'Evaluation Demo Class Lifecycle', '50% First-Month Commission Desk', '3/6/9/12-Month Subscription Passes']],
    ['INSTITUTIONAL TOOLS', ['Classes 1–10 Batch Management', 'Daily Student Attendance Registers', 'Unit Test & Exam Score Ledgers', 'Monthly Fee Collection Tracking', '1-Click WhatsApp Parent Reminders']],
  ];
  groups.forEach(([title, items], i) => {
    const x = 0.8 + (i % 2) * 5.98;
    const y = 1.9 + Math.floor(i / 2) * 2.45;
    addCard(slide, x, y, 5.75, 2.25);
    slide.addText(title, {
      x: x + 0.2, y: y + 0.15, w: 5.35, h: 0.32,
      fontFace: F.heading, fontSize: 11, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(items.map(item => `• ${item}`).join('\n'), {
      x: x + 0.2, y: y + 0.55, w: 5.35, h: 1.5,
      fontFace: F.body, fontSize: 9, color: C.textLight, margin: 0,
    });
  });
}

// -----------------------------------------------------------------------------
// 21 — ROADMAP
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  addMaster(slide, 21, 'Product Roadmap', 'Future Expansion Opportunities', 'Strategic enhancements for subsequent version releases beyond current SRS scope.');
  const roadmap = [
    ['Payment Gateway Integration', 'Automated UPI, credit card, and net banking payment reconciliation.'],
    ['AI-Assisted Tutor Matching', 'Algorithm-driven matching based on syllabus, pace, and tutor experience.'],
    ['Native Mobile Applications', 'Dedicated iOS and Android applications with native push notifications.'],
    ['Embedded Video Classrooms', 'Integrated WebRTC whiteboards and video sessions for online demos.'],
    ['Advanced Learning Analytics', 'Predictive score trendlines, concept gap analysis, and parent insights.'],
    ['Automated WhatsApp Bots', 'Attendance alerts and assignment reminders via WhatsApp Business API.'],
  ];
  roadmap.forEach(([title, desc], i) => {
    const x = 0.8 + (i % 3) * 3.98;
    const y = 1.9 + Math.floor(i / 3) * 2.15;
    addCard(slide, x, y, 3.78, 1.95);
    slide.addText(title, {
      x: x + 0.2, y: y + 0.16, w: 3.38, h: 0.35,
      fontFace: F.heading, fontSize: 10.4, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(desc, {
      x: x + 0.2, y: y + 0.58, w: 3.38, h: 1.15,
      fontFace: F.body, fontSize: 8.9, color: C.textLight, margin: 0,
    });
  });
  addCard(slide, 0.8, 6.25, 11.73, 0.55, { fill: C.navyDark, line: C.amber });
  slide.addText('ROADMAP NOTICE: These modules represent potential future growth avenues and are clearly separated from the current SRS product requirements.', {
    x: 1.0, y: 6.25, w: 11.33, h: 0.55,
    fontFace: F.body, fontSize: 9, bold: true, color: C.goldLight,
    align: 'center', valign: 'middle', margin: 0,
  });
}

// -----------------------------------------------------------------------------
// 22 — VALUE PROPOSITION
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };
  addCard(slide, 1.2, 0.8, 10.93, 5.8, { fill: C.navyBase, line: C.gold, lineWidth: 2, radius: 0.18 });
  slide.addImage({ path: LOGO, x: 5.76, y: 1.2, w: 1.8, h: 1.8 });
  slide.addText('SMART MINDS TUITIONS', {
    x: 1.8, y: 3.2, w: 9.73, h: 0.58,
    fontFace: F.heading, fontSize: 26, bold: true, color: C.white,
    align: 'center', margin: 0,
  });
  slide.addText('"From Finding a Tutor To Managing the Tuition Journey."', {
    x: 1.8, y: 3.83, w: 9.73, h: 0.42,
    fontFace: F.heading, fontSize: 15, italic: true, color: C.gold,
    align: 'center', margin: 0,
  });
  slide.addText('A structured, secure platform connecting parents, students, tutors, and coaching centers through controlled verification, matching, and ongoing tuition operations.', {
    x: 2.2, y: 4.4, w: 8.93, h: 0.72,
    fontFace: F.body, fontSize: 11.4, color: C.textLight,
    align: 'center', margin: 0,
  });
  ['Parents & Students', 'Verified Educators', 'Tuition Centers', 'Central Administration'].forEach((label, i) => {
    const x = 1.8 + i * 2.45;
    addCard(slide, x, 5.4, 2.3, 0.42, { fill: C.navyCard });
    slide.addText(label, {
      x, y: 5.4, w: 2.3, h: 0.42,
      fontFace: F.body, fontSize: 8.8, bold: true, color: C.goldLight,
      align: 'center', valign: 'middle', margin: 0,
    });
  });
  addFooterOnly(slide, 22);
}

// -----------------------------------------------------------------------------
// 23 — FINAL CTA
// -----------------------------------------------------------------------------
{
  const slide = pptx.addSlide();
  slide.background = { color: C.navyDark };
  addCard(slide, 1.2, 0.8, 10.93, 5.8, { fill: C.navyBase, line: C.gold, lineWidth: 1.5, radius: 0.18 });
  slide.addImage({ path: LOGO, x: 1.8, y: 1.8, w: 2.4, h: 2.4 });
  slide.addText("Let's Build a Smarter\nTuition Experience", {
    x: 4.6, y: 1.5, w: 6.8, h: 1.08,
    fontFace: F.heading, fontSize: 26, bold: true,
    color: C.white, margin: 0, valign: 'middle',
  });
  slide.addText('One unified, trusted platform for parents, educators, coaching centers, and platform administrators.', {
    x: 4.6, y: 2.65, w: 6.8, h: 0.48,
    fontFace: F.body, fontSize: 11.4, color: C.goldLight, margin: 0,
  });
  const contact = [
    ['PROJECT INQUIRIES', '[Client Representative Name]'],
    ['OFFICIAL EMAIL', '[contact@smartmindstuitions.com]'],
    ['PLATFORM PORTAL', '[www.smartmindstuitions.com]'],
    ['INQUIRY HELPLINE', '[Official Phone / WhatsApp Helpline]'],
  ];
  contact.forEach(([label, value], i) => {
    const x = 4.6 + (i % 2) * 3.45;
    const y = 3.35 + Math.floor(i / 2) * 1.1;
    addCard(slide, x, y, 3.3, 0.95);
    slide.addText(label, {
      x: x + 0.15, y: y + 0.12, w: 3.0, h: 0.24,
      fontFace: F.body, fontSize: 7.8, bold: true, color: C.gold, margin: 0,
    });
    slide.addText(value, {
      x: x + 0.15, y: y + 0.42, w: 3.0, h: 0.4,
      fontFace: F.body, fontSize: 9.2, color: C.white, margin: 0,
    });
  });
  addFooterOnly(slide, 23);
}

pptx.writeFile({ fileName: OUT })
  .then(fileName => console.log(`[PPTX Audit Complete] Polished presentation saved to: ${fileName}`))
  .catch(error => {
    console.error('[PPTX Audit Error]', error);
    process.exitCode = 1;
  });

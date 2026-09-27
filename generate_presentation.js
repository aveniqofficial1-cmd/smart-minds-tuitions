const pptxgen = require('pptxgenjs');
const path = require('path');

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'Smart Minds Tuitions';
pptx.company = 'Smart Minds Tuitions';
pptx.title = 'Smart Minds Tuitions - Client Project Presentation';

// --- BRAND COLOR PALETTE (RGB Hex without #) ---
const C = {
  navyDark: '050814',      // Deepest background
  navyCore: '0A1128',      // Primary luxury navy
  navyCard: '131F42',      // Elevated navy surface
  navyBorder: '243360',    // Navy outline
  navyLight: '1E2D5A',     // Card accent navy
  goldPrimary: 'D4AF37',   // Champagne Gold
  goldLight: 'F3E5AB',     // Pale champagne gold
  goldDark: '996515',      // Deep antique gold
  goldMuted: 'C5A028',     // Muted gold text
  creamBg: 'FCFBF7',       // Light slide surface
  creamCard: 'F4F0EA',     // Neutral light card
  sandBorder: 'E2DDD5',    // Light border sand
  white: 'FFFFFF',         // Pure white
  textDark: '0A1128',      // Primary dark text
  textMuted: '64748B',     // Gray secondary text
  textLight: 'E2E8F0',     // Light slate text
  greenBadge: '059669',    // Verified success green
  amberBadge: 'D97706',    // Pending amber
  purpleBadge: '7C3AED',   // Center purple
  blueBadge: '2563EB',     // Info blue
};

const FONTS = {
  heading: 'Georgia',
  body: 'Calibri',
};

const LOGO_PATH = path.resolve(__dirname, 'image', 'logo.png');
const HOMEPAGE_PATH = path.resolve(__dirname, 'image', 'homepage.png');

// --- HELPER: Slide Master Decorator ---
function applySlideHeader(slide, categoryTag, titleText, subtitleText, isDark = true) {
  // Background
  slide.background = { color: isDark ? C.navyCore : C.creamBg };

  // Top Banner Pill / Category
  if (categoryTag) {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 0.8,
      y: 0.45,
      w: 2.8,
      h: 0.32,
      rectRadius: 0.15,
      fill: { color: isDark ? C.navyCard : C.creamCard },
      line: { color: isDark ? C.goldPrimary : C.goldDark, width: 1 },
    });
    slide.addText(categoryTag.toUpperCase(), {
      x: 0.8,
      y: 0.45,
      w: 2.8,
      h: 0.32,
      fontSize: 9,
      fontFace: FONTS.body,
      bold: true,
      color: isDark ? C.goldLight : C.goldDark,
      align: 'center',
      valign: 'middle',
    });
  }

  // Slide Main Title
  slide.addText(titleText, {
    x: 0.8,
    y: categoryTag ? 0.82 : 0.5,
    w: 8.5,
    h: 0.6,
    fontSize: 22,
    fontFace: FONTS.heading,
    bold: true,
    color: isDark ? C.white : C.navyDark,
    valign: 'middle',
  });

  // Slide Subtitle / Supporting description
  if (subtitleText) {
    slide.addText(subtitleText, {
      x: 0.8,
      y: categoryTag ? 1.38 : 1.1,
      w: 11.5,
      h: 0.35,
      fontSize: 11,
      fontFace: FONTS.body,
      color: isDark ? C.goldLight : C.textMuted,
      valign: 'top',
    });
  }

  // Top Right Logo on every slide
  slide.addImage({
    path: LOGO_PATH,
    x: 12.0,
    y: 0.4,
    w: 0.75,
    h: 0.75,
  });

  // Bottom Footer Bar
  slide.addShape(pptx.ShapeType.line, {
    x: 0.8,
    y: 7.0,
    w: 11.73,
    h: 0,
    line: { color: isDark ? C.navyBorder : C.sandBorder, width: 1 },
  });

  slide.addText('SMART MINDS TUITIONS  •  Client Project Presentation  •  Confidential', {
    x: 0.8,
    y: 7.05,
    w: 8.0,
    h: 0.3,
    fontSize: 9,
    fontFace: FONTS.body,
    color: isDark ? C.textMuted : C.textMuted,
    valign: 'middle',
  });

  slide.addText('www.smartmindstuitions.com', {
    x: 9.53,
    y: 7.05,
    w: 3.0,
    h: 0.3,
    fontSize: 9,
    fontFace: FONTS.body,
    color: isDark ? C.goldPrimary : C.goldDark,
    align: 'right',
    valign: 'middle',
  });
}

console.log('[PPTX] Initializing presentation generation...');

// =========================================================================
// SLIDE 1: COVER
// =========================================================================
const s1 = pptx.addSlide();
s1.background = { color: C.navyDark };

// Decorative Background Gradient Shapes
s1.addShape(pptx.ShapeType.ellipse, {
  x: -1.0, y: -1.0, w: 6.0, h: 6.0,
  fill: { color: C.navyCore },
  line: { color: C.navyCard, width: 2 }
});
s1.addShape(pptx.ShapeType.ellipse, {
  x: 9.0, y: 3.0, w: 6.0, h: 6.0,
  fill: { color: C.navyCore },
  line: { color: C.navyBorder, width: 1 }
});

// Central Card Container
s1.addShape(pptx.ShapeType.roundRect, {
  x: 1.2, y: 1.0, w: 10.93, h: 5.4,
  rectRadius: 0.25,
  fill: { color: C.navyCore },
  line: { color: C.goldPrimary, width: 1.5 }
});

// Official Circular Logo
s1.addImage({
  path: LOGO_PATH,
  x: 1.8, y: 1.6, w: 2.2, h: 2.2,
});

// Trust Badge Tag
s1.addShape(pptx.ShapeType.roundRect, {
  x: 4.4, y: 1.6, w: 3.2, h: 0.35,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.goldPrimary, width: 1 }
});
s1.addText('OFFICIAL CLIENT PROPOSAL', {
  x: 4.4, y: 1.6, w: 3.2, h: 0.35,
  fontSize: 10, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});

// Title & Subtitle
s1.addText('SMART MINDS TUITIONS', {
  x: 4.4, y: 2.1, w: 7.2, h: 0.8,
  fontSize: 32, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
});
s1.addText('"Connecting Students, Parents & Verified Tutors"', {
  x: 4.4, y: 2.9, w: 7.2, h: 0.45,
  fontSize: 15, fontFace: FONTS.heading, italic: true, color: C.goldPrimary, valign: 'top'
});
s1.addText('A secure, admin-managed tutoring platform engineered to simplify tutor discovery, multi-step verification, controlled matching, and holistic tuition operations.', {
  x: 4.4, y: 3.45, w: 7.0, h: 0.9,
  fontSize: 12, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});

// Feature Pills on Cover
const coverPills = [
  '🛡️ Admin-Verified Tutors',
  '🔒 Contact Privacy Protection',
  '📅 Structured Demo Workflow',
  '🏢 Tuition Center Desk'
];
coverPills.forEach((pill, idx) => {
  s1.addShape(pptx.ShapeType.roundRect, {
    x: 1.8 + idx * 2.45, y: 4.9, w: 2.3, h: 0.45,
    rectRadius: 0.12,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });
  s1.addText(pill, {
    x: 1.8 + idx * 2.45, y: 4.9, w: 2.3, h: 0.45,
    fontSize: 9.5, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
  });
});

s1.addText('Client Project Presentation  •  System Architecture & Feature Overview', {
  x: 1.2, y: 6.6, w: 10.93, h: 0.3,
  fontSize: 10, fontFace: FONTS.body, color: C.textMuted, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 2: THE VISION
// =========================================================================
const s2 = pptx.addSlide();
applySlideHeader(s2, 'Executive Overview', 'The Vision', 'One platform. Four distinct user roles. One seamlessly controlled tutoring ecosystem.');

// Centerpiece Statement Card
s2.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.85, w: 11.73, h: 1.0,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.goldPrimary, width: 1 }
});
s2.addText('Smart Minds Tuitions bridges the trust and coordination gap between parents seeking verified educators, qualified tutors finding sustainable teaching opportunities, and coaching centers scaling student batches.', {
  x: 1.1, y: 1.95, w: 11.13, h: 0.8,
  fontSize: 13, fontFace: FONTS.body, color: C.white, align: 'center', valign: 'middle'
});

// 3 Stakeholder Cards Around Central Admin Authority
const visionRoles = [
  {
    title: '👨‍👩‍👧 Parents & Students',
    desc: 'Access verified subject tutors, post custom home/online requirements, evaluate educators via free demo sessions, and monitor academic progress cards.',
    color: C.goldPrimary,
    x: 0.8, y: 3.1
  },
  {
    title: '🎓 Verified Educators',
    desc: 'Undergo rigorous KYC verification (ID & degree audit), discover nearby student requirements, conduct demos, and manage earnings & attendance registers.',
    color: C.goldPrimary,
    x: 8.73, y: 3.1
  },
  {
    title: '🏢 Tuition Centers',
    desc: 'Manage Classes 1–10 batch rosters, track daily student attendance, record test rankings, trigger 1-click WhatsApp fee reminders, and hire specialized faculty.',
    color: C.goldPrimary,
    x: 0.8, y: 5.1
  },
  {
    title: '👑 Central Admin Authority',
    desc: 'Acts as the single source of truth for tutor KYC audits, requirement matching, demo scheduling, 50% commission verification, subscriptions, and live chat support.',
    color: C.greenBadge,
    x: 8.73, y: 5.1
  }
];

visionRoles.forEach(r => {
  s2.addShape(pptx.ShapeType.roundRect, {
    x: r.x, y: r.y, w: 3.8, h: 1.65,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });
  s2.addText(r.title, {
    x: r.x + 0.2, y: r.y + 0.12, w: 3.4, h: 0.35,
    fontSize: 13, fontFace: FONTS.heading, bold: true, color: r.color, valign: 'middle'
  });
  s2.addText(r.desc, {
    x: r.x + 0.2, y: r.y + 0.5, w: 3.4, h: 1.05,
    fontSize: 10, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});

// Central Connecting Core Graphic
s2.addShape(pptx.ShapeType.roundRect, {
  x: 4.86, y: 3.1, w: 3.6, h: 3.65,
  rectRadius: 0.2,
  fill: { color: C.navyDark },
  line: { color: C.goldPrimary, width: 1.5 }
});
s2.addImage({
  path: LOGO_PATH,
  x: 5.91, y: 3.3, w: 1.5, h: 1.5
});
s2.addText('CENTRALIZED GOVERNANCE', {
  x: 5.06, y: 4.9, w: 3.2, h: 0.3,
  fontSize: 11, fontFace: FONTS.body, bold: true, color: C.goldPrimary, align: 'center', valign: 'middle'
});
s2.addText('• Strict KYC Verification\n• Private Contact Redaction\n• Admin-Relayed Demo Matching\n• Manual Payment Audits\n• Real-Time Support Desk', {
  x: 5.06, y: 5.25, w: 3.2, h: 1.35,
  fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, align: 'center', valign: 'top'
});


// =========================================================================
// SLIDE 3: THE PROBLEM
// =========================================================================
const s3 = pptx.addSlide();
applySlideHeader(s3, 'Market Challenge', 'Challenges in the Traditional Tuition Process', 'Key friction points faced by parents, educators, and institutions in unregulated environments.');

const problems = [
  {
    num: '01',
    title: 'Unverified Tutor Credentials',
    desc: 'Parents struggle to verify background, degree qualifications, and government identities of private home tutors.'
  },
  {
    num: '02',
    title: 'Uncontrolled Contact Sharing',
    desc: 'Open directories expose phone numbers and private addresses prematurely, leading to spam and privacy breaches.'
  },
  {
    num: '03',
    title: 'Disorganized Demo Classes',
    desc: 'No structured trial session mechanism; parents have no formal way to evaluate educators before financial commitment.'
  },
  {
    num: '04',
    title: 'Manual Tutor Application Tracking',
    desc: 'Qualified tutors lack a transparent platform to discover genuine student leads filtered by locality and subject specializations.'
  },
  {
    num: '05',
    title: 'Coaching Center Operational Overhead',
    desc: 'Tuition centers rely on paper registers to track Class 1–10 batches, attendance, exam averages, and monthly fee collections.'
  },
  {
    num: '06',
    title: 'Disputed Commission & Fee Settlements',
    desc: 'Lack of transparent audit trails for platform commissions, subscription passes, and fee verification creates operational disputes.'
  }
];

problems.forEach((p, idx) => {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = 0.8 + col * 3.97;
  const y = 1.9 + row * 2.45;

  s3.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.8, h: 2.25,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  // Number Badge
  s3.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.35,
    rectRadius: 0.08,
    fill: { color: C.navyDark },
    line: { color: C.goldPrimary, width: 1 }
  });
  s3.addText(p.num, {
    x: x + 0.2, y: y + 0.2, w: 0.6, h: 0.35,
    fontSize: 10, fontFace: FONTS.body, bold: true, color: C.goldPrimary, align: 'center', valign: 'middle'
  });

  s3.addText(p.title, {
    x: x + 0.9, y: y + 0.18, w: 2.7, h: 0.45,
    fontSize: 12.5, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
  });

  s3.addText(p.desc, {
    x: x + 0.2, y: y + 0.7, w: 3.4, h: 1.4,
    fontSize: 10.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 4: THE SOLUTION
// =========================================================================
const s4 = pptx.addSlide();
applySlideHeader(s4, 'Platform Solution', 'The Smart Minds Tuitions Solution', 'A controlled, admin-moderated marketplace designed for trust, safety, and operational excellence.');

// Highlight Concept Banner
s4.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.8, w: 11.73, h: 0.8,
  rectRadius: 0.12,
  fill: { color: C.navyCard },
  line: { color: C.goldPrimary, width: 1 }
});
s4.addText('🌟  CONTROLLED MARKETPLACE MODEL: Unlike open classified sites, all requirements, tutor applications, demo sessions, and contact coordinates flow through an authenticated Admin Verification & Matching Engine.', {
  x: 1.0, y: 1.8, w: 11.33, h: 0.8,
  fontSize: 11, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});

// 10-Step Controlled Flowchart
const solutionSteps = [
  { step: '1', title: 'Parent Posts Lead', desc: 'Syllabus, Grade, Location & Budget' },
  { step: '2', title: 'Admin Review', desc: 'Requirement validation & publishing' },
  { step: '3', title: 'Verified Tutor Pool', desc: 'KYC-approved educators discover lead' },
  { step: '4', title: 'Tutor Applies', desc: 'Educators submit tuition applications' },
  { step: '5', title: 'Tutor Selection', desc: 'Admin reviews & selects top educator' },
  { step: '6', title: 'Demo Scheduled', desc: 'Free trial evaluation coordinated' },
  { step: '7', title: 'Parent Decision', desc: 'Binary decision: Accepted / Rejected' },
  { step: '8', title: 'Fee Activation', desc: 'Tutor submits 50% commission proof' },
  { step: '9', title: 'Contacts Unlocked', desc: 'Phone numbers & address revealed' },
  { step: '10', title: 'Tuition Begins', desc: 'Daily attendance & monthly report logs' },
];

solutionSteps.forEach((s, idx) => {
  const col = idx % 5;
  const row = Math.floor(idx / 5);
  const x = 0.8 + col * 2.38;
  const y = 2.85 + row * 1.95;

  s4.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 2.25, h: 1.75,
    rectRadius: 0.12,
    fill: { color: C.navyCard },
    line: { color: idx === 6 || idx === 8 ? C.goldPrimary : C.navyBorder, width: 1 }
  });

  // Step Number Badge
  s4.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.15, y: y + 0.15, w: 0.35, h: 0.35,
    fill: { color: C.goldPrimary }
  });
  s4.addText(s.step, {
    x: x + 0.15, y: y + 0.15, w: 0.35, h: 0.35,
    fontSize: 9, fontFace: FONTS.body, bold: true, color: C.navyDark, align: 'center', valign: 'middle'
  });

  s4.addText(s.title, {
    x: x + 0.55, y: y + 0.12, w: 1.6, h: 0.4,
    fontSize: 10.5, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
  });

  s4.addText(s.desc, {
    x: x + 0.15, y: y + 0.6, w: 1.95, h: 1.0,
    fontSize: 9, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 5: FOUR USER ROLES
// =========================================================================
const s5 = pptx.addSlide();
applySlideHeader(s5, 'Platform Architecture', 'One Platform. Four User Experiences.', 'Granular, role-based workflows tailored to parents, educators, centers, and platform administrators.');

const rolesCards = [
  {
    title: '👨‍👩‍👧 PARENT / STUDENT',
    badge: 'STUDENT PORTAL',
    badgeCol: C.blueBadge,
    items: [
      'Multi-child registration (CBSE / ICSE)',
      'Post home & online tuition leads',
      'Track scheduled evaluation demos',
      'Accept or reject demo educators',
      'Unlocked tutor contact coordinates',
      'Real-time daily attendance registers',
      'Monthly student academic report cards',
      'Direct 2-way support chat with Admin'
    ]
  },
  {
    title: '🎓 EDUCATOR / TUTOR',
    badge: 'TEACHER PORTAL',
    badgeCol: C.greenBadge,
    items: [
      'Aadhaar & Degree KYC submission',
      'Multi-class teaching capability profile',
      'Browse student tuition requirements',
      'Apply for assignments & conduct demos',
      'Active tuition operations & parent details',
      'Lesson attendance & topic registers',
      'Submit monthly student progress cards',
      'Multi-Tuition Passes & 50% commission desk'
    ]
  },
  {
    title: '🏢 TUITION CENTER',
    badge: 'INSTITUTION DESK',
    badgeCol: C.purpleBadge,
    items: [
      'Trade license & registration audit',
      'Class 1–10 batch creation & capacities',
      'Student enrollment & batch assignment',
      'Daily batch attendance registers',
      'Unit test & exam score ledgers',
      'Monthly fee collection tracking',
      '1-Click WhatsApp payment reminders',
      'Hire verified subject faculty from Admin'
    ]
  },
  {
    title: '👑 SUPER ADMIN',
    badge: 'CONTROL ROOM',
    badgeCol: C.amberBadge,
    items: [
      'Global KPI metrics & revenue intelligence',
      'Educator KYC document verification',
      'Tuition center accreditation review',
      'Lead requirement moderation & matching',
      'Demo session coordination & dispatch',
      '50% Commission proof verification',
      'Multi-Tuition Subscription activation',
      'Multi-channel real-time support console'
    ]
  }
];

rolesCards.forEach((r, idx) => {
  const x = 0.8 + idx * 2.98;
  const y = 1.85;

  s5.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 2.85, h: 4.9,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  // Role Badge
  s5.addShape(pptx.ShapeType.roundRect, {
    x: x + 0.15, y: y + 0.15, w: 1.4, h: 0.25,
    rectRadius: 0.08,
    fill: { color: r.badgeCol }
  });
  s5.addText(r.badge, {
    x: x + 0.15, y: y + 0.15, w: 1.4, h: 0.25,
    fontSize: 7.5, fontFace: FONTS.body, bold: true, color: C.white, align: 'center', valign: 'middle'
  });

  // Title
  s5.addText(r.title, {
    x: x + 0.15, y: y + 0.45, w: 2.55, h: 0.4,
    fontSize: 11, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  // Bullet items
  const bulletText = r.items.map(item => `• ${item}`).join('\n');
  s5.addText(bulletText, {
    x: x + 0.15, y: y + 0.95, w: 2.55, h: 3.8,
    fontSize: 8.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 6: HOW THE PLATFORM WORKS (7-Step Timeline)
// =========================================================================
const s6 = pptx.addSlide();
applySlideHeader(s6, 'Platform Workflow', 'How It Works — Step-by-Step Lifecycle', 'The standard operational timeline from account onboarding to active tuition delivery.');

const timelineSteps = [
  { num: '01', title: 'REGISTER', desc: 'Parent, Tutor, or Tuition Center creates an account.' },
  { num: '02', title: 'VERIFICATION', desc: 'Admin audits Government ID & Degree certificates.' },
  { num: '03', title: 'POST REQUIREMENT', desc: 'Parent specifies subject, grade, location & schedule.' },
  { num: '04', title: 'MATCHING & APPS', desc: 'Approved tutors browse leads and submit applications.' },
  { num: '05', title: 'DEMO CLASS', desc: 'Admin coordinates a free evaluation trial session.' },
  { num: '06', title: 'CONFIRMATION', desc: 'Parent accepts or rejects educator based on demo.' },
  { num: '07', title: 'TUITION COMMENCES', desc: 'Commission paid, contacts unlocked, classes begin.' },
];

timelineSteps.forEach((t, idx) => {
  const x = 0.8 + idx * 1.7;
  const y = 2.4;

  // Step card
  s6.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 1.55, h: 3.8,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: idx === 4 || idx === 6 ? C.goldPrimary : C.navyBorder, width: 1.2 }
  });

  // Number Badge Circle
  s6.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.45, y: y + 0.25, w: 0.65, h: 0.65,
    fill: { color: C.navyDark },
    line: { color: C.goldPrimary, width: 1.5 }
  });
  s6.addText(t.num, {
    x: x + 0.45, y: y + 0.25, w: 0.65, h: 0.65,
    fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, align: 'center', valign: 'middle'
  });

  // Title
  s6.addText(t.title, {
    x: x + 0.1, y: y + 1.05, w: 1.35, h: 0.5,
    fontSize: 9.5, fontFace: FONTS.heading, bold: true, color: C.white, align: 'center', valign: 'middle'
  });

  // Description
  s6.addText(t.desc, {
    x: x + 0.1, y: y + 1.6, w: 1.35, h: 2.0,
    fontSize: 8.5, fontFace: FONTS.body, color: C.textLight, align: 'center', valign: 'top'
  });
});


// =========================================================================
// SLIDE 7: PARENT JOURNEY
// =========================================================================
const s7 = pptx.addSlide();
applySlideHeader(s7, 'User Journey', 'Parent & Student Journey', 'A transparent, stress-free experience from tutor discovery to ongoing progress reporting.');

const parentSteps = [
  { step: '1', title: 'Register Account', desc: 'Sign up with verified email & mobile number.' },
  { step: '2', title: 'Add Child Profiles', desc: 'Configure student grade (1-12), board (CBSE/ICSE) & school.' },
  { step: '3', title: 'Post Requirement', desc: 'Specify subjects, locality, budget range, and preferred days.' },
  { step: '4', title: 'Admin Dispatches Lead', desc: 'Requirement is validated and published to verified tutor pool.' },
  { step: '5', title: 'Candidate Assigned', desc: 'Admin matches the best-suited educator for evaluation.' },
  { step: '6', title: 'Attend Demo Session', desc: 'Free trial class conducted online or at home.' },
  { step: '7', title: 'Accept / Reject Decision', desc: 'Parent records binary feedback on the portal.' },
  { step: '8', title: 'Full Access & Tuition', desc: 'Tutor contact coordinates revealed; attendance & report cards active.' },
];

parentSteps.forEach((p, idx) => {
  const col = idx % 4;
  const row = Math.floor(idx / 4);
  const x = 0.8 + col * 2.98;
  const y = 1.9 + row * 2.2;

  s7.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 2.85, h: 2.0,
    rectRadius: 0.12,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s7.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.15, y: y + 0.15, w: 0.35, h: 0.35,
    fill: { color: C.goldPrimary }
  });
  s7.addText(p.step, {
    x: x + 0.15, y: y + 0.15, w: 0.35, h: 0.35,
    fontSize: 9, fontFace: FONTS.body, bold: true, color: C.navyDark, align: 'center', valign: 'middle'
  });

  s7.addText(p.title, {
    x: x + 0.55, y: y + 0.12, w: 2.15, h: 0.4,
    fontSize: 11, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
  });

  s7.addText(p.desc, {
    x: x + 0.15, y: y + 0.6, w: 2.55, h: 1.3,
    fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});

// Privacy Guarantee Callout Box
s7.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 6.25, w: 11.73, h: 0.6,
  rectRadius: 0.1,
  fill: { color: C.navyDark },
  line: { color: C.goldPrimary, width: 1 }
});
s7.addText('🔒 PRIVACY GUARANTEE: Parents do not receive unrestricted tutor contact coordinates before formal assignment and accepted demo confirmation.', {
  x: 1.0, y: 6.25, w: 11.33, h: 0.6,
  fontSize: 10, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 8: TUTOR JOURNEY & SUBSCRIPTIONS
// =========================================================================
const s8 = pptx.addSlide();
applySlideHeader(s8, 'Educator Journey', 'Educator Journey & Multi-Tuition Passes', 'Onboarding verified teachers, discovering assignments, and managing multi-tuition tiers.');

// Left Column: Step-by-Step Flow
const tutorSteps = [
  '1. Onboarding & KYC: Upload Aadhaar / Passport & Degree Certificates.',
  '2. Agreement Acceptance: Review and accept tutor code of conduct.',
  '3. Admin Audit: Admin approves tutor profile after credential verification.',
  '4. Browse & Apply: Discover nearby student leads filtered by locality.',
  '5. Conduct Demo: Deliver free trial session and await parent decision.',
  '6. 50% Commission Desk: Submit 1st month commission proof for active classes.',
  '7. Attendance & Reports: Log class topics, homework, and monthly scores.'
];

s8.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.85, w: 6.0, h: 4.8,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.navyBorder, width: 1 }
});
s8.addText('🎓 EDUCATOR WORKFLOW', {
  x: 1.0, y: 2.0, w: 5.6, h: 0.35,
  fontSize: 13, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
});
s8.addText(tutorSteps.join('\n\n'), {
  x: 1.0, y: 2.45, w: 5.6, h: 4.0,
  fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});

// Right Column: Subscription Requirement (SRS Tier Table)
s8.addShape(pptx.ShapeType.roundRect, {
  x: 7.1, y: 1.85, w: 5.43, h: 4.8,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.goldPrimary, width: 1 }
});
s8.addText('💳 MULTI-TUITION SUBSCRIPTION PASSES', {
  x: 7.3, y: 2.0, w: 5.0, h: 0.35,
  fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
});
s8.addText('Tutors taking 2 or more concurrent tuitions require an active subscription tier as mandated by the SRS:', {
  x: 7.3, y: 2.4, w: 5.0, h: 0.5,
  fontSize: 9.5, fontFace: FONTS.body, color: C.white, valign: 'top'
});

const subPlans = [
  { term: '3 Months Pass', fee: '₹300', desc: 'Valid for 90 days concurrent applications' },
  { term: '6 Months Pass', fee: '₹600', desc: 'Valid for 180 days concurrent applications' },
  { term: '9 Months Pass', fee: '₹900', desc: 'Valid for 270 days concurrent applications' },
  { term: '12 Months Pass', fee: '₹1200', desc: 'Annual pass for unlimited concurrent tuitions' },
];

subPlans.forEach((plan, idx) => {
  const py = 3.0 + idx * 0.85;
  s8.addShape(pptx.ShapeType.roundRect, {
    x: 7.3, y: py, w: 5.0, h: 0.72,
    rectRadius: 0.1,
    fill: { color: C.navyDark },
    line: { color: C.navyBorder, width: 1 }
  });
  s8.addText(plan.term, {
    x: 7.45, y: py + 0.08, w: 2.5, h: 0.3,
    fontSize: 10.5, fontFace: FONTS.heading, bold: true, color: C.goldLight, valign: 'middle'
  });
  s8.addText(plan.fee, {
    x: 10.8, y: py + 0.08, w: 1.3, h: 0.3,
    fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.greenBadge, align: 'right', valign: 'middle'
  });
  s8.addText(plan.desc, {
    x: 7.45, y: py + 0.38, w: 4.6, h: 0.25,
    fontSize: 8.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 9: TUITION CENTER MANAGEMENT
// =========================================================================
const s9 = pptx.addSlide();
applySlideHeader(s9, 'Institutional Module', 'Dedicated Tuition Center Management', 'An enterprise portal enabling coaching centers to automate classes 1–10 batches, attendance & fees.');

const centerModules = [
  {
    icon: '🏢',
    title: 'Classes 1–10 Batch Architecture',
    desc: 'Create academic batches per grade (Class 1 to Class 10), assign subject faculty, configure batch timings, and enforce capacity caps.'
  },
  {
    icon: '👥',
    title: 'Student Roster Management',
    desc: 'Enroll students, assign them to specific batches, track guardian contacts, and monitor active/inactive enrollment statuses.'
  },
  {
    icon: '📅',
    title: 'Daily Batch Attendance',
    desc: 'Streamlined daily attendance registers (Present, Absent, Late) across all enrolled batch students with historical logs.'
  },
  {
    icon: '📊',
    title: 'Unit Test & Exam Performance',
    desc: 'Record periodic unit test marks, subject averages, top ranks, and generate parent-facing academic performance cards.'
  },
  {
    icon: '💰',
    title: 'Monthly Fee Ledger',
    desc: 'Track monthly fee collection statuses (Paid vs Pending) per student with complete payment method and date records.'
  },
  {
    icon: '💬',
    title: '1-Click WhatsApp Reminders',
    desc: 'Trigger pre-formatted WhatsApp payment reminders directly to parent mobile numbers in one click for overdue fees.'
  }
];

centerModules.forEach((m, idx) => {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = 0.8 + col * 3.97;
  const y = 1.9 + row * 2.2;

  s9.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.8, h: 2.0,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s9.addText(`${m.icon}  ${m.title}`, {
    x: x + 0.2, y: y + 0.15, w: 3.4, h: 0.4,
    fontSize: 11, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  s9.addText(m.desc, {
    x: x + 0.2, y: y + 0.55, w: 3.4, h: 1.3,
    fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});

// Center Faculty Hiring Callout
s9.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 6.35, w: 11.73, h: 0.55,
  rectRadius: 0.1,
  fill: { color: C.navyDark },
  line: { color: C.purpleBadge, width: 1 }
});
s9.addText('🌟 FACULTY RECRUITMENT DESK: Tuition centers can submit requests to Admin for qualified subject tutors and specialized educators directly from the verified tutor pool.', {
  x: 1.0, y: 6.35, w: 11.33, h: 0.55,
  fontSize: 9.5, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 10: ADMIN CONTROL CENTER
// =========================================================================
const s10 = pptx.addSlide();
applySlideHeader(s10, 'Central Governance', 'Centralized Admin Control Center', 'The single operational authority for verification, matching, assignments, and platform earnings.');

const adminDesks = [
  { name: '📊 Executive KPI Dashboard', desc: 'Global platform metrics: requirements, active tuitions, verified tutors, and centers.' },
  { name: '🛡️ Educator KYC Audit Desk', desc: 'Review government ID cards and degree memos; approve/reject with feedback.' },
  { name: '🏢 Center Accreditation Desk', desc: 'Audit institutional registration certificates and trade licenses.' },
  { name: '📑 Lead Matching & Dispatch', desc: 'Review incoming parent requirements and audit tutor applications.' },
  { name: '📅 Demo Coordination Console', desc: 'Schedule evaluation demos and relay parent decisions to educators.' },
  { name: '💵 50% Commission Desk', desc: 'Audit tutor UPI payment screenshots; 1-click approval unlocks mutual contacts.' },
  { name: '💳 Subscription Approval Desk', desc: 'Verify 3, 6, 9, 12-month pass payments and activate unlimited applications.' },
  { name: '📈 Financial Intelligence Ledger', desc: 'Unified ledger tracking all platform revenue streams with receipt view.' },
  { name: '💬 Multi-Channel Support Chat', desc: 'Real-time WebSocket messaging hub communicating with all platform roles.' },
  { name: '🔍 Security Audit Trail', desc: 'Immutable log of all administrative actions, KYC decisions, and financial events.' },
];

adminDesks.forEach((d, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.95;
  const y = 1.9 + row * 0.95;

  s10.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 5.78, h: 0.82,
    rectRadius: 0.1,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s10.addText(d.name, {
    x: x + 0.2, y: y + 0.08, w: 5.38, h: 0.3,
    fontSize: 10.5, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  s10.addText(d.desc, {
    x: x + 0.2, y: y + 0.38, w: 5.38, h: 0.38,
    fontSize: 8.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 11: TRUST & SECURITY
// =========================================================================
const s11 = pptx.addSlide();
applySlideHeader(s11, 'Security Architecture', 'Built Around Trust & Controlled Access', 'Rigorous data privacy, credential verification, and role-based boundaries.');

const securityPillars = [
  {
    icon: '🛡️',
    title: 'KYC Document Verification',
    desc: 'Government ID proofs (Aadhaar / Passport) and educational degree memos are verified by Admin before tutors can apply for leads.'
  },
  {
    icon: '🔐',
    title: 'Mutual Contact Redaction',
    desc: 'Tutors and parents cannot view phone numbers, emails, or residential addresses until a demo is accepted and fee is verified.'
  },
  {
    icon: '👥',
    title: 'Role-Based Access Control',
    desc: 'Strict JWT authentication and authorization middleware enforce complete isolation between Parent, Tutor, Center, and Admin portals.'
  },
  {
    icon: '📁',
    title: 'Protected Document Storage',
    desc: 'Sensitive KYC documents and transaction screenshots are stored privately and accessible only via authenticated JWT session routes.'
  },
  {
    icon: '🔑',
    title: 'Password Security Standards',
    desc: 'User credentials are protected using salted BCrypt password hashing, preventing exposure during authentication.'
  },
  {
    icon: '📋',
    title: 'Immutable Audit Logging',
    desc: 'Every administrative decision, KYC approval, status update, and financial transaction is permanently logged with timestamps & IPs.'
  }
];

securityPillars.forEach((p, idx) => {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = 0.8 + col * 3.97;
  const y = 1.9 + row * 2.45;

  s11.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.8, h: 2.25,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s11.addText(`${p.icon}  ${p.title}`, {
    x: x + 0.2, y: y + 0.2, w: 3.4, h: 0.45,
    fontSize: 11.5, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  s11.addText(p.desc, {
    x: x + 0.2, y: y + 0.7, w: 3.4, h: 1.4,
    fontSize: 10, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 12: PAYMENT & COMMISSION WORKFLOW
// =========================================================================
const s12 = pptx.addSlide();
applySlideHeader(s12, 'Financial Governance', 'Simple, Transparent Payment Verification', 'Controlled manual UPI verification workflows for tutor subscriptions and first-month commissions.');

// Left Card: Tutor Subscription
s12.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.85, w: 5.75, h: 4.1,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.navyBorder, width: 1 }
});
s12.addText('💳 TUTOR MULTI-TUITION SUBSCRIPTION', {
  x: 1.0, y: 2.0, w: 5.35, h: 0.35,
  fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
});
const subSteps = [
  '1. Tutor selects 3, 6, 9, or 12-month pass (₹300 - ₹1200).',
  '2. Makes external UPI payment via QR code.',
  '3. Submits UPI Transaction ID (UTR) & payment screenshot.',
  '4. Admin verifies payment receipt on Subscription Desk.',
  '5. Subscription is activated; multi-application pass enabled.'
];
s12.addText(subSteps.join('\n\n'), {
  x: 1.0, y: 2.45, w: 5.35, h: 3.3,
  fontSize: 10, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});

// Right Card: 50% First-Month Commission
s12.addShape(pptx.ShapeType.roundRect, {
  x: 6.78, y: 1.85, w: 5.75, h: 4.1,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.navyBorder, width: 1 }
});
s12.addText('💵 50% FIRST-MONTH COMMISSION WORKFLOW', {
  x: 7.0, y: 2.0, w: 5.35, h: 0.35,
  fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
});
const commSteps = [
  '1. Tutor conducts demo; Parent marks assignment Accepted.',
  '2. Tutor receives first-month tuition fee from parent.',
  '3. Tutor pays 50% one-time commission to Admin via UPI.',
  '4. Tutor uploads payment proof screenshot & UTR number.',
  '5. Admin approves commission; tuition status marked Active.'
];
s12.addText(commSteps.join('\n\n'), {
  x: 7.0, y: 2.45, w: 5.35, h: 3.3,
  fontSize: 10, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});

// Critical Note
s12.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 6.15, w: 11.73, h: 0.7,
  rectRadius: 0.1,
  fill: { color: C.navyDark },
  line: { color: C.goldPrimary, width: 1 }
});
s12.addText('⚠️ IMPORTANT FINANCIAL NOTE: Regular monthly tuition fee payments between parents and tutors take place directly outside the platform. The platform handles only tutor subscriptions and first-month commissions.', {
  x: 1.0, y: 6.15, w: 11.33, h: 0.7,
  fontSize: 9.5, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 13: CENTRALIZED COMMUNICATION
// =========================================================================
const s13 = pptx.addSlide();
applySlideHeader(s13, 'Communication Hub', 'Centralized Communication Channels', 'Two clearly separated communication mediums designed for authenticated users and public inquiries.');

// Channel 1: In-App Chat
s13.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.9, w: 5.75, h: 4.8,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.goldPrimary, width: 1.2 }
});
s13.addText('💬 CHANNEL 1: REAL-TIME IN-APP CHAT', {
  x: 1.1, y: 2.1, w: 5.15, h: 0.4,
  fontSize: 13, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
});
s13.addText('• Purpose: Secure, authenticated operational messaging.\n• Technology: Socket.IO WebSockets with JWT handshake.\n• Direct Channels:\n   - 👨‍👩‍👧 Parent ↔ 👑 Admin (Academic counseling & demo feedback)\n   - 🎓 Tutor ↔ 👑 Admin (Lead clarification & commission support)\n   - 🏢 Center ↔ 👑 Admin (Faculty requests & accreditation)\n• Features: Instant messaging, unread badges, typing indicators.', {
  x: 1.1, y: 2.65, w: 5.15, h: 3.8,
  fontSize: 10.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});

// Channel 2: WhatsApp Widget
s13.addShape(pptx.ShapeType.roundRect, {
  x: 6.78, y: 1.9, w: 5.75, h: 4.8,
  rectRadius: 0.15,
  fill: { color: C.navyCard },
  line: { color: C.greenBadge, width: 1.2 }
});
s13.addText('📱 CHANNEL 2: PUBLIC WHATSAPP INQUIRY', {
  x: 7.08, y: 2.1, w: 5.15, h: 0.4,
  fontSize: 13, fontFace: FONTS.heading, bold: true, color: C.greenBadge, valign: 'middle'
});
s13.addText('• Purpose: Pre-registration public inquiries & instant support.\n• Integration: Floating WhatsApp widget on public marketing pages.\n• User Flow:\n   - Prospective parents & tutors click the WhatsApp badge.\n   - Redirects to WhatsApp with a pre-filled inquiry template.\n   - Connects directly to Smart Minds Tuitions official admin desk.\n• Distinction: WhatsApp and In-App Chat operate as separate channels.', {
  x: 7.08, y: 2.65, w: 5.15, h: 3.8,
  fontSize: 10.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});


// =========================================================================
// SLIDE 14: TECHNOLOGY ARCHITECTURE
// =========================================================================
const s14 = pptx.addSlide();
applySlideHeader(s14, 'System Engineering', 'Technology Architecture', 'A modern, modular full-stack stack engineered for reliability, responsiveness, and zero-setup deployment.');

const techLayers = [
  {
    layer: 'FRONTEND CLIENT',
    tech: 'React 18 + Vite + Tailwind CSS',
    desc: 'Single-page application (SPA), Lucide icons, responsive navigation, and role-based portal routing.'
  },
  {
    layer: 'BACKEND API SERVER',
    tech: 'Node.js + Express.js REST API',
    desc: 'Modular controllers, RBAC middleware, privacy redaction pipelines, and protected document routes.'
  },
  {
    layer: 'REAL-TIME WEBSOCKETS',
    tech: 'Socket.IO (v4)',
    desc: 'Bi-directional authenticated event gateway for live support messaging, typing indicators, and notifications.'
  },
  {
    layer: 'DATABASE & DUAL ENGINE',
    tech: 'MongoDB + In-Memory Fallback',
    desc: 'Mongoose ORM schemas with automatic zero-config in-memory MongoDB failover engine for rapid development.'
  },
  {
    layer: 'SECURITY & ENCRYPTION',
    tech: 'JWT + BCrypt + Helmet',
    desc: 'Cryptographic token authentication, salted password hashing, NoSQL query sanitization, and rate limiting.'
  }
];

techLayers.forEach((t, idx) => {
  const y = 1.85 + idx * 0.98;

  s14.addShape(pptx.ShapeType.roundRect, {
    x: 0.8, y, w: 11.73, h: 0.85,
    rectRadius: 0.1,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  // Layer Tag
  s14.addShape(pptx.ShapeType.roundRect, {
    x: 1.0, y: y + 0.15, w: 2.5, h: 0.55,
    rectRadius: 0.08,
    fill: { color: C.navyDark },
    line: { color: C.goldPrimary, width: 1 }
  });
  s14.addText(t.layer, {
    x: 1.0, y: y + 0.15, w: 2.5, h: 0.55,
    fontSize: 9.5, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
  });

  s14.addText(t.tech, {
    x: 3.7, y: y + 0.12, w: 4.0, h: 0.35,
    fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
  });

  s14.addText(t.desc, {
    x: 3.7, y: y + 0.45, w: 8.5, h: 0.35,
    fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 15: SYSTEM ARCHITECTURE
// =========================================================================
const s15 = pptx.addSlide();
applySlideHeader(s15, 'Ecosystem Topology', 'Platform Ecosystem & Security Architecture', 'High-level architectural topology showing authenticated role interfaces and backend service modules.');

// Diagram Container
s15.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 1.85, w: 11.73, h: 4.9,
  rectRadius: 0.15,
  fill: { color: C.navyDark },
  line: { color: C.navyBorder, width: 1 }
});

// Top: 3 User Portals
const userPortals = [
  { name: '👨‍👩‍👧 Parent Portal', route: '/parent/*', col: C.blueBadge, x: 1.2 },
  { name: '🎓 Educator Portal', route: '/tutor/*', col: C.greenBadge, x: 4.9 },
  { name: '🏢 Tuition Center', route: '/center/*', col: C.purpleBadge, x: 8.6 },
];

userPortals.forEach(p => {
  s15.addShape(pptx.ShapeType.roundRect, {
    x: p.x, y: 2.1, w: 3.4, h: 0.9,
    rectRadius: 0.1,
    fill: { color: C.navyCard },
    line: { color: p.col, width: 1.2 }
  });
  s15.addText(p.name, {
    x: p.x, y: 2.15, w: 3.4, h: 0.4,
    fontSize: 11, fontFace: FONTS.heading, bold: true, color: C.white, align: 'center', valign: 'middle'
  });
  s15.addText(`Protected Route: ${p.route}`, {
    x: p.x, y: 2.55, w: 3.4, h: 0.35,
    fontSize: 9, fontFace: FONTS.body, color: C.goldLight, align: 'center', valign: 'middle'
  });
});

// Middle: Central Admin Authority Hub
s15.addShape(pptx.ShapeType.roundRect, {
  x: 2.8, y: 3.3, w: 7.73, h: 1.4,
  rectRadius: 0.12,
  fill: { color: C.navyCard },
  line: { color: C.goldPrimary, width: 1.5 }
});
s15.addText('👑 CENTRAL ADMIN GATEWAY & REST API CONTROLLERS', {
  x: 3.0, y: 3.4, w: 7.33, h: 0.35,
  fontSize: 12, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, align: 'center', valign: 'middle'
});

const adminServices = [
  '• KYC Document Audit',
  '• Lead Dispatch & Matching',
  '• Demo Coordination',
  '• 50% Commission Desk',
  '• Subscription Pass Manager',
  '• Socket.IO Live Chat Server'
];
s15.addText(adminServices.slice(0, 3).join('\n'), {
  x: 3.2, y: 3.8, w: 3.4, h: 0.8,
  fontSize: 9, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});
s15.addText(adminServices.slice(3, 6).join('\n'), {
  x: 6.8, y: 3.8, w: 3.4, h: 0.8,
  fontSize: 9, fontFace: FONTS.body, color: C.textLight, valign: 'top'
});

// Bottom: MongoDB Data & Storage Layer
s15.addShape(pptx.ShapeType.roundRect, {
  x: 2.8, y: 5.0, w: 7.73, h: 1.4,
  rectRadius: 0.12,
  fill: { color: C.navyCard },
  line: { color: C.navyBorder, width: 1 }
});
s15.addText('💾 MONGODB DATABASE & PROTECTED STORAGE LAYER', {
  x: 3.0, y: 5.1, w: 7.33, h: 0.35,
  fontSize: 11.5, fontFace: FONTS.heading, bold: true, color: C.white, align: 'center', valign: 'middle'
});
s15.addText('Collections: Users • Profiles • TuitionRequirements • Applications • Demos • Assignments • Attendance • MonthlyReports • Batches • FeeLedgers • Subscriptions • AuditLogs', {
  x: 3.1, y: 5.5, w: 7.13, h: 0.75,
  fontSize: 9, fontFace: FONTS.body, color: C.goldLight, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 16: KEY FEATURES (Icon Grid)
// =========================================================================
const s16 = pptx.addSlide();
applySlideHeader(s16, 'Feature Matrix', 'Core Platform Capabilities', '16 core functional capabilities engineered to meet the complete SRS specification.');

const coreFeatures = [
  { icon: '✓', title: 'Tutor KYC Verification' },
  { icon: '✓', title: 'Parent Registration' },
  { icon: '✓', title: 'Tuition Requirements' },
  { icon: '✓', title: 'Tutor Applications' },
  { icon: '✓', title: 'Admin Lead Matching' },
  { icon: '✓', title: 'Evaluation Demo Classes' },
  { icon: '✓', title: 'Tutor Assignments' },
  { icon: '✓', title: 'Lesson Attendance Ledger' },
  { icon: '✓', title: 'Monthly Progress Reports' },
  { icon: '✓', title: 'Tuition Center Batches' },
  { icon: '✓', title: 'Multi-Tuition Passes' },
  { icon: '✓', title: '50% Commission Desk' },
  { icon: '✓', title: 'Real-Time Admin Chat' },
  { icon: '✓', title: 'WhatsApp Reminder Triggers' },
  { icon: '✓', title: 'Role-Based Access Control' },
  { icon: '✓', title: 'Protected Document Desk' },
];

coreFeatures.forEach((f, idx) => {
  const col = idx % 4;
  const row = Math.floor(idx / 4);
  const x = 0.8 + col * 2.98;
  const y = 1.9 + row * 1.2;

  s16.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 2.85, h: 1.05,
    rectRadius: 0.1,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s16.addShape(pptx.ShapeType.ellipse, {
    x: x + 0.15, y: y + 0.3, w: 0.45, h: 0.45,
    fill: { color: C.greenBadge }
  });
  s16.addText(f.icon, {
    x: x + 0.15, y: y + 0.3, w: 0.45, h: 0.45,
    fontSize: 12, fontFace: FONTS.body, bold: true, color: C.white, align: 'center', valign: 'middle'
  });

  s16.addText(f.title, {
    x: x + 0.7, y: y + 0.15, w: 2.0, h: 0.75,
    fontSize: 10.5, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
  });
});


// =========================================================================
// SLIDE 17: USER EXPERIENCE DESIGN (Device & Portal UI)
// =========================================================================
const s17 = pptx.addSlide();
applySlideHeader(s17, 'Interface Experience', 'Designed per User Persona', 'Contextual dashboards crafted specifically for parents, educators, center directors, and administrators.');

const uxPanels = [
  {
    role: '👨‍👩‍👧 PARENT DASHBOARD',
    metric1: 'Active Requirements',
    metric2: 'Scheduled Demo Sessions',
    metric3: 'Assigned Tutors',
    metric4: 'Monthly Report Cards'
  },
  {
    role: '🎓 EDUCATOR DASHBOARD',
    metric1: 'Nearby Student Leads',
    metric2: 'Submitted Applications',
    metric3: 'Active Tuitions',
    metric4: 'Monthly Attendance Register'
  },
  {
    role: '🏢 TUITION CENTER DESK',
    metric1: 'Class 1–10 Batches',
    metric2: 'Enrolled Student Rosters',
    metric3: 'Daily Attendance Marked',
    metric4: 'Monthly Fee Dues Ledger'
  },
  {
    role: '👑 ADMIN CONTROL ROOM',
    metric1: 'Pending Tutor KYC Audits',
    metric2: '50% Commission Proofs',
    metric3: 'Multi-Tuition Passes',
    metric4: 'Live Support Conversations'
  }
];

uxPanels.forEach((p, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.95;
  const y = 1.9 + row * 2.45;

  s17.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 5.78, h: 2.25,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s17.addText(p.role, {
    x: x + 0.2, y: y + 0.15, w: 5.38, h: 0.35,
    fontSize: 11.5, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  const metrics = [p.metric1, p.metric2, p.metric3, p.metric4];
  metrics.forEach((m, mIdx) => {
    const mCol = mIdx % 2;
    const mRow = Math.floor(mIdx / 2);
    const mx = x + 0.2 + mCol * 2.75;
    const my = y + 0.6 + mRow * 0.75;

    s17.addShape(pptx.ShapeType.roundRect, {
      x: mx, y: my, w: 2.65, h: 0.65,
      rectRadius: 0.08,
      fill: { color: C.navyDark },
      line: { color: C.navyBorder, width: 1 }
    });
    s17.addText(m, {
      x: mx + 0.1, y: my + 0.08, w: 2.45, h: 0.5,
      fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, align: 'center', valign: 'middle'
    });
  });
});


// =========================================================================
// SLIDE 18: RESPONSIVE PLATFORM
// =========================================================================
const s18 = pptx.addSlide();
applySlideHeader(s18, 'Accessibility', 'Accessible Across Devices', 'A responsive web application accessible across desktop monitors, laptops, tablets, and smartphones.');

const devices = [
  {
    name: '🖥️ Desktop & Laptops',
    desc: 'Optimized for high-productivity workflows: Admin control room, center batch registers, multi-column requirement browsing, and attendance tables.'
  },
  {
    name: '📱 Tablets & iPads',
    desc: 'Fluid touch navigation for parents reviewing tutor credentials, checking scheduled demo dates, and approving monthly student report cards.'
  },
  {
    name: '📲 Mobile Browsers',
    desc: 'Instant access on iOS and Android browsers for tutors marking daily class attendance on-the-go and parents receiving WhatsApp reminders.'
  }
];

devices.forEach((d, idx) => {
  const x = 0.8 + idx * 3.97;
  const y = 1.9;

  s18.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.8, h: 3.8,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s18.addText(d.name, {
    x: x + 0.2, y: y + 0.3, w: 3.4, h: 0.45,
    fontSize: 13, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, align: 'center', valign: 'middle'
  });

  s18.addText(d.desc, {
    x: x + 0.3, y: y + 1.0, w: 3.2, h: 2.4,
    fontSize: 10.5, fontFace: FONTS.body, color: C.textLight, align: 'center', valign: 'top'
  });
});

s18.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 6.0, w: 11.73, h: 0.75,
  rectRadius: 0.1,
  fill: { color: C.navyDark },
  line: { color: C.goldPrimary, width: 1 }
});
s18.addText('🌐 ZERO INSTALLATION FRICTION: Built as a modern Single Page Web Application (React SPA), users require no app store downloads and can log in securely from any standard web browser.', {
  x: 1.0, y: 6.0, w: 11.33, h: 0.75,
  fontSize: 10, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 19: CLIENT VALUE
// =========================================================================
const s19 = pptx.addSlide();
applySlideHeader(s19, 'Strategic Impact', 'Value Delivered Across All Stakeholders', 'Delivering safety, operational efficiency, and revenue transparency to every user persona.');

const stakeholderValues = [
  {
    title: 'FOR PARENTS & STUDENTS',
    col: C.blueBadge,
    bullets: [
      'Verified educators with audited IDs and degrees',
      'Zero upfront contact leakage or spam',
      'Free evaluation demo before formal tuition',
      'Continuous monthly progress and attendance logs'
    ]
  },
  {
    title: 'FOR QUALIFIED TUTORS',
    col: C.greenBadge,
    bullets: [
      'Direct discovery of genuine nearby tuition leads',
      'Professional credential verification badges',
      'Multi-tuition subscription passes for scale',
      'Transparent 50% commission verification desk'
    ]
  },
  {
    title: 'FOR TUITION CENTERS',
    col: C.purpleBadge,
    bullets: [
      'Classes 1–10 batch configuration and caps',
      'Paperless daily attendance and test ledgers',
      '1-Click WhatsApp payment reminders to parents',
      'Direct faculty hiring requests from verified pool'
    ]
  },
  {
    title: 'FOR PLATFORM OWNERS',
    col: C.amberBadge,
    bullets: [
      'Total administrative control over matching',
      'Multi-stream revenue (commissions + subscriptions)',
      'Immutable security and financial audit trail',
      'Integrated real-time support chat desk'
    ]
  }
];

stakeholderValues.forEach((v, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.95;
  const y = 1.9 + row * 2.45;

  s19.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 5.78, h: 2.25,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s19.addText(v.title, {
    x: x + 0.2, y: y + 0.15, w: 5.38, h: 0.35,
    fontSize: 11.5, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  const bulletList = v.bullets.map(b => `✓  ${b}`).join('\n');
  s19.addText(bulletList, {
    x: x + 0.2, y: y + 0.55, w: 5.38, h: 1.55,
    fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 20: PROJECT SCOPE
// =========================================================================
const s20 = pptx.addSlide();
applySlideHeader(s20, 'Deliverables', 'Current Product Scope', 'A comprehensive inventory of fully engineered and verified deliverables based on the SRS.');

const scopeCategories = [
  {
    title: 'FRONTEND MODULES',
    items: ['Parent & Student Portal (8 Pages)', 'Educator & Tutor Portal (11 Pages)', 'Tuition Center Desk (8 Pages)', 'Super Admin Control Room (10 Pages)', 'Marketing Pages & 1-Click Login']
  },
  {
    title: 'BACKEND SERVICES',
    items: ['JWT Auth & RBAC Middleware', 'Contact Privacy Redaction Pipeline', 'Protected Document Storage Desk', 'Dual Engine (MongoDB + Memory Failover)', 'Socket.IO Real-Time Chat Server']
  },
  {
    title: 'BUSINESS WORKFLOWS',
    items: ['Tutor KYC Aadhaar/Degree Audit', 'Lead Posting & Tutor Applications', 'Evaluation Demo Class Lifecycle', '50% First-Month Commission Desk', '3/6/9/12-Month Subscription Passes']
  },
  {
    title: 'INSTITUTIONAL TOOLS',
    items: ['Classes 1–10 Batch Management', 'Daily Student Attendance Registers', 'Unit Test & Exam Score Ledgers', 'Monthly Fee Collection Tracking', '1-Click WhatsApp Parent Reminders']
  }
];

scopeCategories.forEach((cat, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const x = 0.8 + col * 5.95;
  const y = 1.9 + row * 2.45;

  s20.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 5.78, h: 2.25,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s20.addText(cat.title, {
    x: x + 0.2, y: y + 0.15, w: 5.38, h: 0.35,
    fontSize: 11.5, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  const list = cat.items.map(i => `• ${i}`).join('\n');
  s20.addText(list, {
    x: x + 0.2, y: y + 0.55, w: 5.38, h: 1.55,
    fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});


// =========================================================================
// SLIDE 21: FUTURE EXPANSION
// =========================================================================
const s21 = pptx.addSlide();
applySlideHeader(s21, 'Product Roadmap', 'Future Expansion Opportunities', 'Strategic enhancements for subsequent version releases (beyond current SRS scope).');

const futureItems = [
  { icon: '💳', title: 'Payment Gateway Integration', desc: 'Automated UPI, credit card, and net banking payment reconciliation.' },
  { icon: '🤖', title: 'AI-Assisted Tutor Matching', desc: 'Algorithm-driven matching based on student syllabus, pace, and tutor experience.' },
  { icon: '📱', title: 'Native Mobile Apps', desc: 'Dedicated iOS & Android applications with native push notifications.' },
  { icon: '🎥', title: 'Embedded Video Classrooms', desc: 'Integrated WebRTC virtual whiteboards and video sessions for online demos.' },
  { icon: '📊', title: 'Advanced Learning Analytics', desc: 'Predictive score trendlines, concept gap analysis, and parent insights.' },
  { icon: '🔔', title: 'Automated SMS & WhatsApp Bots', desc: 'Automated attendance alerts and assignment reminders via WhatsApp Business API.' },
];

futureItems.forEach((f, idx) => {
  const col = idx % 3;
  const row = Math.floor(idx / 3);
  const x = 0.8 + col * 3.97;
  const y = 1.9 + row * 2.2;

  s21.addShape(pptx.ShapeType.roundRect, {
    x, y, w: 3.8, h: 2.0,
    rectRadius: 0.15,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s21.addText(`${f.icon}  ${f.title}`, {
    x: x + 0.2, y: y + 0.15, w: 3.4, h: 0.4,
    fontSize: 11, fontFace: FONTS.heading, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  s21.addText(f.desc, {
    x: x + 0.2, y: y + 0.6, w: 3.4, h: 1.25,
    fontSize: 9.5, fontFace: FONTS.body, color: C.textLight, valign: 'top'
  });
});

s21.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 6.35, w: 11.73, h: 0.55,
  rectRadius: 0.1,
  fill: { color: C.navyDark },
  line: { color: C.amberBadge, width: 1 }
});
s21.addText('📌 ROADMAP NOTICE: These modules represent potential future growth avenues and are clearly separated from the current SRS product requirements.', {
  x: 1.0, y: 6.35, w: 11.33, h: 0.55,
  fontSize: 9.5, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
});


// =========================================================================
// SLIDE 22: FINAL VALUE PROPOSITION
// =========================================================================
const s22 = pptx.addSlide();
s22.background = { color: C.navyDark };

// Centerpiece Gold Border Card
s22.addShape(pptx.ShapeType.roundRect, {
  x: 1.5, y: 1.0, w: 10.33, h: 5.4,
  rectRadius: 0.25,
  fill: { color: C.navyCore },
  line: { color: C.goldPrimary, width: 2 }
});

// Central Logo
s22.addImage({
  path: LOGO_PATH,
  x: 5.66, y: 1.4, w: 2.0, h: 2.0,
});

s22.addText('SMART MINDS TUITIONS', {
  x: 2.0, y: 3.55, w: 9.33, h: 0.6,
  fontSize: 26, fontFace: FONTS.heading, bold: true, color: C.white, align: 'center', valign: 'middle'
});

s22.addText('"From Finding a Tutor To Managing the Tuition Journey."', {
  x: 2.0, y: 4.15, w: 9.33, h: 0.5,
  fontSize: 16, fontFace: FONTS.heading, italic: true, color: C.goldPrimary, align: 'center', valign: 'middle'
});

s22.addText('A structured, secure platform connecting parents, students, tutors, and coaching centers through controlled verification, matching, and ongoing tuition operations.', {
  x: 2.5, y: 4.75, w: 8.33, h: 0.8,
  fontSize: 12, fontFace: FONTS.body, color: C.textLight, align: 'center', valign: 'top'
});

// 4 Role Badges at bottom
const pillRoles = ['👨‍👩‍👧 Parents & Students', '🎓 Verified Educators', '🏢 Tuition Centers', '👑 Central Administration'];
pillRoles.forEach((pr, idx) => {
  s22.addShape(pptx.ShapeType.roundRect, {
    x: 2.0 + idx * 2.35, y: 5.65, w: 2.2, h: 0.45,
    rectRadius: 0.12,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });
  s22.addText(pr, {
    x: 2.0 + idx * 2.35, y: 5.65, w: 2.2, h: 0.45,
    fontSize: 9, fontFace: FONTS.body, bold: true, color: C.goldLight, align: 'center', valign: 'middle'
  });
});


// =========================================================================
// SLIDE 23: FINAL CTA / CONTACT
// =========================================================================
const s23 = pptx.addSlide();
s23.background = { color: C.navyDark };

s23.addShape(pptx.ShapeType.roundRect, {
  x: 1.5, y: 1.0, w: 10.33, h: 5.4,
  rectRadius: 0.25,
  fill: { color: C.navyCore },
  line: { color: C.goldPrimary, width: 1.5 }
});

s23.addImage({
  path: LOGO_PATH,
  x: 2.2, y: 1.8, w: 2.4, h: 2.4,
});

s23.addText('Let\'s Build a Smarter\nTuition Experience', {
  x: 5.0, y: 1.6, w: 6.2, h: 1.1,
  fontSize: 26, fontFace: FONTS.heading, bold: true, color: C.white, valign: 'middle'
});

s23.addText('One unified, trusted platform for parents, educators, coaching centers, and platform administrators.', {
  x: 5.0, y: 2.75, w: 6.2, h: 0.6,
  fontSize: 12, fontFace: FONTS.body, color: C.goldLight, valign: 'top'
});

// Contact Card Blocks
const contactCards = [
  { label: 'PROJECT INQUIRIES', val: '[Client Representative Name]' },
  { label: 'OFFICIAL EMAIL', val: '[contact@smartmindstuitions.com]' },
  { label: 'PLATFORM PORTAL', val: '[www.smartmindstuitions.com]' },
  { label: 'INQUIRY HELPLINE', val: '[Official Phone / WhatsApp Helpline]' }
];

contactCards.forEach((c, idx) => {
  const col = idx % 2;
  const row = Math.floor(idx / 2);
  const cx = 5.0 + col * 3.1;
  const cy = 3.5 + row * 1.05;

  s23.addShape(pptx.ShapeType.roundRect, {
    x: cx, y: cy, w: 2.95, h: 0.9,
    rectRadius: 0.1,
    fill: { color: C.navyCard },
    line: { color: C.navyBorder, width: 1 }
  });

  s23.addText(c.label, {
    x: cx + 0.15, y: cy + 0.1, w: 2.65, h: 0.25,
    fontSize: 8, fontFace: FONTS.body, bold: true, color: C.goldPrimary, valign: 'middle'
  });

  s23.addText(c.val, {
    x: cx + 0.15, y: cy + 0.38, w: 2.65, h: 0.45,
    fontSize: 9.5, fontFace: FONTS.body, color: C.white, valign: 'top'
  });
});

s23.addText('Smart Minds Tuitions  •  All Rights Reserved  •  Confidential Client Presentation', {
  x: 1.5, y: 6.6, w: 10.33, h: 0.3,
  fontSize: 9.5, fontFace: FONTS.body, color: C.textMuted, align: 'center', valign: 'middle'
});

// --- SAVE PRESENTATION ---
const OUTPUT_FILE = path.resolve(__dirname, 'Smart_Minds_Tuitions_Presentation.pptx');

pptx.writeFile({ fileName: OUTPUT_FILE })
  .then(fileName => {
    console.log(`[PPTX] Success! Presentation saved to: ${fileName}`);
  })
  .catch(err => {
    console.error('[PPTX] Error writing presentation:', err);
  });

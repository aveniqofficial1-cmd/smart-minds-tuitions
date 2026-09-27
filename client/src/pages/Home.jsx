import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  SparkleDoodle,
  CurvedArrowDoodle,
  UnderlineDoodle,
  GraduationCapIcon,
} from '../components/ui/DoodleDecorations';
import {
  ShieldCheck,
  Award,
  Users,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  School,
  Lock,
  Star,
  FileCheck,
  DollarSign,
  MessageCircle,
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="bg-cream-100 text-navy-950 min-h-screen selection:bg-gold-500 selection:text-navy-950 overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (DEEP NAVY EDITORIAL BACKGROUND WITH FLOATING CARDS & DOODLES) */}
      {/* ========================================================================= */}
      <section className="relative bg-navy-950 text-white pt-20 pb-28 sm:pb-36 lg:pb-44 overflow-hidden border-b border-navy-800">
        {/* Ambient radial glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Floating Doodles */}
        <div className="absolute top-12 left-10 hidden md:block animate-pulse">
          <SparkleDoodle className="w-8 h-8 text-gold-400" />
        </div>
        <div className="absolute top-32 right-16 hidden lg:block animate-bounce duration-1000">
          <SparkleDoodle className="w-6 h-6 text-gold-300 opacity-75" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-900 border border-gold-500/40 text-gold-400 text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>OFFICIAL PLATFORM • EMPOWERING BRIGHTER FUTURES</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white leading-[1.15]">
                The Smarter Way to{' '}
                <span className="relative inline-block text-gold-400">
                  Learn, Teach
                  <span className="absolute -bottom-2 left-0 w-full text-gold-400 opacity-80">
                    <UnderlineDoodle className="w-full h-3" />
                  </span>
                </span>{' '}
                & Manage Tuitions.
              </h1>

              {/* Subheading */}
              <p className="text-sand-200 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Connect with verified 1-on-1 home & online tutors through our admin-managed, zero-spam platform. Empowering tuition centers with complete batch, attendance, and fee automation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/register?role=parent" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full sm:w-auto text-base shadow-gold font-bold"
                  >
                    Find a Tutor (Post Free)
                  </Button>
                </Link>

                <Link to="/register?role=tutor" className="w-full sm:w-auto">
                  <Button
                    variant="navy"
                    size="lg"
                    icon={GraduationCapIcon}
                    className="w-full sm:w-auto text-base"
                  >
                    Teach With Us
                  </Button>
                </Link>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-sand-300 font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-400" />
                  <span>100% Background & KYC Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gold-400" />
                  <span>Zero Spam Contact Shield</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                  <span>Free Initial Demo Session</span>
                </div>
              </div>
            </div>

            {/* Right Visual Floating Showcase Column */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md">
                {/* Center Core Card */}
                <div className="rounded-3xl bg-gradient-to-b from-navy-900 to-navy-950 p-6 sm:p-8 border border-gold-500/30 shadow-2xl relative z-10 space-y-6">
                  <div className="flex items-center justify-between border-b border-navy-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-400/50 flex items-center justify-center text-gold-300">
                        <GraduationCapIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">
                          Smart Minds Verified
                        </h4>
                        <p className="text-xs text-gold-400">Admin-Screened Educators</p>
                      </div>
                    </div>
                    <Badge variant="verified" size="sm" dot>
                      Verified
                    </Badge>
                  </div>

                  {/* Feature Highlights */}
                  <div className="space-y-3.5 text-xs text-sand-200">
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900/80 border border-navy-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Maths, Physics, Chem & Coding for All Boards (CBSE/ICSE/State)</span>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900/80 border border-navy-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Direct Contact Reveal Upon Demo Acceptance</span>
                    </div>

                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900/80 border border-navy-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Session-by-session Attendance & Monthly Parent Reports</span>
                    </div>
                  </div>

                  {/* Rating preview */}
                  <div className="pt-2 flex items-center justify-between border-t border-navy-800 text-xs">
                    <div className="flex items-center gap-1 text-gold-400 font-bold">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        ))}
                      </div>
                      <span className="ml-1 text-white">4.9/5.0</span>
                    </div>
                    <span className="text-sand-400">Over 1,200+ Reviews</span>
                  </div>
                </div>

                {/* Floating Overlay Card: Attendance & Progress */}
                <div className="absolute -bottom-8 -left-6 bg-white text-navy-950 p-4 rounded-2xl shadow-xl border border-sand-200 z-20 max-w-[210px] hidden sm:block animate-float">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-navy-900">Score Jump</span>
                  </div>
                  <p className="text-[11px] text-navy-600 leading-tight">
                    Average student score improvement of <span className="font-bold text-emerald-700">+28%</span> in 3 months.
                  </p>
                </div>

                {/* Floating Overlay Card: Tuition Centers */}
                <div className="absolute -top-6 -right-6 bg-navy-900 text-white p-3.5 rounded-2xl shadow-xl border border-gold-500/40 z-20 max-w-[190px] hidden sm:block">
                  <div className="flex items-center gap-2 text-gold-400 text-xs font-bold">
                    <School className="w-4 h-4" />
                    <span>Tuition Centers</span>
                  </div>
                  <p className="text-[10px] text-sand-300 mt-1 leading-snug">
                    Full batch, attendance & fee reminder system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Paper Tear Decorative Transition */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
          <svg
            className="relative block w-full h-8 sm:h-12 text-cream-100 fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 L30,40 L60,10 L90,35 L120,5 L150,45 L180,15 L210,38 L240,8 L270,42 L300,12 L330,39 L360,6 L390,44 L420,14 L450,41 L480,9 L510,43 L540,11 L570,37 L600,4 L630,46 L660,16 L690,40 L720,7 L750,45 L780,13 L810,38 L840,5 L870,44 L900,10 L930,41 L960,15 L990,39 L1020,8 L1050,43 L1080,12 L1110,38 L1140,6 L1170,42 L1200,10 L1200,120 L0,120 Z" />
          </svg>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHOOSE YOUR PATH (4 CORE ROLES CARDS) */}
      {/* ========================================================================= */}
      <section className="py-20 bg-cream-100 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold font-sans tracking-widest text-gold-600 uppercase">
              TAILORED SOLUTIONS FOR EVERY LEARNER & EDUCATOR
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
              Choose Your Journey with Smart Minds
            </h2>
            <p className="text-navy-700 text-sm sm:text-base">
              Whether you are a parent seeking academic transformation, an educator building a thriving teaching career, or a center scaling operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. For Parents & Students */}
            <Card hover goldBorder className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-navy-950">
                    Parents & Students
                  </h3>
                  <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                    Post 1-on-1 tuition requirements, evaluate verified tutor profiles, book a free demo, and receive session attendance and monthly report cards.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-navy-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Free Demo Class
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Monthly Progress Reports
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Zero Privacy Leakage
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link to="/register?role=parent">
                  <Button variant="primary" size="sm" className="w-full">
                    Post a Requirement
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 2. For Home & Online Tutors */}
            <Card hover goldBorder className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <GraduationCapIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-navy-950">
                    Home & Online Tutors
                  </h3>
                  <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                    Join an elite educator network. Browse verified leads, apply with transparent 50% first-month commission, and scale with multi-tuition subscriptions.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-navy-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Verified Tuition Leads
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> Self-Reported Earnings Log
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" /> 3/6/9/12 Mo Plans
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link to="/register?role=tutor">
                  <Button variant="primary" size="sm" className="w-full">
                    Join as a Tutor
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 3. For Tuition Centers */}
            <Card hover goldBorder className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-navy-950">
                    Tuition Centers
                  </h3>
                  <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                    Automate Classes 1–10 batches. Manage student rosters, mark daily batch attendance, record exam marks, and trigger instant manual fee reminders.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-navy-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Batch Attendance & Rosters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Exam Performance Engine
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Manual Fee Reminders
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link to="/register?role=center">
                  <Button variant="primary" size="sm" className="w-full">
                    Register Center
                  </Button>
                </Link>
              </div>
            </Card>

            {/* 4. Trust & Security Guard */}
            <Card hover goldBorder className="p-6 flex flex-col justify-between bg-navy-950 text-white border-gold-500/50">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-400/40">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-white">
                    Privacy Guarantee
                  </h3>
                  <p className="text-xs text-sand-300 mt-2 leading-relaxed">
                    Strict backend contact redaction. Phone numbers and emails remain hidden until Admin verifies the match and Parent confirms demo acceptance.
                  </p>
                </div>
                <ul className="space-y-2 text-xs text-gold-300 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Zero Unsolicited Spam
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> 100% KYC Document Review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400" /> Dedicated Admin Support
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link to="/how-it-works">
                  <Button variant="navy" size="sm" className="w-full">
                    Learn How It Works
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. 6-STEP ANIMATED "HOW IT WORKS" TIMELINE */}
      {/* ========================================================================= */}
      <section className="py-24 bg-sand-100/60 border-y border-sand-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold font-sans tracking-widest text-gold-600 uppercase">
              TRANSPARENT & STRUCTURED WORKFLOW
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
              How Smart Minds Tuitions Works
            </h2>
            <p className="text-navy-700 text-sm sm:text-base">
              A 6-step admin-curated lifecycle ensuring maximum safety, quality matching, and transparent accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-gold-500">01</span>
                  <div className="p-2 bg-gold-50 rounded-xl text-gold-700">
                    <FileCheck className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-serif font-bold text-lg text-navy-950">
                  Post Requirement / KYC Register
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Parents specify grade, subjects, budget & locality. Tutors submit degree credentials, ID proofs (Aadhar/PAN), and accept our code of conduct.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-gold-500">02</span>
                  <div className="p-2 bg-gold-50 rounded-xl text-gold-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-serif font-bold text-lg text-navy-950">
                  Admin Verification & Matching
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Our management team verifies tutor documents and curates high-compatibility educators without broadcasting contact numbers publicly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-gold-500">03</span>
                  <div className="p-2 bg-gold-50 rounded-xl text-gold-700">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-serif font-bold text-lg text-navy-950">
                  Free Demo Class Arranged
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Admin schedules an initial demo class at the student's residence or online. Parents evaluate teaching pedagogy risk-free.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-gold-500">04</span>
                  <div className="p-2 bg-gold-50 rounded-xl text-gold-700">
                    <Lock className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-serif font-bold text-lg text-navy-950">
                  Acceptance & Contact Reveal
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Parent submits demo feedback. Upon acceptance, the system automatically unlocks mutual contact details for direct daily coordination.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-gold-500">05</span>
                  <div className="p-2 bg-gold-50 rounded-xl text-gold-700">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-serif font-bold text-lg text-navy-950">
                  Commission Proof & Formal Assignment
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Tutor uploads the 50% first-month commission payment screenshot. Admin verifies the transaction and permanently provisions the assignment.
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-2xl p-6 border border-sand-200 shadow-soft relative flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-serif font-bold text-gold-500">06</span>
                  <div className="p-2 bg-gold-50 rounded-xl text-gold-700">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="font-serif font-bold text-lg text-navy-950">
                  Attendance & Monthly Progress
                </h4>
                <p className="text-xs text-navy-600 leading-relaxed">
                  Tutors mark real-time attendance for every class and publish comprehensive monthly reports covering syllabus, test marks, and focus areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PLATFORM METRICS & STATS BAR */}
      {/* ========================================================================= */}
      <section className="bg-navy-950 text-white py-16 border-b border-navy-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-navy-800">
            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-5xl font-serif font-bold text-gold-400">5,000+</p>
              <p className="text-xs sm:text-sm text-sand-300 font-medium">Verified Educators</p>
            </div>

            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-5xl font-serif font-bold text-gold-400">12,500+</p>
              <p className="text-xs sm:text-sm text-sand-300 font-medium">Students Tutored</p>
            </div>

            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-5xl font-serif font-bold text-gold-400">98.4%</p>
              <p className="text-xs sm:text-sm text-sand-300 font-medium">Demo Satisfaction Rate</p>
            </div>

            <div className="p-4 space-y-1">
              <p className="text-3xl sm:text-5xl font-serif font-bold text-gold-400">100%</p>
              <p className="text-xs sm:text-sm text-sand-300 font-medium">KYC & Privacy Protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. WHY CHOOSE SMART MINDS TUITIONS */}
      {/* ========================================================================= */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold font-sans tracking-widest text-gold-600 uppercase">
              THE SMART MINDS ADVANTAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-navy-950">
              Built on Quality, Trust and Reliability
            </h2>
            <p className="text-navy-700 text-sm sm:text-base">
              Say goodbye to unverified listings and spam phone calls. Experience education management designed for student success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Rigorous KYC Verification
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Every tutor must submit educational qualifications, government ID proofs, and undergo admin scrutiny before receiving student requests.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Privacy-First Contact Shield
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                We protect parents and tutors by masking personal contact information until mutual demo confirmation is established.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Monthly Progress Auditing
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Detailed monthly reports capture topics covered, test scores, homework completion, and constructive recommendations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <School className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Tuition Center Automation
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Complete batch management for Classes 1–10. Mark batch attendance, track test performance, and issue manual fee reminders with one click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Flexible Tutor Subscriptions
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Affordable 3, 6, 9, or 12-month subscriptions enabling active tutors to take on multiple high-paying home and online tuitions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Real-Time Admin Support
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Direct in-app messaging channel with platform administrators for immediate issue resolution, demo rescheduling, and payment inquiries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HIGH CONVERTING FINAL CTA BANNER */}
      {/* ========================================================================= */}
      <section className="bg-navy-950 text-white py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold border border-gold-500/30">
            <Sparkles className="w-4 h-4" />
            <span>START YOUR ACADEMIC TRANSFORMATION TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Ready to Experience Excellence in Tutoring?
          </h2>

          <p className="text-sand-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied parents, top-tier educators, and leading tuition centers on India's premier tuition management network.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link to="/register?role=parent" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto text-base font-bold shadow-gold"
              >
                Post Tuition Requirement
              </Button>
            </Link>

            <Link to="/register?role=tutor" className="w-full sm:w-auto">
              <Button
                variant="navy"
                size="lg"
                icon={GraduationCapIcon}
                className="w-full sm:w-auto text-base"
              >
                Apply as a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

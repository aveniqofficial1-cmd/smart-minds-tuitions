import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  FileCheck,
  ShieldCheck,
  CalendarCheck,
  Lock,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  HelpCircle,
  Users,
  GraduationCap,
  School,
} from 'lucide-react';

export const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('parent');

  const faqs = [
    {
      q: 'Is the initial demo class really free for parents?',
      a: 'Yes! Smart Minds arranges a complimentary 45-60 minute demo class. You only confirm and continue if you are 100% satisfied with the tutor’s teaching style and temperament.',
    },
    {
      q: 'Why are tutor and parent phone numbers initially masked?',
      a: 'To protect both families and tutors from unsolicited spam calls and unverified communications. Contact details are automatically and securely revealed once a demo is accepted.',
    },
    {
      q: 'How does the 50% first-month commission work for tutors?',
      a: 'Tutors pay a one-time 50% commission only on the first month’s agreed fee for an assigned tuition. After that, 100% of the tuition fee goes directly to the tutor.',
    },
    {
      q: 'What is the multi-tuition subscription for tutors?',
      a: 'Once a tutor is assigned to an active tuition, taking on additional tuitions requires an active subscription (₹300/3mo, ₹600/6mo, ₹900/9mo, or ₹1200/12mo).',
    },
    {
      q: 'How do Tuition Centers use the platform?',
      a: 'Approved Tuition Centers receive a private management portal to organize batches for Classes 1–10, mark student attendance, log exam scores, and trigger manual fee reminders.',
    },
  ];

  return (
    <div className="bg-cream-100 min-h-screen text-navy-950">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <span className="text-xs font-bold font-sans tracking-widest text-gold-400 uppercase">
            COMPLETE PROCESS EXPLAINED
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            How Smart Minds Tuitions Works
          </h1>
          <p className="text-sand-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Step-by-step guidance on how parents find tutors, how educators get assigned, and how tuition centers operate with automated precision.
          </p>
        </div>
      </section>

      {/* Role-Specific Workflows Tabs */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-sand-200/80 border border-sand-300">
            <button
              onClick={() => setActiveTab('parent')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'parent'
                  ? 'bg-navy-950 text-gold-400 shadow-md'
                  : 'text-navy-700 hover:text-navy-950'
              }`}
            >
              <Users className="w-4 h-4" /> For Parents
            </button>
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'tutor'
                  ? 'bg-navy-950 text-gold-400 shadow-md'
                  : 'text-navy-700 hover:text-navy-950'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> For Tutors
            </button>
            <button
              onClick={() => setActiveTab('center')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'center'
                  ? 'bg-navy-950 text-gold-400 shadow-md'
                  : 'text-navy-700 hover:text-navy-950'
              }`}
            >
              <School className="w-4 h-4" /> For Tuition Centers
            </button>
          </div>
        </div>

        {/* Tab 1: Parents */}
        {activeTab === 'parent' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">1</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Post Requirement
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Provide student class, subjects, syllabus (CBSE/ICSE/State), location, and preferred timing. It's 100% free with no upfront cost.
              </p>
            </Card>

            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">2</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Admin Curates & Schedules Demo
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Admin matches a vetted tutor matching your criteria and schedules a free demo session at your home or online.
              </p>
            </Card>

            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">3</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Accept & Track Ongoing Progress
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Approve the tutor to unlock contact information. Receive per-session attendance logs and monthly progress reports in your portal.
              </p>
            </Card>
          </div>
        )}

        {/* Tab 2: Tutors */}
        {activeTab === 'tutor' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">1</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Register & Submit KYC
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Submit educational credentials, ID proofs (Aadhar/PAN), and accept our code of conduct. Admin reviews your profile within 24 hours.
              </p>
            </Card>

            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">2</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Apply & Conduct Demo
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Browse verified requirements in your area. Apply and deliver a high-quality free demo session to demonstrate your pedagogy.
              </p>
            </Card>

            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">3</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Upload 50% Commission & Start Teaching
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Pay the one-time 50% first-month commission via UPI QR and upload proof. Mark attendance and log earnings directly in your dashboard.
              </p>
            </Card>
          </div>
        )}

        {/* Tab 3: Centers */}
        {activeTab === 'center' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">1</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Register Academy Profile
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Sign up with your center’s registration certificate and address details. Admin verifies and unlocks your operational dashboard.
              </p>
            </Card>

            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">2</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Manage Batches & Students
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Create structured batches from Class 1 to 10. Enroll students, record daily attendance, and track examination performance.
              </p>
            </Card>

            <Card hover goldBorder className="p-6 space-y-3">
              <span className="text-3xl font-serif font-bold text-gold-500">3</span>
              <h4 className="font-serif font-bold text-lg text-navy-950">
                Track Fees & Request Tutors
              </h4>
              <p className="text-xs text-navy-600 leading-relaxed">
                Maintain monthly tuition fee statuses with 1-click manual reminder notices, and post urgent tutor requirements to the central admin pool.
              </p>
            </Card>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h3 className="text-2xl font-serif font-bold text-navy-950">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-navy-600">
              Clear answers to the most common questions regarding our platform policies.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-sand-200 shadow-soft space-y-2"
              >
                <h4 className="font-bold text-sm sm:text-base text-navy-950 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gold-600 shrink-0" />
                  {faq.q}
                </h4>
                <p className="text-xs sm:text-sm text-navy-700 pl-6 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

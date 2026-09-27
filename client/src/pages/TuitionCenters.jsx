import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  School,
  Users,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  FileCheck,
  Bell,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const TuitionCenters = () => {
  const features = [
    {
      title: 'Class 1 to 10 Batch Management',
      desc: 'Structure student batches by grade, subject (Maths, Science, English, etc.), and custom shift timings.',
      icon: Users,
    },
    {
      title: 'Digital Daily Batch Attendance',
      desc: 'Mark presence, absence, late arrivals, or excused absences per session with automatic historical logs.',
      icon: CalendarCheck,
    },
    {
      title: 'Exam Scorecards & Performance Tracking',
      desc: 'Record unit test, quarterly, and midterm exam scores with percentage calculations and optional parent notifications.',
      icon: TrendingUp,
    },
    {
      title: 'Monthly Tuition Fee Ledger',
      desc: 'Track fee statuses (Paid, Unpaid, Partial, Overdue) across all enrolled students in real-time.',
      icon: DollarSign,
    },
    {
      title: '1-Click Manual Fee Reminders',
      desc: 'Send fee reminder notices directly through the system without awkward manual follow-ups.',
      icon: Bell,
    },
    {
      title: 'Access to Central Tutor Pool',
      desc: 'Short of faculty? Post urgent tutor requirements directly to the Smart Minds central verified tutor pool.',
      icon: School,
    },
  ];

  return (
    <div className="bg-cream-100 min-h-screen text-navy-950">
      {/* Hero Header */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold border border-gold-500/30">
            <School className="w-4 h-4" />
            <span>CENTERS & ACADEMIES AUTOMATION ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Simplify Tuition Center Operations & Scale Faster
          </h1>
          <p className="text-sand-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Eliminate messy registers and spreadsheets. Empower your academy with complete batch scheduling, daily attendance, exam scorecards, and fee reminder automation.
          </p>
          <div className="pt-2">
            <Link to="/register?role=center">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Register Your Center Today
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-16">
          <span className="text-xs font-bold font-sans tracking-widest text-gold-600 uppercase">
            DESIGNED SPECIFICALLY FOR TUITION ACADEMIES
          </span>
          <h2 className="text-3xl font-serif font-bold text-navy-950">
            Everything You Need to Run a Modern Academy
          </h2>
          <p className="text-sm text-navy-600">
            Built from the ground up to solve daily administrative headaches for tuition centers across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} hover goldBorder className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-navy-600 mt-2 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="mt-16 bg-navy-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 border border-gold-500/30">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Ready to Automate Your Academy Operations?
          </h3>
          <p className="text-sand-300 text-sm max-w-xl mx-auto">
            Get your center verified by our management team and unlock full batch and student management in minutes.
          </p>
          <div>
            <Link to="/register?role=center">
              <Button variant="primary" size="lg">
                Sign Up as a Tuition Center
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

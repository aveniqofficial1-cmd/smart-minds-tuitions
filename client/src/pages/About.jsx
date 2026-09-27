import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import {
  ShieldCheck,
  Award,
  BookOpen,
  Target,
  Users,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const About = () => {
  return (
    <div className="bg-cream-100 min-h-screen text-navy-950">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold font-sans tracking-widest text-gold-400 uppercase">
            ABOUT SMART MINDS TUITIONS
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Empowering Brighter Futures Through Verified Education
          </h1>
          <p className="text-sand-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We are India's premier academic platform dedicated to connecting families with vetted educators and empowering tuition centers through automated operational excellence.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card hover goldBorder className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-navy-950 mb-3">
              Our Mission
            </h3>
            <p className="text-sm text-navy-700 leading-relaxed">
              To eliminate anxiety, spam, and unverified tutors in private education. We provide a secure, structured, and transparent ecosystem where students gain customized 1-on-1 mentorship, tutors build rewarding careers, and tuition centers operate effortlessly.
            </p>
          </Card>

          <Card hover goldBorder className="p-8">
            <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-navy-950 mb-3">
              Our Vision
            </h3>
            <p className="text-sm text-navy-700 leading-relaxed">
              To establish the nationwide gold standard in personalized home tutoring and academy management, grounded in zero privacy compromise, verified educator background checks, and measurable academic improvements.
            </p>
          </Card>
        </div>

        {/* Our 4 Core Pillars */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            The 4 Pillars of Smart Minds Tuitions
          </h2>
          <p className="text-xs sm:text-sm text-navy-600">
            How we protect and elevate the tutoring journey for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
            <ShieldCheck className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif font-bold text-base text-navy-950">
              100% KYC Verification
            </h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              Every educator uploads government ID documents and degree certificates, verified individually by our management team.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
            <Lock className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif font-bold text-base text-navy-950">
              Zero Contact Leakage
            </h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              Phone numbers and residential addresses are safeguarded on the backend until both parent and tutor confirm demo satisfaction.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
            <BookOpen className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif font-bold text-base text-navy-950">
              Structured Accountability
            </h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              Daily class attendance recording and monthly structured reports ensure parents stay completely informed on their child's progress.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-soft space-y-3">
            <Users className="w-8 h-8 text-gold-600" />
            <h4 className="font-serif font-bold text-base text-navy-950">
              Academy Automation
            </h4>
            <p className="text-xs text-navy-600 leading-relaxed">
              Independent tuition centers manage batches from Class 1 to 10 with exam tracking, attendance rosters, and instant fee reminders.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-navy-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold">
            Experience the Smart Minds Difference
          </h3>
          <p className="text-sand-300 text-sm max-w-xl mx-auto">
            Get started today by posting your child's tuition requirement or applying to join our verified educator network.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register?role=parent">
              <Button variant="primary" size="md">
                Find a Tutor
              </Button>
            </Link>
            <Link to="/register?role=tutor">
              <Button variant="navy" size="md">
                Join as Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

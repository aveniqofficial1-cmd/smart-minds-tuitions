import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  GraduationCap,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ForTutors = () => {
  const plans = [
    {
      name: 'Quarterly Plan',
      duration: '3 Months',
      price: '₹300',
      priceNum: 300,
      description: 'Ideal for tutors starting to expand their tuition portfolio.',
      features: [
        'Apply for multiple tuitions simultaneously',
        'Direct parent contact upon demo acceptance',
        'Digital attendance & earnings logger',
        'Standard Admin Chat Support',
      ],
      popular: false,
    },
    {
      name: 'Half-Yearly Plan',
      duration: '6 Months',
      price: '₹600',
      priceNum: 600,
      description: 'Great for established tutors seeking steady recurring students.',
      features: [
        'Priority placement in search results',
        'Apply for unlimited active leads',
        'Monthly progress report card templates',
        'Dedicated Tutor Relationship Manager',
      ],
      popular: true,
    },
    {
      name: '9-Month Academic',
      duration: '9 Months',
      price: '₹900',
      priceNum: 900,
      description: 'Covers the full school academic session from start to exams.',
      features: [
        'Complete academic year coverage',
        'Verified Educator Badge on profile',
        'Instant notifications for new high-budget leads',
        'Fast-track demo approval pipeline',
      ],
      popular: false,
    },
    {
      name: 'Annual Master Plan',
      duration: '12 Months',
      price: '₹1200',
      priceNum: 1200,
      description: 'Best value for full-time professional home & online tutors.',
      features: [
        '365 days of continuous multi-tuition eligibility',
        'Top-tier priority allocation for high-ticket clients',
        'Official Certificate of Verified Tutoring Excellence',
        'VIP WhatsApp & Phone Escalation Channel',
      ],
      popular: false,
    },
  ];

  return (
    <div className="bg-cream-100 min-h-screen text-navy-950">
      {/* Hero Header */}
      <section className="bg-navy-950 text-white py-16 sm:py-20 border-b border-navy-800 text-center">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-semibold border border-gold-500/30">
            <GraduationCap className="w-4 h-4" />
            <span>JOIN INDIA'S TRUSTED TUTOR COMMUNITY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-white">
            Grow Your Teaching Career With Verified Leads
          </h1>
          <p className="text-sand-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Direct access to high-paying home and online tuition opportunities with clear, transparent commission policies and structured digital management tools.
          </p>
          <div className="pt-2">
            <Link to="/register?role=tutor">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Register as a Tutor Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Policies: 50% First Month & Subscriptions */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* 50% Policy Card */}
        <Card goldBorder hover className="p-8 sm:p-10 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-gold-100 text-navy-900 font-bold text-xs">
                <DollarSign className="w-4 h-4 text-gold-700" />
                <span>50% FIRST MONTH COMMISSION POLICY</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
                Transparent, One-Time First-Month Commission
              </h2>
              <p className="text-sm text-navy-700 leading-relaxed">
                Smart Minds charges a one-time 50% commission only on the first month's agreed tuition fee once the parent approves the demo class. From Month 2 onwards, 100% of the tuition fee goes directly to you.
              </p>

              <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-2">
                <p className="font-bold text-navy-900">Example Calculation:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-white rounded-lg border border-sand-200">
                    <p className="text-navy-500">Agreed Monthly Fee</p>
                    <p className="font-bold text-navy-900 text-sm">₹6,000 / mo</p>
                  </div>
                  <div className="p-2 bg-gold-50 rounded-lg border border-gold-300">
                    <p className="text-gold-800">Month 1 Commission (50%)</p>
                    <p className="font-bold text-gold-700 text-sm">₹3,000 (One-Time)</p>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-300">
                    <p className="text-emerald-800">Month 2 & Beyond</p>
                    <p className="font-bold text-emerald-700 text-sm">₹6,000 (100% Yours)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-navy-950 text-white p-6 rounded-2xl border border-navy-800 space-y-3">
              <h4 className="font-serif font-bold text-base text-gold-400">
                Why Tutors Love This Policy
              </h4>
              <ul className="space-y-2 text-xs text-sand-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>No hidden maintenance cuts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Direct parent fee collection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>Assistance in case of fee delays</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Multi-Tuition Subscriptions */}
        <div className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold font-sans tracking-widest text-gold-600 uppercase">
              EXPAND YOUR TEACHING PORTFOLIO
            </span>
            <h2 className="text-3xl font-serif font-bold text-navy-950">
              Multi-Tuition Subscription Plans
            </h2>
            <p className="text-sm text-navy-600">
              Already have an active tuition? Activate a multi-tuition subscription to apply for unlimited open student requests in your locality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, idx) => (
              <Card
                key={idx}
                hover
                goldBorder={plan.popular}
                className={`p-6 flex flex-col justify-between ${
                  plan.popular ? 'ring-2 ring-gold-500 shadow-gold' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-500 uppercase tracking-wide">
                      {plan.duration}
                    </span>
                    {plan.popular && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-gold-500 text-navy-950 rounded-full">
                        MOST POPULAR
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-navy-950">
                      {plan.name}
                    </h3>
                    <p className="text-3xl font-serif font-bold text-navy-950 mt-2">
                      {plan.price}
                    </p>
                    <p className="text-xs text-navy-500 mt-1">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 text-xs text-navy-700 pt-2 border-t border-sand-200">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <Link to="/register?role=tutor">
                    <Button
                      variant={plan.popular ? 'primary' : 'secondary'}
                      size="sm"
                      className="w-full"
                    >
                      Choose {plan.name}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* KYC Verification Requirements */}
        <div className="bg-white rounded-3xl p-8 border border-sand-200 shadow-soft">
          <h3 className="text-xl font-serif font-bold text-navy-950 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-gold-600" />
            <span>Mandatory KYC Requirements for Tutor Approval</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-navy-700">
            <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
              <p className="font-bold text-navy-950">1. Valid Government ID</p>
              <p className="text-navy-500">Aadhar Card, PAN Card, Driving License, or Passport</p>
            </div>
            <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
              <p className="font-bold text-navy-950">2. Degree Certificate</p>
              <p className="text-navy-500">Graduation degree or highest education mark sheet</p>
            </div>
            <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
              <p className="font-bold text-navy-950">3. Profile Photo</p>
              <p className="text-navy-500">Clear passport-style professional headshot</p>
            </div>
            <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 space-y-1">
              <p className="font-bold text-navy-950">4. Code of Conduct</p>
              <p className="text-navy-500">Acceptance of punctuality, child safety, and ethics</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

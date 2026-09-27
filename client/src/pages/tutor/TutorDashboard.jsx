import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  BookOpen,
  CalendarCheck,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const TutorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await tutorService.getDashboard();
        if (res.success && res.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load tutor dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-navy-500">
        Loading tutor dashboard data...
      </div>
    );
  }

  const {
    tutorProfile = {},
    applications = [],
    demos = [],
    assignedTuitions = [],
    recentReports = [],
    earnings = [],
  } = dashboard || {};

  const isApproved = tutorProfile.approvalStatus === 'approved';
  const totalEarned = earnings.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-8">
      {/* KYC Status Alert Banner */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">KYC Application Under Admin Review</p>
            <p>
              Your profile documents (ID proof & Degree certificate) are currently being audited by Smart Minds management. Once approved, you can apply for open student leads.
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-navy relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="tutor" size="sm">Educator Portal</Badge>
            <Badge variant={tutorProfile.approvalStatus || 'pending'} size="sm" dot>
              {tutorProfile.approvalStatus || 'Pending Review'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Welcome, {tutorProfile.user?.name || 'Educator'}
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl leading-relaxed">
            Browse verified tuition leads in your area, conduct demos, manage session attendance, and log your self-reported monthly earnings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link to="/tutor/requirements">
            <Button variant="primary" size="md" icon={BookOpen}>
              Browse Open Leads
            </Button>
          </Link>
          <Link to="/tutor/attendance">
            <Button variant="navy" size="md" icon={CalendarCheck}>
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Active Tuitions</p>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {assignedTuitions.length}
          </p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Applications</p>
            <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {applications.length}
          </p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Scheduled Demos</p>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {demos.length}
          </p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Total Earnings Logged</p>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            ₹{totalEarned.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Main Sections: Tuitions & Demos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tuitions */}
        <Card className="bg-white">
          <CardHeader
            subtitle="Current ongoing home & online tutoring contracts"
            action={
              <Link to="/tutor/tuitions" className="text-xs text-gold-600 font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            Assigned Tuitions
          </CardHeader>

          <CardBody className="space-y-3">
            {assignedTuitions.length === 0 ? (
              <p className="text-xs text-navy-400 py-6 text-center">
                No active tuition assignments yet. Browse open leads to apply!
              </p>
            ) : (
              assignedTuitions.slice(0, 3).map((assign) => (
                <div
                  key={assign._id}
                  className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-950">
                        Class {assign.requirement?.grade} • {assign.requirement?.subjects?.join(', ')}
                      </span>
                      <Badge variant="assigned" size="sm">
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-navy-600">
                      Parent: <span className="font-semibold text-navy-900">{assign.parent?.user?.name}</span> ({assign.parent?.user?.phone})
                    </p>
                    <p className="text-[11px] text-navy-500">
                      Agreed Fee: ₹{assign.monthlyFee} / month
                    </p>
                  </div>

                  <Link to="/tutor/attendance">
                    <Button variant="outline" size="sm">
                      Attendance
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Scheduled Demos */}
        <Card className="bg-white">
          <CardHeader
            subtitle="Upcoming free evaluation sessions"
            action={
              <Link to="/tutor/demos" className="text-xs text-gold-600 font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            Scheduled Demo Classes
          </CardHeader>

          <CardBody className="space-y-3">
            {demos.length === 0 ? (
              <p className="text-xs text-navy-400 py-6 text-center">
                No demo classes scheduled at this time.
              </p>
            ) : (
              demos.slice(0, 3).map((demo) => (
                <div
                  key={demo._id}
                  className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-950">
                        {demo.subject} Demo
                      </span>
                      <Badge variant={demo.status} size="sm">
                        {demo.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-navy-600">
                      Mode: <span className="capitalize font-semibold">{demo.mode}</span>
                    </p>
                    <p className="text-[11px] text-navy-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-600" />
                      {new Date(demo.scheduledDate).toLocaleDateString()} at {demo.scheduledTime}
                    </p>
                  </div>

                  <Link to="/tutor/demos">
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {/* Subscription & Commission Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover className="p-6 bg-gradient-to-r from-navy-950 to-navy-900 text-white border border-gold-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wide">
              50% 1st Month Commission
            </span>
            <DollarSign className="w-5 h-5 text-gold-400" />
          </div>
          <h3 className="font-serif font-bold text-lg text-white mb-2">
            Upload Commission Proof
          </h3>
          <p className="text-xs text-sand-300 mb-4 leading-relaxed">
            Upon demo acceptance, submit the one-time 50% commission screenshot for official assignment activation.
          </p>
          <Link to="/tutor/commissions">
            <Button variant="primary" size="sm">
              Commission Center
            </Button>
          </Link>
        </Card>

        <Card hover className="p-6 bg-white border border-sand-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-navy-600 uppercase tracking-wide">
              Multi-Tuition Subscriptions
            </span>
            <Sparkles className="w-5 h-5 text-gold-600" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950 mb-2">
            Scale with 3/6/9/12 Month Plans
          </h3>
          <p className="text-xs text-navy-600 mb-4 leading-relaxed">
            Apply for multiple open tuition leads simultaneously and unlock verified educator badge perks.
          </p>
          <Link to="/tutor/subscriptions">
            <Button variant="outline" size="sm">
              Manage Subscriptions
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Activity,
  FileCheck,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await adminService.getMetrics();
        if (res.success && res.data) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-navy-500">
        Loading system management console...
      </div>
    );
  }

  const {
    counts = {},
    pendingApprovals = {},
    recentActivities = [],
    financials = {},
  } = metrics || {};

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-navy flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="admin" size="sm">Super Admin Console</Badge>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Services Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Smart Minds Master Operations Desk
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
            Audit educator KYC credentials, match tutors with student leads, coordinate demo evaluations, verify UPI commissions, and monitor center batches.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/admin/tutors">
            <Button variant="primary" size="md" icon={ShieldCheck}>
              Tutor KYC Queue ({pendingApprovals.tutors || 0})
            </Button>
          </Link>
          <Link to="/admin/commissions">
            <Button variant="gold" size="md" icon={DollarSign}>
              Verify Commissions ({pendingApprovals.commissions || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Total Registered Tutors</p>
            <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {counts.tutors || 0}
          </p>
          <div className="mt-2 text-[11px] text-amber-700 font-semibold">
            {pendingApprovals.tutors || 0} KYC Pending Review
          </div>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Registered Parents</p>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {counts.parents || 0}
          </p>
          <div className="mt-2 text-[11px] text-navy-500">
            {counts.students || 0} Children Profiled
          </div>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Tuition Centers</p>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {counts.centers || 0}
          </p>
          <div className="mt-2 text-[11px] text-purple-700 font-semibold">
            {pendingApprovals.centers || 0} Verification Pending
          </div>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Active Tuitions Matched</p>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 mt-2">
            {counts.activeTuitions || 0}
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-semibold">
            {counts.openRequirements || 0} Leads Open
          </div>
        </Card>
      </div>

      {/* Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tutor KYC Queue */}
        <Card className="bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-navy-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gold-600" />
              Tutor KYC Audits
            </h3>
            <Badge variant="gold" size="sm">
              {pendingApprovals.tutors || 0} Pending
            </Badge>
          </div>
          <p className="text-xs text-navy-600 leading-relaxed">
            Verify government ID proof cards and degree qualification certificates before approving educator profiles.
          </p>
          <Link to="/admin/tutors" className="block pt-2">
            <Button variant="primary" size="sm" className="w-full" icon={ArrowRight}>
              Open KYC Desk
            </Button>
          </Link>
        </Card>

        {/* 50% Commission Desk */}
        <Card className="bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-navy-950 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              50% Commissions
            </h3>
            <Badge variant="emerald" size="sm">
              {pendingApprovals.commissions || 0} Pending
            </Badge>
          </div>
          <p className="text-xs text-navy-600 leading-relaxed">
            Verify UPI payment screenshots submitted by tutors for accepted demo classes to unlock permanent direct parent contact.
          </p>
          <Link to="/admin/commissions" className="block pt-2">
            <Button variant="navy" size="sm" className="w-full" icon={ArrowRight}>
              Verify Commissions
            </Button>
          </Link>
        </Card>

        {/* Multi-Tuition Subscriptions */}
        <Card className="bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-navy-950 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Subscriptions
            </h3>
            <Badge variant="verified" size="sm">
              {pendingApprovals.subscriptions || 0} Pending
            </Badge>
          </div>
          <p className="text-xs text-navy-600 leading-relaxed">
            Review 3/6/9/12 month educator subscription payments (₹300/₹600/₹900/₹1200) to grant multi-application capabilities.
          </p>
          <Link to="/admin/subscriptions" className="block pt-2">
            <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
              Audit Subscriptions
            </Button>
          </Link>
        </Card>
      </div>

      {/* Operational Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card hover className="p-6 bg-navy-900 text-white border border-navy-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-wide">
              Lead Allocation Engine
            </span>
            <BookOpen className="w-5 h-5 text-gold-400" />
          </div>
          <h3 className="font-serif font-bold text-lg text-white mb-2">
            Match Student Leads with Tutors
          </h3>
          <p className="text-xs text-sand-300 mb-4 leading-relaxed">
            Review incoming parent requirements, filter approved tutors by locality and board, and dispatch demo candidates.
          </p>
          <Link to="/admin/requirements">
            <Button variant="primary" size="sm">
              Open Matching Desk
            </Button>
          </Link>
        </Card>

        <Card hover className="p-6 bg-white border border-sand-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-navy-600 uppercase tracking-wide">
              Real-Time Helpdesk
            </span>
            <Activity className="w-5 h-5 text-gold-600" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950 mb-2">
            Multi-User Live Support Desk
          </h3>
          <p className="text-xs text-navy-600 mb-4 leading-relaxed">
            Live messaging with parents, verified tutors, and tuition centers for demo arrangements and support.
          </p>
          <Link to="/admin/chat">
            <Button variant="outline" size="sm">
              Open Support Desk
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

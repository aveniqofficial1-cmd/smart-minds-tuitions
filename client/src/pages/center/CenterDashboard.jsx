import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Building2,
  Users,
  CalendarCheck,
  Award,
  DollarSign,
  Plus,
  ArrowRight,
  Sparkles,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';

export const CenterDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await centerService.getDashboard();
        if (res.success && res.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load center dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-navy-500">
        Loading tuition center data...
      </div>
    );
  }

  const {
    centerProfile = {},
    batches = [],
    students = [],
    recentAttendance = [],
    pendingFees = [],
  } = dashboard || {};

  const isApproved = centerProfile.approvalStatus === 'approved';

  return (
    <div className="space-y-8">
      {/* KYC Alert */}
      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-sm">Center Verification In Progress</p>
            <p>
              Smart Minds management is reviewing your center's registration documents. You can still set up your Classes 1–10 batches and student lists now.
            </p>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-navy relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <Badge variant="center" size="sm">Center Portal</Badge>
            <Badge variant={centerProfile.approvalStatus || 'pending'} size="sm" dot>
              {centerProfile.approvalStatus || 'Pending Verification'}
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {centerProfile.centerName || 'Tuition Center'}
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl leading-relaxed">
            Independent operations portal for Classes 1–10 batch management, student attendance, exam report cards, and monthly fee collections.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link to="/center/batches">
            <Button variant="primary" size="md" icon={Plus}>
              Create Batch
            </Button>
          </Link>
          <Link to="/center/students">
            <Button variant="navy" size="md" icon={Users}>
              Enroll Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Active Batches</p>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {batches.length}
          </p>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Enrolled Students</p>
            <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {students.length}
          </p>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Classes Supported</p>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-800">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            Classes 1–10
          </p>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Pending Fee Dues</p>
            <div className="p-2 rounded-xl bg-red-100 text-red-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {pendingFees.length} Dues
          </p>
        </Card>
      </div>

      {/* Main Sections: Batches & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Batches */}
        <Card className="bg-white">
          <CardHeader
            subtitle="Class 1 to 10 batches currently active"
            action={
              <Link to="/center/batches" className="text-xs text-gold-600 font-bold hover:underline flex items-center gap-1">
                Manage Batches <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            Active Batches
          </CardHeader>

          <CardBody className="space-y-3">
            {batches.length === 0 ? (
              <p className="text-xs text-navy-400 py-6 text-center">
                No batches created yet. Click "Create Batch" to start grouping students.
              </p>
            ) : (
              batches.slice(0, 4).map((b) => (
                <div
                  key={b._id}
                  className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-950">
                        Class {b.grade} • {b.name}
                      </span>
                      <Badge variant="verified" size="sm">
                        {b.subject}
                      </Badge>
                    </div>
                    <p className="text-xs text-navy-600">
                      Timing: {b.timing || '5:00 PM - 6:30 PM'} • Fee: ₹{b.monthlyFee}/mo
                    </p>
                  </div>

                  <Link to="/center/attendance">
                    <Button variant="outline" size="sm">
                      Attendance
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Operational Modules */}
        <div className="space-y-4">
          <Card hover className="p-6 bg-white border border-sand-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-600 uppercase tracking-wide">
                Faculty Matching
              </span>
              <Sparkles className="w-5 h-5 text-gold-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-950 mb-2">
              Hire Verified Subject Tutors
            </h3>
            <p className="text-xs text-navy-600 mb-4 leading-relaxed">
              Need qualified teachers for specific classes or subjects? Request vetted educators from Smart Minds talent pool.
            </p>
            <Link to="/center/tutor-requests">
              <Button variant="primary" size="sm">
                Request Faculty
              </Button>
            </Link>
          </Card>

          <Card hover className="p-6 bg-white border border-sand-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-navy-600 uppercase tracking-wide">
                Fee Collection & Reminders
              </span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-navy-950 mb-2">
              Automated WhatsApp Fee Reminders
            </h3>
            <p className="text-xs text-navy-600 mb-4 leading-relaxed">
              Generate 1-click personalized payment reminder messages with UPI details to send directly to parents.
            </p>
            <Link to="/center/fees">
              <Button variant="outline" size="sm">
                Open Fee Ledger
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

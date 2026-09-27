import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Users,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ParentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await parentService.getDashboard();
        if (res.success && res.data) {
          setDashboard(res.data);
        }
      } catch (err) {
        console.error('Failed to load parent dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-navy-500">
        Loading parent dashboard data...
      </div>
    );
  }

  const { students = [], requirements = [], demos = [], assignedTutors = [] } = dashboard || {};

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-navy relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <Badge variant="parent" size="sm">Parent Portal</Badge>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Welcome to Your Family Education Hub
          </h1>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl leading-relaxed">
            Manage your children's learning journey, review verified tutor applicants, book free demos, and monitor session-by-session progress.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <Link to="/parent/requirements">
            <Button variant="primary" size="md" icon={PlusCircle}>
              Post Tuition Requirement
            </Button>
          </Link>
          <Link to="/parent/students">
            <Button variant="navy" size="md" icon={Users}>
              Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Enrolled Students</p>
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {students.length}
          </p>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Active Requirements</p>
            <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {requirements.length}
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
            <p className="text-xs font-semibold text-navy-600">Assigned Tutors</p>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {assignedTutors.length}
          </p>
        </Card>
      </div>

      {/* Main Grid: Demos & Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduled Demos */}
        <Card className="bg-white">
          <CardHeader
            subtitle="Free initial evaluation sessions coordinated by Admin"
            action={
              <Link to="/parent/demos" className="text-xs text-gold-600 font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            Scheduled Demo Classes
          </CardHeader>

          <CardBody className="space-y-3">
            {demos.length === 0 ? (
              <p className="text-xs text-navy-400 py-6 text-center">
                No active demo classes scheduled yet.
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
                      Tutor: <span className="font-semibold text-navy-900">{demo.tutor?.user?.name || 'Assigned Tutor'}</span>
                    </p>
                    <p className="text-[11px] text-navy-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-600" />
                      {new Date(demo.scheduledDate).toLocaleDateString()} at {demo.scheduledTime} ({demo.mode})
                    </p>
                  </div>

                  <Link to="/parent/demos">
                    <Button variant="outline" size="sm">
                      Evaluate
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Active Posted Requirements */}
        <Card className="bg-white">
          <CardHeader
            subtitle="Tuition inquiries reviewed by Smart Minds admin"
            action={
              <Link to="/parent/requirements" className="text-xs text-gold-600 font-bold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            My Tuition Requirements
          </CardHeader>

          <CardBody className="space-y-3">
            {requirements.length === 0 ? (
              <p className="text-xs text-navy-400 py-6 text-center">
                No tuition requirements posted yet.
              </p>
            ) : (
              requirements.slice(0, 3).map((req) => (
                <div
                  key={req._id}
                  className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-navy-950">
                        Class {req.grade} • {req.subjects?.join(', ')}
                      </span>
                      <Badge variant={req.status} size="sm">
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-navy-600">
                      Locality: {req.location?.locality} • Budget: ₹{req.budgetMonthly}/mo
                    </p>
                  </div>

                  <Link to={`/parent/requirements`}>
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

      {/* Officially Assigned Tutors with Verified Contact Notice */}
      <Card className="bg-white">
        <CardHeader
          subtitle="Tutors officially assigned following demo acceptance"
          action={
            <Link to="/parent/assigned-tutors" className="text-xs text-gold-600 font-bold hover:underline flex items-center gap-1">
              View All Tutors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        >
          Active Assigned Tutors
        </CardHeader>

        <CardBody>
          {assignedTutors.length === 0 ? (
            <div className="p-8 text-center text-xs text-navy-500 space-y-2">
              <ShieldCheck className="w-10 h-10 text-gold-500/70 mx-auto" />
              <p className="font-semibold text-navy-900">No active assigned tutors yet</p>
              <p className="text-navy-500 max-w-sm mx-auto">
                Once an Admin-scheduled demo is approved by you, your tutor's direct phone and email will be unlocked right here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assignedTutors.map((assign) => (
                <div
                  key={assign._id}
                  className="p-4 rounded-2xl bg-sand-50/60 border border-sand-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-navy-950 font-bold flex items-center justify-center text-xs">
                        {assign.tutor?.user?.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-950">
                          {assign.tutor?.user?.name}
                        </h4>
                        <p className="text-[11px] text-navy-500">
                          {assign.requirement?.subjects?.join(', ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="assigned" size="sm">
                      Active
                    </Badge>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-sand-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">Direct Phone:</span>
                      <span className="font-bold text-navy-950">
                        {assign.tutor?.user?.phone || 'Unlocked'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-navy-500">Email:</span>
                      <span className="font-bold text-navy-950">
                        {assign.tutor?.user?.email}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

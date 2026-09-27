import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  User,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

export const AdminRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [selectedTutorId, setSelectedTutorId] = useState('');
  const [demoDate, setDemoDate] = useState(new Date().toISOString().split('T')[0]);
  const [demoTime, setDemoTime] = useState('05:00 PM');
  const [demoMode, setDemoMode] = useState('home');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rRes, tRes] = await Promise.all([
        adminService.getRequirements(),
        adminService.getTutors({ status: 'approved' }),
      ]);

      if (rRes.success && rRes.data) {
        setRequirements(rRes.data);
      }
      if (tRes.success && tRes.data) {
        setTutors(tRes.data);
        if (tRes.data.length > 0) {
          setSelectedTutorId(tRes.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to load requirements or tutors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleDemo = async (e) => {
    e.preventDefault();
    if (!selectedReq || !selectedTutorId) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      const res = await adminService.scheduleDemo({
        requirementId: selectedReq._id,
        studentId: selectedReq.student?._id || selectedReq.student,
        parentId: selectedReq.parent?._id || selectedReq.parent,
        tutorId: selectedTutorId,
        subject: selectedReq.subjects?.[0] || 'Tuition Subject',
        scheduledDate: demoDate,
        scheduledTime: demoTime,
        mode: demoMode,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: 'Evaluation demo scheduled! Tutor and Parent notified.',
        });
        setTimeout(() => {
          setSelectedReq(null);
          setFeedback(null);
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to schedule demo.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Student Tuition Leads & Matching Desk
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Audit parent-posted tuition requirements, review tutor applications, and dispatch evaluation demos.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading tuition requirements...</div>
      ) : requirements.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Student Leads Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            When parents post home or online tuition requirements, they will appear here for admin audit and matching.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requirements.map((req) => (
            <Card key={req._id} hover goldBorder className="p-6 space-y-5 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    {req.board || 'CBSE'} Board
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    Class {req.grade} • {req.subjects?.join(', ')}
                  </h3>
                  <p className="text-xs text-navy-500">
                    Parent: {req.parent?.user?.name || 'Parent'} ({req.parent?.user?.phone})
                  </p>
                </div>
                <Badge variant={req.status} size="sm">
                  {req.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>{req.location?.locality || req.location?.area || 'Hyderabad'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Budget: <strong>₹{req.budgetMin} - ₹{req.budgetMax}</strong> / month
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>
                    {req.mode} • {req.frequencyPerWeek || 5} days/week ({req.preferredTime || 'Evening'})
                  </span>
                </div>
              </div>

              {req.specificRequirements && (
                <p className="text-xs text-navy-600 italic">
                  "{req.specificRequirements}"
                </p>
              )}

              <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                <span className="text-[11px] text-navy-400">
                  {req.applicants?.length || 0} Tutors Applied
                </span>
                <Button
                  variant="primary"
                  size="xs"
                  icon={CalendarCheck}
                  onClick={() => {
                    setSelectedReq(req);
                    setDemoMode(req.mode || 'home');
                  }}
                >
                  Schedule Demo
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Schedule Demo Modal */}
      {selectedReq && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedReq(null);
            setFeedback(null);
          }}
          title={`Schedule Demo for Class ${selectedReq.grade} ${selectedReq.subjects?.join(', ')}`}
        >
          <form onSubmit={handleScheduleDemo} className="space-y-4">
            {feedback && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-red-50 text-red-800 border border-red-300'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedback.msg}</span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1 text-navy-800">
              <p>
                <strong>Parent:</strong> {selectedReq.parent?.user?.name} ({selectedReq.parent?.user?.phone})
              </p>
              <p>
                <strong>Locality:</strong> {selectedReq.location?.locality || selectedReq.location?.area || 'Hyderabad'}
              </p>
              <p>
                <strong>Budget:</strong> ₹{selectedReq.budgetMin} - ₹{selectedReq.budgetMax} / month
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Select Approved Educator
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                value={selectedTutorId}
                onChange={(e) => setSelectedTutorId(e.target.value)}
                required
              >
                {tutors.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.user?.name} — {t.qualification} ({t.primarySubject || 'Educator'})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Scheduled Date"
                type="date"
                required
                value={demoDate}
                onChange={(e) => setDemoDate(e.target.value)}
              />

              <Input
                label="Scheduled Time"
                type="text"
                required
                placeholder="e.g. 05:30 PM"
                value={demoTime}
                onChange={(e) => setDemoTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Teaching Mode
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                value={demoMode}
                onChange={(e) => setDemoMode(e.target.value)}
              >
                <option value="home">Home Tuition</option>
                <option value="online">Online Demo</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReq(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={submitting}
                icon={CalendarCheck}
              >
                Dispatch Demo
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

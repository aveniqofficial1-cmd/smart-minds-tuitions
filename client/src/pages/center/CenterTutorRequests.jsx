import React, { useState, useEffect } from 'react';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  GraduationCap,
  Plus,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const CenterTutorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    subject: 'Mathematics & Science',
    gradeRange: 'Classes 8–10',
    timing: '5:00 PM - 7:00 PM (Mon-Sat)',
    budgetMonthly: 12000,
    qualificationRequired: 'B.Ed / M.Sc / B.Tech',
    notes: 'Need experienced faculty for board exam revision batches.',
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await centerService.getTutorRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Failed to load tutor requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await centerService.createTutorRequest({
        ...formData,
        budgetMonthly: Number(formData.budgetMonthly),
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: 'Faculty requirement posted! Smart Minds operations will match verified tutors.',
        });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            subject: 'Mathematics & Science',
            gradeRange: 'Classes 8–10',
            timing: '5:00 PM - 7:00 PM (Mon-Sat)',
            budgetMonthly: 12000,
            qualificationRequired: 'B.Ed / M.Sc / B.Tech',
            notes: '',
          });
          fetchRequests();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to submit tutor request.',
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
            Center Faculty Hiring & Tutor Requests
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Request vetted, background-verified subject teachers and faculty for your tuition center batches.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Request Faculty
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading faculty requests...</div>
      ) : requests.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Faculty Requests Posted Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Need subject specialists to teach your center batches? Post a requirement to access 1,000+ verified teachers.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            Post Teacher Requirement
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requests.map((req) => (
            <Card key={req._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    {req.gradeRange}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {req.subject} Faculty
                  </h3>
                </div>
                <Badge variant={req.status || 'open'} size="sm">
                  {req.status || 'Active Request'}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>Schedule: <strong>{req.timing}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Monthly Budget: <strong>₹{req.budgetMonthly?.toLocaleString()}</strong></span>
                </p>
                <p className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>Qualification: {req.qualificationRequired}</span>
                </p>
              </div>

              {req.notes && (
                <p className="text-xs text-navy-600 italic">
                  "{req.notes}"
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Request Faculty Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Post Faculty / Teacher Requirement"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <Input
              label="Subject / Specialization"
              required
              placeholder="e.g. Mathematics, Physics & Chemistry"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Class / Grade Range"
                required
                placeholder="e.g. Classes 8 to 10"
                value={formData.gradeRange}
                onChange={(e) => setFormData({ ...formData, gradeRange: e.target.value })}
              />

              <Input
                label="Monthly Budget / Compensation (₹)"
                type="number"
                required
                placeholder="e.g. 15000"
                value={formData.budgetMonthly}
                onChange={(e) => setFormData({ ...formData, budgetMonthly: e.target.value })}
              />
            </div>

            <Input
              label="Required Schedule / Timings"
              required
              placeholder="e.g. 5:00 PM - 7:00 PM (Monday to Saturday)"
              value={formData.timing}
              onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
            />

            <Input
              label="Preferred Qualifications"
              required
              placeholder="e.g. B.Ed, M.Sc, or B.Tech with 2+ years experience"
              value={formData.qualificationRequired}
              onChange={(e) => setFormData({ ...formData, qualificationRequired: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Specific Batch Requirements & Center Notes
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="Describe batch strength, board syllabus focus, or special requirements..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={submitting}
                icon={Sparkles}
              >
                Submit Faculty Request
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

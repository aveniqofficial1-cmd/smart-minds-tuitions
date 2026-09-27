import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Input';
import {
  CalendarCheck,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Video,
  ShieldCheck,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const ParentDemos = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [decisionType, setDecisionType] = useState('accepted'); // 'accepted' | 'rejected'
  const [feedback, setFeedback] = useState('');
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const res = await parentService.getDemos();
      if (res.success && res.data) {
        setDemos(res.data);
      }
    } catch (err) {
      console.error('Failed to load demos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const openDecisionModal = (demo, type) => {
    setSelectedDemo(demo);
    setDecisionType(type);
    setFeedback('');
    setDecisionModalOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDemo) return;

    try {
      setSubmitting(true);
      const res = await parentService.submitDemoDecision(selectedDemo._id, {
        decision: decisionType,
        feedback,
      });

      if (res.success) {
        setDecisionModalOpen(false);
        if (decisionType === 'accepted') {
          setSuccessMessage(
            'Demo accepted successfully! The tutor contact has been unlocked in your Assigned Tutors tab.'
          );
        } else {
          setSuccessMessage(
            'Feedback submitted. Our academic team will curate alternative tutor profiles.'
          );
        }
        fetchDemos();
      }
    } catch (err) {
      console.error('Decision submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Demo Classes & Evaluations
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Evaluate free demo classes scheduled by Admin. Accept your preferred educator to begin regular classes.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-950 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-sm text-navy-500">Loading demo classes...</div>
      ) : demos.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Scheduled Demo Classes
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Once you post a tuition requirement, our academic team will schedule a free demo session with a verified tutor.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {demos.map((demo) => (
            <Card key={demo._id} hover className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-base sm:text-lg font-serif font-bold text-navy-950">
                      {demo.subject} Demo Class
                    </span>
                    <Badge variant={demo.status} size="sm">
                      {demo.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-600" />
                      <span>
                        {new Date(demo.scheduledDate).toLocaleDateString()} at {demo.scheduledTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {demo.mode === 'online' ? (
                        <Video className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-gold-600" />
                      )}
                      <span className="capitalize">{demo.mode} Demo</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tutor: {demo.tutor?.user?.name || 'Assigned Tutor'}</span>
                    </div>
                  </div>

                  {demo.feedback && (
                    <p className="text-xs text-navy-700 bg-sand-50 p-2.5 rounded-lg border border-sand-200">
                      <span className="font-semibold">Parent Feedback:</span> {demo.feedback}
                    </p>
                  )}
                </div>

                {/* Actions if scheduled or completed */}
                {demo.status === 'scheduled' || demo.status === 'completed' ? (
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => openDecisionModal(demo, 'accepted')}
                    >
                      Accept Tutor
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={XCircle}
                      onClick={() => openDecisionModal(demo, 'rejected')}
                    >
                      Decline
                    </Button>
                  </div>
                ) : (
                  <div className="shrink-0 text-xs font-semibold text-navy-500">
                    Evaluation finalized ({demo.status})
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Decision Modal */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        title={decisionType === 'accepted' ? 'Accept Tutor & Begin Regular Classes' : 'Decline Demo & Request Change'}
        subtitle={`Demo for ${selectedDemo?.subject} with ${selectedDemo?.tutor?.user?.name || 'Tutor'}`}
      >
        <form onSubmit={handleDecisionSubmit} className="space-y-4">
          {decisionType === 'accepted' ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                Contact Unlock Guarantee
              </p>
              <p>
                Accepting this tutor will formally notify Admin, trigger official assignment provisioning, and unlock the tutor's direct phone number in your portal.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950">
              Please share constructive feedback so our academic counseling team can find an educator who better aligns with your child's requirements.
            </div>
          )}

          <Textarea
            label="Your Feedback / Comments (Optional)"
            rows={3}
            placeholder={
              decisionType === 'accepted'
                ? 'e.g. Excellent explanation of concepts and patient temperament...'
                : 'e.g. Prefer someone with deeper experience in ICSE numerical problem solving...'
            }
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setDecisionModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant={decisionType === 'accepted' ? 'primary' : 'danger'}
              size="sm"
              type="submit"
              loading={submitting}
            >
              Confirm {decisionType === 'accepted' ? 'Acceptance' : 'Decline'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

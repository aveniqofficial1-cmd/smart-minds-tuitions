import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [auditingSub, setAuditingSub] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSubscriptions();
      if (res.success && res.data) {
        setSubscriptions(res.data);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDecision = async (status) => {
    if (!auditingSub) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await adminService.reviewSubscription(auditingSub._id, { status });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Multi-Tuition Subscription successfully marked as ${status}! Educator's multi-application pass is activated.`,
        });
        setTimeout(() => {
          setAuditingSub(null);
          setFeedback(null);
          fetchSubscriptions();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to update subscription status.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(
    (s) => filterStatus === 'all' || s.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Multi-Tuition Subscription Approvals
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Audit educators' multi-tuition tier payments (3, 6, 9, 12 months) and activate unlimited lead application privileges.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'active', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === st
                ? 'bg-navy-950 text-white shadow-sm'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading subscription records...</div>
      ) : filteredSubscriptions.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Subscription Proofs Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            When tutors purchase multi-tuition passes (₹300 - ₹1200), their payment screenshots will appear here for verification.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => (
            <Card key={sub._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold-600" />
                    {sub.planMonths} Months Multi-Tuition Pass
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    ₹{sub.amount || '—'}
                  </h3>
                </div>
                <Badge variant={sub.status} size="sm">
                  {sub.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p>
                  <strong>Educator:</strong> {sub.tutor?.user?.name || 'Tutor'} ({sub.tutor?.user?.phone})
                </p>
                <p>
                  <strong>UTR / Reference:</strong> <span className="font-mono">{sub.transactionRef || 'Manual UPI'}</span>
                </p>
                <p className="text-navy-400">
                  Purchased on {new Date(sub.createdAt).toLocaleDateString()}
                </p>
                {sub.startDate && (
                  <p className="text-emerald-700 font-semibold">
                    Valid: {new Date(sub.startDate).toLocaleDateString()} → {new Date(sub.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {sub.screenshot && (
                <a
                  href={`/api/documents/${sub.screenshot}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 rounded-xl bg-sand-100 hover:bg-gold-50 border border-sand-300 text-center text-xs font-bold text-navy-900 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gold-700" />
                  View Payment Screenshot
                </a>
              )}

              <div className="pt-2 border-t border-sand-200 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="xs"
                  icon={ShieldCheck}
                  onClick={() => {
                    setAuditingSub(sub);
                    setFeedback(null);
                  }}
                >
                  Verify Plan
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Audit Modal */}
      {auditingSub && (
        <Modal
          isOpen={true}
          onClose={() => {
            setAuditingSub(null);
            setFeedback(null);
          }}
          title={`Verify ${auditingSub.planMonths}-Month Multi-Tuition Pass`}
        >
          <div className="space-y-4">
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

            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1.5 text-navy-800">
              <p>
                <strong>Educator:</strong> {auditingSub.tutor?.user?.name} ({auditingSub.tutor?.user?.phone})
              </p>
              <p>
                <strong>Pass Duration:</strong> {auditingSub.planMonths} Months (Unlimited Applications)
              </p>
              <p>
                <strong>Plan Amount:</strong> ₹{auditingSub.amount}
              </p>
              <p>
                <strong>UTR / Reference:</strong> <span className="font-mono">{auditingSub.transactionRef}</span>
              </p>
            </div>

            {auditingSub.screenshot && (
              <a
                href={`/api/documents/${auditingSub.screenshot}`}
                target="_blank"
                rel="noreferrer"
                className="block p-3.5 rounded-xl bg-gold-50 hover:bg-gold-100 border border-gold-300 text-center text-xs font-bold text-navy-950 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-gold-700" />
                Open Full UPI Transaction Screenshot
              </a>
            )}

            <div className="flex justify-between items-center gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={submitting}
                icon={XCircle}
                onClick={() => handleDecision('rejected')}
              >
                Reject Proof
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuditingSub(null)}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  icon={CheckCircle2}
                  onClick={() => handleDecision('approved')}
                >
                  Approve & Activate Pass
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

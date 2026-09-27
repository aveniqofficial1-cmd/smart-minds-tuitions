import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  DollarSign,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  AlertCircle,
  Clock,
  User,
} from 'lucide-react';

export const AdminCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [verifyingComm, setVerifyingComm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCommissions();
      if (res.success && res.data) {
        setCommissions(res.data);
      }
    } catch (err) {
      console.error('Failed to load commissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const handleDecision = async (status) => {
    if (!verifyingComm) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await adminService.reviewCommission(verifyingComm._id, { status });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Commission marked as ${status}! Tuition contract officially activated.`,
        });
        setTimeout(() => {
          setVerifyingComm(null);
          setFeedback(null);
          fetchCommissions();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to update commission status.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCommissions = commissions.filter(
    (c) => filterStatus === 'all' || c.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            50% Commission Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Audit one-time 50% first-month commission payment proofs submitted by tutors for accepted demo classes.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((st) => (
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
        <div className="p-12 text-center text-sm text-navy-500">Loading commission audit queue...</div>
      ) : filteredCommissions.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Commission Proofs Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            When tutors upload UPI payment transfer screenshots for accepted tuition demos, they will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommissions.map((comm) => (
            <Card key={comm._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    50% 1st Month Commission
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    ₹{comm.amount || '—'}
                  </h3>
                </div>
                <Badge variant={comm.status} size="sm">
                  {comm.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p>
                  <strong>Tutor:</strong> {comm.tutor?.user?.name || 'Tutor'} ({comm.tutor?.user?.phone})
                </p>
                <p>
                  <strong>Ref / UTR:</strong> <span className="font-mono">{comm.transactionRef || 'Manual Transfer'}</span>
                </p>
                <p className="text-navy-400">
                  Submitted on {new Date(comm.createdAt).toLocaleDateString()}
                </p>
              </div>

              {comm.screenshot && (
                <a
                  href={`/api/documents/${comm.screenshot}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-3 rounded-xl bg-sand-100 hover:bg-gold-50 border border-sand-300 text-center text-xs font-bold text-navy-900 flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gold-700" />
                  View UPI Transfer Screenshot
                </a>
              )}

              <div className="pt-2 border-t border-sand-200 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="xs"
                  icon={ShieldCheck}
                  onClick={() => {
                    setVerifyingComm(comm);
                    setFeedback(null);
                  }}
                >
                  Verify Payment
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Verify Modal */}
      {verifyingComm && (
        <Modal
          isOpen={true}
          onClose={() => {
            setVerifyingComm(null);
            setFeedback(null);
          }}
          title="Verify 50% Commission Payment"
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
                <strong>Educator:</strong> {verifyingComm.tutor?.user?.name} ({verifyingComm.tutor?.user?.phone})
              </p>
              <p>
                <strong>Commission Amount:</strong> ₹{verifyingComm.amount}
              </p>
              <p>
                <strong>UTR / Reference:</strong> <span className="font-mono">{verifyingComm.transactionRef}</span>
              </p>
            </div>

            {verifyingComm.screenshot && (
              <a
                href={`/api/documents/${verifyingComm.screenshot}`}
                target="_blank"
                rel="noreferrer"
                className="block p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-center text-xs font-bold text-emerald-950 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-700" />
                Open Full UPI Payment Screenshot
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
                  onClick={() => setVerifyingComm(null)}
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
                  Approve & Unlock Direct Contacts
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

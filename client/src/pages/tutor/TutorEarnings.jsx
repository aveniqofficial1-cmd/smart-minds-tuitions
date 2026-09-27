import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  DollarSign,
  Plus,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Wallet,
} from 'lucide-react';

export const TutorEarnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const [formData, setFormData] = useState({
    tuitionId: '',
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    amount: '',
    paymentMode: 'upi',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [earnRes, tuitRes] = await Promise.all([
        tutorService.getEarnings(),
        tutorService.getTuitions(),
      ]);

      if (earnRes.success && earnRes.data) {
        setEarnings(earnRes.data);
      }
      if (tuitRes.success && tuitRes.data) {
        setTuitions(tuitRes.data);
        if (tuitRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            tuitionId: tuitRes.data[0]._id,
            amount: tuitRes.data[0].monthlyFee || '',
          }));
        }
      }
    } catch (err) {
      console.error('Failed to load earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await tutorService.logEarning({
        ...formData,
        amount: Number(formData.amount),
      });

      if (res.success) {
        setFeedback({ type: 'success', msg: 'Earning entry logged successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            tuitionId: tuitions[0]?._id || '',
            month: months[new Date().getMonth()],
            year: new Date().getFullYear(),
            amount: tuitions[0]?.monthlyFee || '',
            paymentMode: 'upi',
            notes: '',
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to log earning entry.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const totalEarnings = earnings.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const currentYear = new Date().getFullYear();
  const thisYearEarnings = earnings
    .filter((e) => e.year === currentYear)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Earnings Ledger & Fee Tracking
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Self-reported monthly tuition fee ledger to keep track of fees received directly from parents.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
          disabled={tuitions.length === 0}
        >
          Log Fee Receipt
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Total Logged Earnings</p>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            ₹{totalEarnings.toLocaleString()}
          </p>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Current Year ({currentYear})</p>
            <div className="p-2 rounded-xl bg-gold-100 text-gold-800">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            ₹{thisYearEarnings.toLocaleString()}
          </p>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Active Tuition Contracts</p>
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-navy-950 mt-2">
            {tuitions.length}
          </p>
        </Card>
      </div>

      {/* Earnings Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading earnings records...</div>
      ) : earnings.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Earnings Logged Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {tuitions.length === 0
              ? 'You need an active assigned tuition to record received tuition payments.'
              : 'As parents pay your monthly fees, log the transactions here to maintain your educator revenue record.'}
          </p>
          {tuitions.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Log First Payment
            </Button>
          )}
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sand-100 border-b border-sand-200 text-navy-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Period</th>
                  <th className="p-4">Student & Class</th>
                  <th className="p-4">Parent</th>
                  <th className="p-4">Payment Mode</th>
                  <th className="p-4">Notes</th>
                  <th className="p-4 text-right">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-navy-800">
                {earnings.map((earn) => (
                  <tr key={earn._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 font-semibold text-navy-950 whitespace-nowrap">
                      {earn.month} {earn.year}
                    </td>
                    <td className="p-4 font-medium">
                      Class {earn.tuition?.requirement?.grade || '—'} (
                      {earn.tuition?.requirement?.subjects?.join(', ') || 'Tuition'})
                    </td>
                    <td className="p-4 text-navy-600">
                      {earn.tuition?.parent?.user?.name || 'Parent'}
                    </td>
                    <td className="p-4 uppercase text-[11px] font-semibold text-navy-700">
                      {earn.paymentMode}
                    </td>
                    <td className="p-4 text-navy-500 text-xs italic max-w-xs truncate">
                      {earn.notes || '—'}
                    </td>
                    <td className="p-4 text-right font-bold text-emerald-700 text-sm">
                      ₹{earn.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Log Earning Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Log Received Tuition Fee"
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

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Select Tuition Contract
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                value={formData.tuitionId}
                onChange={(e) => {
                  const selectedT = tuitions.find((t) => t._id === e.target.value);
                  setFormData({
                    ...formData,
                    tuitionId: e.target.value,
                    amount: selectedT?.monthlyFee || formData.amount,
                  });
                }}
                required
              >
                {tuitions.map((t) => (
                  <option key={t._id} value={t._id}>
                    Class {t.requirement?.grade} - {t.requirement?.subjects?.join(', ')} ({t.parent?.user?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Month
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  required
                >
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Year"
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount Received (₹)"
                type="number"
                required
                placeholder="e.g. 5000"
                icon={DollarSign}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Payment Mode
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                >
                  <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                  <option value="cash">Direct Cash</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
            </div>

            <Input
              label="Transaction ID / Notes (Optional)"
              placeholder="e.g. UPI Ref: 3849204928"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />

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
                icon={DollarSign}
              >
                Save Payment Entry
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

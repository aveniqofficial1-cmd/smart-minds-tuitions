import React, { useState, useEffect } from 'react';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  DollarSign,
  Plus,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Phone,
  Send,
} from 'lucide-react';

export const CenterFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const [formData, setFormData] = useState({
    studentId: '',
    month: months[new Date().getMonth()],
    year: new Date().getFullYear(),
    amount: 2500,
    status: 'paid',
    paymentMode: 'upi',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [fRes, sRes] = await Promise.all([
        centerService.getFees(),
        centerService.getStudents(),
      ]);

      if (fRes.success && fRes.data) {
        setFees(fRes.data);
      }
      if (sRes.success && sRes.data) {
        setStudents(sRes.data);
        if (sRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, studentId: sRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load fee ledger:', err);
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
      const res = await centerService.recordFee({
        ...formData,
        amount: Number(formData.amount),
      });

      if (res.success) {
        setFeedback({ type: 'success', msg: 'Fee entry recorded successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            studentId: students[0]?._id || '',
            month: months[new Date().getMonth()],
            year: new Date().getFullYear(),
            amount: 2500,
            status: 'paid',
            paymentMode: 'upi',
            notes: '',
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to record fee entry.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppReminder = (feeItem) => {
    const studentName = feeItem.student?.name || 'Student';
    const parentName = feeItem.student?.parentName || 'Parent';
    const parentPhone = feeItem.student?.parentPhone?.replace(/[^0-9]/g, '') || '';
    const amount = feeItem.amount || 2500;
    const month = feeItem.month || 'Current';

    const text = `Dear ${parentName}, greetings from Smart Minds Tuition Center. This is a gentle reminder regarding the monthly tuition fee of ₹${amount} for ${studentName} for the month of ${month}. Kindly clear the pending dues at your earliest convenience via UPI or at the center counter. Thank you!`;

    const url = `https://api.whatsapp.com/send?phone=${parentPhone.length === 10 ? '91' + parentPhone : parentPhone}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const totalCollected = fees
    .filter((f) => f.status === 'paid')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingDues = fees
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Center Fee Ledger & Payment Records
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Track student monthly tuition collections, mark settlements, and generate 1-click WhatsApp reminders.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
          disabled={students.length === 0}
        >
          Record Fee Payment
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Total Fees Collected</p>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-emerald-700 mt-2">
            ₹{totalCollected.toLocaleString()}
          </p>
        </Card>

        <Card hover className="p-5 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-navy-600">Pending Dues Outstanding</p>
            <div className="p-2 rounded-xl bg-red-100 text-red-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-red-600 mt-2">
            ₹{pendingDues.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Fee Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading fee records...</div>
      ) : fees.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Fee Records Logged Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {students.length === 0
              ? 'Enroll students in your center to track monthly fee collections.'
              : 'Record received fee payments or pending dues for each enrolled student.'}
          </p>
          {students.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Record First Fee
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
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Parent Details</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Mode</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-navy-800">
                {fees.map((f) => (
                  <tr key={f._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 font-semibold text-navy-950 whitespace-nowrap">
                      {f.month} {f.year}
                    </td>
                    <td className="p-4 font-bold text-navy-950">
                      {f.student?.name || 'Student'} (Class {f.student?.grade})
                    </td>
                    <td className="p-4 text-navy-600">
                      {f.student?.parentName} ({f.student?.parentPhone})
                    </td>
                    <td className="p-4 font-bold text-navy-950">
                      ₹{f.amount?.toLocaleString()}
                    </td>
                    <td className="p-4 uppercase text-[11px] font-semibold text-navy-700">
                      {f.paymentMode}
                    </td>
                    <td className="p-4">
                      <Badge variant={f.status} size="sm">
                        {f.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      {f.status !== 'paid' && f.student?.parentPhone && (
                        <Button
                          variant="outline"
                          size="xs"
                          icon={MessageSquare}
                          onClick={() => handleWhatsAppReminder(f)}
                        >
                          WhatsApp Reminder
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Record Fee Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Record Student Fee Payment / Due"
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
                Select Student
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
              >
                {students.map((st) => (
                  <option key={st._id} value={st._id}>
                    {st.name} (Class {st.grade}) — Parent: {st.parentName}
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
                label="Fee Amount (₹)"
                type="number"
                required
                placeholder="e.g. 2500"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Payment Status
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Payment Mode
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.paymentMode}
                  onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                >
                  <option value="upi">UPI / Online</option>
                  <option value="cash">Counter Cash</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <Input
                label="Notes / Receipt Ref (Optional)"
                placeholder="e.g. Receipt #402"
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
                icon={DollarSign}
              >
                Save Fee Record
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

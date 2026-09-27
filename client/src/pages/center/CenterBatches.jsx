import React, { useState, useEffect } from 'react';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Building2,
  Plus,
  Users,
  Clock,
  DollarSign,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const CenterBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    grade: 10,
    board: 'CBSE',
    subject: 'Mathematics & Science',
    timing: '5:00 PM - 6:30 PM',
    monthlyFee: 2500,
    maxCapacity: 20,
  });

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const res = await centerService.getBatches();
      if (res.success && res.data) {
        setBatches(res.data);
      }
    } catch (err) {
      console.error('Failed to load batches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await centerService.createBatch({
        ...formData,
        grade: Number(formData.grade),
        monthlyFee: Number(formData.monthlyFee),
        maxCapacity: Number(formData.maxCapacity),
      });

      if (res.success) {
        setFeedback({ type: 'success', msg: 'Batch created successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            name: '',
            grade: 10,
            board: 'CBSE',
            subject: 'Mathematics & Science',
            timing: '5:00 PM - 6:30 PM',
            monthlyFee: 2500,
            maxCapacity: 20,
          });
          fetchBatches();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to create batch.',
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
            Classes 1–10 Batch Management
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Organize tuition center cohorts by grade level, curriculum board, timing schedule, and monthly fees.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Create New Batch
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading center batches...</div>
      ) : batches.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Batches Created Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Create your first batch for Classes 1 to 10 (e.g. Class 10 Board Exam Batch) to start enrolling students.
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            Create First Batch
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((b) => (
            <Card key={b._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    {b.board || 'CBSE'} • Class {b.grade}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {b.name}
                  </h3>
                </div>
                <Badge variant="verified" size="sm">
                  Class {b.grade}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p>
                  <strong>Subject:</strong> {b.subject}
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{b.timing || '5:00 PM - 6:30 PM'}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Monthly Fee: <strong>₹{b.monthlyFee}</strong></span>
                </p>
                <p className="flex items-center gap-1.5 text-navy-500">
                  <Users className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                  <span>Max Capacity: {b.maxCapacity || 20} Students</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Batch Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Create Classes 1–10 Batch"
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
              label="Batch Name"
              required
              placeholder="e.g. Class 10 CBSE Math & Science Masterclass"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Class (1–10)
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                  required
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Class {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Board
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  required
                >
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                  <option value="IB / Cambridge">IB / Cambridge</option>
                </select>
              </div>
            </div>

            <Input
              label="Subjects Covered"
              required
              placeholder="e.g. Mathematics, Science & Social"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Batch Timing"
                required
                placeholder="e.g. 5:30 PM - 7:00 PM"
                value={formData.timing}
                onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
              />

              <Input
                label="Monthly Fee (₹)"
                type="number"
                required
                placeholder="e.g. 2500"
                value={formData.monthlyFee}
                onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
              />

              <Input
                label="Max Students"
                type="number"
                required
                placeholder="e.g. 20"
                value={formData.maxCapacity}
                onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
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
                icon={Plus}
              >
                Create Batch
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

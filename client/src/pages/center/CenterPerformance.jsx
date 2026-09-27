import React, { useState, useEffect } from 'react';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Award,
  Plus,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  BarChart2,
} from 'lucide-react';

export const CenterPerformance = () => {
  const [performances, setPerformances] = useState([]);
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    batchId: '',
    studentId: '',
    examTitle: 'Unit Test 1',
    subject: 'Mathematics',
    maxMarks: 50,
    marksObtained: 45,
    remarks: 'Excellent problem solving ability.',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, bRes, sRes] = await Promise.all([
        centerService.getPerformance(),
        centerService.getBatches(),
        centerService.getStudents(),
      ]);

      if (pRes.success && pRes.data) {
        setPerformances(pRes.data);
      }
      if (bRes.success && bRes.data) {
        setBatches(bRes.data);
        if (bRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, batchId: bRes.data[0]._id }));
        }
      }
      if (sRes.success && sRes.data) {
        setStudents(sRes.data);
        if (sRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, studentId: sRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load performance reports:', err);
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
      const res = await centerService.recordPerformance({
        ...formData,
        maxMarks: Number(formData.maxMarks),
        marksObtained: Number(formData.marksObtained),
      });

      if (res.success) {
        setFeedback({ type: 'success', msg: 'Exam score recorded successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            batchId: batches[0]?._id || '',
            studentId: students[0]?._id || '',
            examTitle: 'Unit Test 1',
            subject: 'Mathematics',
            maxMarks: 50,
            marksObtained: 45,
            remarks: '',
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to record performance.',
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
            Student Exam & Performance Ledger
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Record unit test scores, term assessments, and academic feedback for center students.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
          disabled={students.length === 0}
        >
          Record Exam Score
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading performance data...</div>
      ) : performances.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Exam Marks Recorded Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {students.length === 0
              ? 'Enroll students in your center before recording performance reports.'
              : 'Log regular unit tests and mock exams to track student grade improvements.'}
          </p>
          {students.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Record First Score
            </Button>
          )}
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sand-100 border-b border-sand-200 text-navy-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Student</th>
                  <th className="p-4">Batch / Class</th>
                  <th className="p-4">Exam Title</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Percentage</th>
                  <th className="p-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-navy-800">
                {performances.map((p) => {
                  const percentage = Math.round((p.marksObtained / p.maxMarks) * 100);
                  return (
                    <tr key={p._id} className="hover:bg-sand-50/50 transition-colors">
                      <td className="p-4 font-bold text-navy-950 whitespace-nowrap">
                        {p.student?.name || 'Student'}
                      </td>
                      <td className="p-4 text-navy-600">
                        {p.batch?.name || `Class ${p.student?.grade}`}
                      </td>
                      <td className="p-4 font-medium text-navy-900">
                        {p.examTitle}
                      </td>
                      <td className="p-4 text-navy-700">
                        {p.subject}
                      </td>
                      <td className="p-4 font-mono font-bold text-navy-950">
                        {p.marksObtained} / {p.maxMarks}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-bold ${
                            percentage >= 80
                              ? 'text-emerald-700'
                              : percentage >= 50
                              ? 'text-gold-700'
                              : 'text-red-600'
                          }`}
                        >
                          {percentage}%
                        </span>
                      </td>
                      <td className="p-4 text-xs text-navy-500 italic max-w-xs truncate">
                        {p.remarks || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Record Score Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Record Student Exam Mark"
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

            <div className="grid grid-cols-2 gap-4">
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
                      {st.name} (Class {st.grade})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                  Select Batch
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  value={formData.batchId}
                  onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                  required
                >
                  {batches.map((b) => (
                    <option key={b._id} value={b._id}>
                      Class {b.grade} • {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Exam / Test Title"
                required
                placeholder="e.g. Unit Test 1 or Midterm Mock"
                value={formData.examTitle}
                onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
              />

              <Input
                label="Subject"
                required
                placeholder="e.g. Mathematics"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Maximum Marks"
                type="number"
                required
                value={formData.maxMarks}
                onChange={(e) => setFormData({ ...formData, maxMarks: Number(e.target.value) })}
              />

              <Input
                label="Marks Obtained"
                type="number"
                required
                value={formData.marksObtained}
                onChange={(e) => setFormData({ ...formData, marksObtained: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Teacher Remarks / Recommendations"
              placeholder="e.g. Excellent conceptual grasp in trigonometry..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
                icon={Award}
              >
                Save Score
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

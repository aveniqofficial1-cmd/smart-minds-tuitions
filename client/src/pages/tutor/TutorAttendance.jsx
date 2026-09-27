import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  CalendarCheck,
  Plus,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const TutorAttendance = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // New Attendance Form State
  const [formData, setFormData] = useState({
    tuitionId: '',
    date: new Date().toISOString().split('T')[0],
    hoursTaught: 1.5,
    topicCovered: '',
    status: 'present',
    remarks: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [attRes, tuitRes] = await Promise.all([
        tutorService.getAttendance(),
        tutorService.getTuitions(),
      ]);

      if (attRes.success && attRes.data) {
        setAttendanceList(attRes.data);
      }
      if (tuitRes.success && tuitRes.data) {
        setTuitions(tuitRes.data);
        if (tuitRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, tuitionId: tuitRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load attendance logs:', err);
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
      const res = await tutorService.markAttendance(formData);
      if (res.success) {
        setFeedback({ type: 'success', msg: 'Attendance logged successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            tuitionId: tuitions[0]?._id || '',
            date: new Date().toISOString().split('T')[0],
            hoursTaught: 1.5,
            topicCovered: '',
            status: 'present',
            remarks: '',
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to mark attendance.',
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
            Session Attendance & Topic Logs
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Log class sessions with topics covered and duration. Parents receive real-time notifications.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
          disabled={tuitions.length === 0}
        >
          Log Class Session
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading attendance logs...</div>
      ) : attendanceList.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Attendance Logs Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {tuitions.length === 0
              ? 'You need an active assigned tuition before logging attendance sessions.'
              : 'Log each completed class session to maintain a verified academic ledger for parents.'}
          </p>
          {tuitions.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Log Your First Class
            </Button>
          )}
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sand-100 border-b border-sand-200 text-navy-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Date</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Topic Covered</th>
                  <th className="p-4">Remarks</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-navy-800">
                {attendanceList.map((att) => (
                  <tr key={att._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 font-semibold text-navy-950 whitespace-nowrap">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">
                      {att.student?.name || 'Student'}
                    </td>
                    <td className="p-4 text-navy-600 whitespace-nowrap">
                      {att.hoursTaught} Hours
                    </td>
                    <td className="p-4 text-navy-800 max-w-xs truncate">
                      {att.topicCovered || 'Regular Syllabus Session'}
                    </td>
                    <td className="p-4 text-navy-500 text-xs italic max-w-xs truncate">
                      {att.remarks || '—'}
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={att.status} size="sm">
                        {att.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Log Attendance Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Log Class Session Attendance"
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
                Select Active Tuition Contract
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                value={formData.tuitionId}
                onChange={(e) => setFormData({ ...formData, tuitionId: e.target.value })}
                required
              >
                {tuitions.map((t) => (
                  <option key={t._id} value={t._id}>
                    Class {t.requirement?.grade} - {t.requirement?.subjects?.join(', ')} (Parent: {t.parent?.user?.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date of Class"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />

              <Input
                label="Hours Taught"
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                required
                value={formData.hoursTaught}
                onChange={(e) => setFormData({ ...formData, hoursTaught: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Topic Covered / Curriculum Unit"
              required
              placeholder="e.g. Thermodynamics numericals & Chapter 4 derivations"
              value={formData.topicCovered}
              onChange={(e) => setFormData({ ...formData, topicCovered: e.target.value })}
            />

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Student Attendance Status
              </label>
              <div className="flex gap-4">
                {['present', 'absent', 'cancelled'].map((st) => (
                  <label key={st} className="flex items-center gap-2 text-xs text-navy-900 cursor-pointer capitalize">
                    <input
                      type="radio"
                      name="status"
                      value={st}
                      checked={formData.status === st}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="text-gold-500 focus:ring-gold-500"
                    />
                    {st}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Remarks / Homework Assigned (Optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="e.g. Assigned Exercise 3.2 problems 1-10 as homework..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
                icon={CalendarCheck}
              >
                Save Attendance
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

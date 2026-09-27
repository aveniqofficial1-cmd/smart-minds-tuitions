import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  FileText,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Award,
} from 'lucide-react';

export const TutorReports = () => {
  const [reports, setReports] = useState([]);
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentMonthIndex = new Date().getMonth();

  const [formData, setFormData] = useState({
    tuitionId: '',
    month: months[currentMonthIndex],
    year: new Date().getFullYear(),
    topicsCovered: '',
    testsConducted: 2,
    averageScore: '85%',
    testRemarks: '',
    recommendations: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [repRes, tuitRes] = await Promise.all([
        tutorService.getReports(),
        tutorService.getTuitions(),
      ]);

      if (repRes.success && repRes.data) {
        setReports(repRes.data);
      }
      if (tuitRes.success && tuitRes.data) {
        setTuitions(tuitRes.data);
        if (tuitRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, tuitionId: tuitRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load progress reports:', err);
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
      const res = await tutorService.submitReport(formData);
      if (res.success) {
        setFeedback({ type: 'success', msg: 'Monthly Progress Report submitted successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            tuitionId: tuitions[0]?._id || '',
            month: months[currentMonthIndex],
            year: new Date().getFullYear(),
            topicsCovered: '',
            testsConducted: 2,
            averageScore: '85%',
            testRemarks: '',
            recommendations: '',
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to submit report.',
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
            Monthly Student Progress Reports
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Submit end-of-month academic evaluations for parents and Smart Minds academic audit.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
          disabled={tuitions.length === 0}
        >
          Create Monthly Report
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading progress reports...</div>
      ) : reports.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Progress Reports Submitted Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {tuitions.length === 0
              ? 'You need an active assigned tuition to create student progress reports.'
              : 'Submit structured monthly reports to keep parents updated on syllabus mastery and test scores.'}
          </p>
          {tuitions.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Create First Report
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((rep) => (
            <Card key={rep._id} hover goldBorder className="p-6 sm:p-8 space-y-6 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-navy-950 font-bold flex items-center justify-center text-lg border border-gold-400">
                    <FileText className="w-6 h-6 text-gold-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-950">
                      Progress Report — {rep.month} {rep.year}
                    </h3>
                    <p className="text-xs text-navy-500">
                      Student: <span className="font-bold text-navy-900">{rep.student?.name}</span> • Parent: {rep.parent?.user?.name}
                    </p>
                  </div>
                </div>

                <Badge variant="verified" size="md">
                  Report Filed
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-2">
                  <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] text-gold-700">
                    Topics & Syllabus Covered
                  </h4>
                  <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 text-navy-800 leading-relaxed">
                    {rep.topicsCovered}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] text-gold-700">
                    Tests & Performance Assessment
                  </h4>
                  <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between font-semibold text-navy-900">
                      <span>Tests Conducted: {rep.testsConducted}</span>
                      <span>Average Score: {rep.averageScore}</span>
                    </div>
                    <p className="text-xs text-navy-600">
                      {rep.testRemarks || 'Good homework consistency and conceptual clarity.'}
                    </p>
                  </div>
                </div>
              </div>

              {rep.recommendations && (
                <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200 text-xs space-y-1">
                  <span className="font-bold text-navy-950">Recommendations for Upcoming Month:</span>
                  <p className="text-navy-800">{rep.recommendations}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Report Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Submit Monthly Progress Report"
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
                onChange={(e) => setFormData({ ...formData, tuitionId: e.target.value })}
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
                  Report Month
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

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Topics & Chapters Covered During This Month
              </label>
              <textarea
                rows={3}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="e.g. Chapter 4 Quadratic Equations, Chapter 5 Arithmetic Progressions, and 2 mock test revisions..."
                value={formData.topicsCovered}
                onChange={(e) => setFormData({ ...formData, topicsCovered: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tests Conducted"
                type="number"
                min="0"
                required
                value={formData.testsConducted}
                onChange={(e) => setFormData({ ...formData, testsConducted: Number(e.target.value) })}
              />

              <Input
                label="Average Test Score"
                type="text"
                placeholder="e.g. 88% or 44/50"
                required
                value={formData.averageScore}
                onChange={(e) => setFormData({ ...formData, averageScore: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Test Remarks & Subject Mastery Assessment
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="e.g. Strong problem-solving speed in algebra; needs practice on word problems..."
                value={formData.testRemarks}
                onChange={(e) => setFormData({ ...formData, testRemarks: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Tutor's Recommendations for Next Month (Optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="e.g. Daily 30-minute formula review and solving past 5 years board question papers..."
                value={formData.recommendations}
                onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
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
                icon={FileText}
              >
                Submit Report
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

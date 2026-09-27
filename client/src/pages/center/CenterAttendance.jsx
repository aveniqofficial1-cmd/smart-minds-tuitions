import React, { useState, useEffect } from 'react';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  CalendarCheck,
  CheckCircle2,
  Users,
  Check,
  X,
  Clock,
  AlertCircle,
  Save,
} from 'lucide-react';

export const CenterAttendance = () => {
  const [batches, setBatches] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [topicCovered, setTopicCovered] = useState('');
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const [bRes, stRes] = await Promise.all([
        centerService.getBatches(),
        centerService.getStudents(),
      ]);

      if (bRes.success && bRes.data) {
        setBatches(bRes.data);
        if (bRes.data.length > 0) {
          setSelectedBatchId(bRes.data[0]._id);
        }
      }
      if (stRes.success && stRes.data) {
        setStudents(stRes.data);
      }
    } catch (err) {
      console.error('Failed to load batch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Filter students for the selected batch and initialize attendance map
  const batchStudents = students.filter(
    (s) => s.batch === selectedBatchId || s.batch?._id === selectedBatchId
  );

  useEffect(() => {
    const initialMap = {};
    batchStudents.forEach((st) => {
      initialMap[st._id] = 'present';
    });
    setAttendanceMap(initialMap);
  }, [selectedBatchId, students]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status) => {
    const newMap = {};
    batchStudents.forEach((st) => {
      newMap[st._id] = status;
    });
    setAttendanceMap(newMap);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    if (batchStudents.length === 0) return;

    try {
      setSubmitting(true);
      setFeedback(null);

      // Submit attendance for each student in batch
      const records = batchStudents.map((st) => ({
        studentId: st._id,
        batchId: selectedBatchId,
        date: attendanceDate,
        status: attendanceMap[st._id] || 'present',
        topicCovered,
      }));

      const res = await centerService.markBatchAttendance({
        batchId: selectedBatchId,
        date: attendanceDate,
        topicCovered,
        records,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Attendance successfully saved for ${batchStudents.length} students!`,
        });
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to save attendance records.',
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
            Batch Attendance Register
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Daily cohort attendance tracking for Classes 1–10 batches.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
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

      {/* Selector Toolbar */}
      <Card className="p-5 bg-white space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-navy-800 mb-1.5">
              Select Batch
            </label>
            <select
              className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
            >
              {batches.map((b) => (
                <option key={b._id} value={b._id}>
                  Class {b.grade} • {b.name} ({b.timing})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Attendance Date"
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />

          <Input
            label="Curriculum Unit / Topic Covered"
            placeholder="e.g. Linear Equations in Two Variables"
            value={topicCovered}
            onChange={(e) => setTopicCovered(e.target.value)}
          />
        </div>

        {batchStudents.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-sand-200">
            <span className="text-xs font-semibold text-navy-700">
              Total Students in Batch: {batchStudents.length}
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() => handleMarkAll('present')}
              >
                Mark All Present
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => handleMarkAll('absent')}
              >
                Mark All Absent
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Attendance Register Table */}
      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading batch roster...</div>
      ) : batchStudents.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-sand-200 text-navy-800 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Students in this Batch
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Enroll students and assign them to this batch from the Student Directory.
          </p>
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden space-y-4 p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sand-100 border-b border-sand-200 text-navy-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Roll / ID</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Parent Details</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-navy-800">
                {batchStudents.map((st) => {
                  const currentStatus = attendanceMap[st._id] || 'present';
                  return (
                    <tr key={st._id} className="hover:bg-sand-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-navy-600">
                        {st.rollNumber || '—'}
                      </td>
                      <td className="p-4 font-bold text-navy-950">
                        {st.name}
                      </td>
                      <td className="p-4 text-navy-600">
                        {st.parentName} ({st.parentPhone})
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-sand-50 p-1.5 rounded-xl border border-sand-200">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st._id, 'present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-navy-600 hover:bg-sand-200'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st._id, 'absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'text-navy-600 hover:bg-sand-200'
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(st._id, 'late')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-sm'
                                : 'text-navy-600 hover:bg-sand-200'
                            }`}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end pt-4 border-t border-sand-200">
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={submitting}
              icon={Save}
              onClick={handleSaveAttendance}
            >
              Save Register Entries
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

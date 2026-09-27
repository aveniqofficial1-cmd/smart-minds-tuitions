import React, { useState, useEffect } from 'react';
import { centerService } from '../../services/centerService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Plus,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Search,
} from 'lucide-react';

export const CenterStudents = () => {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    grade: 10,
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    batchId: '',
    rollNumber: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stuRes, bRes] = await Promise.all([
        centerService.getStudents(),
        centerService.getBatches(),
      ]);

      if (stuRes.success && stuRes.data) {
        setStudents(stuRes.data);
      }
      if (bRes.success && bRes.data) {
        setBatches(bRes.data);
        if (bRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, batchId: bRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load students:', err);
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
      const res = await centerService.createStudent({
        ...formData,
        grade: Number(formData.grade),
      });

      if (res.success) {
        setFeedback({ type: 'success', msg: 'Student enrolled successfully!' });
        setTimeout(() => {
          setShowModal(false);
          setFeedback(null);
          setFormData({
            name: '',
            grade: 10,
            parentName: '',
            parentPhone: '',
            parentEmail: '',
            batchId: batches[0]?._id || '',
            rollNumber: '',
          });
          fetchData();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to enroll student.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentPhone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Center Student Directory
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Manage student registrations, parent contact profiles, and batch allocations.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowModal(true)}
          disabled={batches.length === 0}
        >
          Enroll New Student
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by student name, parent, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading student directory...</div>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Students Enrolled Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            {batches.length === 0
              ? 'You must create at least one batch before enrolling students.'
              : 'Add your enrolled tuition students to track their attendance, exam marks, and monthly fee collections.'}
          </p>
          {batches.length > 0 && (
            <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
              Enroll First Student
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((st) => (
            <Card key={st._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-100 text-navy-950 font-bold flex items-center justify-center text-sm">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-navy-950">
                      {st.name}
                    </h3>
                    <p className="text-xs text-navy-500">
                      Class {st.grade} • Roll #{st.rollNumber || '—'}
                    </p>
                  </div>
                </div>
                <Badge variant="verified" size="sm">
                  Active
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-navy-600 shrink-0" />
                  <span>
                    Batch: <strong>{st.batch?.name || 'Assigned Batch'}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-navy-500">Parent:</span>
                  <strong className="text-navy-900">{st.parentName}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a href={`tel:${st.parentPhone}`} className="text-emerald-800 font-semibold hover:underline">
                    {st.parentPhone}
                  </a>
                </div>

                {st.parentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">{st.parentEmail}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Enroll Student Modal */}
      {showModal && (
        <Modal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setFeedback(null);
          }}
          title="Enroll New Student to Center"
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
              <Input
                label="Student Full Name"
                required
                placeholder="e.g. Aryan Reddy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

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
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Assign to Batch
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                value={formData.batchId}
                onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                required
              >
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    Class {b.grade} • {b.name} ({b.timing})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Parent Name"
                required
                placeholder="e.g. Suresh Reddy"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              />

              <Input
                label="Parent Phone Number"
                required
                placeholder="e.g. 9876543210"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Parent Email (Optional)"
                type="email"
                placeholder="e.g. parent@gmail.com"
                value={formData.parentEmail}
                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              />

              <Input
                label="Roll Number / Student ID (Optional)"
                placeholder="e.g. SM-101"
                value={formData.rollNumber}
                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
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
                Enroll Student
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

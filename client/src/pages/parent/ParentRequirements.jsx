import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Plus,
  BookOpen,
  MapPin,
  DollarSign,
  Clock,
  Users,
  ShieldCheck,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const ParentRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Candidate viewer
  const [candidatesModalOpen, setCandidatesModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    studentId: '',
    grade: '10',
    subjects: 'Mathematics, Science',
    mode: 'home',
    budgetMonthly: '6000',
    locality: '',
    address: '',
    preferredTimings: 'Evening (5:00 PM - 7:00 PM)',
    specificRequirements: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reqRes, stuRes] = await Promise.all([
        parentService.getRequirements(),
        parentService.getStudents(),
      ]);

      if (reqRes.success && reqRes.data) setRequirements(reqRes.data);
      if (stuRes.success && stuRes.data) {
        setStudents(stuRes.data);
        if (stuRes.data.length > 0) {
          setFormData((prev) => ({ ...prev, studentId: stuRes.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load requirements data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        student: formData.studentId || undefined,
        grade: formData.grade,
        subjects: formData.subjects.split(',').map((s) => s.trim()).filter(Boolean),
        mode: formData.mode,
        budgetMonthly: Number(formData.budgetMonthly),
        location: {
          locality: formData.locality,
          address: formData.address,
        },
        preferredTimings: formData.preferredTimings,
        specificRequirements: formData.specificRequirements,
      };

      const res = await parentService.createRequirement(payload);
      if (res.success) {
        setPostModalOpen(false);
        fetchData();
      }
    } catch (err) {
      console.error('Failed to post requirement:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewCandidates = async (req) => {
    setSelectedReq(req);
    setCandidatesModalOpen(true);
    setLoadingCandidates(true);
    try {
      const res = await parentService.getCandidates(req._id);
      if (res.success && res.data) {
        setCandidates(res.data);
      }
    } catch (err) {
      console.error('Failed to load candidates:', err);
    } finally {
      setLoadingCandidates(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Tuition Requirements
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Post and track your academic requirements. Admin curates verified educator candidates.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setPostModalOpen(true)}
        >
          Post New Requirement
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-navy-500">Loading requirements...</div>
      ) : requirements.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Tuition Requirements Posted
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Tell us which subjects and grade your child needs support in, and our team will match verified top educators.
          </p>
          <Button variant="primary" size="sm" onClick={() => setPostModalOpen(true)}>
            Post Requirement Now
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {requirements.map((req) => (
            <Card key={req._id} hover className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-base sm:text-lg font-serif font-bold text-navy-950">
                      Class {req.grade} • {req.subjects?.join(', ')}
                    </span>
                    <Badge variant={req.status} size="sm">
                      {req.status}
                    </Badge>
                    <span className="text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded bg-sand-100 text-navy-800">
                      {req.mode === 'home' ? 'Home Tuition' : 'Online Tuition'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-navy-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-600" />
                      <span>{req.location?.locality || 'Hyderabad'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-gold-600" />
                      <span>Budget: ₹{req.budgetMonthly} / month</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-600" />
                      <span>{req.preferredTimings || 'Flexible'}</span>
                    </div>
                  </div>

                  {req.specificRequirements && (
                    <p className="text-xs text-navy-700 bg-sand-50 p-2.5 rounded-lg border border-sand-200">
                      <span className="font-semibold">Parent Note:</span> {req.specificRequirements}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewCandidates(req)}
                  >
                    View Matching Tutors
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Post Requirement Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post Tuition Requirement"
        subtitle="Our team will shortlist top verified tutors for a free demo"
      >
        <form onSubmit={handlePostSubmit} className="space-y-4">
          {students.length > 0 && (
            <Select
              label="Select Student Profile"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            >
              {students.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} (Class {s.grade} - {s.board})
                </option>
              ))}
            </Select>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Grade / Class"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Class {i + 1}
                </option>
              ))}
            </Select>

            <Select
              label="Tuition Mode"
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
            >
              <option value="home">Home Tuition (At Residence)</option>
              <option value="online">Online 1-on-1 Tuition</option>
            </Select>
          </div>

          <Input
            label="Subjects Needed (comma separated)"
            placeholder="e.g. Mathematics, Physics, Chemistry"
            required
            value={formData.subjects}
            onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Monthly Budget (₹)"
              type="number"
              placeholder="e.g. 6000"
              required
              value={formData.budgetMonthly}
              onChange={(e) => setFormData({ ...formData, budgetMonthly: e.target.value })}
            />
            <Input
              label="Preferred Timings"
              placeholder="e.g. 5:00 PM - 7:00 PM"
              required
              value={formData.preferredTimings}
              onChange={(e) => setFormData({ ...formData, preferredTimings: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Locality / Area"
              placeholder="e.g. Kondapur, Hyderabad"
              required
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            />
            <Input
              label="Street / Landmark (Masked)"
              placeholder="e.g. Near RTA Office"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <Textarea
            label="Specific Requirements / Student Weak Areas"
            rows={3}
            placeholder="e.g. Needs extra focus on geometry and numerical problem solving..."
            value={formData.specificRequirements}
            onChange={(e) => setFormData({ ...formData, specificRequirements: e.target.value })}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setPostModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Post Requirement
            </Button>
          </div>
        </form>
      </Modal>

      {/* Candidate Tutors Modal */}
      <Modal
        isOpen={candidatesModalOpen}
        onClose={() => setCandidatesModalOpen(false)}
        title="Verified Matching Candidates"
        subtitle={`Shortlisted for Class ${selectedReq?.grade} (${selectedReq?.subjects?.join(', ')})`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="p-3 bg-gold-50 border border-gold-300 rounded-xl text-xs text-gold-950 font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-gold-700 shrink-0" />
            <span>
              All tutor profiles shown have verified KYC credentials. Direct phone numbers unlock upon demo acceptance.
            </span>
          </div>

          {loadingCandidates ? (
            <div className="py-8 text-center text-xs text-navy-400">
              Fetching verified tutor candidates...
            </div>
          ) : candidates.length === 0 ? (
            <div className="py-8 text-center text-xs text-navy-500">
              Admin is currently curating candidate educators. You will receive an update once demo slots are scheduled.
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {candidates.map((cand) => (
                <div
                  key={cand._id}
                  className="p-4 rounded-xl border border-sand-200 bg-sand-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center text-xs">
                        {cand.user?.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-navy-950">
                          {cand.user?.name || 'Verified Tutor'}
                        </h4>
                        <p className="text-xs text-navy-500">
                          {cand.qualification} • {cand.experienceYears} Years Exp
                        </p>
                      </div>
                    </div>
                    <Badge variant="verified" size="sm" dot>
                      KYC Approved
                    </Badge>
                  </div>

                  <div className="text-xs text-navy-700 space-y-1">
                    <p><span className="font-semibold">Subjects:</span> {cand.subjects?.join(', ')}</p>
                    <p><span className="font-semibold">Localities:</span> {cand.preferredLocalities?.join(', ')}</p>
                    {cand.bio && <p className="text-navy-500 italic">"{cand.bio}"</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  GraduationCap,
  MapPin,
  Clock,
  Eye,
  AlertCircle,
  Search,
} from 'lucide-react';

export const AdminTutors = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditingTutor, setAuditingTutor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const res = await adminService.getTutors();
      if (res.success && res.data) {
        setTutors(res.data);
      }
    } catch (err) {
      console.error('Failed to load tutors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleDecision = async (status) => {
    if (!auditingTutor) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await adminService.reviewTutorKYC(auditingTutor._id, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason : undefined,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Tutor KYC successfully marked as ${status}!`,
        });
        setTimeout(() => {
          setAuditingTutor(null);
          setRejectionReason('');
          setFeedback(null);
          fetchTutors();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to update KYC status.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTutors = tutors.filter((t) => {
    const matchesStatus =
      filterStatus === 'all' || t.approvalStatus === filterStatus;
    const matchesSearch =
      t.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.user?.phone?.includes(searchQuery) ||
      t.qualification?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.primarySubject?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Educator KYC & Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Review government identity cards, degree qualification certificates, and background credentials.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-sand-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search by tutor name, phone, qualification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />

          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'rejected'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                  filterStatus === st
                    ? 'bg-navy-950 text-white shadow-sm'
                    : 'bg-sand-100 text-navy-700 hover:bg-sand-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Tutor Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Auditing educator database...</div>
      ) : filteredTutors.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Educators Matching Criteria
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Try adjusting your search query or status filter.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <Card key={tutor._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-navy-950 font-bold flex items-center justify-center text-base border border-gold-400">
                    {tutor.user?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-navy-950">
                      {tutor.user?.name}
                    </h3>
                    <p className="text-xs text-navy-500">{tutor.qualification}</p>
                  </div>
                </div>

                <Badge variant={tutor.approvalStatus} size="sm">
                  {tutor.approvalStatus}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p>
                  <strong>Contact:</strong> {tutor.user?.phone} • {tutor.user?.email}
                </p>
                <p>
                  <strong>Experience:</strong> {tutor.experienceYears || 2}+ Years
                </p>
                <p>
                  <strong>Subjects:</strong> {tutor.subjects?.join(', ') || tutor.primarySubject || 'All Subjects'}
                </p>
                <p className="flex items-center gap-1 text-navy-500">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>{tutor.preferredLocalities?.join(', ') || 'Hyderabad'}</span>
                </p>
              </div>

              {/* KYC Documents Links */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-bold text-navy-700 uppercase tracking-wider">
                  KYC Verification Files:
                </span>
                <div className="flex flex-wrap gap-2">
                  {tutor.idProofDoc && (
                    <a
                      href={`/api/documents/${tutor.idProofDoc}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-xs font-semibold text-navy-900 transition-colors"
                    >
                      <FileText className="w-3 h-3 text-gold-600" />
                      Govt ID Card
                    </a>
                  )}
                  {tutor.degreeDoc && (
                    <a
                      href={`/api/documents/${tutor.degreeDoc}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-sand-200 text-xs font-semibold text-navy-900 transition-colors"
                    >
                      <GraduationCap className="w-3 h-3 text-purple-600" />
                      Degree Cert
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-sand-200 flex items-center justify-end gap-2">
                <Button
                  variant="primary"
                  size="xs"
                  icon={ShieldCheck}
                  onClick={() => {
                    setAuditingTutor(tutor);
                    setFeedback(null);
                  }}
                >
                  Audit KYC
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Audit Modal */}
      {auditingTutor && (
        <Modal
          isOpen={true}
          onClose={() => {
            setAuditingTutor(null);
            setFeedback(null);
          }}
          title={`Audit KYC: ${auditingTutor.user?.name}`}
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

            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-2 text-navy-800">
              <p>
                <strong>Educator Name:</strong> {auditingTutor.user?.name}
              </p>
              <p>
                <strong>Phone & Email:</strong> {auditingTutor.user?.phone} • {auditingTutor.user?.email}
              </p>
              <p>
                <strong>Qualification:</strong> {auditingTutor.qualification} ({auditingTutor.experienceYears} yrs exp)
              </p>
              <p>
                <strong>Current Status:</strong> <Badge variant={auditingTutor.approvalStatus} size="sm">{auditingTutor.approvalStatus}</Badge>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-sand-200 space-y-2">
              <span className="text-xs font-bold text-navy-950 uppercase tracking-wide">
                Document Credentials:
              </span>
              <div className="flex gap-4">
                {auditingTutor.idProofDoc && (
                  <a
                    href={`/api/documents/${auditingTutor.idProofDoc}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 p-3 rounded-xl bg-sand-100 hover:bg-gold-50 border border-sand-300 text-center text-xs font-bold text-navy-900 flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-gold-700" />
                    Open Government ID Proof
                  </a>
                )}
                {auditingTutor.degreeDoc && (
                  <a
                    href={`/api/documents/${auditingTutor.degreeDoc}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 p-3 rounded-xl bg-sand-100 hover:bg-purple-50 border border-sand-300 text-center text-xs font-bold text-navy-900 flex items-center justify-center gap-2"
                  >
                    <GraduationCap className="w-4 h-4 text-purple-700" />
                    Open Degree Certificate
                  </a>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Rejection Reason (If rejecting KYC)
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="e.g. Identity document photo is blurred, please upload clear Aadhaar copy..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={submitting}
                icon={XCircle}
                onClick={() => handleDecision('rejected')}
              >
                Reject KYC
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuditingTutor(null)}
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
                  Approve & Activate Tutor
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

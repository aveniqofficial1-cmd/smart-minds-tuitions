import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  Search,
  ShieldCheck,
} from 'lucide-react';

export const AdminCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [auditingCenter, setAuditingCenter] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCenters();
      if (res.success && res.data) {
        setCenters(res.data);
      }
    } catch (err) {
      console.error('Failed to load tuition centers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const handleDecision = async (status) => {
    if (!auditingCenter) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await adminService.reviewCenter(auditingCenter._id, { status });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: `Tuition Center status successfully updated to ${status}!`,
        });
        setTimeout(() => {
          setAuditingCenter(null);
          setFeedback(null);
          fetchCenters();
        }, 1200);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to update center status.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCenters = centers.filter((c) => {
    const matchesStatus =
      filterStatus === 'all' || c.approvalStatus === filterStatus;
    const matchesSearch =
      c.centerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.user?.phone?.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Tuition Center Verification Desk
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Audit institutional tuition centers, verify registration certificates, and approve batch management access.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border border-sand-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search by center name, owner, phone..."
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

      {/* Centers Grid */}
      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading tuition centers...</div>
      ) : filteredCenters.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Tuition Centers Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Try adjusting your search criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.map((center) => (
            <Card key={center._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-950 font-bold flex items-center justify-center text-lg border border-purple-300">
                    <Building2 className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-navy-950">
                      {center.centerName}
                    </h3>
                    <p className="text-xs text-navy-500">
                      Owner: {center.user?.name}
                    </p>
                  </div>
                </div>

                <Badge variant={center.approvalStatus} size="sm">
                  {center.approvalStatus}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p>
                  <strong>Contact:</strong> {center.user?.phone} • {center.user?.email}
                </p>
                <p className="flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                  <span>
                    {center.address?.addressLine}, {center.address?.locality},{' '}
                    {center.address?.city}
                  </span>
                </p>
              </div>

              {center.registrationDoc && (
                <a
                  href={`/api/documents/${center.registrationDoc}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sand-100 hover:bg-sand-200 text-xs font-bold text-navy-900 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  View Registration / Trade License Proof
                </a>
              )}

              <div className="pt-2 border-t border-sand-200 flex items-center justify-end">
                <Button
                  variant="primary"
                  size="xs"
                  icon={ShieldCheck}
                  onClick={() => {
                    setAuditingCenter(center);
                    setFeedback(null);
                  }}
                >
                  Review Center
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {auditingCenter && (
        <Modal
          isOpen={true}
          onClose={() => {
            setAuditingCenter(null);
            setFeedback(null);
          }}
          title={`Review Center: ${auditingCenter.centerName}`}
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

            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1.5 text-navy-800">
              <p>
                <strong>Center Name:</strong> {auditingCenter.centerName}
              </p>
              <p>
                <strong>Owner / Director:</strong> {auditingCenter.user?.name} ({auditingCenter.user?.phone})
              </p>
              <p>
                <strong>Location:</strong> {auditingCenter.address?.addressLine}, {auditingCenter.address?.locality}, {auditingCenter.address?.city}
              </p>
            </div>

            {auditingCenter.registrationDoc && (
              <a
                href={`/api/documents/${auditingCenter.registrationDoc}`}
                target="_blank"
                rel="noreferrer"
                className="block p-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-300 text-center text-xs font-bold text-purple-950 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-purple-700" />
                Open Institutional Registration Document
              </a>
            )}

            <div className="flex justify-between items-center gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="danger"
                size="sm"
                loading={submitting}
                icon={XCircle}
                onClick={() => handleDecision('rejected')}
              >
                Reject Center
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuditingCenter(null)}
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
                  Approve Center
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

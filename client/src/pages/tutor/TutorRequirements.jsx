import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  BookOpen,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Send,
  CheckCircle2,
  Filter,
  Search,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const TutorRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingReq, setApplyingReq] = useState(null);
  const [proposedFee, setProposedFee] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Filters
  const [localityFilter, setLocalityFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      const res = await tutorService.getRequirements({
        locality: localityFilter || undefined,
        grade: gradeFilter || undefined,
        mode: modeFilter || undefined,
      });
      if (res.success && res.data) {
        setRequirements(res.data);
      }
    } catch (err) {
      console.error('Failed to load open requirements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, [localityFilter, gradeFilter, modeFilter]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyingReq) return;

    try {
      setSubmitting(true);
      setFeedback(null);
      const res = await tutorService.applyForRequirement(applyingReq._id, {
        proposedFee: Number(proposedFee) || applyingReq.budgetMax || applyingReq.budgetMin,
        message,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          msg: 'Application submitted successfully! Parent and Admin will review your profile.',
        });
        setTimeout(() => {
          setApplyingReq(null);
          setProposedFee('');
          setMessage('');
          setFeedback(null);
          fetchRequirements();
        }, 1500);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to submit application. Please check KYC status.',
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
            Browse Tuition Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Verified student leads from parents seeking qualified home and online tutors across Hyderabad.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-sand-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Search by Locality (e.g. Madhapur, Gachibowli)"
            value={localityFilter}
            onChange={(e) => setLocalityFilter(e.target.value)}
            icon={Search}
          />

          <select
            className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="">All Classes / Grades</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Class {i + 1}
              </option>
            ))}
          </select>

          <select
            className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
          >
            <option value="">All Modes (Home & Online)</option>
            <option value="home">Home Tuition</option>
            <option value="online">Online Tuition</option>
            <option value="both">Flexible / Hybrid</option>
          </select>
        </div>
      </Card>

      {/* Requirements List */}
      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Searching open tuition leads...</div>
      ) : requirements.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Matching Tuition Leads Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Try adjusting your locality or class filter. New verified student leads are posted every day!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requirements.map((req) => (
            <Card
              key={req._id}
              hover
              goldBorder
              className="p-6 flex flex-col justify-between space-y-5 bg-white"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                      {req.board || 'CBSE'} Board
                    </span>
                    <h3 className="font-serif font-bold text-lg text-navy-950">
                      Class {req.grade} • {req.subjects?.join(', ')}
                    </h3>
                  </div>

                  <Badge variant={req.mode === 'online' ? 'verified' : 'gold'} size="sm">
                    {req.mode === 'home' ? 'Home Tuition' : req.mode === 'online' ? 'Online' : 'Flexible'}
                  </Badge>
                </div>

                {/* Location & Schedule Highlights */}
                <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <span className="font-medium text-navy-900">
                      {req.location?.locality || req.location?.area || 'Hyderabad'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Budget: <strong className="text-navy-900">₹{req.budgetMin || 4000} - ₹{req.budgetMax || 8000}</strong> / mo
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>
                      {req.frequencyPerWeek || 5} days/week • {req.preferredTime || 'Evening'}
                    </span>
                  </div>
                </div>

                {req.specificRequirements && (
                  <p className="text-xs text-navy-600 line-clamp-2 italic">
                    "{req.specificRequirements}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-sand-200 flex items-center justify-between">
                <span className="text-[11px] text-navy-400">
                  Posted {new Date(req.createdAt).toLocaleDateString()}
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={() => {
                    setApplyingReq(req);
                    setProposedFee(req.budgetMax || req.budgetMin || '');
                  }}
                >
                  Apply Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Application Modal */}
      {applyingReq && (
        <Modal
          isOpen={true}
          onClose={() => {
            setApplyingReq(null);
            setFeedback(null);
          }}
          title={`Apply for Class ${applyingReq.grade} ${applyingReq.subjects?.join(', ')}`}
        >
          <form onSubmit={handleApply} className="space-y-4">
            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1.5 text-navy-800">
              <p>
                <strong>Locality:</strong> {applyingReq.location?.locality || applyingReq.location?.area || 'Hyderabad'}
              </p>
              <p>
                <strong>Parent Budget:</strong> ₹{applyingReq.budgetMin} - ₹{applyingReq.budgetMax} / month
              </p>
              <p>
                <strong>Teaching Mode:</strong> {applyingReq.mode} ({applyingReq.frequencyPerWeek || 5} days/wk)
              </p>
            </div>

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
              label="Proposed Monthly Fee (₹)"
              type="number"
              required
              value={proposedFee}
              onChange={(e) => setProposedFee(e.target.value)}
              placeholder="e.g. 5000"
              icon={DollarSign}
            />

            <div>
              <label className="block text-xs font-semibold text-navy-800 mb-1.5">
                Note for Parent & Admin (Your Experience & Teaching Approach)
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 bg-sand-50/50 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 placeholder:text-navy-400"
                placeholder="Describe your subject mastery, teaching style, and past student improvements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setApplyingReq(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={submitting}
                icon={Send}
              >
                Confirm Application
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

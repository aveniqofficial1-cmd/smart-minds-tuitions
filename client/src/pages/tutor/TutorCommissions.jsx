import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { FileUpload } from '../../components/ui/FileUpload';
import { Modal } from '../../components/ui/Modal';
import {
  DollarSign,
  QrCode,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react';

export const TutorCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [commRes, demoRes] = await Promise.all([
        tutorService.getCommissions(),
        tutorService.getDemos(),
      ]);

      if (commRes.success && commRes.data) {
        setCommissions(commRes.data);
      }
      if (demoRes.success && demoRes.data) {
        // Filter demos that are accepted
        const acceptedDemos = demoRes.data.filter((d) => d.status === 'accepted');
        setDemos(acceptedDemos);
      }
    } catch (err) {
      console.error('Failed to load commissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!screenshot) {
      setFeedback({ type: 'error', msg: 'Please select a screenshot file of the UPI payment.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      const formData = new FormData();
      if (selectedDemo) {
        formData.append('demoId', selectedDemo._id);
        formData.append('tuitionId', selectedDemo.requirement?._id || '');
      }
      formData.append('transactionRef', transactionRef);
      formData.append('commissionScreenshot', screenshot);

      const res = await tutorService.uploadCommissionProof(formData);
      if (res.success) {
        setFeedback({
          type: 'success',
          msg: 'Commission payment proof uploaded successfully! Admin will verify and activate your tuition assignment.',
        });
        setTimeout(() => {
          setSelectedDemo(null);
          setTransactionRef('');
          setScreenshot(null);
          setFeedback(null);
          fetchData();
        }, 1500);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to upload commission proof.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          50% First-Month Commission Center
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          In accordance with Smart Minds platform policy, tutors pay a one-time 50% commission on the first month's tuition fee upon demo acceptance.
        </p>
      </div>

      {/* Policy Explanation Banner */}
      <div className="p-6 rounded-3xl bg-navy-950 text-white border border-navy-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-navy">
        <div className="space-y-2 max-w-xl">
          <Badge variant="gold" size="sm">
            Platform Policy SRS §3.4
          </Badge>
          <h2 className="font-serif font-bold text-xl text-white">
            Transparent One-Time Commission Model
          </h2>
          <p className="text-xs text-sand-300 leading-relaxed">
            No recurring monthly cuts. You only pay 50% of the first month's agreed fee once a demo is accepted by the parent. All future monthly fees (100%) go directly to you.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 bg-navy-900/90 rounded-2xl border border-gold-500/30 shrink-0">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <QrCode className="w-7 h-7 text-navy-950" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-white">UPI: smartminds@icici</p>
            <p className="text-sand-300">Smart Minds LLP</p>
          </div>
        </div>
      </div>

      {/* Demos pending commission payment */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-navy-950">
          Accepted Demos Requiring Commission Upload
        </h3>

        {demos.length === 0 ? (
          <Card className="p-8 text-center text-xs text-navy-400 bg-white">
            No pending accepted demos requiring commission payment right now.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demos.map((demo) => {
              const estimatedFee = demo.requirement?.budgetMax || demo.requirement?.budgetMin || 6000;
              const commissionAmount = Math.round(estimatedFee * 0.5);

              return (
                <Card key={demo._id} hover goldBorder className="p-6 space-y-4 bg-white">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
                        Demo Accepted
                      </span>
                      <h4 className="font-serif font-bold text-base text-navy-950">
                        Class {demo.student?.grade || demo.requirement?.grade} • {demo.subject}
                      </h4>
                      <p className="text-xs text-navy-500">Student: {demo.student?.name}</p>
                    </div>
                    <Badge variant="accepted" size="sm">
                      Accepted
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1.5 text-navy-800">
                    <div className="flex justify-between">
                      <span>Agreed Monthly Fee:</span>
                      <strong className="text-navy-950">₹{estimatedFee}</strong>
                    </div>
                    <div className="flex justify-between text-gold-700 font-bold border-t border-sand-200 pt-1.5">
                      <span>50% Commission Payable:</span>
                      <span className="text-sm">₹{commissionAmount}</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={UploadCloud}
                    onClick={() => {
                      setSelectedDemo(demo);
                      setFeedback(null);
                    }}
                  >
                    Pay & Upload Proof (₹{commissionAmount})
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Commission History */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-navy-950">
          Commission Payment History
        </h3>

        {loading ? (
          <div className="p-8 text-center text-xs text-navy-500">Loading commission history...</div>
        ) : commissions.length === 0 ? (
          <Card className="p-8 text-center text-xs text-navy-400 bg-white">
            No commission payment submissions recorded yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commissions.map((comm) => (
              <Card key={comm._id} className="p-5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-950 text-sm">
                    ₹{comm.amount || 'Commission'} • 50% 1st Month
                  </span>
                  <Badge variant={comm.status} size="sm">
                    {comm.status}
                  </Badge>
                </div>
                <div className="text-xs text-navy-600 space-y-1">
                  <p>Ref: {comm.transactionRef || 'UPI Transfer'}</p>
                  <p className="text-navy-400">
                    Submitted on {new Date(comm.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {selectedDemo && (
        <Modal
          isOpen={true}
          onClose={() => {
            setSelectedDemo(null);
            setFeedback(null);
          }}
          title="Upload 50% Commission Payment Proof"
        >
          <form onSubmit={handleUpload} className="space-y-4">
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

            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-1 text-navy-800">
              <p>
                <strong>Student:</strong> {selectedDemo.student?.name} (Class {selectedDemo.student?.grade || selectedDemo.requirement?.grade})
              </p>
              <p>
                <strong>Subject:</strong> {selectedDemo.subject}
              </p>
              <p className="text-gold-700 font-bold pt-1">
                <strong>Payable (50%):</strong> ₹{Math.round((selectedDemo.requirement?.budgetMax || 6000) * 0.5)}
              </p>
            </div>

            <Input
              label="UPI Transaction Reference / UTR Number"
              required
              placeholder="e.g. 384920492812"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
            />

            <FileUpload
              label="Upload Transfer Screenshot"
              helperText="PNG, JPG, WebP, or PDF up to 5MB"
              accept=".png,.jpg,.jpeg,.webp,.pdf"
              file={screenshot}
              onFileChange={setScreenshot}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-sand-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDemo(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={submitting}
                icon={UploadCloud}
              >
                Submit Proof
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

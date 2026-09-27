import React, { useState, useEffect } from 'react';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { FileUpload } from '../../components/ui/FileUpload';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  UploadCloud,
  Clock,
  AlertCircle,
  Zap,
} from 'lucide-react';

export const TutorSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('6');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const plans = [
    {
      months: '3',
      price: 300,
      title: 'Starter Pack',
      features: ['Apply to 5 leads simultaneously', 'Locality Lead Alerts', 'Standard Profile Badge'],
    },
    {
      months: '6',
      price: 600,
      title: 'Growth Pack',
      popular: true,
      features: ['Apply to 12 leads simultaneously', 'Priority Parent Shortlisting', 'Gold Educator Badge', 'Direct Admin WhatsApp Alert'],
    },
    {
      months: '9',
      price: 900,
      title: 'Pro Pack',
      features: ['Apply to 20 leads simultaneously', 'Featured Profile Placement', 'Priority Demo Slots', 'Dedicated Academic Counselor'],
    },
    {
      months: '12',
      price: 1200,
      title: 'Master Educator',
      features: ['Unlimited Lead Applications', 'Top Featured Ranking in Search', 'Elite Master Badge', 'Direct Center Tutor Match'],
    },
  ];

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await tutorService.getSubscriptions();
      if (res.success && res.data) {
        setSubscriptions(res.data);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!paymentScreenshot) {
      setFeedback({ type: 'error', msg: 'Please attach the UPI payment transfer screenshot.' });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);
      const formData = new FormData();
      formData.append('planDurationMonths', selectedPlan);
      formData.append('transactionRef', transactionRef);
      formData.append('paymentScreenshot', paymentScreenshot);

      const res = await tutorService.createSubscription(formData);
      if (res.success) {
        setFeedback({
          type: 'success',
          msg: 'Subscription request submitted! Smart Minds admin will verify your payment and activate your plan.',
        });
        setTransactionRef('');
        setPaymentScreenshot(null);
        fetchSubscriptions();
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.message || 'Failed to submit subscription request.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentPlan = plans.find((p) => p.months === selectedPlan) || plans[1];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Multi-Tuition Educator Subscriptions
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Scale your tutoring practice with 3, 6, 9, or 12-month subscription tiers to apply for multiple tuition leads simultaneously.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.months;
          return (
            <div
              key={plan.months}
              onClick={() => setSelectedPlan(plan.months)}
              className={`relative rounded-3xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-navy-950 text-white shadow-navy border-2 border-gold-400 scale-[1.02]'
                  : 'bg-white text-navy-950 border border-sand-200 hover:border-gold-300 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3
                    className={`font-serif font-bold text-lg ${
                      isSelected ? 'text-white' : 'text-navy-950'
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <p className={`text-xs ${isSelected ? 'text-sand-300' : 'text-navy-500'}`}>
                    {plan.months} Months Duration
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-3xl font-serif font-bold ${
                      isSelected ? 'text-gold-400' : 'text-navy-950'
                    }`}
                  >
                    ₹{plan.price}
                  </span>
                  <span className={`text-xs ${isSelected ? 'text-sand-300' : 'text-navy-500'}`}>
                    / {plan.months} mo
                  </span>
                </div>

                <div className="pt-3 border-t border-sand-200/30 space-y-2">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isSelected ? 'text-gold-400' : 'text-emerald-600'
                        }`}
                      />
                      <span className={isSelected ? 'text-sand-200' : 'text-navy-700'}>
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Button
                  type="button"
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  className="w-full"
                >
                  {isSelected ? 'Selected Plan' : 'Select Plan'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* UPI Payment & Screenshot Upload Form */}
      <Card goldBorder className="p-6 sm:p-8 bg-white space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-sand-200 pb-6">
          <div className="space-y-1">
            <Badge variant="gold" size="sm">
              Step 2 • Payment & Verification
            </Badge>
            <h2 className="font-serif font-bold text-xl text-navy-950">
              Submit UPI Transfer for {currentPlan.title} (₹{currentPlan.price})
            </h2>
            <p className="text-xs text-navy-600">
              Pay via any UPI app (GPay / PhonePe / Paytm / BHIM) to the official Smart Minds current account and upload the receipt screenshot.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-sand-50 rounded-2xl border border-sand-200 shrink-0">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-sand-300 shadow-inner">
              <QrCode className="w-7 h-7 text-navy-950" />
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-navy-950">UPI ID: smartminds@icici</p>
              <p className="text-navy-500">A/C: Smart Minds Education LLP</p>
            </div>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                : 'bg-red-50 text-red-800 border border-red-300'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        <form onSubmit={handlePurchase} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="UPI UTR / Transaction Reference Number"
              required
              placeholder="e.g. 384920492812"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
            />

            <div className="p-4 rounded-xl bg-sand-50 border border-sand-200 text-xs space-y-2 text-navy-800">
              <h4 className="font-bold text-navy-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verification Guarantee</span>
              </h4>
              <p className="text-navy-600 text-[11px] leading-relaxed">
                Smart Minds audit team verifies payment reference within 2 hours. Your multi-application limits will be upgraded instantly upon approval.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <FileUpload
              label="Upload Payment Screenshot / PDF Receipt"
              helperText="PNG, JPG, WebP, or PDF up to 5MB"
              accept=".png,.jpg,.jpeg,.webp,.pdf"
              file={paymentScreenshot}
              onFileChange={setPaymentScreenshot}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              className="w-full"
              icon={UploadCloud}
            >
              Submit Subscription Request (₹{currentPlan.price})
            </Button>
          </div>
        </form>
      </Card>

      {/* Subscription History */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-navy-950">
          Your Subscription History
        </h3>

        {subscriptions.length === 0 ? (
          <Card className="p-8 text-center text-xs text-navy-400 bg-white">
            No previous subscription requests on record.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subscriptions.map((sub) => (
              <Card key={sub._id} className="p-5 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-950 text-sm">
                    {sub.planDurationMonths} Months Subscription (₹{sub.amount})
                  </span>
                  <Badge variant={sub.status} size="sm">
                    {sub.status}
                  </Badge>
                </div>
                <div className="text-xs text-navy-600 space-y-1">
                  <p>Ref: {sub.transactionRef || 'Manual Transfer'}</p>
                  <p className="text-navy-400">
                    Requested on {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                  {sub.startDate && sub.endDate && (
                    <p className="text-emerald-700 font-semibold">
                      Active: {new Date(sub.startDate).toLocaleDateString()} –{' '}
                      {new Date(sub.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

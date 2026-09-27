import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Calendar,
  FileText,
  Search,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const AdminEarnings = () => {
  const [commissions, setCommissions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cRes, sRes] = await Promise.all([
        adminService.getCommissions(),
        adminService.getSubscriptions(),
      ]);

      if (cRes.success && cRes.data) {
        setCommissions(cRes.data);
      }
      if (sRes.success && sRes.data) {
        setSubscriptions(sRes.data);
      }
    } catch (err) {
      console.error('Failed to load revenue ledgers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute platform financial aggregates
  const approvedComms = commissions.filter((c) => c.status === 'approved');
  const approvedSubs = subscriptions.filter((s) => s.status === 'approved' || s.status === 'active');
  const pendingComms = commissions.filter((c) => c.status === 'pending');
  const pendingSubs = subscriptions.filter((s) => s.status === 'pending');

  const totalCommRevenue = approvedComms.reduce((acc, c) => acc + (c.amount || 0), 0);
  const totalSubRevenue = approvedSubs.reduce((acc, s) => acc + (s.amount || 0), 0);
  const totalPlatformRevenue = totalCommRevenue + totalSubRevenue;

  const totalPendingRevenue =
    pendingComms.reduce((acc, c) => acc + (c.amount || 0), 0) +
    pendingSubs.reduce((acc, s) => acc + (s.amount || 0), 0);

  // Combine transactions for unified financial ledger
  const unifiedTransactions = [
    ...commissions.map((c) => ({
      _id: c._id,
      type: '50% First-Month Commission',
      amount: c.amount,
      tutor: c.tutor,
      status: c.status,
      ref: c.transactionRef,
      screenshot: c.screenshot,
      date: c.createdAt,
    })),
    ...subscriptions.map((s) => ({
      _id: s._id,
      type: `${s.planMonths}-Month Multi-Tuition Pass`,
      amount: s.amount,
      tutor: s.tutor,
      status: s.status,
      ref: s.transactionRef,
      screenshot: s.screenshot,
      date: s.createdAt,
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredTransactions = unifiedTransactions.filter((tx) => {
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'commission' && tx.type.includes('Commission')) ||
      (typeFilter === 'subscription' && tx.type.includes('Pass'));
    const matchesSearch =
      tx.tutor?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.ref?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Platform Revenue & Financial Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Executive audit of all monetized revenue streams: 50% first-month tuition commissions and educator multi-lead subscription tiers.
        </p>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card goldBorder className="p-6 bg-gradient-to-br from-navy-950 to-navy-900 text-white space-y-3">
          <div className="flex items-center justify-between text-gold-400">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Platform Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-gold-400" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-white">
            ₹{totalPlatformRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-navy-300">
            {approvedComms.length + approvedSubs.length} Approved Payments Verified
          </p>
        </Card>

        <Card className="p-6 bg-white border border-sand-200 space-y-3">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-bold uppercase tracking-wider">Tuition Commissions</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-800" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-navy-950">
            ₹{totalCommRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-navy-500">
            50% from accepted tuition demos
          </p>
        </Card>

        <Card className="p-6 bg-white border border-sand-200 space-y-3">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-bold uppercase tracking-wider">Educator Subscriptions</span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-800" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-navy-950">
            ₹{totalSubRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-navy-500">
            3, 6, 9 & 12 Month Educator Passes
          </p>
        </Card>

        <Card className="p-6 bg-white border border-sand-200 space-y-3">
          <div className="flex items-center justify-between text-gold-700">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Audit Queue</span>
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gold-800" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-navy-950">
            ₹{totalPendingRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-xs text-navy-500">
            {pendingComms.length + pendingSubs.length} Transactions Awaiting Admin Audit
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-sand-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Search by educator name or UTR reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />

          <div className="flex gap-2">
            {[
              { label: 'All Revenue Streams', val: 'all' },
              { label: '50% Commissions', val: 'commission' },
              { label: 'Subscriptions', val: 'subscription' },
            ].map((st) => (
              <button
                key={st.val}
                onClick={() => setTypeFilter(st.val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  typeFilter === st.val
                    ? 'bg-navy-950 text-white shadow-sm'
                    : 'bg-sand-100 text-navy-700 hover:bg-sand-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Financial Ledger Table */}
      <Card className="bg-white border border-sand-200 overflow-hidden">
        <div className="p-5 border-b border-sand-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif font-bold text-lg text-navy-950">
              Verified Revenue Ledger
            </h2>
          </div>
          <span className="text-xs font-medium text-navy-500">
            {filteredTransactions.length} Transactions Recorded
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-navy-500">Compiling financial intelligence...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-sm text-navy-500">No revenue records found matching your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50/70 text-xs font-bold text-navy-800 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Revenue Stream</th>
                  <th className="py-3 px-4">Educator</th>
                  <th className="py-3 px-4">UTR Reference</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Proof Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs text-navy-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-navy-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-navy-950">
                      {tx.type}
                    </td>
                    <td className="py-3.5 px-4">
                      {tx.tutor?.user?.name || 'Educator'} ({tx.tutor?.user?.phone || '—'})
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {tx.ref || 'Manual Transfer'}
                    </td>
                    <td className="py-3.5 px-4 font-serif font-bold text-sm text-navy-950">
                      ₹{tx.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={tx.status} size="sm">
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {tx.screenshot ? (
                        <a
                          href={`/api/documents/${tx.screenshot}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sand-100 hover:bg-gold-50 text-navy-900 font-bold text-[11px] border border-sand-300 transition-colors"
                        >
                          <FileText className="w-3 h-3 text-gold-700" />
                          View Receipt
                        </a>
                      ) : (
                        <span className="text-navy-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

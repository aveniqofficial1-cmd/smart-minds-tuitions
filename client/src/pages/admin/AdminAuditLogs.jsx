import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  ShieldAlert,
  Search,
  Clock,
  User,
  ShieldCheck,
  Activity,
  FileCode,
} from 'lucide-react';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const actionMatch = log.action?.toLowerCase().includes(searchQuery.toLowerCase());
    const userMatch = log.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const targetMatch = log.targetType?.toLowerCase().includes(searchQuery.toLowerCase());
    return actionMatch || userMatch || targetMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            System Security & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Immutable trace of all administrative authorizations, KYC decisions, and financial verifications.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-sand-200">
        <Input
          placeholder="Filter audit records by action keyword, administrator name, or target..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={Search}
        />
      </Card>

      {/* Audit Log Table */}
      <Card className="bg-white border border-sand-200 overflow-hidden">
        <div className="p-5 border-b border-sand-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gold-600" />
            <h2 className="font-serif font-bold text-lg text-navy-950">
              Audit Event Log
            </h2>
          </div>
          <span className="text-xs font-medium text-navy-500">
            {filteredLogs.length} Events Recorded
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-navy-500">Auditing system event ledger...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-sm text-navy-500">No audit events match your search query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-sand-200 bg-sand-50/70 text-xs font-bold text-navy-800 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Code</th>
                  <th className="py-3 px-4">Initiator</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-xs text-navy-700">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-navy-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs text-navy-950 bg-sand-100 px-2 py-0.5 rounded-md border border-sand-300">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-navy-900">{log.user?.name || 'System Admin'}</span>
                        <Badge variant={log.userRole || 'admin'} size="sm">
                          {log.userRole || 'admin'}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-gold-700 font-semibold">{log.targetType || 'General'}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-navy-500">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate font-mono text-[11px] text-navy-600">
                      {log.metadata ? JSON.stringify(log.metadata) : '—'}
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

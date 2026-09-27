import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  CalendarCheck,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  DollarSign,
  User,
  GraduationCap,
} from 'lucide-react';

export const AdminDemos = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  const fetchDemos = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDemos();
      if (res.success && res.data) {
        setDemos(res.data);
      }
    } catch (err) {
      console.error('Failed to load demos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemos();
  }, []);

  const filteredDemos = demos.filter(
    (d) => filterStatus === 'all' || d.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            Demo Class Coordination Console
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Monitor scheduled free evaluation sessions between students and educators.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'scheduled', 'completed', 'accepted', 'rejected'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filterStatus === st
                ? 'bg-navy-950 text-white shadow-sm'
                : 'bg-white text-navy-700 hover:bg-sand-100 border border-sand-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading demo classes...</div>
      ) : filteredDemos.length === 0 ? (
        <Card className="p-12 text-center space-y-4 bg-white">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Demo Classes Found
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Try selecting a different status filter or dispatching a demo from the Student Leads desk.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map((demo) => (
            <Card key={demo._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    Class {demo.student?.grade || demo.requirement?.grade}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {demo.subject} Demo
                  </h3>
                </div>
                <Badge variant={demo.status} size="sm">
                  {demo.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700 bg-sand-50/70 p-3.5 rounded-xl border border-sand-200">
                <p>
                  <strong>Student:</strong> {demo.student?.name} (Parent: {demo.parent?.user?.name || 'Parent'})
                </p>
                <p>
                  <strong>Educator:</strong> {demo.tutor?.user?.name || 'Educator'} ({demo.tutor?.user?.phone})
                </p>
                <p className="flex items-center gap-1.5 text-navy-900 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                  <span>
                    {new Date(demo.scheduledDate).toLocaleDateString()} at {demo.scheduledTime} ({demo.mode})
                  </span>
                </p>
              </div>

              {demo.feedback && (
                <div className="p-3 rounded-xl bg-sand-50 text-xs text-navy-600 italic">
                  Feedback: "{demo.feedback}"
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

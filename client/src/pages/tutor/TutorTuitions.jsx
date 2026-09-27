import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  CalendarCheck,
  FileText,
  DollarSign,
} from 'lucide-react';

export const TutorTuitions = () => {
  const [tuitions, setTuitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTuitions = async () => {
      try {
        setLoading(true);
        const res = await tutorService.getTuitions();
        if (res.success && res.data) {
          setTuitions(res.data);
        }
      } catch (err) {
        console.error('Failed to load assigned tuitions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTuitions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Assigned Tuition Contracts
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Active teaching contracts officially assigned to you with permanently unlocked parent contact information.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading assigned tuitions...</div>
      ) : tuitions.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Active Tuition Contracts Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Browse open leads, conduct evaluation demos, and get assigned to ongoing tuition contracts.
          </p>
          <Link to="/tutor/requirements">
            <Button variant="primary" size="sm">
              Browse Open Leads
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tuitions.map((assign) => (
            <Card key={assign._id} hover goldBorder className="p-6 space-y-5 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    Class {assign.requirement?.grade} • {assign.requirement?.board || 'CBSE'}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {assign.requirement?.subjects?.join(', ')}
                  </h3>
                </div>
                <Badge variant={assign.status} size="sm">
                  {assign.status}
                </Badge>
              </div>

              {/* Unlocked Parent Coordinates Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Parent Contact Unlocked</span>
                </div>

                <div className="flex items-center gap-2 text-navy-900">
                  <span className="text-navy-600 font-normal">Name:</span>
                  <strong className="font-bold">{assign.parent?.user?.name}</strong>
                </div>

                <div className="flex items-center gap-2 text-navy-900">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <a
                    href={`tel:${assign.parent?.user?.phone}`}
                    className="font-semibold text-emerald-800 hover:underline"
                  >
                    {assign.parent?.user?.phone || 'Contact Available'}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-navy-900">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <a
                    href={`mailto:${assign.parent?.user?.email}`}
                    className="font-semibold text-emerald-800 hover:underline truncate"
                  >
                    {assign.parent?.user?.email}
                  </a>
                </div>

                {assign.parent?.address?.addressLine && (
                  <div className="flex items-start gap-2 text-navy-900 pt-1 border-t border-emerald-200/60">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {assign.parent?.address?.addressLine}, {assign.parent?.address?.locality},{' '}
                      {assign.parent?.address?.city}
                    </span>
                  </div>
                )}
              </div>

              {/* Contract terms */}
              <div className="space-y-1.5 text-xs text-navy-700 bg-sand-50/70 p-3 rounded-xl border border-sand-200">
                <p>
                  <strong>Monthly Fee:</strong> ₹{assign.monthlyFee} / month
                </p>
                <p>
                  <strong>Teaching Mode:</strong> {assign.requirement?.mode} ({assign.requirement?.frequencyPerWeek || 5} sessions/week)
                </p>
                <p className="text-navy-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gold-600" />
                  Contract active since {new Date(assign.startDate).toLocaleDateString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-sand-200 grid grid-cols-2 gap-2">
                <Link to="/tutor/attendance">
                  <Button variant="navy" size="xs" icon={CalendarCheck} className="w-full">
                    Attendance
                  </Button>
                </Link>
                <Link to="/tutor/reports">
                  <Button variant="outline" size="xs" icon={FileText} className="w-full">
                    Progress Report
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

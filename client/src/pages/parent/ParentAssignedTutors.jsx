import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  BookOpen,
  DollarSign,
} from 'lucide-react';

export const ParentAssignedTutors = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await parentService.getAssignedTutors();
        if (res.success && res.data) {
          setAssignments(res.data);
        }
      } catch (err) {
        console.error('Failed to load assigned tutors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Assigned Tutors & Direct Contacts
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Educators officially matched with your students following demo completion. Direct contacts are permanently unlocked.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-navy-500">Loading assigned tutors...</div>
      ) : assignments.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Assigned Tutors Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Once a demo session is completed and accepted by you, the tutor will appear here with complete direct phone and email coordinates.
          </p>
          <Link to="/parent/requirements">
            <Button variant="primary" size="sm">
              Post Requirement
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assign) => (
            <Card key={assign._id} hover goldBorder className="p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-navy-950 font-bold flex items-center justify-center text-base border border-gold-400">
                    {assign.tutor?.user?.name?.charAt(0) || 'T'}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-navy-950">
                      {assign.tutor?.user?.name || 'Verified Educator'}
                    </h3>
                    <p className="text-xs text-navy-500">
                      {assign.tutor?.qualification || 'Educator'}
                    </p>
                  </div>
                </div>

                <Badge variant={assign.status} size="sm">
                  {assign.status}
                </Badge>
              </div>

              {/* Direct Unlocked Contact Card */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2.5">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Direct Contact Unlocked</span>
                </div>

                <div className="flex items-center gap-2 text-navy-900">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{assign.tutor?.user?.phone || 'Contact Verified'}</span>
                </div>

                <div className="flex items-center gap-2 text-navy-900">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold">{assign.tutor?.user?.email}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-navy-700">
                <p>
                  <span className="font-semibold">Subjects:</span>{' '}
                  {assign.requirement?.subjects?.join(', ') || 'Academic Tutoring'}
                </p>
                <p>
                  <span className="font-semibold">Agreed Fee:</span> ₹{assign.monthlyFee} / month
                </p>
                <p className="text-navy-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gold-600" />
                  Started on {new Date(assign.startDate).toLocaleDateString()}
                </p>
              </div>

              <div className="pt-2 border-t border-sand-200 flex items-center justify-between gap-2">
                <Link to="/parent/attendance" className="w-1/2">
                  <Button variant="ghost" size="xs" className="w-full">
                    Attendance
                  </Button>
                </Link>
                <Link to="/parent/reports" className="w-1/2">
                  <Button variant="outline" size="xs" className="w-full">
                    Reports
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

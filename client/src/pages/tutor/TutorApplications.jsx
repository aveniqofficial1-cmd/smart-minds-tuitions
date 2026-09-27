import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const TutorApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await tutorService.getApplications();
        if (res.success && res.data) {
          setApplications(res.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            My Tuition Applications
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Real-time tracking of all tuition leads you've applied for and their evaluation stages.
          </p>
        </div>
        <Link to="/tutor/requirements">
          <Button variant="primary" size="sm" icon={BookOpen}>
            Browse More Leads
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading your applications...</div>
      ) : applications.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Applications Submitted Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Browse through verified open leads across your preferred localities and apply to start conducting demo sessions.
          </p>
          <Link to="/tutor/requirements">
            <Button variant="primary" size="sm">
              Explore Leads
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <Card key={app._id} hover goldBorder className="p-6 space-y-4 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wide">
                    {app.requirement?.board || 'CBSE'} Board
                  </span>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    Class {app.requirement?.grade} • {app.requirement?.subjects?.join(', ')}
                  </h3>
                </div>
                <Badge variant={app.status} size="sm">
                  {app.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-navy-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>
                    {app.requirement?.location?.locality || app.requirement?.location?.area || 'Hyderabad'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Your Proposed Fee: <strong className="text-navy-900">₹{app.proposedFee}</strong> / month
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {app.message && (
                <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 text-xs text-navy-600 italic">
                  "{app.message}"
                </div>
              )}

              {app.status === 'demo_scheduled' && (
                <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-700">
                    Demo has been scheduled!
                  </span>
                  <Link to="/tutor/demos">
                    <Button variant="outline" size="xs" icon={ArrowRight}>
                      View Demo Details
                    </Button>
                  </Link>
                </div>
              )}

              {app.status === 'accepted' && (
                <div className="pt-2 border-t border-sand-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700">
                    Accepted by Parent!
                  </span>
                  <Link to="/tutor/tuitions">
                    <Button variant="primary" size="xs" icon={ArrowRight}>
                      View Assignment
                    </Button>
                  </Link>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

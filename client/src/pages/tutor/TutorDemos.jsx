import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorService } from '../../services/tutorService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  CalendarCheck,
  Clock,
  MapPin,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const TutorDemos = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDemos = async () => {
      try {
        setLoading(true);
        const res = await tutorService.getDemos();
        if (res.success && res.data) {
          setDemos(res.data);
        }
      } catch (err) {
        console.error('Failed to load demos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemos();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Scheduled Demo Classes
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Conduct free demo sessions to demonstrate teaching pedagogy and evaluate student baseline knowledge.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-navy-500">Loading scheduled demo sessions...</div>
      ) : demos.length === 0 ? (
        <Card className="p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Demo Classes Scheduled
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Once a parent or admin shortlists your tuition application, a demo session will be scheduled and displayed here.
          </p>
          <Link to="/tutor/requirements">
            <Button variant="primary" size="sm">
              Browse Open Leads
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {demos.map((demo) => (
            <Card key={demo._id} hover goldBorder className="p-6 space-y-5 bg-white">
              <div className="flex items-start justify-between gap-3 border-b border-sand-200 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {demo.subject} Demo Class
                  </h3>
                  <p className="text-xs text-navy-500">
                    Student: {demo.student?.name} (Class {demo.student?.grade || demo.requirement?.grade})
                  </p>
                </div>
                <Badge variant={demo.status} size="sm">
                  {demo.status}
                </Badge>
              </div>

              {/* Schedule Details */}
              <div className="space-y-2.5 text-xs text-navy-700 bg-sand-50/70 p-4 rounded-xl border border-sand-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>
                    <strong className="text-navy-900">
                      {new Date(demo.scheduledDate).toLocaleDateString()}
                    </strong>{' '}
                    at {demo.scheduledTime}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>
                    Mode: <strong className="capitalize text-navy-900">{demo.mode}</strong> (
                    {demo.requirement?.location?.locality || demo.requirement?.location?.area || 'Hyderabad'})
                  </span>
                </div>

                {demo.notes && (
                  <p className="text-navy-600 italic pt-1 border-t border-sand-200">
                    Notes: {demo.notes}
                  </p>
                )}
              </div>

              {/* Status specific actions */}
              {demo.status === 'accepted' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Demo Accepted by Parent!</span>
                  </div>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    Congratulations! The parent accepted your demo. Complete the 50% first-month commission payment to unlock direct contacts and initiate regular classes.
                  </p>
                  <Link to="/tutor/commissions">
                    <Button variant="primary" size="xs" icon={DollarSign}>
                      Upload Commission Proof
                    </Button>
                  </Link>
                </div>
              )}

              {demo.status === 'scheduled' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Please arrive 5-10 minutes early or share the video link prior to the scheduled slot.
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

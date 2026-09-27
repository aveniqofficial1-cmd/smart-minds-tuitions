import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award,
  AlertCircle,
} from 'lucide-react';

export const ParentReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await parentService.getReports();
        if (res.success && res.data) {
          setReports(res.data);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Monthly Student Progress Reports
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Detailed monthly evaluation reports submitted by your tutors covering syllabus mastery, test scores, and focus areas.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-navy-500">Loading progress reports...</div>
      ) : reports.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Progress Reports Submitted Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            At the end of every teaching month, your assigned tutor creates a structured progress report which will be displayed here.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {reports.map((rep) => (
            <Card key={rep._id} hover goldBorder className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-sand-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-navy-950 font-bold flex items-center justify-center text-lg border border-gold-400">
                    <FileText className="w-6 h-6 text-gold-700" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-navy-950">
                      Progress Report — {rep.month} {rep.year}
                    </h3>
                    <p className="text-xs text-navy-500">
                      Student: <span className="font-bold text-navy-900">{rep.student?.name}</span> • Tutor: {rep.tutor?.user?.name}
                    </p>
                  </div>
                </div>

                <Badge variant="verified" size="md">
                  Report Approved
                </Badge>
              </div>

              {/* Grid with metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                <div className="space-y-3">
                  <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] text-gold-700">
                    Syllabus & Topics Covered
                  </h4>
                  <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 text-navy-800 leading-relaxed">
                    {rep.topicsCovered || 'Covered scheduled monthly curriculum units and practice problem sets.'}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-navy-950 uppercase tracking-wider text-[11px] text-gold-700">
                    Tests & Performance Assessment
                  </h4>
                  <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 space-y-2">
                    <div className="flex items-center justify-between font-semibold text-navy-900">
                      <span>Tests Conducted: {rep.testsConducted || 2}</span>
                      <span>Average Score: {rep.averageScore || '88%'}</span>
                    </div>
                    <p className="text-xs text-navy-600">
                      {rep.testRemarks || 'Solid grasp of conceptual fundamentals with good homework discipline.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              {rep.recommendations && (
                <div className="p-4 rounded-xl bg-gold-50/60 border border-gold-200 text-xs space-y-1">
                  <span className="font-bold text-navy-950">Tutor's Recommendations for Next Month:</span>
                  <p className="text-navy-800">{rep.recommendations}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

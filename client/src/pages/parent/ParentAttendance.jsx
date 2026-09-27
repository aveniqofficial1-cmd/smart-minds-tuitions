import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CalendarCheck, Clock, BookOpen, User, CheckCircle2 } from 'lucide-react';

export const ParentAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await parentService.getAttendance();
        if (res.success && res.data) {
          setAttendanceRecords(res.data);
        }
      } catch (err) {
        console.error('Failed to load attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Student Attendance Logs
        </h1>
        <p className="text-xs sm:text-sm text-navy-600">
          Class-by-class attendance records logged directly by your assigned home & online tutors.
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-navy-500">Loading attendance logs...</div>
      ) : attendanceRecords.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Attendance Logs Yet
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            As your assigned tutor completes each teaching session, the date, hours, and topics covered will be logged here.
          </p>
        </Card>
      ) : (
        <Card className="bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-sand-100 border-b border-sand-200 text-navy-900 font-bold uppercase tracking-wider text-[11px]">
                  <th className="p-4">Date</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Tutor</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Topics Covered</th>
                  <th className="p-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100 text-navy-800">
                {attendanceRecords.map((att) => (
                  <tr key={att._id} className="hover:bg-sand-50/50 transition-colors">
                    <td className="p-4 font-semibold text-navy-950 whitespace-nowrap">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-medium">
                      {att.student?.name || 'Student'}
                    </td>
                    <td className="p-4 text-navy-600">
                      {att.tutor?.user?.name || 'Tutor'}
                    </td>
                    <td className="p-4 text-navy-600">
                      {att.hoursTaught || 1.5} Hours
                    </td>
                    <td className="p-4 text-navy-700 max-w-xs truncate">
                      {att.topicCovered || 'Regular Syllabus Session'}
                    </td>
                    <td className="p-4 text-right">
                      <Badge variant={att.status} size="sm">
                        {att.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

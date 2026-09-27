import React, { useState, useEffect } from 'react';
import { parentService } from '../../services/parentService';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Select, Textarea } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Users, Plus, GraduationCap, School, BookOpen } from 'lucide-react';

export const ParentStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade: '10',
    board: 'CBSE',
    schoolName: '',
    notes: '',
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await parentService.getStudents();
      if (res.success && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await parentService.createStudent(formData);
      if (res.success) {
        setModalOpen(false);
        setFormData({ name: '', grade: '10', board: 'CBSE', schoolName: '', notes: '' });
        fetchStudents();
      }
    } catch (err) {
      console.error('Create student failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
            My Students (Children Profiles)
          </h1>
          <p className="text-xs sm:text-sm text-navy-600">
            Manage your child profiles to associate with home and online tuition requests.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Add New Student Profile
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-navy-500">Loading student profiles...</div>
      ) : students.length === 0 ? (
        <Card className="p-10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-950">
            No Student Profiles Registered
          </h3>
          <p className="text-xs text-navy-500 max-w-sm mx-auto">
            Add your child's profile to easily specify their grade, syllabus, and learning goals when posting tuition requirements.
          </p>
          <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
            Add Student Now
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <Card key={student._id} hover goldBorder className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                  {student.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-navy-950">
                    {student.name}
                  </h3>
                  <p className="text-xs text-navy-500">
                    Class {student.grade} • {student.board} Board
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-navy-700">
                  <School className="w-4 h-4 text-gold-600" />
                  <span>School: {student.schoolName || 'Not specified'}</span>
                </div>
                {student.notes && (
                  <div className="text-navy-600 italic">
                    "{student.notes}"
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Student Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Child / Student Profile"
      >
        <form onSubmit={handleCreateStudent} className="space-y-4">
          <Input
            label="Student's Full Name"
            placeholder="e.g. Aarav Sharma"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Grade / Class"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={String(i + 1)}>
                  Class {i + 1}
                </option>
              ))}
            </Select>

            <Select
              label="Education Board"
              value={formData.board}
              onChange={(e) => setFormData({ ...formData, board: e.target.value })}
            >
              <option value="CBSE">CBSE</option>
              <option value="ICSE">ICSE</option>
              <option value="State Board">State Board</option>
              <option value="IB / Cambridge">IB / Cambridge</option>
            </Select>
          </div>

          <Input
            label="School Name (Optional)"
            placeholder="e.g. Delhi Public School"
            value={formData.schoolName}
            onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
          />

          <Textarea
            label="Learning Needs & Specific Focus Areas"
            rows={3}
            placeholder="e.g. Needs strong foundation in Algebra, prepares for Olympiads..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

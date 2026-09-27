import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Select, Textarea } from '../components/ui/Input';
import { FileUpload } from '../components/ui/FileUpload';
import { Modal } from '../components/ui/Modal';
import {
  UserPlus,
  Lock,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  School,
  Users,
  ShieldCheck,
  FileText,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'parent';
  const [role, setRole] = useState(initialRole);
  const { registerParent, registerTutor, registerCenter } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);

  // Parent form state
  const [parentData, setParentData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    locality: '',
  });

  // Tutor form state
  const [tutorData, setTutorData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    qualification: 'M.Sc Mathematics',
    experienceYears: '4',
    subjects: 'Mathematics, Physics, Chemistry',
    preferredLocalities: 'Hitech City, Madhapur, Gachibowli',
    monthlyRate: '5000',
    idProofType: 'Aadhar',
    idProofNumber: '',
    bio: '',
    agreedToTerms: false,
  });
  const [idProofFile, setIdProofFile] = useState(null);
  const [degreeFile, setDegreeFile] = useState(null);

  // Center form state
  const [centerData, setCenterData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: 'Hyderabad',
    registrationNumber: '',
    description: '',
  });
  const [centerDocFile, setCenterDocFile] = useState(null);

  useEffect(() => {
    if (searchParams.get('role')) {
      setRole(searchParams.get('role'));
    }
  }, [searchParams]);

  // Submit Parent Registration
  const handleParentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerParent(parentData);
      if (res.success) {
        navigate('/parent');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Tutor Registration (Multipart FormData)
  const handleTutorSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!tutorData.agreedToTerms) {
      setError('You must read and agree to the 50% First-Month Commission and Conduct Agreement to register.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', tutorData.name);
      formData.append('email', tutorData.email);
      formData.append('password', tutorData.password);
      formData.append('phone', tutorData.phone);
      formData.append('qualification', tutorData.qualification);
      formData.append('experienceYears', tutorData.experienceYears);
      formData.append('subjects', tutorData.subjects);
      formData.append('preferredLocalities', tutorData.preferredLocalities);
      formData.append('monthlyRate', tutorData.monthlyRate);
      formData.append('idProofType', tutorData.idProofType);
      formData.append('idProofNumber', tutorData.idProofNumber);
      formData.append('bio', tutorData.bio);
      formData.append('agreedToTerms', 'true');

      if (idProofFile) formData.append('idProof', idProofFile);
      if (degreeFile) formData.append('degreeDoc', degreeFile);

      const res = await registerTutor(formData);
      if (res.success) {
        navigate('/tutor');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Tutor registration failed. Ensure all required fields are filled.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Center Registration (Multipart FormData)
  const handleCenterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', centerData.name);
      formData.append('contactPerson', centerData.contactPerson);
      formData.append('email', centerData.email);
      formData.append('password', centerData.password);
      formData.append('phone', centerData.phone);
      formData.append('address', centerData.address);
      formData.append('city', centerData.city);
      formData.append('registrationNumber', centerData.registrationNumber);
      formData.append('description', centerData.description);

      if (centerDocFile) formData.append('registrationDoc', centerDocFile);

      const res = await registerCenter(formData);
      if (res.success) {
        navigate('/center');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Center registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link to="/" className="inline-block">
          <img
            src="/logo.png"
            alt="Smart Minds Tuitions"
            className="w-16 h-16 rounded-full mx-auto border-2 border-gold-400 shadow-gold"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/64?text=SMT';
            }}
          />
        </Link>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-950">
          Create Your Account
        </h2>
        <p className="text-xs sm:text-sm text-navy-600">
          Join Smart Minds Tuitions as a Parent, Tutor, or Tuition Center.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl px-4">
        <Card className="p-6 sm:p-8 bg-white border border-sand-200 shadow-xl space-y-6">
          {/* Role selector tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-2">
              Select Registration Role
            </label>
            <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-sand-100 border border-sand-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => { setRole('parent'); setError(null); }}
                className={`py-2.5 px-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === 'parent'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Parent / Student</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('tutor'); setError(null); }}
                className={`py-2.5 px-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === 'tutor'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Home / Online Tutor</span>
              </button>

              <button
                type="button"
                onClick={() => { setRole('center'); setError(null); }}
                className={`py-2.5 px-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === 'center'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Tuition Center</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* PARENT REGISTRATION FORM */}
          {/* ========================================================= */}
          {role === 'parent' && (
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name (Parent / Guardian)"
                  placeholder="e.g. Priya Sharma"
                  required
                  value={parentData.name}
                  onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  icon={Phone}
                  required
                  value={parentData.phone}
                  onChange={(e) => setParentData({ ...parentData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. priya@example.com"
                  icon={Mail}
                  required
                  value={parentData.email}
                  onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  value={parentData.password}
                  onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Residential Locality / Area"
                  placeholder="e.g. Jubilee Hills, Hyderabad"
                  icon={MapPin}
                  required
                  value={parentData.locality}
                  onChange={(e) => setParentData({ ...parentData, locality: e.target.value })}
                />
                <Input
                  label="Complete Address (Masked until assignment)"
                  placeholder="e.g. Flat 302, Green Valley Apts"
                  required
                  value={parentData.address}
                  onChange={(e) => setParentData({ ...parentData, address: e.target.value })}
                />
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={UserPlus}
                  className="w-full font-bold text-base shadow-gold"
                >
                  Create Parent Account & Post Tuition
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TUTOR REGISTRATION FORM (WITH KYC UPLOADS & AGREEMENT) */}
          {/* ========================================================= */}
          {role === 'tutor' && (
            <form onSubmit={handleTutorSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name (as per ID)"
                  placeholder="e.g. Rajesh Kumar"
                  required
                  value={tutorData.name}
                  onChange={(e) => setTutorData({ ...tutorData, name: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  icon={Phone}
                  required
                  value={tutorData.phone}
                  onChange={(e) => setTutorData({ ...tutorData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. rajesh@example.com"
                  icon={Mail}
                  required
                  value={tutorData.email}
                  onChange={(e) => setTutorData({ ...tutorData, email: e.target.value })}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  value={tutorData.password}
                  onChange={(e) => setTutorData({ ...tutorData, password: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Highest Qualification"
                  placeholder="e.g. M.Sc Mathematics"
                  required
                  value={tutorData.qualification}
                  onChange={(e) => setTutorData({ ...tutorData, qualification: e.target.value })}
                />
                <Input
                  label="Teaching Experience (Years)"
                  type="number"
                  placeholder="e.g. 5"
                  required
                  value={tutorData.experienceYears}
                  onChange={(e) => setTutorData({ ...tutorData, experienceYears: e.target.value })}
                />
                <Input
                  label="Expected Monthly Rate (₹)"
                  type="number"
                  placeholder="e.g. 5000"
                  required
                  value={tutorData.monthlyRate}
                  onChange={(e) => setTutorData({ ...tutorData, monthlyRate: e.target.value })}
                />
              </div>

              <Input
                label="Subjects Taught (comma separated)"
                placeholder="e.g. Mathematics, Physics, Chemistry, Vedic Maths"
                required
                value={tutorData.subjects}
                onChange={(e) => setTutorData({ ...tutorData, subjects: e.target.value })}
              />

              <Input
                label="Preferred Localities / Service Areas (comma separated)"
                placeholder="e.g. Hitech City, Gachibowli, Madhapur, Kondapur"
                required
                value={tutorData.preferredLocalities}
                onChange={(e) => setTutorData({ ...tutorData, preferredLocalities: e.target.value })}
              />

              {/* ID Proof Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Select
                  label="Government ID Proof Type"
                  value={tutorData.idProofType}
                  onChange={(e) => setTutorData({ ...tutorData, idProofType: e.target.value })}
                >
                  <option value="Aadhar">Aadhar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="Driving License">Driving License</option>
                </Select>

                <Input
                  label="ID Proof Number"
                  placeholder="e.g. XXXX XXXX XXXX"
                  required
                  value={tutorData.idProofNumber}
                  onChange={(e) => setTutorData({ ...tutorData, idProofNumber: e.target.value })}
                />
              </div>

              {/* Document Uploads */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <FileUpload
                  label="Upload ID Proof (Aadhar/PAN)"
                  helperText="Clear photo or PDF (up to 5MB)"
                  onChange={(file) => setIdProofFile(file)}
                />
                <FileUpload
                  label="Upload Degree / Qualification Proof"
                  helperText="Degree certificate or mark sheet"
                  onChange={(file) => setDegreeFile(file)}
                />
              </div>

              <Textarea
                label="Professional Bio / Pedagogy Summary"
                rows={2}
                placeholder="Tell parents about your teaching style, achievements, and approach..."
                value={tutorData.bio}
                onChange={(e) => setTutorData({ ...tutorData, bio: e.target.value })}
              />

              {/* Code of Conduct & Agreement Verification */}
              <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-300/80 space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="tutorAgreementCheck"
                    required
                    checked={tutorData.agreedToTerms}
                    onChange={(e) => setTutorData({ ...tutorData, agreedToTerms: e.target.checked })}
                    className="mt-1 h-4 w-4 rounded border-gold-400 text-gold-600 focus:ring-gold-400"
                  />
                  <label htmlFor="tutorAgreementCheck" className="text-xs text-navy-950 font-medium leading-relaxed">
                    I agree to the <span className="font-bold text-navy-950">50% First-Month Commission Policy</span>, Code of Conduct, child safety standards, and multi-tuition subscription framework.
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setAgreementModalOpen(true)}
                  className="text-xs text-gold-700 font-bold hover:underline flex items-center gap-1 pl-7"
                >
                  <FileText className="w-3.5 h-3.5" /> Read Full Code of Conduct & Policy Document
                </button>
              </div>

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={UserPlus}
                  className="w-full font-bold text-base shadow-gold"
                >
                  Submit Tutor Application for KYC Review
                </Button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* TUITION CENTER REGISTRATION FORM */}
          {/* ========================================================= */}
          {role === 'center' && (
            <form onSubmit={handleCenterSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Tuition Center / Academy Name"
                  placeholder="e.g. Apex Academy"
                  required
                  value={centerData.name}
                  onChange={(e) => setCenterData({ ...centerData, name: e.target.value })}
                />
                <Input
                  label="Contact Person / Director Name"
                  placeholder="e.g. K. Srinivas Rao"
                  required
                  value={centerData.contactPerson}
                  onChange={(e) => setCenterData({ ...centerData, contactPerson: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder="e.g. center@example.com"
                  icon={Mail}
                  required
                  value={centerData.email}
                  onChange={(e) => setCenterData({ ...centerData, email: e.target.value })}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={Lock}
                  required
                  value={centerData.password}
                  onChange={(e) => setCenterData({ ...centerData, password: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Official Phone Number"
                  type="tel"
                  placeholder="e.g. 9876543210"
                  icon={Phone}
                  required
                  value={centerData.phone}
                  onChange={(e) => setCenterData({ ...centerData, phone: e.target.value })}
                />
                <Input
                  label="Registration / Reg ID"
                  placeholder="e.g. REG-HYD-9988"
                  value={centerData.registrationNumber}
                  onChange={(e) => setCenterData({ ...centerData, registrationNumber: e.target.value })}
                />
                <Input
                  label="City"
                  placeholder="e.g. Hyderabad"
                  required
                  value={centerData.city}
                  onChange={(e) => setCenterData({ ...centerData, city: e.target.value })}
                />
              </div>

              <Input
                label="Center Physical Address"
                placeholder="e.g. Plot 45, 2nd Floor, Main Road, Madhapur, Hyderabad"
                icon={MapPin}
                required
                value={centerData.address}
                onChange={(e) => setCenterData({ ...centerData, address: e.target.value })}
              />

              <FileUpload
                label="Center Registration Certificate / Affiliation Document (Optional)"
                helperText="Upload official registration proof for faster verification"
                onChange={(file) => setCenterDocFile(file)}
              />

              <Textarea
                label="About the Center & Classes Offered"
                rows={2}
                placeholder="e.g. Coaching for Classes 1 to 10 CBSE/State board in Maths, Science, and Olympiads..."
                value={centerData.description}
                onChange={(e) => setCenterData({ ...centerData, description: e.target.value })}
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={UserPlus}
                  className="w-full font-bold text-base shadow-gold"
                >
                  Register Center & Launch Academy Portal
                </Button>
              </div>
            </form>
          )}

          {/* Footer note */}
          <p className="text-center text-xs text-navy-600">
            Already registered on Smart Minds?{' '}
            <Link to="/login" className="text-gold-600 font-bold hover:underline">
              Sign In to Your Account
            </Link>
          </p>
        </Card>
      </div>

      {/* Code of Conduct & Agreement Modal */}
      <Modal
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
        title="Smart Minds Tuitions — Tutor Code of Conduct & Policy"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs text-navy-800 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
          <div className="p-3 rounded-xl bg-gold-50 border border-gold-300 text-gold-900 font-semibold">
            Please read these terms carefully before submitting your KYC application.
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-navy-950 text-sm">1. 50% First Month Commission</h4>
            <p>
              The tutor acknowledges that a one-time 50% commission is payable to Smart Minds Tuitions exclusively for the first month upon parent acceptance of the demo class. From the second month onwards, the tutor collects 100% of the tuition fee directly from the parent.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-navy-950 text-sm">2. Multi-Tuition Subscriptions</h4>
            <p>
              Tutors with an active tuition assignment who wish to apply for additional open tuition leads must hold an active multi-tuition subscription plan (3, 6, 9, or 12 months).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-navy-950 text-sm">3. Punctuality & Attendance</h4>
            <p>
              Tutors must record session attendance punctually inside their dashboard. Consistent cancellations without prior notice may result in account suspension.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-navy-950 text-sm">4. Child Safety & Professional Ethics</h4>
            <p>
              Smart Minds maintains zero tolerance for misconduct, harassment, or unethical behavior. Background information provided must be truthful and valid.
            </p>
          </div>

          <div className="pt-4 border-t border-sand-200 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setTutorData({ ...tutorData, agreedToTerms: true });
                setAgreementModalOpen(false);
              }}
            >
              I Understand & Agree
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

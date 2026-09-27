import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import {
  LogIn,
  Lock,
  Mail,
  ShieldCheck,
  Users,
  GraduationCap,
  School,
  Sparkles,
} from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('parent');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const demoAccounts = {
    parent: { email: 'sunita.reddy@parents.com', pass: 'ParentPass@2026!', label: 'Parent Account (Sunita Reddy)' },
    tutor: { email: 'priya.sharma@tutors.com', pass: 'TutorPass@2026!', label: 'Tutor Account (Priya Sharma)' },
    center: { email: 'apex.academy@centers.com', pass: 'CenterPass@2026!', label: 'Center Account (Apex Scholars)' },
    admin: { email: 'admin@smartmindstuitions.com', pass: 'AdminPass@2026!', label: 'Super Administrator' },
  };

  const handleFillDemo = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(demoAccounts[roleKey].email);
    setPassword(demoAccounts[roleKey].pass);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      if (res.success && res.user) {
        const userRole = res.user.role;
        // Redirect to origin or corresponding role portal
        const origin = location.state?.from?.pathname;
        if (origin) {
          navigate(origin, { replace: true });
        } else {
          switch (userRole) {
            case 'admin':
              navigate('/admin', { replace: true });
              break;
            case 'tutor':
              navigate('/tutor', { replace: true });
              break;
            case 'parent':
              navigate('/parent', { replace: true });
              break;
            case 'center':
              navigate('/center', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
          }
        }
      } else {
        setError(res.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
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
          Sign In to Your Account
        </h2>
        <p className="text-xs sm:text-sm text-navy-600">
          Select your portal role and enter your registered credentials.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <Card className="p-6 sm:p-8 bg-white border border-sand-200 shadow-xl space-y-6">
          {/* 4-Role Selector Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-2">
              Select Portal Type
            </label>
            <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-sand-100 border border-sand-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedRole('parent')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'parent'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Parent</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('tutor')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'tutor'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Tutor</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('center')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'center'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Center</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-1 rounded-lg transition-all flex flex-col items-center gap-1 ${
                  selectedRole === 'admin'
                    ? 'bg-navy-950 text-gold-400 shadow-sm'
                    : 'text-navy-700 hover:text-navy-950'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. name@example.com"
              icon={Mail}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-navy-700 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-sand-300 text-gold-500 focus:ring-gold-400"
                />
                <span>Remember this device</span>
              </label>

              <span className="text-gold-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={LogIn}
              className="w-full text-base font-bold shadow-gold"
            >
              Sign In to {selectedRole.toUpperCase()} Portal
            </Button>
          </form>

          {/* Quick Demo Fill Buttons (For instant reviewer testing) */}
          <div className="pt-4 border-t border-sand-200">
            <p className="text-[11px] font-bold text-navy-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>Quick Test Account Fillers:</span>
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo('parent')}
                className="p-2 text-left bg-teal-50 hover:bg-teal-100 text-teal-900 rounded-lg border border-teal-200 transition-colors"
              >
                <span className="font-bold block">Parent Demo</span>
                <span className="text-[10px] text-teal-700">Sunita Reddy</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('tutor')}
                className="p-2 text-left bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg border border-indigo-200 transition-colors"
              >
                <span className="font-bold block">Tutor Demo</span>
                <span className="text-[10px] text-indigo-700">Priya Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('center')}
                className="p-2 text-left bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-lg border border-purple-200 transition-colors"
              >
                <span className="font-bold block">Center Demo</span>
                <span className="text-[10px] text-purple-700">Apex Scholars</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="p-2 text-left bg-navy-900 hover:bg-navy-950 text-gold-300 rounded-lg border border-navy-800 transition-colors"
              >
                <span className="font-bold block">Super Admin</span>
                <span className="text-[10px] text-sand-300">Full System Control</span>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-navy-600">
            Don't have an account yet?{' '}
            <Link
              to={`/register?role=${selectedRole === 'admin' ? 'parent' : selectedRole}`}
              className="text-gold-600 font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};

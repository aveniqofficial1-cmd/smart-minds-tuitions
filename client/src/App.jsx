import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WhatsAppWidget } from './components/ui/WhatsAppWidget';
import { Badge } from './components/ui/Badge';

// Icons for Nav Items
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarCheck,
  GraduationCap,
  Clock,
  Award,
  MessageSquare,
  Search,
  FileText,
  TrendingUp,
  CreditCard,
  DollarSign,
  Layers,
  BarChart3,
  UserPlus,
  ShieldCheck,
  Building2,
  Activity,
} from 'lucide-react';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { HowItWorks } from './pages/HowItWorks';
import { ForTutors } from './pages/ForTutors';
import { TuitionCenters } from './pages/TuitionCenters';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Parent Pages
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { ParentStudents } from './pages/parent/ParentStudents';
import { ParentRequirements } from './pages/parent/ParentRequirements';
import { ParentDemos } from './pages/parent/ParentDemos';
import { ParentAssignedTutors } from './pages/parent/ParentAssignedTutors';
import { ParentAttendance } from './pages/parent/ParentAttendance';
import { ParentReports } from './pages/parent/ParentReports';
import { ParentChat } from './pages/parent/ParentChat';

// Tutor Pages
import { TutorDashboard } from './pages/tutor/TutorDashboard';
import { TutorRequirements } from './pages/tutor/TutorRequirements';
import { TutorApplications } from './pages/tutor/TutorApplications';
import { TutorDemos } from './pages/tutor/TutorDemos';
import { TutorTuitions } from './pages/tutor/TutorTuitions';
import { TutorAttendance } from './pages/tutor/TutorAttendance';
import { TutorReports } from './pages/tutor/TutorReports';
import { TutorEarnings } from './pages/tutor/TutorEarnings';
import { TutorSubscriptions } from './pages/tutor/TutorSubscriptions';
import { TutorCommissions } from './pages/tutor/TutorCommissions';
import { TutorChat } from './pages/tutor/TutorChat';

// Tuition Center Pages
import { CenterDashboard } from './pages/center/CenterDashboard';
import { CenterBatches } from './pages/center/CenterBatches';
import { CenterStudents } from './pages/center/CenterStudents';
import { CenterAttendance } from './pages/center/CenterAttendance';
import { CenterPerformance } from './pages/center/CenterPerformance';
import { CenterFees } from './pages/center/CenterFees';
import { CenterTutorRequests } from './pages/center/CenterTutorRequests';
import { CenterChat } from './pages/center/CenterChat';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRequirements } from './pages/admin/AdminRequirements';
import { AdminTutors } from './pages/admin/AdminTutors';
import { AdminCenters } from './pages/admin/AdminCenters';
import { AdminDemos } from './pages/admin/AdminDemos';
import { AdminCommissions } from './pages/admin/AdminCommissions';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminEarnings } from './pages/admin/AdminEarnings';
import { AdminChat } from './pages/admin/AdminChat';
import { AdminAuditLogs } from './pages/admin/AdminAuditLogs';

// Public Layout Wrapper with Navbar & Footer
const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-100 selection:bg-gold-500 selection:text-navy-950 font-sans">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppWidget />
    </div>
  );
};

// Parent Portal Layout
const ParentLayout = ({ children }) => {
  const navItems = [
    { name: 'Dashboard', path: '/parent/dashboard', icon: LayoutDashboard },
    { name: 'My Children', path: '/parent/students', icon: Users },
    { name: 'Tuition Leads', path: '/parent/requirements', icon: BookOpen },
    { name: 'Demo Sessions', path: '/parent/demos', icon: CalendarCheck },
    { name: 'Assigned Tutors', path: '/parent/tutors', icon: GraduationCap },
    { name: 'Attendance', path: '/parent/attendance', icon: Clock },
    { name: 'Progress Reports', path: '/parent/reports', icon: Award },
    { name: 'Support & Chat', path: '/parent/chat', icon: MessageSquare },
  ];

  return (
    <DashboardLayout
      roleTitle="Parent Portal"
      roleBadge={<Badge variant="info" size="sm">Parent Account</Badge>}
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
};

// Tutor Portal Layout
const TutorLayout = ({ children }) => {
  const { user } = useAuth();
  const navItems = [
    { name: 'Dashboard', path: '/tutor/dashboard', icon: LayoutDashboard },
    { name: 'Browse Leads', path: '/tutor/requirements', icon: Search },
    { name: 'My Applications', path: '/tutor/applications', icon: FileText },
    { name: 'Demo Sessions', path: '/tutor/demos', icon: CalendarCheck },
    { name: 'Active Tuitions', path: '/tutor/tuitions', icon: GraduationCap },
    { name: 'Attendance Register', path: '/tutor/attendance', icon: Clock },
    { name: 'Student Reports', path: '/tutor/reports', icon: Award },
    { name: 'Earnings & Ledger', path: '/tutor/earnings', icon: TrendingUp },
    { name: 'Multi-Tuition Pass', path: '/tutor/subscriptions', icon: CreditCard },
    { name: '50% Commission', path: '/tutor/commissions', icon: DollarSign },
    { name: 'Support Desk', path: '/tutor/chat', icon: MessageSquare },
  ];

  return (
    <DashboardLayout
      roleTitle="Educator Portal"
      roleBadge={
        <Badge variant={user?.tutorProfile?.approvalStatus === 'approved' ? 'success' : 'warning'} size="sm">
          {user?.tutorProfile?.approvalStatus === 'approved' ? 'Verified Educator' : 'KYC Pending'}
        </Badge>
      }
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
};

// Tuition Center Layout
const CenterLayout = ({ children }) => {
  const { user } = useAuth();
  const navItems = [
    { name: 'Overview', path: '/center/dashboard', icon: LayoutDashboard },
    { name: 'Class 1-10 Batches', path: '/center/batches', icon: Layers },
    { name: 'Enrolled Students', path: '/center/students', icon: Users },
    { name: 'Daily Attendance', path: '/center/attendance', icon: CalendarCheck },
    { name: 'Exams & Performance', path: '/center/performance', icon: BarChart3 },
    { name: 'Monthly Fee Ledger', path: '/center/fees', icon: DollarSign },
    { name: 'Hire Faculty', path: '/center/tutor-requests', icon: UserPlus },
    { name: 'Support & Chat', path: '/center/chat', icon: MessageSquare },
  ];

  return (
    <DashboardLayout
      roleTitle="Tuition Center Desk"
      roleBadge={
        <Badge variant={user?.centerProfile?.approvalStatus === 'approved' ? 'success' : 'warning'} size="sm">
          {user?.centerProfile?.approvalStatus === 'approved' ? 'Accredited Center' : 'Review Pending'}
        </Badge>
      }
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
};

// Admin Control Room Layout
const AdminLayout = ({ children }) => {
  const navItems = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Student Leads', path: '/admin/requirements', icon: BookOpen },
    { name: 'Educator KYC', path: '/admin/tutors', icon: ShieldCheck },
    { name: 'Tuition Centers', path: '/admin/centers', icon: Building2 },
    { name: 'Demo Sessions', path: '/admin/demos', icon: CalendarCheck },
    { name: '50% Commissions', path: '/admin/commissions', icon: DollarSign },
    { name: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
    { name: 'Revenue Ledger', path: '/admin/earnings', icon: TrendingUp },
    { name: 'Live Support', path: '/admin/chat', icon: MessageSquare },
    { name: 'Audit Trail', path: '/admin/audit-logs', icon: Activity },
  ];

  return (
    <DashboardLayout
      roleTitle="Super Admin Console"
      roleBadge={<Badge variant="gold" size="sm">Super Administrator</Badge>}
      navItems={navItems}
    >
      {children}
    </DashboardLayout>
  );
};

export const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/how-it-works" element={<PublicLayout><HowItWorks /></PublicLayout>} />
      <Route path="/for-tutors" element={<PublicLayout><ForTutors /></PublicLayout>} />
      <Route path="/tuition-centers" element={<PublicLayout><TuitionCenters /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Parent Protected Routes */}
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <Navigate to="/parent/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentDashboard /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/students"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentStudents /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/requirements"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentRequirements /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/demos"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentDemos /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/tutors"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentAssignedTutors /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/attendance"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentAttendance /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/reports"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentReports /></ParentLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/chat"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentLayout><ParentChat /></ParentLayout>
          </ProtectedRoute>
        }
      />

      {/* Tutor Protected Routes */}
      <Route
        path="/tutor"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <Navigate to="/tutor/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorDashboard /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/requirements"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorRequirements /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/applications"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorApplications /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/demos"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorDemos /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/tuitions"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorTuitions /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/attendance"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorAttendance /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/reports"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorReports /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/earnings"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorEarnings /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/subscriptions"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorSubscriptions /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/commissions"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorCommissions /></TutorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tutor/chat"
        element={
          <ProtectedRoute allowedRoles={['tutor']}>
            <TutorLayout><TutorChat /></TutorLayout>
          </ProtectedRoute>
        }
      />

      {/* Tuition Center Protected Routes */}
      <Route
        path="/center"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <Navigate to="/center/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/dashboard"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterDashboard /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/batches"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterBatches /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/students"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterStudents /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/attendance"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterAttendance /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/performance"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterPerformance /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/fees"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterFees /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/tutor-requests"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterTutorRequests /></CenterLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/center/chat"
        element={
          <ProtectedRoute allowedRoles={['center']}>
            <CenterLayout><CenterChat /></CenterLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminDashboard /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/requirements"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminRequirements /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tutors"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminTutors /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/centers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminCenters /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/demos"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminDemos /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/commissions"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminCommissions /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subscriptions"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminSubscriptions /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/earnings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminEarnings /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/chat"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminChat /></AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><AdminAuditLogs /></AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

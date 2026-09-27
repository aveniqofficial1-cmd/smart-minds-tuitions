import React from 'react';

const statusStyles = {
  // Common states
  pending: 'bg-amber-100 text-amber-800 border-amber-300',
  approved: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  verified: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  rejected: 'bg-rose-100 text-rose-800 border-rose-300',
  active: 'bg-blue-100 text-blue-800 border-blue-300',
  completed: 'bg-purple-100 text-purple-800 border-purple-300',
  cancelled: 'bg-slate-100 text-slate-700 border-slate-300',

  // Specific statuses
  scheduled: 'bg-sky-100 text-sky-800 border-sky-300',
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  open: 'bg-gold-100 text-navy-900 border-gold-400 font-semibold',
  assigned: 'bg-emerald-100 text-emerald-900 border-emerald-400',
  closed: 'bg-slate-100 text-slate-600 border-slate-300',
  paid: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  unpaid: 'bg-rose-100 text-rose-800 border-rose-300',
  partial: 'bg-amber-100 text-amber-800 border-amber-300',
  overdue: 'bg-red-100 text-red-900 border-red-300 font-bold',
  present: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  absent: 'bg-rose-100 text-rose-800 border-rose-300',
  late: 'bg-amber-100 text-amber-800 border-amber-300',
  excused: 'bg-slate-100 text-slate-800 border-slate-300',

  // Roles
  admin: 'bg-navy-950 text-gold-400 border-gold-500/40',
  tutor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  parent: 'bg-teal-100 text-teal-800 border-teal-300',
  center: 'bg-purple-100 text-purple-800 border-purple-300',

  // Default
  default: 'bg-slate-100 text-slate-800 border-slate-200',
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const normKey = (variant || 'default').toLowerCase().replace(/\s+/g, '_');
  const style = statusStyles[normKey] || statusStyles.default;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs rounded-md',
    md: 'px-2.5 py-1 text-xs font-medium rounded-full',
    lg: 'px-3.5 py-1.5 text-sm font-medium rounded-full',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border capitalize ${style} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      )}
      {children}
    </span>
  );
};

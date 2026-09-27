import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import {
  Menu,
  X,
  LogOut,
  ChevronRight,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Home,
} from 'lucide-react';

export const DashboardLayout = ({
  children,
  roleTitle,
  roleBadge,
  navItems = [],
}) => {
  const { user, logout, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === `/${role}` && location.pathname === `/${role}`) return true;
    if (path !== `/${role}` && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-sand-50/70 flex flex-col">
      {/* Top bar for dashboard */}
      <header className="sticky top-0 z-30 bg-navy-950 text-white border-b border-navy-800 shadow-navy">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile toggle + Brand */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl bg-navy-900 text-sand-200 hover:text-white"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2.5">
                <img
                  src="/logo.png"
                  alt="Smart Minds Tuitions"
                  className="w-9 h-9 rounded-full border border-gold-400"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/36?text=SMT';
                  }}
                />
                <div className="hidden sm:block">
                  <span className="block font-serif text-sm font-bold text-white leading-tight">
                    SMART MINDS
                  </span>
                  <span className="block text-[9px] font-sans text-gold-400 uppercase tracking-widest leading-tight">
                    {roleTitle}
                  </span>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/"
                className="hidden md:flex items-center gap-1.5 text-xs text-sand-300 hover:text-gold-400 transition-colors px-2 py-1 rounded-lg hover:bg-navy-900"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Visit Main Site</span>
              </Link>

              <NotificationDropdown />

              <div className="h-6 w-px bg-navy-800 hidden sm:block" />

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 flex items-center justify-center text-xs font-bold uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-bold text-white max-w-[130px] truncate leading-tight">
                    {user?.name}
                  </p>
                  <span className="text-[10px] text-gold-400 capitalize">
                    {role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-sand-400 hover:text-red-400 rounded-xl hover:bg-navy-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar for Desktop */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-navy-900 text-sand-200 border-r border-navy-800/80 shrink-0">
          {/* User profile card */}
          <div className="p-4 border-b border-navy-800 bg-navy-950/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-400/40 text-gold-400 flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">{user?.name}</h4>
                <p className="text-xs text-sand-400 truncate">{user?.email}</p>
              </div>
            </div>

            {roleBadge && (
              <div className="mt-3">
                {roleBadge}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                    ${active
                      ? 'bg-gold-500 text-navy-950 font-bold shadow-gold'
                      : 'text-sand-300 hover:bg-navy-800 hover:text-white'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-navy-950' : 'text-sand-400 group-hover:text-gold-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      active ? 'bg-navy-950 text-gold-400' : 'bg-gold-500/20 text-gold-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick Help / Footer of sidebar */}
          <div className="p-4 border-t border-navy-800 bg-navy-950/40 text-xs text-sand-400 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified & Secured</span>
            </div>
            <p className="text-[11px] leading-relaxed text-sand-400">
              Need assistance? Connect with Admin through portal messaging.
            </p>
          </div>
        </aside>

        {/* Mobile Slide-in Sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-xs h-full bg-navy-900 text-sand-200 border-r border-navy-800 shadow-2xl animate-fade-in">
              <div className="flex items-center justify-between p-4 border-b border-navy-800">
                <span className="font-serif font-bold text-white text-sm">
                  {roleTitle}
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-lg text-sand-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${active
                          ? 'bg-gold-500 text-navy-950 font-bold'
                          : 'text-sand-300 hover:bg-navy-800 hover:text-white'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-500/20 text-gold-400">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-navy-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-sm font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};

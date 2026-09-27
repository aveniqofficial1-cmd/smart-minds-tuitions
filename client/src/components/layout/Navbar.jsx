import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { Button } from '../ui/Button';
import {
  Menu,
  X,
  GraduationCap,
  User,
  LogOut,
  LayoutDashboard,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPortalRoute = () => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'tutor':
        return '/tutor';
      case 'parent':
        return '/parent';
      case 'center':
        return '/center';
      default:
        return '/';
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'For Tutors', path: '/for-tutors' },
    { name: 'Tuition Centers', path: '/tuition-centers' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-navy-950/95 backdrop-blur-md border-b border-navy-800/80 text-white transition-all shadow-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="Smart Minds Tuitions Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-gold-400/80 shadow-gold group-hover:scale-105 transition-transform"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/48?text=SMT';
                }}
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full border-2 border-navy-950"></span>
            </div>

            <div>
              <span className="block font-serif text-lg sm:text-xl font-bold tracking-wide text-white group-hover:text-gold-400 transition-colors">
                SMART MINDS
              </span>
              <span className="block text-[10px] sm:text-[11px] font-sans tracking-widest text-gold-400 uppercase font-semibold -mt-1">
                Tuitions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'text-gold-400 bg-navy-900 font-semibold'
                    : 'text-sand-200 hover:text-white hover:bg-navy-900/60'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Area */}
          <div className="hidden lg:flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-3">
                <NotificationDropdown />

                <Link to={getPortalRoute()}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={LayoutDashboard}
                    className="shadow-sm"
                  >
                    Dashboard
                  </Button>
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-navy-900 border border-navy-700/60 text-white hover:border-gold-500/50 transition-colors focus:outline-none"
                  >
                    <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 flex items-center justify-center text-xs font-bold uppercase">
                      {user.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="text-xs font-medium max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-sand-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-navy-950 shadow-2xl border border-sand-200 py-2 z-50 animate-scale-up">
                      <div className="px-4 py-2 border-b border-sand-100">
                        <p className="text-sm font-bold truncate">{user.name}</p>
                        <p className="text-xs text-navy-500 capitalize">{role} Account</p>
                      </div>

                      <Link
                        to={getPortalRoute()}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-navy-700 hover:bg-sand-50 hover:text-gold-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        My Dashboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-sand-200 hover:text-white hover:bg-navy-900">
                    Login
                  </Button>
                </Link>

                <Link to="/register">
                  <Button variant="primary" size="sm" icon={Sparkles}>
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && <NotificationDropdown />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-navy-900 text-sand-200 hover:text-white hover:bg-navy-800 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-900 border-b border-navy-800 px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-gold-500/10 text-gold-400 font-semibold'
                    : 'text-sand-200 hover:text-white hover:bg-navy-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-navy-800/80 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-gold-500/20 border border-gold-400 text-gold-300 flex items-center justify-center text-sm font-bold uppercase">
                    {user.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-gold-400 capitalize">{role} Account</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    to={getPortalRoute()}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="primary" size="sm" className="w-full">
                      Dashboard
                    </Button>
                  </Link>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

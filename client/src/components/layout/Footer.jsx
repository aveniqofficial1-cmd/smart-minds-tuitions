import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  BookOpen,
  ArrowRight,
  Heart,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-navy-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Smart Minds Tuitions Logo"
                className="w-12 h-12 rounded-full border-2 border-gold-400 shadow-gold"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/48?text=SMT';
                }}
              />
              <div>
                <span className="block font-serif text-xl font-bold tracking-wide text-white">
                  SMART MINDS
                </span>
                <span className="block text-xs font-sans tracking-widest text-gold-400 uppercase font-semibold">
                  Tuitions
                </span>
              </div>
            </div>

            <p className="text-sand-300 text-sm leading-relaxed max-w-sm">
              Empowering students through verified, expert 1-on-1 home & online tutoring and comprehensive tuition center management. Quality education backed by verified security.
            </p>

            <div className="flex items-center gap-4 text-xs text-gold-400/90 pt-2 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>100% KYC Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-400" />
                <span>Zero-Spam Privacy</span>
              </div>
            </div>
          </div>

          {/* Quick Links For Parents */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gold-400">For Parents</h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link to="/register" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Post Requirement
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Free Demo Class
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Safety & Verification
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Parent Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links For Tutors */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gold-400">For Tutors</h4>
            <ul className="space-y-2 text-sm text-sand-300">
              <li>
                <Link to="/for-tutors" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Join as a Tutor
                </Link>
              </li>
              <li>
                <Link to="/for-tutors" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/for-tutors" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> 50% 1st Month Policy
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-gold-400 transition-colors flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-gold-500/70" /> Tutor Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gold-400">Contact Us</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-sand-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>Head Office: Smart Minds Academy, Tech Hub Road, Hyderabad, TS, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>+91 98765 43210 / +91 98765 43211</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>support@smartmindstuitions.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-400 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Smart Minds Tuitions. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built with dedication for Academic Excellence <Heart className="w-3.5 h-3.5 text-red-400 fill-current inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};

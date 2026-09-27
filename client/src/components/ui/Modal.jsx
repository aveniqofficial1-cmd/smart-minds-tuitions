import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div
          className={`
            relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all
            sm:my-8 w-full ${maxWidth} border border-sand-200 animate-scale-up
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 bg-sand-50/50">
              <div>
                {title && (
                  <h3 className="text-lg font-serif font-bold text-navy-950">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs text-navy-600 mt-0.5">{subtitle}</p>
                )}
              </div>
              {showClose && (
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-navy-400 hover:text-navy-700 hover:bg-sand-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          {/* Body */}
          <div className="px-6 py-5 max-h-[78vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

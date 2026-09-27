import React from 'react';

const variants = {
  primary: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-semibold shadow-gold hover:shadow-lg focus:ring-gold-400',
  secondary: 'bg-navy-900 hover:bg-navy-800 text-white font-medium shadow-md focus:ring-navy-500 border border-navy-700/50',
  outline: 'border-2 border-gold-500/60 hover:border-gold-500 text-navy-900 dark:text-gold-400 hover:bg-gold-500/10 font-semibold focus:ring-gold-400',
  ghost: 'text-navy-800 hover:text-navy-950 hover:bg-navy-100/60 font-medium focus:ring-navy-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm focus:ring-red-400',
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm focus:ring-emerald-400',
  navy: 'bg-navy-950 hover:bg-navy-900 text-gold-400 border border-gold-500/30 hover:border-gold-500 font-semibold shadow-navy focus:ring-gold-400',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs rounded-md',
  sm: 'px-3.5 py-1.5 text-xs sm:text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm sm:text-base rounded-xl',
  lg: 'px-7 py-3 text-base sm:text-lg rounded-2xl',
  xl: 'px-8 py-4 text-lg sm:text-xl rounded-2xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2.5 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon className={`w-4 h-4 mr-2 ${size === 'lg' || size === 'xl' ? 'w-5 h-5 mr-2.5' : ''}`} />
      ) : null}

      <span>{children}</span>

      {!loading && Icon && iconPosition === 'right' ? (
        <Icon className={`w-4 h-4 ml-2 ${size === 'lg' || size === 'xl' ? 'w-5 h-5 ml-2.5' : ''}`} />
      ) : null}
    </button>
  );
};

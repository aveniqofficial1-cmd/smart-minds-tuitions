import React from 'react';

export const Card = ({
  children,
  className = '',
  hover = true,
  glow = false,
  goldBorder = false,
  dark = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-2xl transition-all duration-300
        ${dark
          ? 'bg-navy-900/95 border border-navy-800 text-white shadow-navy'
          : 'bg-white border border-sand-200/80 text-navy-950 shadow-soft'}
        ${hover ? 'hover:-translate-y-1 hover:shadow-card' : ''}
        ${glow ? 'ring-1 ring-gold-500/40 shadow-gold' : ''}
        ${goldBorder ? 'border-t-4 border-t-gold-500' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', subtitle, action }) => (
  <div className={`p-5 sm:p-6 border-b border-sand-200/60 flex items-start justify-between gap-4 ${className}`}>
    <div>
      <h3 className="text-lg sm:text-xl font-serif font-bold text-navy-950 dark:text-white">
        {children}
      </h3>
      {subtitle && (
        <p className="mt-1 text-xs sm:text-sm text-navy-600 dark:text-sand-400">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`p-5 sm:p-6 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`p-4 sm:p-6 bg-sand-50/50 dark:bg-navy-950/40 rounded-b-2xl border-t border-sand-200/60 flex items-center justify-between gap-4 ${className}`}>
    {children}
  </div>
);

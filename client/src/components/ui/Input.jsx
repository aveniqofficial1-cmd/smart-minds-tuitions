import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  required,
  ...props
}) => {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs sm:text-sm font-semibold text-navy-900 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-navy-400">
            <Icon className="h-4 w-4" />
          </div>
        )}

        <input
          id={inputId}
          required={required}
          className={`
            w-full rounded-xl border transition-colors duration-150 text-sm sm:text-base
            py-2.5 px-3.5 bg-white text-navy-950 placeholder:text-sand-400
            focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent
            disabled:bg-sand-100 disabled:text-sand-500 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20' : 'border-sand-300 hover:border-gold-500/60'}
            ${className}
          `}
          {...props}
        />
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-navy-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Select = ({
  label,
  error,
  helperText,
  children,
  className = '',
  id,
  required,
  ...props
}) => {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs sm:text-sm font-semibold text-navy-900 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          required={required}
          className={`
            w-full rounded-xl border transition-colors duration-150 text-sm sm:text-base
            py-2.5 px-3.5 bg-white text-navy-950
            focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent
            disabled:bg-sand-100 disabled:text-sand-500 disabled:cursor-not-allowed
            ${error ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20' : 'border-sand-300 hover:border-gold-500/60'}
            ${className}
          `}
          {...props}
        >
          {children}
        </select>
      </div>

      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-navy-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 3,
  required,
  ...props
}) => {
  const areaId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={areaId}
          className="block text-xs sm:text-sm font-semibold text-navy-900 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={areaId}
        rows={rows}
        required={required}
        className={`
          w-full rounded-xl border transition-colors duration-150 text-sm sm:text-base
          py-2.5 px-3.5 bg-white text-navy-950 placeholder:text-sand-400
          focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent
          disabled:bg-sand-100 disabled:text-sand-500 disabled:cursor-not-allowed
          ${error ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20' : 'border-sand-300 hover:border-gold-500/60'}
          ${className}
        `}
        {...props}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-navy-500">{helperText}</p>
      ) : null}
    </div>
  );
};

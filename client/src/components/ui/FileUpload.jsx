import React, { useRef, useState } from 'react';
import { UploadCloud, File, CheckCircle2, X } from 'lucide-react';

export const FileUpload = ({
  label,
  name,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  helperText = 'PDF, PNG, JPG up to 5MB',
  required = false,
  error = null,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [internalError, setInternalError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setInternalError(`File size exceeds maximum allowed limit of ${maxSizeMB}MB`);
      return;
    }

    setInternalError(null);
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }

    if (onChange) {
      onChange(selectedFile);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (onChange) {
      onChange(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-navy-900 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-4 sm:p-5 text-center transition-all
          ${dragOver ? 'border-gold-500 bg-gold-50/40' : 'border-sand-300 hover:border-gold-400 bg-sand-50/40 hover:bg-gold-50/20'}
          ${error || internalError ? 'border-red-400 bg-red-50/20' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-sand-200">
            <div className="flex items-center gap-3 overflow-hidden">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-lg border border-sand-200"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-navy-100 flex items-center justify-center text-navy-700">
                  <File className="w-6 h-6" />
                </div>
              )}
              <div className="text-left overflow-hidden">
                <p className="text-sm font-semibold text-navy-950 truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-navy-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • Selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 text-navy-400 hover:text-red-600 rounded-lg hover:bg-sand-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2">
            <div className="w-11 h-11 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center mb-2">
              <UploadCloud className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-navy-950">
              Click or drag file to upload
            </p>
            <p className="text-xs text-navy-500 mt-1">{helperText}</p>
          </div>
        )}
      </div>

      {(error || internalError) && (
        <p className="mt-1.5 text-xs text-red-600 font-medium">{error || internalError}</p>
      )}
    </div>
  );
};

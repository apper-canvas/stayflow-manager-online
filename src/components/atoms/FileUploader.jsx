import { forwardRef, useState, useRef } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const FileUploader = forwardRef(({
  onChange,
  onRemove,
  files = [],
  accept = 'image/*',
  multiple = true,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
  label,
  error,
  className,
  containerClassName,
  ...props
}, ref) => {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const validateFiles = (filesToValidate) => {
    setUploadError('');
    
    if (files.length + filesToValidate.length > maxFiles) {
      setUploadError(`Maximum ${maxFiles} files allowed`);
      return [];
    }

    const validFiles = [];
    for (const file of filesToValidate) {
      if (file.size > maxSize) {
        setUploadError(`File ${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        continue;
      }
      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);
    if (validFiles.length > 0) {
      onChange?.(validFiles);
    }
  };

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = validateFiles(selectedFiles);
    if (validFiles.length > 0) {
      onChange?.(validFiles);
    }
  };

  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-3", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive && !disabled ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400",
          disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer",
          error || uploadError ? "border-error bg-error/5" : "",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
          {...props}
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <ApperIcon name="Upload" className="h-8 w-8 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Drag and drop files here
            </p>
            <p className="text-xs text-gray-500 mt-1">
              or click to select files
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Supported: Images up to {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        </div>
      </div>

      {(error || uploadError) && (
        <p className="text-xs text-error font-medium">{error || uploadError}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Uploaded Files ({files.length}/{maxFiles})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {files.map((file, idx) => {
              const isImage = file.type?.startsWith('image/');
              const preview = isImage ? URL.createObjectURL(file) : null;
              
              return (
                <div key={`${file.name}-${idx}`} className="relative group">
                  {isImage && preview ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                      <ApperIcon name="File" className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove?.(idx);
                    }}
                  >
                    <ApperIcon name="X" className="h-3 w-3" />
                  </Button>
                  <p className="text-xs text-gray-600 mt-1 truncate" title={file.name}>
                    {file.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;
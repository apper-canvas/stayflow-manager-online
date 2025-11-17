import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Textarea = forwardRef(({ 
  label,
  error,
  help,
  rows = 4,
  maxLength,
  showCount = false,
  className,
  containerClassName,
  ...props 
}, ref) => {
  const value = props.value || '';
  
  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
            "transition-colors duration-150 resize-none",
            "placeholder-gray-400 text-gray-900",
            error && "border-error focus:ring-error/20 focus:border-error",
            className
          )}
          {...props}
        />
        {showCount && maxLength && (
          <span className="absolute bottom-2 right-3 text-xs text-gray-500">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
      {help && !error && (
        <p className="text-xs text-gray-500">{help}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;
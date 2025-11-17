import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const Toggle = forwardRef(({ 
  checked = false, 
  onChange, 
  disabled = false,
  label,
  description,
  className,
  ...props 
}, ref) => {
  return (
    <div className="flex items-center gap-3">
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          checked ? "bg-primary" : "bg-gray-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && (
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
      )}
    </div>
  );
});

Toggle.displayName = 'Toggle';

export default Toggle;
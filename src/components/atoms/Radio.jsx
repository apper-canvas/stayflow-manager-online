import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

const RadioGroup = forwardRef(({ 
  value, 
  onChange, 
  options = [],
  name,
  disabled = false,
  className,
  direction = 'vertical',
  ...props 
}, ref) => {
  return (
    <div 
      ref={ref}
      className={cn(
        "flex gap-4",
        direction === 'horizontal' ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <label 
          key={option.value} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={cn(
              "w-4 h-4 text-primary border-gray-300 focus:ring-2 focus:ring-primary/20",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          />
          <span className={cn(
            "text-sm font-medium text-gray-700",
            disabled && "opacity-50"
          )}>
            {option.label}
          </span>
        </label>
      ))}
    </div>
  );
});

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
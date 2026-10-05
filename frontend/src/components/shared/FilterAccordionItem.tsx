import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterAccordionItemProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  defaultOpen?: boolean;
  className?: string;
}

export const FilterAccordionItem: React.FC<FilterAccordionItemProps> = ({
  title,
  options,
  selectedValues,
  onChange,
  defaultOpen = true,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={cn('border-b border-border py-3', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-bold text-text-primary tracking-wide text-left focus:outline-none focus-visible:text-accent"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-text-muted transition-transform duration-200',
            isOpen && 'rotate-180 text-text-primary'
          )}
        />
      </button>

      {isOpen && (
        <div className="mt-2.5 space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {options.map((opt) => {
            const isChecked = selectedValues.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center justify-between text-xs text-text-primary hover:text-accent cursor-pointer py-1 select-none group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggle(opt.value)}
                    className="w-4 h-4 rounded-sm border-border text-accent focus:ring-accent focus:ring-offset-0 focus:ring-1"
                  />
                  <span className={cn('group-hover:text-accent', isChecked && 'font-semibold text-accent')}>
                    {opt.label}
                  </span>
                </div>
                {opt.count !== undefined && (
                  <span className="text-[10px] text-text-muted">({opt.count})</span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

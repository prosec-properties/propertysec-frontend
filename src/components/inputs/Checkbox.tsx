import React, { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
  labelClassName?: string;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      name,
      label,
      checked,
      onChange,
      disabled = false,
      className = '',
      containerClassName = '',
      labelClassName = '',
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    // Combine default and custom classes
    const inputClasses = `h-5 w-5 rounded border-gray-300 shadow-sm focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600 ${className}`;
    const labelClasses = `font-medium text-gray-700 dark:text-gray-200 ${
      disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
    } ${labelClassName}`;

    return (
      <div className={`inline-flex items-center gap-3 ${containerClassName}`}>
        <input
          ref={ref}
          type="checkbox"
          id={id}
          name={name || id}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={inputClasses}
          aria-checked={indeterminate ? 'mixed' : checked}
          {...props}
        />
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      </div>
    );
  }
);

interface CheckboxGroupProps {
  legend?: string;
  options: Array<
    {
      label: string;
    } & Omit<CheckboxProps, 'label'>
  >;
  groupClassName?: string;
  containerClassName?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  legend,
  options,
  groupClassName = '',
  containerClassName = '',
}) => {
  return (
    <fieldset className={containerClassName}>
      {legend && <legend className="sr-only">{legend}</legend>}
      <div className={`flex flex-col items-start gap-3 ${groupClassName}`}>
        {options.map(({ label, ...option }) => (
          <Checkbox
            key={option.id}
            label={label}
            {...option}
          />
        ))}
      </div>
    </fieldset>
  );
};

// Add display name for better debugging
Checkbox.displayName = 'Checkbox';

export default Checkbox;
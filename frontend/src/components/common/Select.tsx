import React from 'react';
import '../../styles/form.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  helpText,
  options,
  placeholder,
  required = false,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={`form-select ${error ? 'form-error' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error-message">{error}</span>}
      {helpText && <span className="form-help-text">{helpText}</span>}
    </div>
  );
};

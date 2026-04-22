import React from 'react';
import '../../styles/form.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
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
      <input
        id={id}
        className={`form-input ${error ? 'form-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="form-error-message">{error}</span>}
      {helpText && <span className="form-help-text">{helpText}</span>}
    </div>
  );
};

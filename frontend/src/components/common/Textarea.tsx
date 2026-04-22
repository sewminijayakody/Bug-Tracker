import React from 'react';
import '../../styles/form.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
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
      <textarea
        id={id}
        className={`form-textarea ${error ? 'form-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="form-error-message">{error}</span>}
      {helpText && <span className="form-help-text">{helpText}</span>}
    </div>
  );
};

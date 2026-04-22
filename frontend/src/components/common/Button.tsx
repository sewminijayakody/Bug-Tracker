import React from 'react';
import '../../styles/button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        button
        button-${variant}
        button-${size}
        ${fullWidth ? 'button-full' : ''}
        ${loading ? 'button-loading' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading-spinner" />}
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

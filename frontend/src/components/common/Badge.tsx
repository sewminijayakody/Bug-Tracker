import React from 'react';
import '../../styles/card.css';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray' | 'purple';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'gray', icon }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
};

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusClass = () => {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'In Progress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
      case 'Closed':
        return 'status-closed';
      default:
        return 'status-open';
    }
  };

  return <span className={`status-badge ${getStatusClass()}`}>{status}</span>;
};
